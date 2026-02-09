'use client';

import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { motion } from 'motion/react';
import styles from './Breadcrumb.module.scss';

interface BreadcrumbProps {
    items: Array<{
        label: string;
        href?: string;
    }>;
    title: string;
}

export default function Breadcrumb({ items, title }: BreadcrumbProps) {
    return (
        <section className={styles.breadcrumb}>
            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={styles.title}>{title}</h1>
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.homeLink}>
                            <FaHome />
                            Home
                        </Link>
                        {items.map((item, index) => (
                            <span key={index} className={styles.item}>
                                <FaChevronRight className={styles.separator} />
                                {item.href ? (
                                    <Link href={item.href}>{item.label}</Link>
                                ) : (
                                    <span className={styles.current}>{item.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                </motion.div>
            </div>

            {/* Decorative shapes */}
            <div className={styles.shapes}>
                <motion.div
                    className={styles.shape1}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className={styles.shape2}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        </section>
    );
}
