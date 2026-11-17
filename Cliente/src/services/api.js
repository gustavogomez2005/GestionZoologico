/*
Centraliza las peticiones HTTP adjuntando automáticamente
 el token JWT almacenado en localStorage
*/

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3000/api';

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.detalles?.[0]?.msg || 'Error en la petición');
    }
    return data;
};
