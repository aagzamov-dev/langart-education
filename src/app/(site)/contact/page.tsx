'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTelegram, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import Breadcrumb from '@/components/layout/Breadcrumb';
// import { contactInfo } from '@/data/contact'; // Keeping static as fallback/initial
import styles from './page.module.scss';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { LocalizedContent } from '@/types/admin';

interface Course {
    id: number;
    title: LocalizedContent | string; // Handle both legacy string and new Json
    slug: string;
}

// Basic email validation
const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function ContactPage() {
    const t = useTranslations('contact');
    const tNav = useTranslations('nav');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const { showToast } = useToast();
    const config = useSiteConfig();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        course: '',
        level: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                if (Array.isArray(data)) {
                    setCourses(data);
                } else {
                    console.error('API returned non-array data:', data);
                    setCourses([]);
                }
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setCourses([]);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            showToast('Name and phone are required', 'error');
            return;
        }

        if (formData.email && !isValidEmail(formData.email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            showToast('Thank you for your message! We will contact you soon.', 'success');
            setFormData({
                name: '',
                phone: '',
                email: '',
                course: '',
                level: '',
                message: '',
            });
        } catch (error) {
            console.error('Submission error:', error);
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCourseTitle = (course: Course) => {
        if (typeof course.title === 'string') return course.title;
        // @ts-ignore
        return course.title?.[locale] || course.title?.['en'] || 'Course';
    };

    return (
        <>
            <Breadcrumb
                title={t('title')}
                items={[{ label: tNav('contact') }]}
            />

            <section className={styles.contact}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Contact Info */}
                        <motion.div
                            className={styles.infoCol}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3>{t('getInTouch')}</h3>
                            <p className={styles.description}>
                                {t('description')}
                            </p>

                            <div className={styles.contactItems}>
                                <a href={`tel:${config.phoneNumber.replace(/\s/g, '')}`} className={styles.contactItem}>
                                    <span className={styles.iconBox}>
                                        <FaPhone />
                                    </span>
                                    <div>
                                        <h6>{t('phone')}</h6>
                                        <p>{config.phoneNumber}</p>
                                    </div>
                                </a>

                                <a href={`mailto:${config.email}`} className={styles.contactItem}>
                                    <span className={styles.iconBox}>
                                        <FaEnvelope />
                                    </span>
                                    <div>
                                        <h6>{t('email')}</h6>
                                        <p>{config.email}</p>
                                    </div>
                                </a>

                                {config.locations.length > 0 && (
                                    <div className={styles.contactItem}>
                                        <span className={styles.iconBox}>
                                            <FaMapMarkerAlt />
                                        </span>
                                        <div>
                                            <h6>{t('address')}</h6>
                                            <p>{config.locations[0]}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.socialLinks}>
                                {config.telegram && (
                                    <a
                                        href={config.telegram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialLink}
                                    >
                                        <FaTelegram />
                                    </a>
                                )}
                                {config.instagram && (
                                    <a
                                        href={config.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialLink}
                                    >
                                        <FaInstagram />
                                    </a>
                                )}
                                {config.facebook && (
                                    <a
                                        href={config.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialLink}
                                    >
                                        <FaFacebookF />
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            className={styles.formCol}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3>{t('sendMessage')}</h3>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder={`${t('yourName')} *`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder={`${t('phoneNumber')} *`}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={t('emailAddress')}
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <select name="course" value={formData.course} onChange={handleChange} disabled={isSubmitting || loadingCourses}>
                                            <option value="">{t('selectCourse')}</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.title && typeof course.title === 'string' ? course.title : (course.title as any)?.['en'] || course.slug}>
                                                    {getCourseTitle(course)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <select name="level" value={formData.level} onChange={handleChange} disabled={isSubmitting}>
                                            <option value="">{t('selectLevel')}</option>
                                            <option value="beginner">{t('beginner')}</option>
                                            <option value="elementary">{t('elementary')}</option>
                                            <option value="intermediate">{t('intermediate')}</option>
                                            <option value="upper-intermediate">{t('upperIntermediate')}</option>
                                            <option value="advanced">{t('advanced')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <textarea
                                        name="message"
                                        placeholder={t('yourMessage')}
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : tCommon('sendMessage')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className={styles.map}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.0!2d69.2401!3d41.3111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzQwLjAiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="LangArt Location"
                />
            </section>
        </>
    );
}
