import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ManagerDashboard from './Dashboard';
import { Loader2 } from 'lucide-react';

export default function FinanceiroHome() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('fluxo_user') || localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error('Erro ao carregar usuário:', e);
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    // Se for gestor ou admin, vê o Dashboard
    if (user?.role === 'manager' || user?.profile_type === 'gestor' || user?.department === 'GOR' || (user?.department === 'CVAC' && user?.role === 'manager')) {
        return <ManagerDashboard />;
    }

    // Se não for gestor (Analista, etc), redireciona para Contratos
    return <Navigate to="/financeiro/contratos" replace />;
}
