import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const instructor = await prisma.instructor.findUnique({ where: { id: parseInt(id) } });
        if (!instructor) return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
        return NextResponse.json(instructor);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch instructor' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const instructor = await prisma.instructor.update({
            where: { id: parseInt(id) },
            data: {
                slug: data.slug,
                name: data.name,
                image: data.image,
                experience: data.experience,
                students: data.students,
                about: data.about
            }
        });
        return NextResponse.json(instructor);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update instructor' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.instructor.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete instructor' }, { status: 500 });
    }
}
