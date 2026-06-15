import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';

const ManagerDashboard = lazy(() => import('./ManagerDashboard'));
const RequesterDashboard = lazy(() => import('./RequesterDashboard'));

export default function Dashboard() {
    const { user, loading: isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-10 text-center">Carregando...</div>;
    }

    return (
        <Suspense fallback={
            <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-2">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium animate-pulse">Carregando painel...</p>
            </div>
        }>
            {user?.role === 'requester' ? <RequesterDashboard /> : <ManagerDashboard />}
        </Suspense>
    );
}
