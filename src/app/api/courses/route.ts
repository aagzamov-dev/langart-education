import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: { reviews: true },
            orderBy: { id: 'asc' }
        });
        return NextResponse.json(courses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const course = await prisma.course.create({
            data: {
                slug: data.slug,
                title: data.title,
                shortTag: data.shortTag,
                image: data.image || '/images/placeholder.svg',
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
                rating: data.rating || 5,
                overview: data.overview,
                whatYouWillLearn: data.whatYouWillLearn || []
            }
        });
        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
