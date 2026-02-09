'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Breadcrumb from '@/components/layout/Breadcrumb';
import InstructorCard from '@/components/cards/InstructorCard';
import { getAllInstructors } from '@/data/instructors';
import styles from './page.module.scss';

export default function InstructorsPage() {
    const t = useTranslations('instructors');
    const instructors = getAllInstructors();

    return (
        <>
            <Breadcrumb
                title={t('title')}
                items={[{ label: t('title') }]}
            />

            <section className={styles.instructors}>
                <div className={styles.container}>
                    <motion.div
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className={styles.subTitle}>
                            <span className={styles.icon}>👨‍🏫</span>
                            <h6>{t('subtitle')}</h6>
                        </div>
                        <h2>{t('expert')}</h2>
                    </motion.div>

                    <div className={styles.grid}>
                        {instructors.map((instructor, index) => (
                            <InstructorCard
                                key={instructor.id}
                                slug={instructor.slug}
                                name={instructor.name}
                                image={instructor.image}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
