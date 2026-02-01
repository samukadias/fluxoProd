import React, { createContext, useContext, useState, useEffect } from 'react';
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
            const userData = JSON.parse(storedUser);
            // Adaptador para compatibilidade com sistema legado
            if (!userData.full_name && userData.name) {
                userData.full_name = userData.name;
            }
            if (!userData.perfil && userData.role) {
                // Mapear roles se necessário (manager -> MANAGER, etc)
                userData.perfil = userData.role.toUpperCase(); // Exemplo simples
            }
            setUser(userData);
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
        // Apenas mostra toast se estiver logado, para evitar toast duplo no timeout e depois no redirect
        // mas aqui é genérico.
        // toast.info('Você saiu do sistema.'); 
        // O toast pode ser chamado por quem invoca, ou aqui.
        // Vou manter simples.
    };

    // Auto-logout por inatividade (20 minutos)
    useEffect(() => {
        if (!user) return;

        let timeoutId;
        const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutos

        const handleInactive = () => {
            toast.warning("Sessão encerrada por inatividade (20min).");
            logout();
        };

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(handleInactive, INACTIVITY_LIMIT);
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

        events.forEach(event => document.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
