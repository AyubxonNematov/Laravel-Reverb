import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(process.env.REACT_APP_AUTH_REFRESH_TOKEN_KEY);
                if (refreshToken) {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/refresh-token`, {
                        refresh_token: refreshToken
                    });

                    const { token } = response.data;
                    localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, token);

                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
                localStorage.removeItem(process.env.REACT_APP_AUTH_REFRESH_TOKEN_KEY);
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 