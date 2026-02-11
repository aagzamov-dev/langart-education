import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Upsert ensures we always have at least one config record (ID 1)
    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: {},
      create: {
        phoneNumber: '+998 90 123 45 67',
        email: 'info@langart.uz',
        locations: ['Tashkent, Uzbekistan'],
        workingHours: '09:00 - 18:00',
        facebook: '',
        instagram: '',
        telegram: '',
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      phoneNumber,
      email,
      locations,
      workingHours,
      facebook,
      instagram,
      telegram,
    } = body;

    const config = await prisma.siteConfig.update({
      where: { id: 1 },
      data: {
        phoneNumber,
        email,
        locations,
        workingHours,
        facebook,
        instagram,
        telegram,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
