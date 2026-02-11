'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifyToken, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function changePassword(prevState: any, formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match' };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return { error: 'Unauthorized' };
    }

    const payload = await verifyToken(token);
    
    // verifyToken returns payload, we assume it has username
    // but the payload type is 'any' in lib/auth.ts
    // let's cast it safely
    const username = (payload as any)?.username;

    if (!username) {
        return { error: 'Invalid token' };
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return { error: 'Incorrect current password' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: 'Password updated successfully' };

  } catch (error) {
    console.error('Password change error:', error);
    return { error: 'Something went wrong' };
  }
}
