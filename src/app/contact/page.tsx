'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTelegram, FaInstagram, FaFacebookF } from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { contactInfo } from '@/data/contact';
import styles from './page.module.scss';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        course: '',
        level: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO: Add form submission logic
        alert('Thank you for your message! We will contact you soon.');
    };

    return (
        <>
            <Breadcrumb
                title="Contact Us"
                items={[{ label: 'Contact' }]}
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
                            <h3>Get in Touch</h3>
                            <p className={styles.description}>
                                Have questions about our courses? Want to enroll? Fill out the form or contact us directly!
                            </p>

                            <div className={styles.contactItems}>
                                <a href={`tel:${contactInfo.phoneNumber.replace(/\s/g, '')}`} className={styles.contactItem}>
                                    <span className={styles.iconBox}>
                                        <FaPhone />
                                    </span>
                                    <div>
                                        <h6>Phone</h6>
                                        <p>{contactInfo.phoneNumber}</p>
                                    </div>
                                </a>

                                <a href={`mailto:${contactInfo.email}`} className={styles.contactItem}>
                                    <span className={styles.iconBox}>
                                        <FaEnvelope />
                                    </span>
                                    <div>
                                        <h6>Email</h6>
                                        <p>{contactInfo.email}</p>
                                    </div>
                                </a>

                                <div className={styles.contactItem}>
                                    <span className={styles.iconBox}>
                                        <FaMapMarkerAlt />
                                    </span>
                                    <div>
                                        <h6>Address</h6>
                                        <p>{contactInfo.locations[0]}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.socialLinks}>
                                <a
                                    href={contactInfo.socialLinks.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    <FaTelegram />
                                </a>
                                <a
                                    href={contactInfo.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    <FaInstagram />
                                </a>
                                <a
                                    href={contactInfo.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    <FaFacebookF />
                                </a>
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
                                <h3>Send us a Message</h3>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name *"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number *"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <select name="course" value={formData.course} onChange={handleChange}>
                                            <option value="">Select Course</option>
                                            <option value="young-learners">Young Learners English</option>
                                            <option value="school">English for School</option>
                                            <option value="general">General English</option>
                                            <option value="exam">Exam Preparation</option>
                                            <option value="business">Business English</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <select name="level" value={formData.level} onChange={handleChange}>
                                            <option value="">Select Level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="elementary">Elementary</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="upper-intermediate">Upper Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn}>
                                    Send Message
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
