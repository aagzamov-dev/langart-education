import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const plan = await prisma.pricingPlan.findUnique({ where: { id: parseInt(id) } });
        if (!plan) return NextResponse.json({ error: 'Pricing plan not found' }, { status: 404 });
        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pricing plan' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const plan = await prisma.pricingPlan.update({
            where: { id: parseInt(id) },
            data: {
                title: data.title,
                icon: data.icon,
                ages: data.ages,
                features: data.features,
                standardMonthly: data.standardMonthly,
                standardPerLesson: data.standardPerLesson,
                standardStudents: data.standardStudents,
                focusedMonthly: data.focusedMonthly,
                focusedPerLesson: data.focusedPerLesson,
                focusedStudents: data.focusedStudents,
                duoMonthly: data.duoMonthly,
                duoPerLesson: data.duoPerLesson,
                duoStudents: data.duoStudents,
                order: data.order
            }
        });
        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update pricing plan' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.pricingPlan.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete pricing plan' }, { status: 500 });
    }
}
