'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import styles from './AboutSection.module.scss';

interface AboutSectionProps {
    variant?: 'school' | 'exam' | 'business';
}

export default function AboutSection({ variant = 'school' }: AboutSectionProps) {
    const t = useTranslations('about');
    const tCommon = useTranslations('common');

    const sectionData = {
        school: {
            title: [t('schoolTitle1'), t('schoolTitle2')],
            description: t('schoolDesc'),
            features: [t('innovativeLearning'), t('worldwideIntelligent')],
            image: '/images/home/school.png',
            reverse: true,
        },
        exam: {
            title: [t('examTitle1'), t('examTitle2')],
            description: t('examDesc'),
            features: [t('ielts'), t('toefl'), t('duolingo'), t('localExams')],
            image: '/images/home/campus-life.png',
            reverse: false,
        },
        business: {
            title: [t('businessTitle1'), t('businessTitle2')],
            description: t('businessDesc'),
            features: [],
            image: '/images/home/colleagues.png',
            reverse: false,
        },
    };

    const data = sectionData[variant];

    return (
        <section className={`${styles.about} ${data.reverse ? styles.reverse : ''}`}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Image Column */}
                    <motion.div
                        className={styles.imageCol}
                        initial={{ opacity: 0, x: data.reverse ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={data.image}
                                alt={data.title[0]}
                                width={500}
                                height={400}
                                className={styles.mainImage}
                            />
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        className={styles.contentCol}
                        initial={{ opacity: 0, x: data.reverse ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.content}>
                            <h1 className={styles.title}>{data.title[0]}</h1>
                            <h1 className={styles.title}>{data.title[1]}</h1>

                            <p className={styles.description}>{data.description}</p>

                            {data.features.length > 0 && (
                                <div className={styles.features}>
                                    {data.features.map((feature, index) => (
                                        <motion.div
                                            key={feature}
                                            className={styles.featureItem}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <span className={styles.featureIcon}>✓</span>
                                            {feature}
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.buttons}>
                                <Link href="/contact" className={styles.btnPrimary}>
                                    {tCommon('enroll')}
                                    <FaArrowRight />
                                </Link>
                                <Link href="/courses" className={styles.btnOutline}>
                                    {tCommon('findCourse')}
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background shapes */}
            <div className={styles.shapes}>
                <motion.div
                    className={styles.shape1}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className={styles.shape2}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
            </div>
        </section>
    );
}
