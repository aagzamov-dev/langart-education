'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

interface Instructor {
    id: number;
    slug: string;
    name: string;
    image: string;
    experience: number;
    students: number;
}

const emptyForm = { slug: '', name: '', image: '/images/placeholder.svg', experience: 0, students: 0, about: '' };

export default function InstructorsAdmin() {
    const [items, setItems] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchItems = () => {
        fetch('/api/instructors').then(r => r.json()).then(d => { setItems(d); setLoading(false); });
    };

    useEffect(() => { fetchItems(); }, []);

    const openModal = (item?: Instructor) => {
        if (item) { setEditId(item.id); fetch(`/api/instructors/${item.id}`).then(r => r.json()).then(setForm); }
        else { setEditId(null); setForm(emptyForm); }
        setErrors({});
        setModalOpen(true);
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Name is required';
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

    return (
        <>
            <div className="header">
                <h1 className="pageTitle">Instructors</h1>
                <button className="btn btnPrimary" onClick={() => openModal()}><FaPlus /> Add Instructor</button>
            </div>

            <div className="tableContainer">
                <table className="table">
                    <thead>
                        <tr><th>Name</th><th>Slug</th><th>Experience</th><th>Students</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={5} className="loading">Loading...</td></tr> :
                            items.length === 0 ? <tr><td colSpan={5} className="emptyState">No instructors found</td></tr> :
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
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
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Name *</label>
                                    <input className="formInput" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    {errors.name && <p className="formError">{errors.name}</p>}
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Slug *</label>
                                    <input className="formInput" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                                    {errors.slug && <p className="formError">{errors.slug}</p>}
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Experience (years)</label>
                                    <input type="number" className="formInput" value={form.experience} onChange={e => setForm({ ...form, experience: +e.target.value })} />
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Students</label>
                                    <input type="number" className="formInput" value={form.students} onChange={e => setForm({ ...form, students: +e.target.value })} />
                                </div>
                            </div>
                            <div className="formGroup">
                                <label className="formLabel">About</label>
                                <textarea className="formTextarea" value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} />
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
