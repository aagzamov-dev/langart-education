'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FaArrowRight, FaStar, FaCalendarAlt, FaHourglass } from 'react-icons/fa';
import { useLocale } from 'next-intl';
import styles from './CourseCard.module.scss';
import { getLocalizedContent } from '@/utils/localized';

interface CourseCardProps {
    slug: string;
    title: any;
    shortTag: any;
    image: string;
    price: number;
    duration: number;
    lessonDuration: number;
    rating: number;
    index?: number;
}

export default function CourseCard({
    slug,
    title,
    shortTag,
    image,
    price,
    duration,
    lessonDuration,
    rating,
    index = 0,
}: CourseCardProps) {
    const locale = useLocale();

    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
        >
            <div className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={getLocalizedContent(title, locale)}
                    width={400}
                    height={250}
                    className={styles.image}
                />
                <span className={styles.tag}>{getLocalizedContent(shortTag, locale)}</span>
            </div>

            <div className={styles.content}>
                <h4 className={styles.title}>
                    <Link href={`/courses/${slug}`}>{getLocalizedContent(title, locale)}</Link>
                </h4>

                <div className={styles.rating}>
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={i < rating ? styles.starFilled : styles.starEmpty}
                            />
                        ))}
                    </div>
                    <span className={styles.ratingText}>({rating}/5 Ratings)</span>
                    <span className={styles.price}>{price.toLocaleString()} som</span>
                </div>

                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        <FaCalendarAlt />
                        {duration} Month
                    </span>
                    <span className={styles.metaItem}>
                        <FaHourglass />
                        {lessonDuration} minutes
                    </span>
                </div>

                <Link href={`/courses/${slug}`} className={styles.btn}>
                    Enroll Now
                    <FaArrowRight />
                </Link>
            </div>
        </motion.div>
    );
}
