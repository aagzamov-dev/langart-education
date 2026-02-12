'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { Language, LocalizedContent } from '@/types/admin';

interface Instructor {
    id: number;
    slug: string;
    name: LocalizedContent;
    image: string;
    experience: number;
    students: number;
}

interface InstructorForm {
    id?: number;
    slug: string;
    name: LocalizedContent;
    image: string;
    experience: number;
    students: number;
    about: LocalizedContent;
}

const emptyLocalized: LocalizedContent = { en: '', ru: '', uz: '' };

const emptyForm: InstructorForm = {
    slug: '',
    name: { ...emptyLocalized },
    image: '/images/placeholder.svg',
    experience: 0,
    students: 0,
    about: { ...emptyLocalized }
};

export default function InstructorsAdmin() {
    const [items, setItems] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<InstructorForm>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<Language>('en');

    const fetchItems = () => {
        setLoading(true);
        fetch('/api/instructors')
            .then(r => r.json())
            .then(d => { setItems(d); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item?: Instructor) => {
        setActiveTab('en');
        if (item) {
            setEditId(item.id);
            setModalOpen(true);
            setModalLoading(true);
            fetch(`/api/instructors/${item.id}`)
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
        if (!form.slug.trim()) e.slug = 'Slug is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/instructors/${editId}` : '/api/instructors';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setModalOpen(false);
        fetchItems();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this instructor?')) return;
        await fetch(`/api/instructors/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const handleLocalizedChange = (field: keyof InstructorForm, value: string) => {
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
                <h1 className="pageTitle">Instructors</h1>
                <button className="btn btnPrimary" onClick={() => openModal()}><FaPlus /> Add Instructor</button>
            </div>

            <div className="tableContainer">
                <table className="table">
                    <thead>
                        <tr><th>Name (EN)</th><th>Slug</th><th>Experience</th><th>Students</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="loading">Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan={5} className="emptyState">No instructors found</td></tr> :
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name?.en || (typeof item.name === 'string' ? item.name : '')}</td>
                                        <td>{item.slug}</td>
                                        <td>{item.experience} years</td>
                                        <td>{item.students}</td>
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
                            <h2 className="modalTitle">{editId ? 'Edit' : 'Add'} Instructor</h2>
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
                                            placeholder="Instructor Name"
                                        />
                                        {activeTab === 'en' && errors.name && <p className="formError">{errors.name}</p>}
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">About ({activeTab.toUpperCase()})</label>
                                        <textarea
                                            className="formTextarea"
                                            value={form.about[activeTab]}
                                            onChange={e => handleLocalizedChange('about', e.target.value)}
                                            rows={4}
                                        />
                                    </div>

                                    <hr className="my-6 border-gray-200 dark:border-gray-700" />
                                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Common Settings</h3>

                                    <div className="formRow">
                                        <div className="formGroup">
                                            <label className="formLabel">Slug *</label>
                                            <input className="formInput" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                                            {errors.slug && <p className="formError">{errors.slug}</p>}
                                        </div>
                                        <div className="formGroup">
                                            <label className="formLabel">Experience (years)</label>
                                            <input type="number" className="formInput" value={form.experience} onChange={e => setForm({ ...form, experience: +e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="formGroup">
                                        <label className="formLabel">Students</label>
                                        <input type="number" className="formInput" value={form.students} onChange={e => setForm({ ...form, students: +e.target.value })} />
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
