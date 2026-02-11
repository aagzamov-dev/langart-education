'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import LanguageSelector from '@/components/ui/LanguageSelector';
import styles from './Header.module.scss';

export default function Header() {
    const t = useTranslations();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/about', label: t('nav.about') },
        { href: '/courses', label: t('nav.courses') },
        { href: '/instructors', label: t('nav.instructors') },
        { href: '/pricing', label: t('nav.pricing') },
        { href: '/contact', label: t('nav.contact') },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Top Bar - Always visible (hidden when scrolled via CSS) */}
            <div className={`${styles.topBar} ${isScrolled ? styles.hidden : ''}`}>
                <div className={styles.container}>
                    <p className={styles.welcomeText}>
                        <span className={styles.icon}>✨</span>
                        {t('topBar.welcome')} <Link href="/">LangArt</Link> – {t('topBar.tagline')}
                    </p>
                </div>
            </div>

            {/* Main Header */}
            <header className={`${styles.header} ${isScrolled ? styles.sticky : ''}`}>
                <div className={styles.container}>
                    <div className={styles.headerWrap}>
                        {/* Logo */}
                        <Link href="/" className={styles.logo}>
                            <Image
                                src={isScrolled ? '/images/logo.png' : '/images/footer-logo.png'}
                                alt="LangArt"
                                width={150}
                                height={50}
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className={styles.desktopNav}>
                            <ul className={styles.navList}>
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={styles.navLink}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Right side: Language Selector & Mobile Menu Button */}
                        <div className={styles.headerRight}>
                            <LanguageSelector variant={isScrolled ? 'sticky' : 'default'} />

                            <button
                                className={styles.mobileMenuBtn}
                                onClick={toggleMobileMenu}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Opens from top, full width */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className={styles.backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={toggleMobileMenu}
                        />

                        {/* Mobile Menu Panel - From Top */}
                        <motion.div
                            className={styles.mobileMenu}
                            initial={{ y: '-100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200
                            }}
                        >
                            <div className={styles.mobileMenuHeader}>
                                <Link href="/" className={styles.mobileLogo} onClick={toggleMobileMenu}>
                                    <Image
                                        src="/images/logo.png"
                                        alt="LangArt"
                                        width={120}
                                        height={40}
                                    />
                                </Link>
                                <button
                                    className={styles.closeBtn}
                                    onClick={toggleMobileMenu}
                                    aria-label="Close menu"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <nav className={styles.mobileNav}>
                                <ul>
                                    {navLinks.map((link, index) => (
                                        <motion.li
                                            key={link.href}
                                            initial={{ opacity: 0, y: -20, x: 0 }}
                                            animate={{ opacity: 1, y: 0, x: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                delay: 0.1 + index * 0.05,
                                                duration: 0.3,
                                                ease: 'easeOut'
                                            }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={styles.mobileNavLink}
                                                onClick={toggleMobileMenu}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Mobile Language Selector */}
                            <motion.div
                                className={styles.mobileLangSelector}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <LanguageSelector variant="mobile" />
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
