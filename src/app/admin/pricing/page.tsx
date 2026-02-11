'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

interface PricingPlan {
    id: number;
    title: string;
    icon: string;
    ages: string;
    standardMonthly: number;
}

const emptyForm = { title: '', icon: '📚', ages: '', features: [''], standardMonthly: 0, standardPerLesson: 0, standardStudents: '10-12', focusedMonthly: 0, focusedPerLesson: 0, focusedStudents: '5-6', duoMonthly: 0, duoPerLesson: 0, duoStudents: '2', order: 0 };

export default function PricingAdmin() {
    const [items, setItems] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchItems = () => {
        fetch('/api/pricing').then(r => r.json()).then(d => { setItems(d); setLoading(false); });
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item?: PricingPlan) => {
        if (item) { setEditId(item.id); fetch(`/api/pricing/${item.id}`).then(r => r.json()).then(d => setForm({ ...d, features: d.features || [''] })); }
        else { setEditId(null); setForm(emptyForm); }
        setErrors({});
        setModalOpen(true);
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.ages.trim()) e.ages = 'Ages is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/pricing/${editId}` : '/api/pricing';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, features: form.features.filter(Boolean) }) });
        setModalOpen(false);
        fetchItems();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this pricing plan?')) return;
        await fetch(`/api/pricing/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const updateFeature = (i: number, v: string) => {
        const arr = [...form.features]; arr[i] = v;
        setForm({ ...form, features: arr });
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
                        <tr><th>Icon</th><th>Title</th><th>Ages</th><th>Standard Price</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="loading">Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan={5} className="emptyState">No plans found</td></tr> :
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.icon}</td>
                                        <td>{item.title}</td>
                                        <td>{item.ages}</td>
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
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Title *</label>
                                    <input className="formInput" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                    {errors.title && <p className="formError">{errors.title}</p>}
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Icon</label>
                                    <input className="formInput" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Ages *</label>
                                    <input className="formInput" value={form.ages} onChange={e => setForm({ ...form, ages: e.target.value })} />
                                    {errors.ages && <p className="formError">{errors.ages}</p>}
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Order</label>
                                    <input type="number" className="formInput" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })} />
                                </div>
                            </div>
                            <p className="formLabel" style={{ marginTop: '1rem' }}>Standard Tier</p>
                            <div className="formRow">
                                <div className="formGroup"><label className="formLabel">Monthly</label><input type="number" className="formInput" value={form.standardMonthly} onChange={e => setForm({ ...form, standardMonthly: +e.target.value })} /></div>
                                <div className="formGroup"><label className="formLabel">Per Lesson</label><input type="number" className="formInput" value={form.standardPerLesson} onChange={e => setForm({ ...form, standardPerLesson: +e.target.value })} /></div>
                            </div>
                            <p className="formLabel">Focused Tier</p>
                            <div className="formRow">
                                <div className="formGroup"><label className="formLabel">Monthly</label><input type="number" className="formInput" value={form.focusedMonthly} onChange={e => setForm({ ...form, focusedMonthly: +e.target.value })} /></div>
                                <div className="formGroup"><label className="formLabel">Per Lesson</label><input type="number" className="formInput" value={form.focusedPerLesson} onChange={e => setForm({ ...form, focusedPerLesson: +e.target.value })} /></div>
                            </div>
                            <p className="formLabel">Duo Tier</p>
                            <div className="formRow">
                                <div className="formGroup"><label className="formLabel">Monthly</label><input type="number" className="formInput" value={form.duoMonthly} onChange={e => setForm({ ...form, duoMonthly: +e.target.value })} /></div>
                                <div className="formGroup"><label className="formLabel">Per Lesson</label><input type="number" className="formInput" value={form.duoPerLesson} onChange={e => setForm({ ...form, duoPerLesson: +e.target.value })} /></div>
                            </div>
                            <div className="formGroup" style={{ marginTop: '1rem' }}>
                                <label className="formLabel">Features</label>
                                {form.features.map((f, i) => <input key={i} className="formInput" style={{ marginBottom: '0.5rem' }} value={f} onChange={e => updateFeature(i, e.target.value)} />)}
                                <button className="btn btnSecondary" onClick={() => setForm({ ...form, features: [...form.features, ''] })}>+ Add Feature</button>
                            </div>
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
