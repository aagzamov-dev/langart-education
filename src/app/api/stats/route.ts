import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const [courses, instructors, testimonials, pricingPlans] = await Promise.all([
            prisma.course.count(),
            prisma.instructor.count(),
            prisma.testimonial.count(),
            prisma.pricingPlan.count()
        ]);

        return NextResponse.json({ courses, instructors, testimonials, pricingPlans });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
