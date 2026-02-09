'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTelegram, FaInstagram, FaFacebookF, FaHeart } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { contactInfo } from '@/data/contact';
import styles from './Footer.module.scss';

export default function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');

    const quickLinks = [
        { href: '/about', label: tNav('about') },
        { href: '/courses', label: tNav('courses') },
        { href: '/instructors', label: tNav('instructors') },
        { href: '/pricing', label: tNav('pricing') },
        { href: '/contact', label: tNav('contact') },
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerTop}>
                    {/* Logo & Description */}
                    <div className={styles.footerCol}>
                        <Link href="/" className={styles.footerLogo}>
                            <Image
                                src="/images/footer-logo.png"
                                alt="LangArt"
                                width={150}
                                height={50}
                            />
                        </Link>
                        <p className={styles.description}>
                            {t('description')}
                        </p>
                        <div className={styles.socialLinks}>
                            <a href={contactInfo.socialLinks.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <FaTelegram />
                            </a>
                            <a href={contactInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href={contactInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerCol}>
                        <h4>{t('quickLinks')}</h4>
                        <ul className={styles.linkList}>
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Online Platform */}
                    <div className={styles.footerCol}>
                        <h4>{t('onlinePlatform')}</h4>
                        <ul className={styles.linkList}>
                            <li><a href="https://edu.langart.uz" target="_blank" rel="noopener noreferrer">LangArt LMS</a></li>
                            <li><Link href="/pricing">{tNav('pricing')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.footerCol}>
                        <h4>{tNav('contact')}</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <FaPhone className={styles.icon} />
                                <a href={`tel:${contactInfo.phoneNumber.replace(/\s/g, '')}`}>
                                    {contactInfo.phoneNumber}
                                </a>
                            </li>
                            <li>
                                <FaEnvelope className={styles.icon} />
                                <a href={`mailto:${contactInfo.email}`}>
                                    {contactInfo.email}
                                </a>
                            </li>
                            <li>
                                <FaMapMarkerAlt className={styles.icon} />
                                <span>{contactInfo.locations[0]}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className={styles.footerBottom}>
                <div className={styles.container}>
                    <p>
                        {t('copyright')} {t('madeWith')} <FaHeart className={styles.heart} /> {t('by')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
