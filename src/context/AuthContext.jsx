import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fluxoApi, fluxClient } from '@/api/fluxoClient';

const AuthContext = createContext({});

const TOKEN_KEY = 'fluxo_token';
const USER_KEY = 'fluxo_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from stored token on mount
    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            const storedUser = localStorage.getItem(USER_KEY);

            if (token && storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    // Compatibility adapter
                    if (!userData.full_name && userData.name) {
                        userData.full_name = userData.name;
                    }
                    if (!userData.perfil && userData.role) {
                        userData.perfil = userData.role.toUpperCase();
                    }
                    setUser(userData);
                } catch (e) {
                    console.error("Erro ao recuperar sessão:", e);
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                }
            }
            setLoading(false);
        };

        restoreSession();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);

            // Call the real JWT login endpoint
            const response = await fluxoApi.auth.login(email, password);

            if (!response || !response.token) {
                toast.error('Erro ao realizar login.');
                return false;
            }

            const { token, user: userData } = response;

            // Store JWT token
            localStorage.setItem(TOKEN_KEY, token);

            // Build user object with compatibility fields
            const userObj = {
                ...userData,
                full_name: userData.full_name || userData.name,
                perfil: userData.perfil || (userData.role ? userData.role.toUpperCase() : 'USER'),
            };

            // Store user data (no password!)
            setUser(userObj);
            localStorage.setItem(USER_KEY, JSON.stringify(userObj));

            toast.success(`Bem-vindo, ${userObj.full_name || userObj.name}!`);
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            const message = error.response?.data?.error || 'Erro ao realizar login.';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    // Auto-logout on inactivity (20 minutes)
    const lastActivityRef = useRef(Date.now());

    useEffect(() => {
        if (!user) return;

        const INACTIVITY_LIMIT = 20 * 60 * 1000;
        const CHECK_INTERVAL = 60 * 1000;

        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
        events.forEach(event => document.addEventListener(event, updateActivity));

        const intervalId = setInterval(() => {
            if (Date.now() - lastActivityRef.current > INACTIVITY_LIMIT) {
                toast.warning("Sessão encerrada por inatividade (20min).");
                logout();
            }
        }, CHECK_INTERVAL);

        lastActivityRef.current = Date.now();

        return () => {
            clearInterval(intervalId);
            events.forEach(event => document.removeEventListener(event, updateActivity));
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
