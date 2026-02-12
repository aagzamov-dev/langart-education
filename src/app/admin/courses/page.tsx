'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import LanguageTabs from '@/components/admin/LanguageTabs';
import { Language, LocalizedContent } from '@/types/admin';

interface Course {
    id: number;
    slug: string;
    title: LocalizedContent;
    shortTag: LocalizedContent;
    price: number;
    ages: LocalizedContent;
    rating: number;
    // other fields ignored in list view for now
}

interface CourseForm {
    id?: number;
    slug: string;
    title: LocalizedContent;
    shortTag: LocalizedContent;
    image: string;
    price: number;
    price2: number;
    price3: number;
    dailyPrice: number;
    dailyPrice2: number;
    dailyPrice3: number;
    duration: number;
    lessonDuration: number;
    breaks: number;
    studentsInGroup: number;
    studentsInGroup2: number;
    studentsInGroup3: number;
    certificates: string;
    ages: LocalizedContent;
    rating: number;
    overview: LocalizedContent;
    whatYouWillLearn: { [key in Language]: string[] };
}

const emptyLocalized: LocalizedContent = { en: '', ru: '', uz: '' };

const emptyForm: CourseForm = {
    slug: '',
    title: { ...emptyLocalized },
    shortTag: { ...emptyLocalized },
    image: '/images/placeholder.svg',
    price: 0, price2: 0, price3: 0,
    dailyPrice: 0, dailyPrice2: 0, dailyPrice3: 0,
    duration: 12, lessonDuration: 60, breaks: 10,
    studentsInGroup: 12, studentsInGroup2: 6, studentsInGroup3: 2,
    certificates: '',
    ages: { ...emptyLocalized },
    rating: 5,
    overview: { ...emptyLocalized },
    whatYouWillLearn: { en: [''], ru: [''], uz: [''] }
};

export default function CoursesAdmin() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<CourseForm>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<Language>('en');

    const fetchCourses = () => {
        setLoading(true);
        fetch('/api/courses')
            .then(res => res.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => { fetchCourses(); }, []);

    const openModal = (course?: Course) => {
        setActiveTab('en');
        if (course) {
            setEditId(course.id);
            setModalOpen(true);
            setModalLoading(true);
            fetch(`/api/courses/${course.id}`)
                .then(res => res.json())
                .then(data => {
                    const safeData = {
                        ...data,
                        whatYouWillLearn: data.whatYouWillLearn || { en: [''], ru: [''], uz: [''] }
                    };
                    setForm(safeData);
                    setModalLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setModalLoading(false);
                });
        } else {
            setEditId(null);
            setForm(JSON.parse(JSON.stringify(emptyForm))); // Deep copy
            setErrors({});
            setModalOpen(true);
            setModalLoading(false);
        }
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title.en.trim()) e.title = 'Title (EN) is required';
        if (!form.slug.trim()) e.slug = 'Slug is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/courses/${editId}` : '/api/courses';

        // Clean up empty strings in arrays
        const cleanForm = {
            ...form,
            whatYouWillLearn: {
                en: form.whatYouWillLearn.en.filter(Boolean),
                ru: form.whatYouWillLearn.ru.filter(Boolean),
                uz: form.whatYouWillLearn.uz.filter(Boolean),
            }
        };

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanForm)
            });
            setModalOpen(false);
            fetchCourses();
        } catch (error) {
            console.error('Failed to submit form', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this course?')) return;
        await fetch(`/api/courses/${id}`, { method: 'DELETE' });
        fetchCourses();
    };

    const handleLocalizedChange = (field: keyof CourseForm, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: {
                ...(prev[field] as LocalizedContent),
                [activeTab]: value
            }
        }));
    };

    const updateLearn = (index: number, value: string) => {
        const arr = [...form.whatYouWillLearn[activeTab]];
        arr[index] = value;
        setForm(prev => ({
            ...prev,
            whatYouWillLearn: {
                ...prev.whatYouWillLearn,
                [activeTab]: arr
            }
        }));
    };

    const addLearnPoint = () => {
        setForm(prev => ({
            ...prev,
            whatYouWillLearn: {
                ...prev.whatYouWillLearn,
                [activeTab]: [...prev.whatYouWillLearn[activeTab], '']
            }
        }));
    };

    const removeLearnPoint = (index: number) => {
        const arr = [...form.whatYouWillLearn[activeTab]];
        arr.splice(index, 1);
        setForm(prev => ({
            ...prev,
            whatYouWillLearn: {
                ...prev.whatYouWillLearn,
                [activeTab]: arr
            }
        }));
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
                            <th>Title (EN)</th>
                            <th>Slug</th>
                            <th>Tag (EN)</th>
                            <th>Ages (EN)</th>
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
                                <td>{course.title?.en || (typeof course.title === 'string' ? course.title : '')}</td>
                                <td>{course.slug}</td>
                                <td>{course.shortTag?.en || ''}</td>
                                <td>{course.ages?.en || ''}</td>
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
                <div className="modalOverlay" onClick={() => !submitting && setModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h2 className="modalTitle">{editId ? 'Edit' : 'Add'} Course</h2>
                            <button className="modalClose" onClick={() => !submitting && setModalOpen(false)} disabled={submitting}><FaTimes /></button>
                        </div>
                        <div className="modalBody">
                            {modalLoading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : (
                                <>
                                    <LanguageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                                    {/* Localized Fields */}
                                    <div className="formGroup">
                                        <label className="formLabel">Title ({activeTab.toUpperCase()}) *</label>
                                        <input
                                            className="formInput"
                                            value={form.title[activeTab]}
                                            onChange={e => handleLocalizedChange('title', e.target.value)}
                                            placeholder="Course Title"
                                        />
                                        {activeTab === 'en' && errors.title && <p className="formError">{errors.title}</p>}
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Short Tag ({activeTab.toUpperCase()})</label>
                                        <input
                                            className="formInput"
                                            value={form.shortTag[activeTab]}
                                            onChange={e => handleLocalizedChange('shortTag', e.target.value)}
                                            placeholder="e.g. Popular"
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Ages ({activeTab.toUpperCase()})</label>
                                        <input
                                            className="formInput"
                                            value={form.ages[activeTab]}
                                            onChange={e => handleLocalizedChange('ages', e.target.value)}
                                            placeholder="e.g. 6-9 years"
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Overview ({activeTab.toUpperCase()})</label>
                                        <textarea
                                            className="formTextarea"
                                            value={form.overview[activeTab]}
                                            onChange={e => handleLocalizedChange('overview', e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">What You Will Learn ({activeTab.toUpperCase()})</label>
                                        {form.whatYouWillLearn[activeTab].map((item, i) => (
                                            <div key={i} className="inputGroup mb-2" style={{ marginBottom: '8px' }}>
                                                <input
                                                    className="formInput"
                                                    value={item}
                                                    onChange={e => updateLearn(i, e.target.value)}
                                                    placeholder={`Point ${i + 1}`}
                                                />
                                                <button className="btn btnDanger" onClick={() => removeLearnPoint(i)}><FaTrash /></button>
                                            </div>
                                        ))}
                                        <button className="btn btnSecondary" onClick={addLearnPoint}>+ Add Point</button>
                                    </div>

                                    <h3 className="formSectionTitle">Common Settings</h3>

                                    <div className="formRow">
                                        <div className="formGroup">
                                            <label className="formLabel">Slug *</label>
                                            <input className="formInput" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                                            {errors.slug && <p className="formError">{errors.slug}</p>}
                                        </div>
                                        <div className="formGroup">
                                            <label className="formLabel">Price (Standard)</label>
                                            <input type="number" className="formInput" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />
                                        </div>
                                    </div>
                                    {/* Additional fields for price2, price3, etc. can be added here if needed */}
                                    <div className="formRow">
                                        <div className="formGroup">
                                            <label className="formLabel">Price (Focused)</label>
                                            <input type="number" className="formInput" value={form.price2} onChange={e => setForm({ ...form, price2: +e.target.value })} />
                                        </div>
                                        <div className="formGroup">
                                            <label className="formLabel">Price (Duo)</label>
                                            <input type="number" className="formInput" value={form.price3} onChange={e => setForm({ ...form, price3: +e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="formRow">
                                        <div className="formGroup">
                                            <label className="formLabel">Daily Price (Standard)</label>
                                            <input type="number" className="formInput" value={form.dailyPrice} onChange={e => setForm({ ...form, dailyPrice: +e.target.value })} />
                                        </div>
                                        {/* Add other daily prices if needed */}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modalFooter">
                            <button className="btn btnSecondary" onClick={() => setModalOpen(false)} disabled={submitting}>Cancel</button>
                            <button className="btn btnPrimary" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? 'Saving...' : (editId ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
