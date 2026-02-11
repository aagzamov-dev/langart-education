'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBook, FaUsers, FaStar, FaDollarSign } from 'react-icons/fa';

interface Stats {
    courses: number;
    instructors: number;
    testimonials: number;
    pricingPlans: number;
}

const statCards = [
    { key: 'courses', label: 'Courses', icon: FaBook, color: '#6366f1', href: '/admin/courses' },
    { key: 'instructors', label: 'Instructors', icon: FaUsers, color: '#22c55e', href: '/admin/instructors' },
    { key: 'testimonials', label: 'Testimonials', icon: FaStar, color: '#f59e0b', href: '/admin/testimonials' },
    { key: 'pricingPlans', label: 'Pricing Plans', icon: FaDollarSign, color: '#ef4444', href: '/admin/pricing' },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <div className="header">
                <h1 className="pageTitle">Dashboard</h1>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="statsGrid">
                    {statCards.map((card) => (
                        <Link key={card.key} href={card.href} className="statCard">
                            <div className="statIcon" style={{ background: `${card.color}20`, color: card.color }}>
                                <card.icon />
                            </div>
                            <div className="statInfo">
                                <h3>{stats?.[card.key as keyof Stats] ?? 0}</h3>
                                <p>{card.label}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
