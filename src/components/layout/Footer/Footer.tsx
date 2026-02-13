'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaTelegram,
    FaInstagram,
    FaFacebookF,
    FaChevronRight,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useSiteConfig } from '@/context/SiteConfigContext';
import styles from './Footer.module.scss';
import { motion } from 'motion/react';

export default function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');
    const config = useSiteConfig();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaTelegram, href: config.telegram, label: 'Telegram' },
        { icon: FaInstagram, href: config.instagram, label: 'Instagram' },
        { icon: FaFacebookF, href: config.facebook, label: 'Facebook' },
    ].filter(link => link.href);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.col}>
                        <div className={styles.brand}>
                            <Link href="/" className={styles.logo}>
                                <Image
                                    src="/images/logo.png"
                                    alt="LangArt"
                                    width={140}
                                    height={40}
                                    className="dark:invert"
                                />
                            </Link>
                            <p className={styles.description}>
                                {t('description')}
                            </p>
                            <div className={styles.socials}>
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label}
                                    >
                                        <link.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.col}>
                        <h4 className={styles.title}>{t('quickLinks')}</h4>
                        <ul className={styles.links}>
                            <li>
                                <Link href="/courses">
                                    <FaChevronRight size={10} /> {tNav('courses')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/instructors">
                                    <FaChevronRight size={10} /> {tNav('instructors')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/about">
                                    <FaChevronRight size={10} /> {tNav('about')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact">
                                    <FaChevronRight size={10} /> {tNav('contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Platform / Resources */}
                    <div className={styles.col}>
                        <h4 className={styles.title}>{t('platform')}</h4>
                        <ul className={styles.links}>
                            <li>
                                <a href="https://lms.langart.uz" target="_blank" rel="noopener noreferrer">
                                    <FaExternalLinkAlt size={12} /> LMS {t('login')}
                                </a>
                            </li>
                            <li>
                                <a href="https://cabinet.langart.uz" target="_blank" rel="noopener noreferrer">
                                    <FaExternalLinkAlt size={12} /> Student Cabinet
                                </a>
                            </li>
                            <li>
                                <Link href="/pricing">
                                    <FaChevronRight size={10} /> Pricing Plans
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.col}>
                        <h4 className={styles.title}>{tNav('contact')}</h4>
                        <ul className={styles.contactInfo}>
                            <li>
                                <FaPhone />
                                <a href={`tel:${config.phoneNumber.replace(/\s/g, '')}`}>{config.phoneNumber}</a>
                            </li>
                            <li>
                                <FaEnvelope />
                                <a href={`mailto:${config.email}`}>{config.email}</a>
                            </li>
                            {config.locations.map((loc, idx) => (
                                <li key={idx}>
                                    <FaMapMarkerAlt />
                                    <span>{loc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.bottomContent}>
                    <p>&copy; {currentYear} LangArt Educational Group. {t('rights')}</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
