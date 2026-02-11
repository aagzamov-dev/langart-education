'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import styles from './page.module.scss';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className={styles.button} disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(login, undefined);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Admin Login</h1>
                <form action={dispatch} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className={styles.input}
                        />
                    </div>
                    {errorMessage?.error && (
                        <div className={styles.error}>{errorMessage.error}</div>
                    )}
                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
