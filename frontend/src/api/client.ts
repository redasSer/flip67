import axios from 'axios';

export const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Use the current hostname so it works from any device on the network
    return `http://${window.location.hostname}:8080`;
};

const apiClient = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
