'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Header.module.scss';

const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/courses', label: 'Courses' },
    { href: '/instructors', label: 'Instructors' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.container}>
                    <p className={styles.welcomeText}>
                        <span className={styles.icon}>✨</span>
                        Welcome to <Link href="/">LangArt</Link> – Unlocking the Power of Education!
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
                                src={isScrolled ? '/images/footer-logo.png' : '/images/logo.png'}
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

                        {/* Mobile Menu Button */}
                        <button
                            className={styles.mobileMenuBtn}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMobileMenu}
                        />
                        <motion.div
                            className={styles.mobileMenu}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                        >
                            <div className={styles.mobileMenuHeader}>
                                <Link href="/" className={styles.mobileLogo} onClick={toggleMobileMenu}>
                                    <Image
                                        src="/images/footer-logo.png"
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
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
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
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
