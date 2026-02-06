import axios from 'axios';

// Creating a standard axios instance
// You should update the baseURL to match your backend server URL
// Dynamically determine the base URL based on the current hostname
const getBaseUrl = () => {
    const url = (() => {
        // Prioritize dynamic hostname to fix LAN access when .env has localhost hardcoded
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return `http://${window.location.hostname}:3000`;
        }
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
        Contract: createCrud('deadline_contracts'), // Alterado para apontar para a tabela correta do módulo de prazos
        FinanceContract: createCrud('finance_contracts'), // Módulo Financeiro
        DeadlineContract: createCrud('deadline_contracts'), // Módulo Prazos
        Invoice: createCrud('invoices'),
        MonthlyAttestation: createCrud('monthly_attestations'),
        Client: createCrud('clients'),
        Analyst: createCrud('analysts'),
        TermoConfirmacao: createCrud('termos_confirmacao'),
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
