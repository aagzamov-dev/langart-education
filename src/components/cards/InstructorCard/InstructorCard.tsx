'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import styles from './InstructorCard.module.scss';

interface InstructorCardProps {
    slug: string;
    name: string;
    image: string;
    index?: number;
}

const colorClasses = ['color1', 'color2', 'color3', 'color4'];

export default function InstructorCard({
    slug,
    name,
    image,
    index = 0,
}: InstructorCardProps) {
    const colorClass = colorClasses[index % colorClasses.length];

    return (
        <motion.div
            className={`${styles.card} ${styles[colorClass]}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
        >
            <Link href={`/instructors/${slug}`} className={styles.link}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={image}
                        alt={name}
                        width={300}
                        height={350}
                        className={styles.image}
                    />
                </div>
                <div className={styles.content}>
                    <h4 className={styles.name}>{name}</h4>
                </div>
            </Link>
        </motion.div>
    );
}
