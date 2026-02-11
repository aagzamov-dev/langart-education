'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    title: string;
    rating: number;
}

const emptyForm = { name: '', role: '', image: '/images/placeholder.svg', title: '', content: '', rating: 5 };

export default function TestimonialsAdmin() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchItems = () => {
        fetch('/api/testimonials').then(r => r.json()).then(d => { setItems(d); setLoading(false); });
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item?: Testimonial) => {
        if (item) { setEditId(item.id); fetch(`/api/testimonials/${item.id}`).then(r => r.json()).then(setForm); }
        else { setEditId(null); setForm(emptyForm); }
        setErrors({});
        setModalOpen(true);
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.content.trim()) e.content = 'Content is required';
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

    return (
        <>
            <div className="header">
                <h1 className="pageTitle">Testimonials</h1>
                <button className="btn btnPrimary" onClick={() => openModal()}><FaPlus /> Add Testimonial</button>
            </div>

            <div className="tableContainer">
                <table className="table">
                    <thead>
                        <tr><th>Name</th><th>Role</th><th>Title</th><th>Rating</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="loading">Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan={5} className="emptyState">No testimonials found</td></tr> :
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.role}</td>
                                        <td>{item.title}</td>
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
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Name *</label>
                                    <input className="formInput" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    {errors.name && <p className="formError">{errors.name}</p>}
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Role</label>
                                    <input className="formInput" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Title *</label>
                                    <input className="formInput" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                    {errors.title && <p className="formError">{errors.title}</p>}
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Rating</label>
                                    <select className="formSelect" value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })}>
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star{n > 1 && 's'}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="formGroup">
                                <label className="formLabel">Content *</label>
                                <textarea className="formTextarea" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                                {errors.content && <p className="formError">{errors.content}</p>}
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
