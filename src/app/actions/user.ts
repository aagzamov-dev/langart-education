'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateProfile(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!username || !password) {
    return { error: 'Current credentials are required' };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return { error: 'Unauthorized' };

    const payload: any = await verifyToken(token);
    if (!payload?.userId) return { error: 'Unauthorized' };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return { error: 'User not found' };

    // Verify current password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: 'Incorrect current password' };

    const data: any = { username };
    
    // Only update password if provided
    if (newPassword) {
        if(newPassword.length < 6) {
             return { error: 'New password must be at least 6 characters' };
        }
      data.password = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: user.id },
      data,
    });

    revalidatePath('/admin/settings');
    return { success: 'Profile updated successfully' };

  } catch (error) {
    console.error('Update profile error:', error);
    return { error: 'Failed to update profile' };
  }
}
