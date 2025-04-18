'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { setCookie } from 'cookies-next';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axiosInstance.post('/login', {
                email,
                password,
            });

            if (response.data.token) {
                setCookie('auth-token', response.data.token, {
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                });

                setCookie('user', JSON.stringify(response.data.user), {
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                });

                router.push('/');
                router.refresh();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="page-container">
            <div className="auth-container">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
} 