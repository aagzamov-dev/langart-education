import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CourseCard from '@/components/cards/CourseCard';
import { getCourses } from '@/lib/api';
import styles from './page.module.scss';

export default async function CoursesPage() {
    const t = await getTranslations('courses');
    const courses = await getCourses();

    return (
        <>
            <Breadcrumb
                title={t('title')}
                items={[{ label: t('title') }]}
            />

            <section className={styles.courses}>
                <div className={styles.container}>
                    <div className={styles.sectionTitle}>
                        <div className={styles.subTitle}>
                            <span className={styles.icon}>📚</span>
                            <h6>{t('subtitle')}</h6>
                        </div>
                        <h2>{t('findPerfect')}</h2>
                    </div>

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
