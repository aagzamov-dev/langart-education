import { FaCheck, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { getPricingPlans } from '@/lib/api';
import styles from './page.module.scss';

export const revalidate = 86400; // 24 hours

interface PricingPlan {
    id: number;
    title: string;
    icon: string;
    ages: string;
    features: string[];
    standardMonthly: number;
    standardPerLesson: number;
    standardStudents: string;
    focusedMonthly: number;
    focusedPerLesson: number;
    focusedStudents: string;
    duoMonthly: number;
    duoPerLesson: number;
    duoStudents: string;
}

export default async function PricingPage() {
    const plans = await getPricingPlans() as PricingPlan[];

    return (
        <>
            <Breadcrumb
                title="Pricing Plans"
                items={[{ label: 'Pricing' }]}
            />

            <section className={styles.pricing}>
                <div className={styles.container}>
                    <div className={styles.sectionTitle}>
                        <div className={styles.subTitle}>
                            <span className={styles.icon}>💰</span>
                            <h6>Affordable Plans</h6>
                        </div>
                        <h2>Choose Your <span>Perfect Plan</span></h2>
                    </div>

                    <div className={styles.grid}>
                        {plans.map((plan) => (
                            <div key={plan.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.planIcon}>{plan.icon}</span>
                                    <h3>{plan.title}</h3>
                                    <span className={styles.ages}>{plan.ages}</span>
                                </div>

                                <ul className={styles.features}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>
                                            <FaCheck className={styles.checkIcon} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className={styles.pricingTiers}>
                                    <div className={styles.tier}>
                                        <span className={styles.tierName}>Standard</span>
                                        <span className={styles.tiersStudents}>{plan.standardStudents} students</span>
                                        <span className={styles.tierPrice}>
                                            {plan.standardMonthly.toLocaleString()} som
                                        </span>
                                    </div>
                                    <div className={styles.tier}>
                                        <span className={styles.tierName}>Focused</span>
                                        <span className={styles.tiersStudents}>{plan.focusedStudents} students</span>
                                        <span className={styles.tierPrice}>
                                            {plan.focusedMonthly.toLocaleString()} som
                                        </span>
                                    </div>
                                    <div className={styles.tier}>
                                        <span className={styles.tierName}>Duo</span>
                                        <span className={styles.tiersStudents}>{plan.duoStudents} students</span>
                                        <span className={styles.tierPrice}>
                                            {plan.duoMonthly.toLocaleString()} som
                                        </span>
                                    </div>
                                </div>

                                <Link href="/contact" className={styles.btn}>
                                    Get Started
                                    <FaArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
