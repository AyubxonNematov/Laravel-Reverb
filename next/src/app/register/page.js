'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';


export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/register', {
                name,
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
            setError(error.response?.data?.message || 'Register failed');
        }
    };

    return (
        <div className="page-container">
            <div className="auth-container">
                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
} 