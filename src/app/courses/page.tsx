'use client';

import { motion } from 'motion/react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CourseCard from '@/components/cards/CourseCard';
import { getAllCourses } from '@/data/courses';
import styles from './page.module.scss';

export default function CoursesPage() {
    const courses = getAllCourses();

    return (
        <>
            <Breadcrumb
                title="Our Courses"
                items={[{ label: 'Courses' }]}
            />

            <section className={styles.courses}>
                <div className={styles.container}>
                    <motion.div
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className={styles.subTitle}>
                            <span className={styles.icon}>📚</span>
                            <h6>Explore Programs</h6>
                        </div>
                        <h2>Find Your <span>Perfect Course</span></h2>
                    </motion.div>

                    <div className={styles.grid}>
                        {courses.map((course, index) => (
                            <CourseCard
                                key={course.id}
                                slug={course.slug}
                                title={course.title}
                                shortTag={course.shortTag}
                                image={course.image}
                                price={course.price}
                                duration={course.duration}
                                lessonDuration={course.lessonDuration}
                                rating={course.rating}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
