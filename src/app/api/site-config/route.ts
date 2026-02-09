import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.siteConfig.findFirst();
        if (!config) {
            return NextResponse.json({
                phoneNumber: '',
                email: '',
                locations: [],
                workingHours: '',
                facebook: '',
                instagram: '',
                telegram: ''
            });
        }
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const config = await prisma.siteConfig.upsert({
            where: { id: 1 },
            update: {
                phoneNumber: data.phoneNumber,
                email: data.email,
                locations: data.locations,
                workingHours: data.workingHours,
                facebook: data.facebook,
                instagram: data.instagram,
                telegram: data.telegram
            },
            create: {
                id: 1,
                phoneNumber: data.phoneNumber,
                email: data.email,
                locations: data.locations,
                workingHours: data.workingHours,
                facebook: data.facebook,
                instagram: data.instagram,
                telegram: data.telegram
            }
        });
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update site config' }, { status: 500 });
    }
}
