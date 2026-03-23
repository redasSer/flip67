import axios from 'axios';

export const getBaseURL = () => {
    // If explicitly set (non-empty), use it. Empty string = same origin (production via nginx proxy).
    if (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '') {
        return import.meta.env.VITE_API_URL;
    }
    // Dev fallback: use current hostname with backend port
    if (import.meta.env.DEV) {
        return `http://${window.location.hostname}:8080`;
    }
    // Production: same origin, nginx proxies /api and /ws
    return '';
};

const apiClient = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
