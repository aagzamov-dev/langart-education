import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import styles from './page.module.scss';

export default function Home() {
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
      <TestimonialSection />
    </div>
  );
}
