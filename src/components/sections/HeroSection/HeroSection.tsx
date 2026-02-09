'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import styles from './HeroSection.module.scss';

export default function HeroSection() {
    return (
        <>
            {/* Part 1: Main Hero with Background */}
            <section className={styles.heroMain}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <motion.h5
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <FaCheck className={styles.checkIcon} />
                            100% Satisfaction Guarantee
                        </motion.h5>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Grow Your Learning
                        </motion.h1>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            With <span>LangArt</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            We are committed to delivering success
                        </motion.p>

                        <motion.div
                            className={styles.heroButtons}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href="/contact" className={styles.btnPrimary}>
                                ENROLL
                                <FaArrowRight />
                            </Link>
                            <Link href="/courses" className={styles.btnOutline}>
                                FIND COURSE
                                <FaArrowRight />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Floating shapes - positioned relative to section, infinite animation */}
                <motion.div
                    className={styles.shape1}
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Image src="/images/hero/hero-shape31.png" alt="" width={50} height={50} />
                </motion.div>

                <motion.div
                    className={styles.shape2}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Image src="/images/hero/hero-shape32.png" alt="" width={20} height={20} />
                </motion.div>

                <motion.div
                    className={styles.shape3}
                    animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Image src="/images/hero/hero-shape33.png" alt="" width={30} height={30} />
                </motion.div>
            </section>

            {/* Part 2: Young Learners Section */}
            <section className={styles.youngLearners}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Image Column */}
                        <div className={styles.imageCol}>
                            <div className={styles.imageWrapper}>
                                <motion.div
                                    className={styles.mainThumb}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Image
                                        src="/images/hero/hero-thumb4.png"
                                        alt="Young Learner"
                                        width={350}
                                        height={400}
                                        className={styles.heroThumb}
                                    />
                                </motion.div>

                                {/* Floating decorations - infinite */}
                                <motion.div
                                    className={styles.floatShape1}
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Image src="/images/hero/hero-shape43.png" alt="" width={60} height={60} />
                                </motion.div>

                                <motion.div
                                    className={styles.floatShape2}
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Image src="/images/hero/hero-shape44.png" alt="" width={25} height={25} />
                                </motion.div>

                                <motion.div
                                    className={styles.floatShape3}
                                    animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Image src="/images/hero/hero-shape45.png" alt="" width={40} height={40} />
                                </motion.div>

                                <motion.div
                                    className={styles.floatShape4}
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Image src="/images/hero/hero-shape46.png" alt="" width={80} height={80} />
                                </motion.div>

                                {/* Expert Instructors Badge */}
                                <motion.div
                                    className={styles.autorBadge}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className={styles.autorThumb}>
                                        <Image
                                            src="/images/hero/hero-autor.png"
                                            alt="Instructors"
                                            width={80}
                                            height={35}
                                        />
                                    </div>
                                    <span className={styles.autorText}>Expert Instructors</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <motion.div
                            className={styles.contentCol}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1>Young Learners English</h1>
                            <h1>Bright Future</h1>
                            <h1>Strong Foundation</h1>

                            <p>
                                <strong>LangArt</strong> - the ultimate destination for young knowledge seekers aged 7-10
                            </p>

                            <div className={styles.heroButtons}>
                                <Link href="/contact" className={styles.btnPrimary}>
                                    📚 ENROLL
                                </Link>
                                <Link href="/courses" className={styles.btnOutline}>
                                    FIND COURSE
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Background floating elements */}
                <motion.div
                    className={styles.bgShape1}
                    animate={{ y: [0, -30, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className={styles.bgShape2}
                    animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
            </section>
        </>
    );
}
