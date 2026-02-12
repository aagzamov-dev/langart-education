'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { Language, LocalizedContent } from '@/types/admin';

interface Testimonial {
    id: number;
    name: LocalizedContent;
    role: LocalizedContent;
    title: LocalizedContent;
    rating: number;
}

interface TestimonialForm {
    id?: number;
    name: LocalizedContent;
    role: LocalizedContent;
    image: string;
    title: LocalizedContent;
    content: LocalizedContent;
    rating: number;
}

const emptyLocalized: LocalizedContent = { en: '', ru: '', uz: '' };

const emptyForm: TestimonialForm = {
    name: { ...emptyLocalized },
    role: { ...emptyLocalized },
    image: '/images/placeholder.svg',
    title: { ...emptyLocalized },
    content: { ...emptyLocalized },
    rating: 5
};

export default function TestimonialsAdmin() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<TestimonialForm>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<Language>('en');

    const fetchItems = () => {
        setLoading(true);
        fetch('/api/testimonials')
            .then(r => r.json())
            .then(d => { setItems(d); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item?: Testimonial) => {
        setActiveTab('en');
        if (item) {
            setEditId(item.id);
            setModalOpen(true);
            setModalLoading(true);
            fetch(`/api/testimonials/${item.id}`)
                .then(r => r.json())
                .then(d => { setForm(d); setModalLoading(false); })
                .catch(err => { console.error(err); setModalLoading(false); });
        } else {
            setEditId(null);
            setForm(JSON.parse(JSON.stringify(emptyForm)));
            setErrors({});
            setModalOpen(true);
            setModalLoading(false);
        }
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.en.trim()) e.name = 'Name (EN) is required';
        if (!form.title.en.trim()) e.title = 'Title (EN) is required';
        if (!form.content.en.trim()) e.content = 'Content (EN) is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/testimonials/${editId}` : '/api/testimonials';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setModalOpen(false);
        fetchItems();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this testimonial?')) return;
        await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const handleLocalizedChange = (field: keyof TestimonialForm, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: {
                ...(prev[field] as LocalizedContent),
                [activeTab]: value
            }
        }));
    };

    return (
        <>
            <div className="header">
                <h1 className="pageTitle">Testimonials</h1>
                <button className="btn btnPrimary" onClick={() => openModal()}><FaPlus /> Add Testimonial</button>
            </div>

            <div className="tableContainer">
                <table className="table">
                    <thead>
                        <tr><th>Name (EN)</th><th>Role (EN)</th><th>Title (EN)</th><th>Rating</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="loading">Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan={5} className="emptyState">No testimonials found</td></tr> :
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name?.en || (typeof item.name === 'string' ? item.name : '')}</td>
                                        <td>{item.role?.en || ''}</td>
                                        <td>{item.title?.en || ''}</td>
                                        <td>{'⭐'.repeat(item.rating)}</td>
                                        <td>
                                            <div className="btnGroup">
                                                <button className="btn btnSecondary" onClick={() => openModal(item)}><FaEdit /></button>
                                                <button className="btn btnDanger" onClick={() => handleDelete(item.id)}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="modalOverlay" onClick={() => setModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h2 className="modalTitle">{editId ? 'Edit' : 'Add'} Testimonial</h2>
                            <button className="modalClose" onClick={() => setModalOpen(false)}><FaTimes /></button>
                        </div>
                        <div className="modalBody">
                            {modalLoading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : (
                                <>
                                    <LanguageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                                    <div className="formGroup">
                                        <label className="formLabel">Name ({activeTab.toUpperCase()}) *</label>
                                        <input
                                            className="formInput"
                                            value={form.name[activeTab]}
                                            onChange={e => handleLocalizedChange('name', e.target.value)}
                                        />
                                        {activeTab === 'en' && errors.name && <p className="formError">{errors.name}</p>}
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Role ({activeTab.toUpperCase()})</label>
                                        <input
                                            className="formInput"
                                            value={form.role[activeTab]}
                                            onChange={e => handleLocalizedChange('role', e.target.value)}
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Title ({activeTab.toUpperCase()}) *</label>
                                        <input
                                            className="formInput"
                                            value={form.title[activeTab]}
                                            onChange={e => handleLocalizedChange('title', e.target.value)}
                                        />
                                        {activeTab === 'en' && errors.title && <p className="formError">{errors.title}</p>}
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Content ({activeTab.toUpperCase()}) *</label>
                                        <textarea
                                            className="formTextarea"
                                            value={form.content[activeTab]}
                                            onChange={e => handleLocalizedChange('content', e.target.value)}
                                            rows={4}
                                        />
                                        {activeTab === 'en' && errors.content && <p className="formError">{errors.content}</p>}
                                    </div>

                                    <hr className="my-6 border-gray-200 dark:border-gray-700" />
                                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Common Settings</h3>

                                    <div className="formGroup">
                                        <label className="formLabel">Rating</label>
                                        <select className="formSelect" value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })}>
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star{n > 1 && 's'}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modalFooter">
                            <button className="btn btnSecondary" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="btn btnPrimary" onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
