'use client';

import { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';

const emptyForm = { phoneNumber: '', email: '', locations: [''], workingHours: '', facebook: '', instagram: '', telegram: '' };

export default function SettingsAdmin() {
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/site-config').then(r => r.json()).then(d => {
            setForm({ ...d, locations: d.locations?.length ? d.locations : [''] });
            setLoading(false);
        });
    }, []);

    const handleSubmit = async () => {
        setSaving(true);
        await fetch('/api/site-config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, locations: form.locations.filter(Boolean) })
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const updateLocation = (i: number, v: string) => {
        const arr = [...form.locations]; arr[i] = v;
        setForm({ ...form, locations: arr });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <div className="header">
                <h1 className="pageTitle">Site Settings</h1>
                <button className="btn btnPrimary" onClick={handleSubmit} disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="tableContainer" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Contact Information</h3>

                <div className="formRow">
                    <div className="formGroup">
                        <label className="formLabel">Phone Number</label>
                        <input className="formInput" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
                    </div>
                    <div className="formGroup">
                        <label className="formLabel">Email</label>
                        <input className="formInput" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                </div>

                <div className="formGroup">
                    <label className="formLabel">Working Hours</label>
                    <input className="formInput" value={form.workingHours} onChange={e => setForm({ ...form, workingHours: e.target.value })} />
                </div>

                <div className="formGroup">
                    <label className="formLabel">Locations</label>
                    {form.locations.map((loc, i) => (
                        <input key={i} className="formInput" style={{ marginBottom: '0.5rem' }} value={loc} onChange={e => updateLocation(i, e.target.value)} />
                    ))}
                    <button className="btn btnSecondary" onClick={() => setForm({ ...form, locations: [...form.locations, ''] })}>+ Add Location</button>
                </div>

                <h3 style={{ margin: '2rem 0 1.5rem' }}>Social Links</h3>

                <div className="formGroup">
                    <label className="formLabel">Facebook URL</label>
                    <input className="formInput" value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} />
                </div>

                <div className="formGroup">
                    <label className="formLabel">Instagram URL</label>
                    <input className="formInput" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
                </div>

                <div className="formGroup">
                    <label className="formLabel">Telegram URL</label>
                    <input className="formInput" value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })} />
                </div>
            </div>
        </>
    );
}
