import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) },
            include: { reviews: true }
        });
        if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const course = await prisma.course.update({
            where: { id: parseInt(id) },
            data: {
                slug: data.slug,
                title: data.title,
                shortTag: data.shortTag,
                image: data.image,
                price: data.price,
                price2: data.price2,
                price3: data.price3,
                dailyPrice: data.dailyPrice,
                dailyPrice2: data.dailyPrice2,
                dailyPrice3: data.dailyPrice3,
                duration: data.duration,
                lessonDuration: data.lessonDuration,
                breaks: data.breaks,
                studentsInGroup: data.studentsInGroup,
                studentsInGroup2: data.studentsInGroup2,
                studentsInGroup3: data.studentsInGroup3,
                certificates: data.certificates,
                ages: data.ages,
                rating: data.rating,
                overview: data.overview,
                whatYouWillLearn: data.whatYouWillLearn
            }
        });
        return NextResponse.json(course);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.course.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
}
