'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaEye, FaTrash, FaCheck, FaTimes, FaSearch, FaPhone, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
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
                if (Array.isArray(data)) {
                    setSubmissions(data);
                } else {
                    console.error('API returned invalid format:', data);
                    setSubmissions([]);
                }
            } else {
                console.error('Failed to fetch submissions:', res.statusText);
                setSubmissions([]);
            }
        } catch (error) {
            console.error('Failed to fetch submissions', error);
            setSubmissions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleReadStatus = async (id: number, currentStatus: boolean, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

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

    const deleteSubmission = async (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
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
                    <TableSkeleton rows={8} columns={6} />
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
                                                        className="actionBtn primary"
                                                        title="View Details"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedMessage(submission);
                                                        }}
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        className="actionBtn"
                                                        title={submission.isRead ? "Mark as Unread" : "Mark as Read"}
                                                        onClick={(e) => toggleReadStatus(submission.id, submission.isRead, e)}
                                                    >
                                                        {submission.isRead ? <FaEnvelopeOpen /> : <FaEnvelope />}
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
                                        {selectedMessage.message || <em className="text-muted">No message content</em>}
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
                                    onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.isRead)}
                                >
                                    {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        deleteSubmission(selectedMessage.id);
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
                .adminPage { padding: 24px; max-width: 1400px; margin: 0 auto; color: var(--admin-text); }
                .pageHeader { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                .subtitle { color: var(--admin-text-muted); display: flex; align-items: center; gap: 8px; }
                .badge { background: var(--admin-danger); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
                
                .toolbar { display: flex; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 16px; }
                .filters { display: flex; gap: 8px; }
                .filterBtn { padding: 6px 16px; border-radius: 6px; border: 1px solid var(--admin-border); background: var(--admin-bg-secondary); color: var(--admin-text-muted); cursor: pointer; transition: all 0.2s; }
                .filterBtn.active { background: var(--admin-primary); color: white; border-color: var(--admin-primary); }
                
                .searchBox { position: relative; width: 300px; }
                .searchIcon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--admin-text-muted); }
                .searchBox input { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid var(--admin-border); border-radius: 6px; background: var(--admin-bg-secondary); color: var(--admin-text); }
                .searchBox input:focus { border-color: var(--admin-primary); outline: none; }
                
                .contentCard { background: var(--admin-bg-secondary); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); overflow: hidden; border: 1px solid var(--admin-border); }
                .tableResponsive { overflow-x: auto; }
                .dataTable { width: 100%; border-collapse: collapse; }
                .dataTable th { background: var(--admin-bg-tertiary); padding: 16px; text-align: left; font-weight: 600; color: var(--admin-text-muted); border-bottom: 1px solid var(--admin-border); }
                .dataTable td { padding: 16px; border-bottom: 1px solid var(--admin-border); vertical-align: middle; color: var(--admin-text); }
                .dataTable tr:hover { background: var(--admin-bg-tertiary); cursor: pointer; }
                .dataTable tr.selected { background: rgba(99, 102, 241, 0.1); }
                .dataTable tr.unread td { font-weight: 500; color: white; background: rgba(99, 102, 241, 0.05); }
                
                .statusIndicator { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
                .statusIndicator.read { background: rgba(34, 197, 94, 0.1); color: var(--admin-success); }
                .statusIndicator.unread { background: rgba(239, 68, 68, 0.1); color: var(--admin-danger); }
                
                .contactDetails { display: flex; flex-direction: column; }
                .subtext { font-size: 12px; color: var(--admin-text-muted); }
                
                .interestDetails { display: flex; gap: 6px; flex-wrap: wrap; }
                .tag { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); color: var(--admin-success); padding: 2px 6px; border-radius: 4px; font-size: 11px; }
                .tag.outline { background: transparent; border-style: dashed; }
                .tag.large { font-size: 13px; padding: 4px 10px; }
                
                .actions { display: flex; gap: 8px; opacity: 0.7; transition: opacity 0.2s; }
                .dataTable tr:hover .actions { opacity: 1; }
                .actionBtn { padding: 6px; border-radius: 4px; border: 1px solid var(--admin-border); background: var(--admin-bg-tertiary); cursor: pointer; color: var(--admin-text-muted); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; }
                .actionBtn:hover { border-color: var(--admin-primary); color: var(--admin-primary); }
                .actionBtn.primary { color: var(--admin-primary); border-color: var(--admin-primary); }
                .actionBtn.delete:hover { border-color: var(--admin-danger); color: var(--admin-danger); }
                
                .modalBackdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 100; backdrop-filter: blur(2px); }
                .modalPanel { position: fixed; top: 0; right: 0; bottom: 0; width: 450px; max-width: 90vw; background: var(--admin-bg-secondary); padding: 0; box-shadow: -4px 0 20px rgba(0,0,0,0.3); z-index: 101; display: flex; flex-direction: column; border-left: 1px solid var(--admin-border); }
                
                .modalHeader { padding: 20px; border-bottom: 1px solid var(--admin-border); display: flex; justify-content: space-between; align-items: center; color: var(--admin-text); }
                .modalContent { padding: 24px; flex: 1; overflow-y: auto; color: var(--admin-text); }
                .modalFooter { padding: 20px; border-top: 1px solid var(--admin-border); display: flex; gap: 12px; justify-content: flex-end; background: var(--admin-bg-tertiary); }
                
                .detailSection { margin-bottom: 24px; }
                .detailSection label { display: block; font-size: 12px; text-transform: uppercase; color: var(--admin-text-muted); margin-bottom: 8px; font-weight: 600; letter-spacing: 0.5px; }
                .messageBox { background: var(--admin-bg); padding: 16px; border-radius: 8px; border: 1px solid var(--admin-border); white-space: pre-wrap; line-height: 1.6; color: var(--admin-text); }
                
                .closeBtn { font-size: 20px; color: var(--admin-text-muted); cursor: pointer; background: none; border: none; }
                .closeBtn:hover { color: var(--admin-text); }
                
                .btn { padding: 10px 20px; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; }
                .btn-sm { padding: 6px 12px; border-radius: 4px; border: 1px solid var(--admin-border); text-decoration: none; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; color: var(--admin-text); background: var(--admin-bg-tertiary); }
                .btn-sm:hover { background: var(--admin-border); }
                .btn-primary { background: var(--admin-primary); color: white; }
                .btn-outline { background: transparent; border: 1px solid var(--admin-border); color: var(--admin-text); }
                .btn-outline:hover { border-color: var(--admin-text); }
                .btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--admin-danger); border: 1px solid rgba(239, 68, 68, 0.2); }
                .btn-danger:hover { background: rgba(239, 68, 68, 0.2); }
                
                .emptyState { text-align: center; color: var(--admin-text-muted); padding: 40px; }
                .text-muted { color: var(--admin-text-muted); }
                .text-gray-400 { color: #9ca3af; }
                
                .font-medium { font-weight: 500; }
                .font-bold { font-weight: 700; }
                .text-lg { font-size: 18px; }
                .flex { display: flex; }
                .gap-4 { gap: 16px; }
            `}</style>
        </div>
    );
}
