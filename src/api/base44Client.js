import axios from 'axios';

// Creating a standard axios instance
// You should update the baseURL to match your backend server URL
export const base44Client = axios.create({
    baseURL: 'http://localhost:3000', // Default local development URL
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
        return base44Client.get(`/${resource}`, config).then(res => res.data);
    },
    get: (id) => base44Client.get(`/${resource}/${id}`).then(res => res.data),
    create: (data) => base44Client.post(`/${resource}`, data).then(res => res.data),
    update: (id, data) => base44Client.put(`/${resource}/${id}`, data).then(res => res.data),
    delete: (id) => base44Client.delete(`/${resource}/${id}`).then(res => res.data),
});

export const base44 = {
    entities: {
        Demand: createCrud('demands'),
        StatusHistory: createCrud('status_history'),
        Analyst: createCrud('analysts'),
        Holiday: createCrud('holidays'),
        Client: createCrud('clients'),
        Cycle: createCrud('cycles'),
        Requester: createCrud('requesters'),
        User: createCrud('users'),
    },
    auth: {
        login: (email, password) => base44Client.post('/auth/login', { email, password }).then(res => res.data),
        me: () => base44Client.get('/auth/me').then(res => res.data),
    },
    integrations: {
        Core: {
            SendEmail: (data) => base44Client.post('/integrations/email', data).then(res => res.data),
        }
    }
};

export default base44;
