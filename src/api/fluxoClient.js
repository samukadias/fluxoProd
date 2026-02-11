import axios from 'axios';

// Dynamically determine the base URL based on the current hostname
const getBaseUrl = () => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://127.0.0.1:3000';
    }

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return `http://${hostname}:3000`;
        }
    }

    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

export const fluxClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// ========================================
// INTERCEPTORS
// ========================================

// Request interceptor: attach JWT token to all requests
fluxClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('fluxo_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (expired/invalid token)
fluxClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear session and redirect to login
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/') {
                localStorage.removeItem('fluxo_token');
                localStorage.removeItem('fluxo_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ========================================
// API CLIENT
// ========================================

const createCrud = (resource) => ({
    list: (args) => {
        const config = {};
        if (typeof args === 'string') {
            config.params = { sort: args };
        } else if (typeof args === 'object' && args !== null) {
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
        Contract: createCrud('contracts'),
        FinanceContract: createCrud('finance_contracts'),
        DeadlineContract: createCrud('deadline_contracts'),
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
    notifications: {
        list: (params) => fluxClient.get('/notifications', { params }).then(res => res.data),
        unreadCount: () => fluxClient.get('/notifications/unread-count').then(res => res.data),
        markRead: (id) => fluxClient.put(`/notifications/${id}/read`).then(res => res.data),
        markAllRead: () => fluxClient.put('/notifications/mark-all-read').then(res => res.data),
    },
    activity: {
        list: (params) => fluxClient.get('/activity-log', { params }).then(res => res.data),
    },
    integrations: {
        Core: {
            SendEmail: (data) => fluxClient.post('/integrations/email', data).then(res => res.data),
        }
    }
};

export default fluxoApi;
