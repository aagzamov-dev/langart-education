import { unstable_cache } from 'next/cache';
import prisma from './prisma';

// Courses - No cache (server-side rendered)
export async function getCourses() {
    return prisma.course.findMany({
        include: { reviews: true },
        orderBy: { id: 'asc' }
    });
}

export async function getCourseBySlug(slug: string) {
    return prisma.course.findUnique({
        where: { slug },
        include: { reviews: true }
    });
}

// Instructors - Cached for 24 hours
export const getInstructors = unstable_cache(
    async () => {
        return prisma.instructor.findMany({ orderBy: { id: 'asc' } });
    },
    ['instructors'],
    { revalidate: 86400 }
);

export const getInstructorBySlug = unstable_cache(
    async (slug: string) => {
        return prisma.instructor.findUnique({ where: { slug } });
    },
    ['instructor'],
    { revalidate: 86400 }
);

// Testimonials - Cached for 24 hours
export const getTestimonials = unstable_cache(
    async () => {
        return prisma.testimonial.findMany({ orderBy: { id: 'asc' } });
    },
    ['testimonials'],
    { revalidate: 86400 }
);

// Pricing Plans - Cached for 24 hours
export const getPricingPlans = unstable_cache(
    async () => {
        return prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } });
    },
    ['pricing-plans'],
    { revalidate: 86400 }
);

// Site Config - Cached for 24 hours
export const getSiteConfig = unstable_cache(
    async () => {
        return prisma.siteConfig.findFirst();
    },
    ['site-config'],
    { revalidate: 86400 }
);

// Stats for Admin Dashboard
export async function getStats() {
    const [courses, instructors, testimonials, pricingPlans] = await Promise.all([
        prisma.course.count(),
        prisma.instructor.count(),
        prisma.testimonial.count(),
        prisma.pricingPlan.count()
    ]);

    return { courses, instructors, testimonials, pricingPlans };
}
