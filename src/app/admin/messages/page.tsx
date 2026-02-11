'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaEye, FaEyeSlash, FaTrash, FaCheck, FaTimes, FaSearch, FaPhone, FaEnvelope } from 'react-icons/fa';
import { TableSkeleton } from '@/components/ui/Loading/TableSkeleton';

interface Submission {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    course: string | null;
    level: string | null;
    message: string | null;
    isRead: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Submission | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/submissions');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleReadStatus = async (id: number, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        // Optimistic update
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, isRead: !currentStatus } : s));
        if (selectedMessage?.id === id) {
            setSelectedMessage(prev => prev ? { ...prev, isRead: !currentStatus } : null);
        }

        try {
            await fetch(`/api/admin/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentStatus }),
            });
        } catch (error) {
            console.error('Failed to update status', error);
            // Revert on error
            setSubmissions(prev => prev.map(s => s.id === id ? { ...s, isRead: currentStatus } : s));
        }
    };

    const deleteSubmission = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this message?')) return;

        // Optimistic update
        setSubmissions(prev => prev.filter(s => s.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);

        try {
            await fetch(`/api/admin/submissions/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Failed to delete', error);
            fetchSubmissions(); // Re-fetch to sync
        }
    };

    const filteredSubmissions = submissions.filter(s => {
        const matchesFilter = filter === 'all' || (filter === 'unread' && !s.isRead);
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone.includes(searchTerm) ||
            (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const unreadCount = submissions.filter(s => !s.isRead).length;

    return (
        <div className="adminPage">
            <div className="pageHeader">
                <div>
                    <h1>Messages</h1>
                    <p className="subtitle">
                        Manage contact form submissions.
                        {unreadCount > 0 && <span className="badge">{unreadCount} unread</span>}
                    </p>
                </div>
            </div>

            <div className="toolbar">
                <div className="filters">
                    <button
                        className={`filterBtn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filterBtn ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                    </button>
                </div>
                <div className="searchBox">
                    <FaSearch className="searchIcon" />
                    <input
                        type="text"
                        placeholder="Search name, phone, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="contentCard">
                {isLoading ? (
                    <TableSkeleton rows={8} columns={5} />
                ) : (
                    <div className="tableResponsive">
                        <table className="dataTable">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Interest</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="emptyState">No messages found</td>
                                    </tr>
                                ) : (
                                    filteredSubmissions.map((submission) => (
                                        <motion.tr
                                            key={submission.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`
                                                ${!submission.isRead ? 'unread' : ''} 
                                                ${selectedMessage?.id === submission.id ? 'selected' : ''}
                                            `}
                                            onClick={() => setSelectedMessage(submission)}
                                        >
                                            <td>
                                                <div className={`statusIndicator ${submission.isRead ? 'read' : 'unread'}`}>
                                                    {submission.isRead ? 'Read' : 'New'}
                                                </div>
                                            </td>
                                            <td className="font-medium">{submission.name}</td>
                                            <td>
                                                <div className="contactDetails">
                                                    <span>{submission.phone}</span>
                                                    {submission.email && <span className="subtext">{submission.email}</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="interestDetails">
                                                    {submission.course && <span className="tag">{submission.course}</span>}
                                                    {submission.level && <span className="tag outline">{submission.level}</span>}
                                                </div>
                                            </td>
                                            <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className="actionBtn"
                                                        title={submission.isRead ? "Mark as unread" : "Mark as read"}
                                                        onClick={(e) => toggleReadStatus(submission.id, submission.isRead, e)}
                                                    >
                                                        {submission.isRead ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                    <button
                                                        className="actionBtn delete"
                                                        title="Delete"
                                                        onClick={(e) => deleteSubmission(submission.id, e)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <>
                        <motion.div
                            className="modalBackdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMessage(null)}
                        />
                        <motion.div
                            className="modalPanel right"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                        >
                            <div className="modalHeader">
                                <h2>Message Details</h2>
                                <button className="closeBtn" onClick={() => setSelectedMessage(null)}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="modalContent">
                                <div className="detailSection">
                                    <label>From</label>
                                    <p className="text-lg font-bold">{selectedMessage.name}</p>
                                    <div className="flex gap-4 mt-2">
                                        <a href={`tel:${selectedMessage.phone}`} className="btn-sm">
                                            <FaPhone /> Call
                                        </a>
                                        {selectedMessage.email && (
                                            <a href={`mailto:${selectedMessage.email}`} className="btn-sm">
                                                <FaEnvelope /> Email
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="detailSection">
                                    <label>Interest</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMessage.course ? (
                                            <span className="tag large">{selectedMessage.course}</span>
                                        ) : (
                                            <span className="text-gray-400">No course selected</span>
                                        )}
                                        {selectedMessage.level && (
                                            <span className="tag outline large">{selectedMessage.level}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="detailSection">
                                    <label>Message</label>
                                    <div className="messageBox">
                                        {selectedMessage.message || <em className="text-gray-400">No message content</em>}
                                    </div>
                                </div>

                                <div className="detailSection">
                                    <label>Received</label>
                                    <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="modalFooter">
                                <button
                                    className={`btn ${selectedMessage.isRead ? 'btn-outline' : 'btn-primary'}`}
                                    onClick={(e) => toggleReadStatus(selectedMessage.id, selectedMessage.isRead, e)}
                                >
                                    {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={(e) => {
                                        deleteSubmission(selectedMessage.id, e);
                                        setSelectedMessage(null);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx>{`
                .adminPage { padding: 24px; max-width: 1400px; margin: 0 auto; }
                .pageHeader { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                .subtitle { color: #666; display: flex; align-items: center; gap: 8px; }
                .badge { background: #ff4d4f; color: white; px-2 py-0.5 rounded-full text-xs font-bold; padding: 2px 8px; border-radius: 12px; }
                
                .toolbar { display: flex; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 16px; }
                .filters { display: flex; gap: 8px; }
                .filterBtn { padding: 6px 16px; border-radius: 6px; border: 1px solid #ddd; background: white; cursor: pointer; transition: all 0.2s; }
                .filterBtn.active { background: #1ec28e; color: white; border-color: #1ec28e; }
                
                .searchBox { position: relative; width: 300px; }
                .searchIcon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #999; }
                .searchBox input { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid #ddd; border-radius: 6px; }
                
                .contentCard { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
                .tableResponsive { overflow-x: auto; }
                .dataTable { width: 100%; border-collapse: collapse; }
                .dataTable th { background: #f9f9f9; padding: 16px; text-align: left; font-weight: 600; color: #444; border-bottom: 1px solid #eee; }
                .dataTable td { padding: 16px; border-bottom: 1px solid #eee; vertical-align: middle; }
                .dataTable tr:hover { background: #f8f9fa; cursor: pointer; }
                .dataTable tr.selected { background: #f0fbf8; }
                .dataTable tr.unread td { font-weight: 500; color: #000; background: #fffbf6; }
                
                .statusIndicator { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
                .statusIndicator.read { background: #e6f7ff; color: #1890ff; }
                .statusIndicator.unread { background: #fff1f0; color: #ff4d4f; }
                
                .contactDetails { display: flex; flex-direction: column; }
                .subtext { font-size: 12px; color: #888; }
                
                .interestDetails { display: flex; gap: 6px; flex-wrap: wrap; }
                .tag { background: #f6ffed; border: 1px solid #b7eb8f; color: #389e0d; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
                .tag.outline { background: white; border-style: dashed; }
                .tag.large { font-size: 13px; padding: 4px 10px; }
                
                .actions { display: flex; gap: 8px; opacity: 0.5; transition: opacity 0.2s; }
                .dataTable tr:hover .actions { opacity: 1; }
                .actionBtn { padding: 6px; border-radius: 4px; border: 1px solid #ddd; background: white; cursor: pointer; color: #666; }
                .actionBtn:hover { border-color: #1ec28e; color: #1ec28e; }
                .actionBtn.delete:hover { border-color: #ff4d4f; color: #ff4d4f; }
                
                .modalBackdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); z-index: 100; }
                .modalPanel { position: fixed; top: 0; right: 0; bottom: 0; width: 400px; max-width: 90vw; background: white; padding: 0; box-shadow: -4px 0 20px rgba(0,0,0,0.1); z-index: 101; display: flex; flex-direction: column; }
                
                .modalHeader { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
                .modalContent { padding: 24px; flex: 1; overflow-y: auto; }
                .modalFooter { padding: 20px; border-top: 1px solid #eee; display: flex; gap: 12px; justify-content: flex-end; background: #fafafa; }
                
                .detailSection { margin-bottom: 24px; }
                .detailSection label { display: block; font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 8px; font-weight: 600; letter-spacing: 0.5px; }
                .messageBox { background: #f9f9f9; padding: 16px; border-radius: 8px; border: 1px solid #eee; white-space: pre-wrap; line-height: 1.6; }
                
                .closeBtn { font-size: 20px; color: #999; cursor: pointer; background: none; border: none; }
                
                .btn { padding: 10px 20px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; }
                .btn-sm { padding: 6px 12px; border-radius: 4px; border: 1px solid #ddd; text-decoration: none; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; color: #555; }
                .btn-primary { background: #1ec28e; color: white; }
                .btn-outline { background: white; border: 1px solid #ddd; }
                .btn-danger { background: #fff1f0; color: #ff4d4f; border: 1px solid #ffccc7; }
                
                .font-medium { font-weight: 500; }
                .font-bold { font-weight: 700; }
                .text-lg { font-size: 18px; }
                .flex { display: flex; }
                .gap-4 { gap: 16px; }
            `}</style>
        </div>
    );
}
