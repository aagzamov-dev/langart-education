'use client';

import { motion } from 'motion/react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getAllTestimonials } from '@/data/testimonials';
import styles from './TestimonialSection.module.scss';

export default function TestimonialSection() {
    const t = useTranslations('testimonials');
    const testimonials = getAllTestimonials();

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
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <FaQuoteLeft className={styles.quoteIcon} />
                            <h4 className={styles.title}>{testimonial.title}</h4>
                            <p className={styles.content}>{testimonial.content}</p>

                            <div className={styles.rating}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={i < testimonial.rating ? styles.starFilled : styles.starEmpty}
                                    />
                                ))}
                            </div>

                            <div className={styles.author}>
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={60}
                                    height={60}
                                    className={styles.authorImage}
                                />
                                <div className={styles.authorInfo}>
                                    <h5>{testimonial.name}</h5>
                                    <p>{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
