import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/layout/Breadcrumb';
import InstructorCard from '@/components/cards/InstructorCard';
import { getInstructors } from '@/lib/api';
import styles from './page.module.scss';

export const revalidate = 86400; // 24 hours

export default async function InstructorsPage() {
    const t = await getTranslations('instructors');
    const instructors = await getInstructors();

    return (
        <>
            <Breadcrumb
                title={t('title')}
                items={[{ label: t('title') }]}
            />

            <section className={styles.instructors}>
                <div className={styles.container}>
                    <div className={styles.sectionTitle}>
                        <div className={styles.subTitle}>
                            <span className={styles.icon}>👨‍🏫</span>
                            <h6>{t('subtitle')}</h6>
                        </div>
                        <h2>{t('expert')}</h2>
                    </div>

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
