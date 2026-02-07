import axios from 'axios';

// Creating a standard axios instance
// You should update the baseURL to match your backend server URL
// Dynamically determine the base URL based on the current hostname
const getBaseUrl = () => {
    // Force IPv4 for local development to avoid [::1] issues
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.log('FluxoAPI Base URL: http://127.0.0.1:3000');
        return 'http://127.0.0.1:3000';
    }

    // If we are on a remote machine (LAN), use that IP!
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // If it's a LAN IP or specific hostname, assume API is on port 3000 of same host
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            console.log(`FluxoAPI Base URL (LAN): http://${hostname}:3000`);
            return `http://${hostname}:3000`;
        }
    }

    // Fallback/Default logic
    const url = (() => {
        if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
        return 'http://localhost:3000';
    })();
    console.log('FluxoAPI Base URL:', url);
    return url;
};

export const fluxClient = axios.create({
    baseURL: getBaseUrl(), // Dynamic URL
    headers: {
        'Content-Type': 'application/json',
    },
});

const createCrud = (resource) => ({
    list: (args) => {
        const config = {};
        if (typeof args === 'string') {
            config.params = { sort: args };
        } else if (typeof args === 'object') {
            config.params = args;
        }
        return fluxClient.get(`/${resource}`, config).then(res => res.data);
    },
    listPaginated: (args) => {
        const config = {};
        if (typeof args === 'object') {
            config.params = args;
        }
        return fluxClient.get(`/${resource}`, config).then(res => ({
            data: res.data,
            total: parseInt(res.headers['x-total-count'] || 0)
        }));
    },
    get: (id) => fluxClient.get(`/${resource}/${id}`).then(res => res.data),
    create: (data) => fluxClient.post(`/${resource}`, data).then(res => res.data),
    update: (id, data) => fluxClient.put(`/${resource}/${id}`, data).then(res => res.data),
    delete: (id) => fluxClient.delete(`/${resource}/${id}`).then(res => res.data),
});

export const fluxoApi = {
    entities: {
        Demand: createCrud('demands'),
        StatusHistory: createCrud('status_history'),
        Holiday: createCrud('holidays'),
        Cycle: createCrud('cycles'),
        Requester: createCrud('requesters'),
        User: createCrud('users'),
        Contract: createCrud('contracts'), // Alterado para apontar para a tabela correta conforme solicitação do usuário
        FinanceContract: createCrud('finance_contracts'), // Módulo Financeiro
        DeadlineContract: createCrud('deadline_contracts'), // Módulo Prazos
        Invoice: createCrud('invoices'),
        MonthlyAttestation: createCrud('attestations'),
        Client: createCrud('clients'),
        Analyst: createCrud('analysts'),
        TermoConfirmacao: createCrud('termos_confirmacao'),
        StageHistory: createCrud('stage_history'),
    },
    auth: {
        login: (email, password) => fluxClient.post('/auth/login', { email, password }).then(res => res.data),
        me: () => fluxClient.get('/auth/me').then(res => res.data),
    },
    integrations: {
        Core: {
            SendEmail: (data) => fluxClient.post('/integrations/email', data).then(res => res.data),
        }
    }
};

export default fluxoApi;
