import React, { useState, useEffect } from 'react';
import ManagerDashboard from './ManagerDashboard';
import RequesterDashboard from './RequesterDashboard';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
    const { user, loading: isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-10 text-center">Carregando...</div>;
    }

    if (user?.role === 'requester') {
        return <RequesterDashboard />;
    }

    // Default to Manager/Analyst Dashboard
    return <ManagerDashboard />;
}
