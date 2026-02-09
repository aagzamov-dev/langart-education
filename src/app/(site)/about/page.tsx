import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import { getTestimonials } from '@/lib/api';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about LangArt Educational Group - the ultimate destination for learners committed to mastering English.',
};

export default async function AboutPage() {
    const testimonials = await getTestimonials();

    return (
        <>
            <Breadcrumb
                title="About Us"
                items={[{ label: 'About Us' }]}
            />

            <AboutSection variant="school" />
            <AboutSection variant="exam" />
            <AboutSection variant="business" />
            <TestimonialSection testimonials={testimonials} />
        </>
    );
}
