// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
    // CAMBIO CRÍTICO: Escribimos la URL directamente para asegurar que no falle
    baseURL: "http://localhost:5012/api", 
    headers: {
        'Content-Type': 'application/json'
    }
});

// ... el resto de tu código de interceptores déjalo igual ...
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default api;