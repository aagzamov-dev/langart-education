'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

interface Course {
    id: number;
    slug: string;
    title: string;
    shortTag: string;
    price: number;
    ages: string;
    rating: number;
}

const emptyForm = { slug: '', title: '', shortTag: '', image: '/images/placeholder.svg', price: 0, price2: 0, price3: 0, dailyPrice: 0, dailyPrice2: 0, dailyPrice3: 0, duration: 12, lessonDuration: 60, breaks: 10, studentsInGroup: 12, studentsInGroup2: 6, studentsInGroup3: 2, certificates: '', ages: '', rating: 5, overview: '', whatYouWillLearn: [''] };

export default function CoursesAdmin() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchCourses = () => {
        fetch('/api/courses')
            .then(res => res.json())
            .then(data => { setCourses(data); setLoading(false); });
    };

    useEffect(() => { fetchCourses(); }, []);

    const openModal = (course?: Course) => {
        if (course) {
            setEditId(course.id);
            fetch(`/api/courses/${course.id}`).then(res => res.json()).then(data => {
                setForm({ ...data, whatYouWillLearn: data.whatYouWillLearn || [''] });
            });
        } else {
            setEditId(null);
            setForm(emptyForm);
        }
        setErrors({});
        setModalOpen(true);
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.slug.trim()) e.slug = 'Slug is required';
        if (!form.ages.trim()) e.ages = 'Ages is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/courses/${editId}` : '/api/courses';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, whatYouWillLearn: form.whatYouWillLearn.filter(Boolean) }) });
        setModalOpen(false);
        fetchCourses();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this course?')) return;
        await fetch(`/api/courses/${id}`, { method: 'DELETE' });
        fetchCourses();
    };

    const updateLearn = (index: number, value: string) => {
        const arr = [...form.whatYouWillLearn];
        arr[index] = value;
        setForm({ ...form, whatYouWillLearn: arr });
    };

    return (
        <>
            <div className="header">
                <h1 className="pageTitle">Courses</h1>
                <button className="btn btnPrimary" onClick={() => openModal()}><FaPlus /> Add Course</button>
            </div>

            <div className="tableContainer">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Tag</th>
                            <th>Ages</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="loading">Loading...</td></tr>
                        ) : courses.length === 0 ? (
                            <tr><td colSpan={6} className="emptyState">No courses found</td></tr>
                        ) : courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.title}</td>
                                <td>{course.slug}</td>
                                <td>{course.shortTag}</td>
                                <td>{course.ages}</td>
                                <td>{course.price.toLocaleString()} som</td>
                                <td>
                                    <div className="btnGroup">
                                        <button className="btn btnSecondary" onClick={() => openModal(course)}><FaEdit /></button>
                                        <button className="btn btnDanger" onClick={() => handleDelete(course.id)}><FaTrash /></button>
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
                            <h2 className="modalTitle">{editId ? 'Edit' : 'Add'} Course</h2>
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
                                    <label className="formLabel">Slug *</label>
                                    <input className="formInput" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                                    {errors.slug && <p className="formError">{errors.slug}</p>}
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Short Tag</label>
                                    <input className="formInput" value={form.shortTag} onChange={e => setForm({ ...form, shortTag: e.target.value })} />
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Ages *</label>
                                    <input className="formInput" value={form.ages} onChange={e => setForm({ ...form, ages: e.target.value })} />
                                    {errors.ages && <p className="formError">{errors.ages}</p>}
                                </div>
                            </div>
                            <div className="formRow">
                                <div className="formGroup">
                                    <label className="formLabel">Price (Standard)</label>
                                    <input type="number" className="formInput" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />
                                </div>
                                <div className="formGroup">
                                    <label className="formLabel">Price (Focused)</label>
                                    <input type="number" className="formInput" value={form.price2} onChange={e => setForm({ ...form, price2: +e.target.value })} />
                                </div>
                            </div>
                            <div className="formGroup">
                                <label className="formLabel">Overview</label>
                                <textarea className="formTextarea" value={form.overview} onChange={e => setForm({ ...form, overview: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label className="formLabel">What You Will Learn</label>
                                {form.whatYouWillLearn.map((item, i) => (
                                    <input key={i} className="formInput" style={{ marginBottom: '0.5rem' }} value={item} onChange={e => updateLearn(i, e.target.value)} placeholder={`Point ${i + 1}`} />
                                ))}
                                <button className="btn btnSecondary" onClick={() => setForm({ ...form, whatYouWillLearn: [...form.whatYouWillLearn, ''] })}>+ Add Point</button>
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
