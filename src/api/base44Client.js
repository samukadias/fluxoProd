import axios from 'axios';

// Creating a standard axios instance
// You should update the baseURL to match your backend server URL
export const base44Client = axios.create({
    baseURL: 'http://localhost:3000', // Default local development URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default base44Client;
