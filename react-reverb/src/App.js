import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Chat from './pages/chat';
import { useEffect } from 'react';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const getWebSocketConfig = (token) => ({
    broadcaster: 'reverb',
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST,
    wsPort: process.env.REACT_APP_REVERB_PORT || 80,
    wssPort: process.env.REACT_APP_REVERB_PORT || 443,
    forceTLS: (process.env.REACT_APP_REVERB_SCHEME || 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    },
});

const App = () => {
    const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
    useEffect(() => {
        window.Pusher = Pusher;
        window.Echo = new Echo(getWebSocketConfig(token));
    }, [token]);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Chat />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;