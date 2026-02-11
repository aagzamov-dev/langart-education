import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({ orderBy: { id: 'asc' } });
        return NextResponse.json(testimonials);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const testimonial = await prisma.testimonial.create({
            data: {
                name: data.name,
                role: data.role,
                image: data.image || '/images/placeholder.svg',
                title: data.title,
                content: data.content,
                rating: data.rating || 5
            }
        });
        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}
