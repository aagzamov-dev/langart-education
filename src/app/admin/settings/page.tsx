'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast/ToastContext';

export default function SettingsPage() {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fallback/Initial state
    const [config, setConfig] = useState({
        phoneNumber: '',
        email: '',
        locations: [''],
        workingHours: '',
        facebook: '',
        instagram: '',
        telegram: '',
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setConfig({
                    phoneNumber: data.phoneNumber || '',
                    email: data.email || '',
                    locations: data.locations && data.locations.length > 0 ? data.locations : [''],
                    workingHours: data.workingHours || '',
                    facebook: data.facebook || '',
                    instagram: data.instagram || '',
                    telegram: data.telegram || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
            showToast('Failed to load settings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleLocationChange = (index: number, value: string) => {
        const newLocations = [...config.locations];
        newLocations[index] = value;
        setConfig({ ...config, locations: newLocations });
    };

    const addLocation = () => {
        setConfig({ ...config, locations: [...config.locations, ''] });
    };

    const removeLocation = (index: number) => {
        if (config.locations.length <= 1) return;
        const newLocations = config.locations.filter((_, i) => i !== index);
        setConfig({ ...config, locations: newLocations });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            if (res.ok) {
                showToast('Settings saved successfully', 'success');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to save settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="adminPage">
            <div className="pageHeader">
                <h1>Site Settings</h1>
                <p className="subtitle">Manage contact information and social links</p>
            </div>

            <form onSubmit={handleSubmit} className="settingsForm">
                <div className="sectionCard">
                    <h3>Contact Information</h3>

                    <div className="formGroup">
                        <label>
                            <FaPhone className="icon" /> Phone Number
                        </label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={config.phoneNumber}
                            onChange={handleChange}
                            placeholder="+998 90 123 45 67"
                        />
                    </div>

                    <div className="formGroup">
                        <label>
                            <FaEnvelope className="icon" /> Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={config.email}
                            onChange={handleChange}
                            placeholder="info@example.com"
                        />
                    </div>

                    <div className="formGroup">
                        <label>
                            <FaClock className="icon" /> Working Hours
                        </label>
                        <input
                            type="text"
                            name="workingHours"
                            value={config.workingHours}
                            onChange={handleChange}
                            placeholder="09:00 - 18:00"
                        />
                    </div>

                    <div className="formGroup">
                        <label>
                            <FaMapMarkerAlt className="icon" /> Locations
                        </label>
                        {config.locations.map((loc, index) => (
                            <div key={index} className="locationInput">
                                <input
                                    type="text"
                                    value={loc}
                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                    placeholder="Address line"
                                />
                                {config.locations.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLocation(index)}
                                        className="removeBtn"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addLocation} className="addBtn">
                            + Add Another Location
                        </button>
                    </div>
                </div>

                <div className="sectionCard">
                    <h3>Social Media Links</h3>

                    <div className="formGroup">
                        <label>
                            <FaTelegram className="icon" /> Telegram
                        </label>
                        <input
                            type="text"
                            name="telegram"
                            value={config.telegram}
                            onChange={handleChange}
                            placeholder="https://t.me/..."
                        />
                    </div>

                    <div className="formGroup">
                        <label>
                            <FaInstagram className="icon" /> Instagram
                        </label>
                        <input
                            type="text"
                            name="instagram"
                            value={config.instagram}
                            onChange={handleChange}
                            placeholder="https://instagram.com/..."
                        />
                    </div>

                    <div className="formGroup">
                        <label>
                            <FaFacebook className="icon" /> Facebook
                        </label>
                        <input
                            type="text"
                            name="facebook"
                            value={config.facebook}
                            onChange={handleChange}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                </div>

                <div className="formActions">
                    <button type="submit" className="saveBtn" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <span className="spinner"></span> Saving...
                            </>
                        ) : (
                            <>
                                <FaSave /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .adminPage { padding: 24px; max-width: 800px; margin: 0 auto; }
                .pageHeader { margin-bottom: 32px; }
                .subtitle { color: #666; }
                
                .sectionCard { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 24px; }
                .sectionCard h3 { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #eee; font-size: 18px; color: #333; }
                
                .formGroup { margin-bottom: 20px; }
                .formGroup label { display: block; margin-bottom: 8px; font-weight: 500; color: #555; display: flex; align-items: center; gap: 8px; }
                .icon { color: #1ec28e; }
                
                input[type="text"], input[type="email"] { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; transition: border 0.2s; }
                input:focus { border-color: #1ec28e; outline: none; }
                
                .locationInput { display: flex; gap: 10px; margin-bottom: 10px; }
                .removeBtn { padding: 8px 12px; background: #fff1f0; color: #ff4d4f; border: 1px solid #ffccc7; border-radius: 6px; cursor: pointer; }
                .addBtn { background: none; border: 1px dashed #1ec28e; color: #1ec28e; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; width: 100%; }
                .addBtn:hover { background: #f0fbf8; }
                
                .formActions { display: flex; justify-content: flex-end; position: sticky; bottom: 24px; }
                .saveBtn { background: #1ec28e; color: white; padding: 12px 32px; border-radius: 8px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(30, 194, 142, 0.3); transition: transform 0.2s; }
                .saveBtn:hover { transform: translateY(-2px); }
                .saveBtn:disabled { opacity: 0.7; transform: none; cursor: not-allowed; }
                
                .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
