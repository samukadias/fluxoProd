import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '../entities/User';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar se já existe um usuário salvo no localStorage ao carregar
        const storedUser = localStorage.getItem('fluxo_user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                // Adaptador para compatibilidade com sistema legado
                if (!userData.full_name && userData.name) {
                    userData.full_name = userData.name;
                }
                if (!userData.perfil && userData.role) {
                    // Mapear roles se necessário (manager -> MANAGER, etc)
                    userData.perfil = userData.role.toUpperCase();
                }
                setUser(userData);
            } catch (e) {
                console.error("Erro ao recuperar sessão:", e);
                localStorage.removeItem('fluxo_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            // Buscar usuário pelo email na nossa tabela de usuários
            const userFound = await User.getByEmail(email);

            if (!userFound) {
                toast.error('Usuário não encontrado. Verifique o email.');
                return false;
            }

            // Verificar senha (comparação simples por enquanto)
            if (userFound.password !== password) {
                toast.error('Senha incorreta.');
                return false;
            }

            // Salvar usuário no estado e no localStorage
            setUser(userFound);
            localStorage.setItem('fluxo_user', JSON.stringify(userFound));
            toast.success(`Bem-vindo, ${userFound.full_name}!`);
            return true;
        } catch (error) {
            console.error('Erro no login:', error);
            toast.error('Erro ao realizar login.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fluxo_user');
    };

    // Auto-logout por inatividade (20 minutos) - Otimizado
    const lastActivityRef = useRef(Date.now());

    useEffect(() => {
        if (!user) return; // Só ativa se logado

        const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutos
        const CHECK_INTERVAL = 60 * 1000; // Checa a cada 1 minuto

        // Função ultra-leve chamada nos eventos
        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        // Eventos a monitorar
        // Removi mousemove para evitar overhead, mas em computadores modernos é ok com essa lógica leve.
        // Vou manter mousemove pois o usuário espera isso.
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
        events.forEach(event => document.addEventListener(event, updateActivity));

        // Intervalo de verificação periódica
        const intervalId = setInterval(() => {
            const now = Date.now();
            if (now - lastActivityRef.current > INACTIVITY_LIMIT) {
                toast.warning("Sessão encerrada por inatividade (20min).");
                logout();
            }
        }, CHECK_INTERVAL);

        // Reset inicial
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
