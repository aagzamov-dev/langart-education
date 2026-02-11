import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import { getTestimonials } from '@/lib/api';
import styles from './page.module.scss';

export const revalidate = 86400; // 24 hours

export default async function Home() {
  const testimonials = await getTestimonials();

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <HeroSection />

      {/* English For School Section */}
      <AboutSection variant="school" />

      {/* English For Exam Section */}
      <AboutSection variant="exam" />

      {/* English For Business Section */}
      <AboutSection variant="business" />

      {/* Testimonials Section */}
      <TestimonialSection testimonials={testimonials} />
    </div>
  );
}
