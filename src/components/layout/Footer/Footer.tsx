'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTelegram, FaInstagram, FaFacebookF, FaRocket } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useSiteConfig } from '@/context/SiteConfigContext';
import styles from './Footer.module.scss';

export default function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');
    const config = useSiteConfig();

    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/images/logo.png"
                                alt="LangArt"
                                width={150}
                                height={40}
                                className={styles.logoImg}
                            />
                        </Link>
                        <p className={styles.description}>
                            {t('description')}
                        </p>
                        <div className={styles.socialLinks}>
                            {config.telegram && (
                                <a href={config.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                    <FaTelegram />
                                </a>
                            )}
                            {config.instagram && (
                                <a href={config.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                            )}
                            {config.facebook && (
                                <a href={config.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <FaFacebookF />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksCol}>
                        <h3>{t('quickLinks')}</h3>
                        <ul>
                            <li><Link href="/courses">{tNav('courses')}</Link></li>
                            <li><Link href="/instructors">{tNav('instructors')}</Link></li>
                            <li><Link href="/about">{tNav('about')}</Link></li>
                            <li><Link href="/contact">{tNav('contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div className={styles.linksCol}>
                        <h3>{t('platform')}</h3>
                        <ul>
                            <li>
                                <a href="https://lms.langart.uz" target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                                    <FaRocket className={styles.icon} /> CMS {t('login')}
                                </a>
                            </li>
                            <li>
                                <a href="https://cabinet.langart.uz" target="_blank" rel="noopener noreferrer" className={styles.platformLink}>
                                    <FaRocket className={styles.icon} /> Student Cabinet
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.contactCol}>
                        <h3>{tNav('contact')}</h3>
                        <ul className={styles.contactList}>
                            <li>
                                <FaPhone className={styles.contactIcon} />
                                <a href={`tel:${config.phoneNumber.replace(/\s/g, '')}`}>{config.phoneNumber}</a>
                            </li>
                            <li>
                                <FaEnvelope className={styles.contactIcon} />
                                <a href={`mailto:${config.email}`}>{config.email}</a>
                            </li>
                            {config.locations.map((loc, idx) => (
                                <li key={idx}>
                                    <FaMapMarkerAlt className={styles.contactIcon} />
                                    <span>{loc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {currentYear} LangArt. {t('rights')}</p>
                </div>
            </div>
        </footer>
    );
}
