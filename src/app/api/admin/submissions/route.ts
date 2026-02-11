import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to check authentication could be added here if not handled by middleware
// Assuming middleware protects /api/admin/* routes as per standard practice

export async function GET() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching admin submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
