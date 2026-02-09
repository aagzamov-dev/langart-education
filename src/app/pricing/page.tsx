'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import styles from './page.module.scss';

const pricingPlans = [
    {
        id: 1,
        title: 'Young Learners',
        icon: '🎓',
        ages: '7-10 Years',
        features: [
            'Cambridge YLE Framework',
            'Native-level Pronunciation',
            'Interactive Games',
            'Progress Reports',
            'Certificate Upon Completion',
        ],
        pricing: {
            standard: { monthly: 590000, perLesson: 60000, students: '10-12' },
            focused: { monthly: 690000, perLesson: 70000, students: '5-6' },
            duo: { monthly: 790000, perLesson: 80000, students: '2' },
        },
    },
    {
        id: 2,
        title: 'English for School',
        icon: '📚',
        ages: '11-17 Years',
        features: [
            'Academic English Skills',
            'Essay & Report Writing',
            'Critical Thinking',
            'Exam Preparation',
            'Group Discussions',
        ],
        pricing: {
            standard: { monthly: 650000, perLesson: 65000, students: '10-12' },
            focused: { monthly: 750000, perLesson: 75000, students: '5-6' },
            duo: { monthly: 850000, perLesson: 85000, students: '2' },
        },
    },
    {
        id: 3,
        title: 'Exam Preparation',
        icon: '🎯',
        ages: '16+ Years',
        features: [
            'IELTS Preparation',
            'TOEFL Strategies',
            'Duolingo Test Prep',
            'Mock Tests & Feedback',
            'Time Management',
        ],
        pricing: {
            standard: { monthly: 800000, perLesson: 85000, students: '6-8' },
            focused: { monthly: 950000, perLesson: 100000, students: '3-4' },
            duo: { monthly: 1100000, perLesson: 120000, students: '2' },
        },
    },
    {
        id: 4,
        title: 'Business English',
        icon: '💼',
        ages: '20+ Years',
        features: [
            'Business Communication',
            'Presentation Skills',
            'Negotiation English',
            'Email & Report Writing',
            'Industry Vocabulary',
        ],
        pricing: {
            standard: { monthly: 900000, perLesson: 95000, students: '4-6' },
            focused: { monthly: 1050000, perLesson: 110000, students: '2-3' },
            duo: { monthly: 1200000, perLesson: 130000, students: '2' },
        },
    },
];

export default function PricingPage() {
    const [showPerLesson, setShowPerLesson] = useState(false);

    return (
        <>
            <Breadcrumb
                title="Pricing Plans"
                items={[{ label: 'Pricing' }]}
            />

            <section className={styles.pricing}>
                <div className={styles.container}>
                    <motion.div
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className={styles.subTitle}>
                            <span className={styles.icon}>💰</span>
                            <h6>Affordable Plans</h6>
                        </div>
                        <h2>Choose Your <span>Perfect Plan</span></h2>
                    </motion.div>

                    {/* Toggle */}
                    <div className={styles.toggle}>
                        <span className={!showPerLesson ? styles.active : ''}>12 Lessons</span>
                        <button
                            className={`${styles.toggleBtn} ${showPerLesson ? styles.toggled : ''}`}
                            onClick={() => setShowPerLesson(!showPerLesson)}
                            aria-label="Toggle pricing view"
                        >
                            <span className={styles.toggleKnob} />
                        </button>
                        <span className={showPerLesson ? styles.active : ''}>Per Lesson</span>
                    </div>

                    <div className={styles.grid}>
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                className={styles.card}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
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
                                    {Object.entries(plan.pricing).map(([tier, data]) => (
                                        <div key={tier} className={styles.tier}>
                                            <span className={styles.tierName}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</span>
                                            <span className={styles.tiersStudents}>{data.students} students</span>
                                            <span className={styles.tierPrice}>
                                                {(showPerLesson ? data.perLesson : data.monthly).toLocaleString()} som
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/contact" className={styles.btn}>
                                    Get Started
                                    <FaArrowRight />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
