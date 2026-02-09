import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaTelegram, FaPhone, FaEnvelope } from 'react-icons/fa';
import { contactInfo } from '@/data/contact';
import styles from './Footer.module.scss';

const footerLinks = {
    platform: [
        { href: '/about', label: 'About Us' },
        { href: '/courses', label: 'Our Courses' },
        { href: '/instructors', label: 'Instructors' },
        { href: '/contact', label: 'Enroll Now' },
    ],
    quickLinks: [
        { href: '/contact', label: 'Contact Us' },
        { href: '/pricing', label: 'Pricing' },
    ],
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main Footer Content */}
                <div className={styles.footerContent}>
                    {/* Logo Section */}
                    <div className={styles.logoSection}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/images/footer-logo.png"
                                alt="LangArt"
                                width={150}
                                height={50}
                            />
                        </Link>
                    </div>

                    {/* Footer Grid */}
                    <div className={styles.footerGrid}>
                        {/* Get in Touch */}
                        <div className={styles.footerCol}>
                            <h4 className={styles.colTitle}>Get in Touch</h4>
                            <p className={styles.description}>
                                LangArt - the ultimate destination for learners. We are committed to transforming education without standards.
                            </p>
                            <div className={styles.contactInfo}>
                                <a href={`tel:${contactInfo.phoneNumber.replace(/\s/g, '')}`} className={styles.contactItem}>
                                    <FaPhone />
                                    <span>{contactInfo.phoneNumber}</span>
                                </a>
                                <a href={`mailto:${contactInfo.email}`} className={styles.contactItem}>
                                    <FaEnvelope />
                                    <span>{contactInfo.email}</span>
                                </a>
                            </div>
                        </div>

                        {/* Online Platform */}
                        <div className={styles.footerCol}>
                            <h4 className={styles.colTitle}>Online Platform</h4>
                            <ul className={styles.linkList}>
                                {footerLinks.platform.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            <span className={styles.linkIcon}>→</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className={styles.footerCol}>
                            <h4 className={styles.colTitle}>Quick Links</h4>
                            <ul className={styles.linkList}>
                                {footerLinks.quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            <span className={styles.linkIcon}>→</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className={styles.footerBottom}>
                    <div className={styles.bottomContent}>
                        <p className={styles.copyright}>
                            © {currentYear} <Link href="/">LangArt</Link>. All rights reserved.
                        </p>
                        <div className={styles.socialLinks}>
                            <a
                                href={contactInfo.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Facebook"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href={contactInfo.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href={contactInfo.socialLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Telegram"
                            >
                                <FaTelegram />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
