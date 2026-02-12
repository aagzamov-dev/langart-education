'use client';

import { motion } from 'motion/react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import styles from './TestimonialSection.module.scss';
import { LocalizedContent } from '@/types/admin';

interface Testimonial {
    id: number;
    name: LocalizedContent | string;
    role: LocalizedContent | string;
    image: string;
    title: LocalizedContent | string;
    content: LocalizedContent | string;
    rating: number;
}

interface TestimonialSectionProps {
    testimonials: Testimonial[] | { testimonials: Testimonial[] };
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
    const t = useTranslations('testimonials');
    const locale = useLocale();
    const items = Array.isArray(testimonials) ? testimonials : (testimonials as any)?.testimonials || [];

    // Helper to safely render localized content
    const renderContent = (content: any) => {
        if (!content) return '';
        if (typeof content === 'string') return content;

        // Try to get content for current locale, fallback to english, then others
        return content[locale] || content['en'] || content['uz'] || content['ru'] || '';
    };

    return (
        <section className={styles.testimonials}>
            <div className={styles.container}>
                <motion.div
                    className={styles.sectionTitle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.subTitle}>
                        <span className={styles.icon}>⭐</span>
                        <h6>{t('title')}</h6>
                    </div>
                    <h2>{t('subtitle')}</h2>
                </motion.div>

                <div className={styles.grid}>
                    {items.map((testimonial: Testimonial, index: number) => (
                        <motion.div
                            key={testimonial.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <FaQuoteLeft className={styles.quoteIcon} />

                            <h4 className={styles.title}>{renderContent(testimonial.title)}</h4>
                            <p className={styles.content}>{renderContent(testimonial.content)}</p>

                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}
                                    />
                                ))}
                            </div>

                            <div className={styles.author}>
                                <div className={styles.authorImageWrapper}>
                                    <Image
                                        src={testimonial.image}
                                        alt={renderContent(testimonial.name)}
                                        width={60}
                                        height={60}
                                        className={styles.authorImage}
                                    />
                                </div>
                                <div className={styles.authorInfo}>
                                    <h5>{renderContent(testimonial.name)}</h5>
                                    <p>{renderContent(testimonial.role)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
