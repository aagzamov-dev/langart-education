'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBook, FaUsers, FaStar, FaDollarSign, FaCog, FaEnvelope } from 'react-icons/fa';
import './admin.css';

const navItems = [
    { href: '/admin', icon: FaHome, label: 'Dashboard' },
    { href: '/admin/messages', icon: FaEnvelope, label: 'Messages' },
    { href: '/admin/courses', icon: FaBook, label: 'Courses' },
    { href: '/admin/instructors', icon: FaUsers, label: 'Instructors' },
    { href: '/admin/testimonials', icon: FaStar, label: 'Testimonials' },
    { href: '/admin/pricing', icon: FaDollarSign, label: 'Pricing Plans' },
    { href: '/admin/settings', icon: FaCog, label: 'Site Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="adminLayout">
            <aside className="sidebar">
                <Link href="/admin" className="logo">LangArt Admin</Link>
                <nav>
                    <div className="navSection">
                        <p className="navTitle">Menu</p>
                        <ul className="navList">
                            {navItems.map((item) => (
                                <li key={item.href} className="navItem">
                                    <Link
                                        href={item.href}
                                        className={`navLink ${pathname === item.href ? 'active' : ''}`}
                                    >
                                        <item.icon className="navIcon" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </aside>
            <main className="main">{children}</main>
        </div>
    );
}
