'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import styles from './LanguageSelector.module.scss';

const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
];

interface LanguageSelectorProps {
    variant?: 'default' | 'sticky' | 'mobile';
}

export default function LanguageSelector({ variant = 'default' }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState('en');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get current locale from cookie
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };
        const locale = getCookie('NEXT_LOCALE') || 'en';
        setCurrentLocale(locale);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (code: string) => {
        document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`;
        setCurrentLocale(code);
        setIsOpen(false);
        window.location.reload();
    };

    const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

    const variantClass = variant === 'sticky'
        ? styles.stickyVariant
        : variant === 'mobile'
            ? styles.mobileVariant
            : '';

    return (
        <div
            className={`${styles.selector} ${variantClass} ${isOpen ? styles.open : ''}`}
            ref={dropdownRef}
        >
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select language"
            >
                <span className={styles.code}>{currentLang.code.toUpperCase()}</span>
                <FaChevronDown className={styles.icon} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                className={`${styles.option} ${lang.code === currentLocale ? styles.active : ''}`}
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                <span className={styles.flag}>{lang.flag}</span>
                                <span className={styles.label}>{lang.label}</span>
                                {lang.code === currentLocale && <FaCheck className={styles.check} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
