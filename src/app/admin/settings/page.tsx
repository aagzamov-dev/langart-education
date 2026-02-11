'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/actions/user';
import styles from './page.module.scss';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className={styles.button} disabled={pending}>
            {pending ? 'Updating...' : 'Update Profile'}
        </button>
    );
}

export default function SettingsPage() {
    const [state, dispatch] = useActionState(updateProfile, undefined);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Settings</h1>

            <div className={styles.card}>
                <form action={dispatch} className={styles.form}>

                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={styles.input}
                            placeholder="Leave empty to keep current"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Current Password (Required)</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className={styles.input}
                            placeholder="Leave empty to keep current"
                        />
                    </div>

                    {state?.error && (
                        <div className={styles.error}>{state.error}</div>
                    )}
                    {state?.success && (
                        <div className={styles.success}>{state.success}</div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
