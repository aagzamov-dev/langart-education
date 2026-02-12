'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FaTrash, FaCheck, FaSearch, FaEnvelopeOpen, FaCopy } from 'react-icons/fa';
import { TableSkeleton } from '@/components/ui/Loading/TableSkeleton';
import { useToast } from '@/components/ui/Toast/ToastContext';

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
    const { showToast } = useToast();

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

        try {
            await fetch(`/api/admin/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentStatus }),
            });
            showToast(currentStatus ? 'Marked as unread' : 'Marked as read', 'success');
        } catch (error) {
            console.error('Failed to update status', error);
            // Revert on error
            setSubmissions(prev => prev.map(s => s.id === id ? { ...s, isRead: currentStatus } : s));
            showToast('Failed to update status', 'error');
        }
    };

    const deleteSubmission = async (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm('Are you sure you want to delete this message?')) return;

        // Optimistic update
        setSubmissions(prev => prev.filter(s => s.id !== id));

        try {
            await fetch(`/api/admin/submissions/${id}`, {
                method: 'DELETE',
            });
            showToast('Message deleted', 'success');
        } catch (error) {
            console.error('Failed to delete', error);
            fetchSubmissions(); // Re-fetch to sync
            showToast('Failed to delete message', 'error');
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        showToast(`${label} copied`, 'success');
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
                    <span className="searchIconWrapper">
                        <FaSearch className="searchIcon" />
                    </span>
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
                                    <th>Message</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="emptyState">No messages found</td>
                                    </tr>
                                ) : (
                                    filteredSubmissions.map((submission) => (
                                        <motion.tr
                                            key={submission.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`${!submission.isRead ? 'unread' : ''}`}
                                        >
                                            <td>
                                                <div className={`statusIndicator ${submission.isRead ? 'read' : 'unread'}`}>
                                                    {submission.isRead ? 'Read' : 'New'}
                                                </div>
                                            </td>
                                            <td className="font-medium">{submission.name}</td>
                                            <td>
                                                <div className="contactDetails">
                                                    <div className="contactRow">
                                                        <span>{submission.phone}</span>
                                                        <button
                                                            className="copyBtn"
                                                            onClick={() => copyToClipboard(submission.phone, 'Phone number')}
                                                            title="Copy phone"
                                                        >
                                                            <FaCopy size={12} />
                                                        </button>
                                                    </div>
                                                    {submission.email && (
                                                        <div className="contactRow">
                                                            <span className="subtext">{submission.email}</span>
                                                            <button
                                                                className="copyBtn"
                                                                onClick={() => copyToClipboard(submission.email!, 'Email')}
                                                                title="Copy email"
                                                            >
                                                                <FaCopy size={12} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="interestDetails">
                                                    {submission.course && <span className="tag">{submission.course}</span>}
                                                    {submission.level && <span className="tag outline">{submission.level}</span>}
                                                </div>
                                            </td>
                                            <td className="messageCell">
                                                <div className="truncate-text" title={submission.message || ''}>
                                                    {submission.message || '-'}
                                                </div>
                                            </td>
                                            <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className={`actionBtn ${submission.isRead ? '' : 'primary'}`}
                                                        title={submission.isRead ? "Mark as Unread" : "Mark as Read"}
                                                        onClick={(e) => toggleReadStatus(submission.id, submission.isRead, e)}
                                                    >
                                                        {submission.isRead ? <FaEnvelopeOpen /> : <FaCheck />}
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

            <style jsx>{`
                .adminPage { padding: 24px; max-width: 1400px; margin: 0 auto; color: var(--admin-text); }
                .pageHeader { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                .subtitle { color: var(--admin-text-muted); display: flex; align-items: center; gap: 8px; }
                .badge { background: var(--admin-danger); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
                
                .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 16px; min-height: 48px; }
                .filters { display: flex; gap: 8px; }
                .filterBtn { padding: 8px 16px; border-radius: 6px; border: 1px solid var(--admin-border); background: var(--admin-bg-secondary); color: var(--admin-text-muted); cursor: pointer; transition: all 0.2s; font-size: 14px; }
                .filterBtn.active { background: var(--admin-primary); color: white; border-color: var(--admin-primary); }
                
                .searchBox { position: relative; width: 300px; display: flex; align-items: center; }
                .searchIconWrapper { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--admin-text-muted); z-index: 2; pointer-events: none; display: flex; align-items: center; justify-content: center; }
                .searchBox input { width: 100%; padding: 10px 12px 10px 42px; border: 1px solid var(--admin-border); border-radius: 6px; background: var(--admin-bg-secondary); color: var(--admin-text); font-size: 14px; height: 42px; transition: border-color 0.2s; }
                .searchBox input:focus { border-color: var(--admin-primary); outline: none; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); }
                
                .contentCard { background: var(--admin-bg-secondary); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); overflow: hidden; border: 1px solid var(--admin-border); }
                .tableResponsive { overflow-x: auto; }
                .dataTable { width: 100%; border-collapse: collapse; }
                .dataTable th { background: var(--admin-bg-tertiary); padding: 16px; text-align: left; font-weight: 600; color: var(--admin-text-muted); border-bottom: 1px solid var(--admin-border); white-space: nowrap; }
                .dataTable td { padding: 16px; border-bottom: 1px solid var(--admin-border); vertical-align: middle; color: var(--admin-text); }
                .dataTable tr.unread td { font-weight: 500; color: white; background: rgba(99, 102, 241, 0.05); }
                
                .statusIndicator { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
                .statusIndicator.read { background: rgba(34, 197, 94, 0.1); color: var(--admin-success); }
                .statusIndicator.unread { background: rgba(239, 68, 68, 0.1); color: var(--admin-danger); }
                
                .contactDetails { display: flex; flex-direction: column; gap: 4px; }
                .contactRow { display: flex; align-items: center; gap: 8px; }
                .copyBtn { padding: 4px; background: transparent; border: none; color: var(--admin-text-muted); cursor: pointer; opacity: 0.5; transition: opacity 0.2s; display: flex; align-items: center; }
                .contactRow:hover .copyBtn { opacity: 1; }
                .copyBtn:hover { color: var(--admin-primary); }
                .subtext { font-size: 12px; color: var(--admin-text-muted); }
                
                .interestDetails { display: flex; gap: 6px; flex-wrap: wrap; }
                .tag { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); color: var(--admin-success); padding: 2px 6px; border-radius: 4px; font-size: 11px; }
                .tag.outline { background: transparent; border-style: dashed; }
                
                .messageCell { max-width: 300px; }
                .truncate-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; color: var(--admin-text-muted); font-size: 0.9em; }
                
                .actions { display: flex; gap: 8px; justify-content: flex-end; }
                .actionBtn { padding: 6px; border-radius: 4px; border: 1px solid var(--admin-border); background: var(--admin-bg-tertiary); cursor: pointer; color: var(--admin-text-muted); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; transition: all 0.2s; }
                .actionBtn:hover { border-color: var(--admin-primary); color: var(--admin-primary); transform: translateY(-1px); }
                .actionBtn.primary { color: var(--admin-primary); border-color: var(--admin-primary); background: rgba(99, 102, 241, 0.1); }
                .actionBtn.primary:hover { background: var(--admin-primary); color: white; }
                .actionBtn.delete:hover { border-color: var(--admin-danger); color: var(--admin-danger); background: rgba(239, 68, 68, 0.1); }
                
                .emptyState { text-align: center; color: var(--admin-text-muted); padding: 40px; }
                .font-medium { font-weight: 500; }
                
                @media (max-width: 768px) {
                    .messageCell { max-width: 150px; }
                    .pageHeader { flex-direction: column; gap: 16px; }
                    .toolbar { flex-direction: column; }
                    .searchBox { width: 100%; }
                }
            `}</style>
        </div>
    );
}
