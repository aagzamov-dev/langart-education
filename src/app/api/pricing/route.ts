import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const plans = await prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } });
        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pricing plans' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const plan = await prisma.pricingPlan.create({
            data: {
                title: data.title,
                icon: data.icon,
                ages: data.ages,
                features: data.features || [],
                standardMonthly: data.standardMonthly,
                standardPerLesson: data.standardPerLesson,
                standardStudents: data.standardStudents,
                focusedMonthly: data.focusedMonthly,
                focusedPerLesson: data.focusedPerLesson,
                focusedStudents: data.focusedStudents,
                duoMonthly: data.duoMonthly,
                duoPerLesson: data.duoPerLesson,
                duoStudents: data.duoStudents,
                order: data.order || 0
            }
        });
        return NextResponse.json(plan, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create pricing plan' }, { status: 500 });
    }
}
