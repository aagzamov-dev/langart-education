'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { Language, LocalizedContent } from '@/types/admin';

interface PricingPlan {
    id: number;
    title: LocalizedContent;
    icon: string;
    ages: LocalizedContent;
    standardMonthly: number;
}

interface PricingForm {
    id?: number;
    title: LocalizedContent;
    icon: string;
    ages: LocalizedContent;
    features: { [key in Language]: string[] };
    standardMonthly: number;
    standardPerLesson: number;
    standardStudents: string;
    focusedMonthly: number;
    focusedPerLesson: number;
    focusedStudents: string;
    duoMonthly: number;
    duoPerLesson: number;
    duoStudents: string;
    order: number;
}

const emptyLocalized: LocalizedContent = { en: '', ru: '', uz: '' };

const emptyForm: PricingForm = {
    title: { ...emptyLocalized },
    icon: '📚',
    ages: { ...emptyLocalized },
    features: { en: [''], ru: [''], uz: [''] },
    standardMonthly: 0, standardPerLesson: 0, standardStudents: '10-12',
    focusedMonthly: 0, focusedPerLesson: 0, focusedStudents: '5-6',
    duoMonthly: 0, duoPerLesson: 0, duoStudents: '2',
    order: 0
};

export default function PricingAdmin() {
    const [items, setItems] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<PricingForm>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<Language>('en');

    const fetchItems = () => {
        setLoading(true);
        fetch('/api/pricing')
            .then(r => r.json())
            .then(d => { setItems(d); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item?: PricingPlan) => {
        setActiveTab('en');
        if (item) {
            setEditId(item.id);
            setModalOpen(true);
            setModalLoading(true);
            fetch(`/api/pricing/${item.id}`)
                .then(r => r.json())
                .then(d => {
                    const safeData = {
                        ...d,
                        features: d.features || { en: [''], ru: [''], uz: [''] }
                    };
                    setForm(safeData);
                    setModalLoading(false);
                })
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
        if (!form.title.en.trim()) e.title = 'Title (EN) is required';
        if (!form.ages.en.trim()) e.ages = 'Ages (EN) is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/pricing/${editId}` : '/api/pricing';

        const cleanForm = {
            ...form,
            features: {
                en: form.features.en.filter(Boolean),
                ru: form.features.ru.filter(Boolean),
                uz: form.features.uz.filter(Boolean),
            }
        };

        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanForm) });
        setModalOpen(false);
        fetchItems();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this pricing plan?')) return;
        await fetch(`/api/pricing/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const handleLocalizedChange = (field: keyof PricingForm, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: {
                ...(prev[field] as LocalizedContent),
                [activeTab]: value
            }
        }));
    };

    const updateFeature = (index: number, value: string) => {
        const arr = [...form.features[activeTab]];
        arr[index] = value;
        setForm(prev => ({
            ...prev,
            features: {
                ...prev.features,
                [activeTab]: arr
            }
        }));
    };

    const addFeature = () => {
        setForm(prev => ({
            ...prev,
            features: {
                ...prev.features,
                [activeTab]: [...prev.features[activeTab], '']
            }
        }));
    };

    const removeFeature = (index: number) => {
        const arr = [...form.features[activeTab]];
        arr.splice(index, 1);
        setForm(prev => ({
            ...prev,
            features: {
                ...prev.features,
                [activeTab]: arr
            }
        }));
    };

    return (
        <>
            <div className="header">
                <h1 className="pageTitle">Pricing Plans</h1>
                <button className="btn btnPrimary" onClick={() => openModal()}><FaPlus /> Add Plan</button>
            </div>

            <div className="tableContainer">
                <table className="table">
                    <thead>
                        <tr><th>Icon</th><th>Title (EN)</th><th>Ages (EN)</th><th>Standard Price</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="loading">Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan={5} className="emptyState">No plans found</td></tr> :
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.icon}</td>
                                        <td>{item.title?.en || (typeof item.title === 'string' ? item.title : '')}</td>
                                        <td>{item.ages?.en || ''}</td>
                                        <td>{item.standardMonthly.toLocaleString()} som</td>
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
                            <h2 className="modalTitle">{editId ? 'Edit' : 'Add'} Pricing Plan</h2>
                            <button className="modalClose" onClick={() => setModalOpen(false)}><FaTimes /></button>
                        </div>
                        <div className="modalBody">
                            {modalLoading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : (
                                <>
                                    <LanguageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                                    <div className="formRow">
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
                                            <label className="formLabel">Icon</label>
                                            <input className="formInput" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Ages ({activeTab.toUpperCase()}) *</label>
                                        <input
                                            className="formInput"
                                            value={form.ages[activeTab]}
                                            onChange={e => handleLocalizedChange('ages', e.target.value)}
                                        />
                                        {activeTab === 'en' && errors.ages && <p className="formError">{errors.ages}</p>}
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Features ({activeTab.toUpperCase()})</label>
                                        {form.features[activeTab].map((f, i) => (
                                            <div key={i} className="flex gap-2 mb-2">
                                                <input
                                                    className="formInput"
                                                    value={f}
                                                    onChange={e => updateFeature(i, e.target.value)}
                                                />
                                                <button className="btn btnDanger" onClick={() => removeFeature(i)}><FaTrash /></button>
                                            </div>
                                        ))}
                                        <button className="btn btnSecondary" onClick={addFeature}>+ Add Feature</button>
                                    </div>

                                    <hr className="my-6 border-gray-200 dark:border-gray-700" />
                                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Common Settings</h3>

                                    <div className="formRow">
                                        <div className="formGroup"><label className="formLabel">Order</label><input type="number" className="formInput" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })} /></div>
                                    </div>

                                    <p className="formLabel font-bold mt-4">Standard Tier</p>
                                    <div className="formRow">
                                        <div className="formGroup"><label className="formLabel">Monthly</label><input type="number" className="formInput" value={form.standardMonthly} onChange={e => setForm({ ...form, standardMonthly: +e.target.value })} /></div>
                                        <div className="formGroup"><label className="formLabel">Per Lesson</label><input type="number" className="formInput" value={form.standardPerLesson} onChange={e => setForm({ ...form, standardPerLesson: +e.target.value })} /></div>
                                    </div>

                                    <p className="formLabel font-bold mt-2">Focused Tier</p>
                                    <div className="formRow">
                                        <div className="formGroup"><label className="formLabel">Monthly</label><input type="number" className="formInput" value={form.focusedMonthly} onChange={e => setForm({ ...form, focusedMonthly: +e.target.value })} /></div>
                                        <div className="formGroup"><label className="formLabel">Per Lesson</label><input type="number" className="formInput" value={form.focusedPerLesson} onChange={e => setForm({ ...form, focusedPerLesson: +e.target.value })} /></div>
                                    </div>

                                    <p className="formLabel font-bold mt-2">Duo Tier</p>
                                    <div className="formRow">
                                        <div className="formGroup"><label className="formLabel">Monthly</label><input type="number" className="formInput" value={form.duoMonthly} onChange={e => setForm({ ...form, duoMonthly: +e.target.value })} /></div>
                                        <div className="formGroup"><label className="formLabel">Per Lesson</label><input type="number" className="formInput" value={form.duoPerLesson} onChange={e => setForm({ ...form, duoPerLesson: +e.target.value })} /></div>
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
