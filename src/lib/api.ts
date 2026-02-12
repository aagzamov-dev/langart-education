import { unstable_cache } from 'next/cache';
import prisma from './prisma';

// Courses - No cache (server-side rendered)
export async function getCourses() {
    try {
        return await prisma.course.findMany({
            include: { reviews: true },
            orderBy: { id: 'asc' }
        });
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        return [];
    }
}

export async function getCourseBySlug(slug: string) {
    try {
        return await prisma.course.findUnique({
            where: { slug },
            include: { reviews: true }
        });
    } catch (error) {
        console.error(`Failed to fetch course by slug ${slug}:`, error);
        return null;
    }
}

// Instructors - Cached for 24 hours
export const getInstructors = unstable_cache(
    async () => {
        try {
            return await prisma.instructor.findMany({ orderBy: { id: 'asc' } });
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
            return [];
        }
    },
    ['instructors'],
    { revalidate: 86400 }
);

export const getInstructorBySlug = unstable_cache(
    async (slug: string) => {
        try {
            return await prisma.instructor.findUnique({ where: { slug } });
        } catch (error) {
            console.error(`Failed to fetch instructor by slug ${slug}:`, error);
            return null;
        }
    },
    ['instructor'],
    { revalidate: 86400 }
);

// Testimonials - Cached for 24 hours
export const getTestimonials = unstable_cache(
    async () => {
        try {
            return await prisma.testimonial.findMany({ orderBy: { id: 'asc' } });
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            return [];
        }
    },
    ['testimonials'],
    { revalidate: 86400 }
);

// Pricing Plans - Cached for 24 hours
export const getPricingPlans = unstable_cache(
    async () => {
        try {
            return await prisma.pricingPlan.findMany({ orderBy: { order: 'asc' } });
        } catch (error) {
            console.error('Failed to fetch pricing plans:', error);
            return [];
        }
    },
    ['pricing-plans'],
    { revalidate: 86400 }
);

// Site Config - Cached for 24 hours
export const getSiteConfig = unstable_cache(
    async () => {
        try {
            return await prisma.siteConfig.findFirst();
        } catch (error) {
            console.error('Failed to fetch site config:', error);
            return null;
        }
    },
    ['site-config'],
    { revalidate: 86400 }
);

// Stats for Admin Dashboard
export async function getStats() {
    try {
        const [courses, instructors, testimonials, pricingPlans] = await Promise.all([
            prisma.course.count(),
            prisma.instructor.count(),
            prisma.testimonial.count(),
            prisma.pricingPlan.count()
        ]);

        return { courses, instructors, testimonials, pricingPlans };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return { courses: 0, instructors: 0, testimonials: 0, pricingPlans: 0 };
    }
}
