import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY)}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, credentials);
            const { token, user } = response.data;

            localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, token);
            setUser(user);

            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, userData);
            const { token, user } = response.data;

            localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, token);
            setUser(user);

            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 