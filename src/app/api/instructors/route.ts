import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const instructors = await prisma.instructor.findMany({ orderBy: { id: 'asc' } });
        return NextResponse.json(instructors);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const instructor = await prisma.instructor.create({
            data: {
                slug: data.slug,
                name: data.name,
                image: data.image || '/images/placeholder.svg',
                experience: data.experience,
                students: data.students,
                about: data.about
            }
        });
        return NextResponse.json(instructor, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 });
    }
}
