import axios from 'axios';

// Creating a standard axios instance
// You should update the baseURL to match your backend server URL
export const fluxClient = axios.create({
    baseURL: 'http://10.2.8.115:3000', // External Access URL
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
    get: (id) => fluxClient.get(`/${resource}/${id}`).then(res => res.data),
    create: (data) => fluxClient.post(`/${resource}`, data).then(res => res.data),
    update: (id, data) => fluxClient.put(`/${resource}/${id}`, data).then(res => res.data),
    delete: (id) => fluxClient.delete(`/${resource}/${id}`).then(res => res.data),
});

export const fluxoApi = {
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
