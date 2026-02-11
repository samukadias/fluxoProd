import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Demands from "./pages/Demands";
import DemandDetail from "./pages/DemandDetail";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import FinanceiroHome from './pages/Financeiro';
import Contracts from './pages/Financeiro/Contracts';
import AttestationHistory from './pages/Financeiro/AttestationHistory';

import PrazosDashboard from "./pages/Prazos/Dashboard";
import NewContractLegacy from "./pages/Prazos/Legacy/pages/NewContract";
import EditContractLegacy from "./pages/Prazos/Legacy/pages/EditContract";
import ContractsLegacy from "./pages/Prazos/Legacy/pages/Contracts";
import ViewContractLegacy from "./pages/Prazos/Legacy/pages/ViewContract";
import AnalysisLegacy from "./pages/Prazos/Legacy/pages/Analysis";
import StageControlLegacy from "./pages/Prazos/Legacy/pages/StageControl";
import DataManagementLegacy from "./pages/Prazos/Legacy/pages/DataManagement";
import SearchLegacy from "./pages/Prazos/Legacy/pages/Search";
import ActivityLog from "./pages/ActivityLog";

// Components
import UserNotRegisteredError from "./components/UserNotRegisteredError";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

// Protected Route Wrapper - Now consumes useAuth
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="p-10 text-center">Carregando...</div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

// Componente interno para acesso ao contexto de auth nas rotas
function AppRoutes() {
    const { user, login, logout, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Carregando aplicação...</div>;

    const getHomeRoute = (user) => {
        if (!user) return "/login";
        if (user.role === 'requester') return "/dashboard";

        const modules = user.allowed_modules || ['flow'];

        if (modules.includes('flow')) return "/dashboard";
        if (modules.includes('finance')) return "/financeiro";
        if (modules.includes('contracts')) return "/prazos";

        // Fallback baseado em departamento se modules estiver vazio
        if (user.department === 'COCR') return "/prazos";
        if (user.department === 'CVAC') return "/financeiro";
        if (user.department === 'CDPC') return "/dashboard";

        return "/dashboard"; // Fallback final
    };

    return (
        <Routes>
            <Route path="/login" element={
                user ? <Navigate to={getHomeRoute(user)} replace /> : <Login onLogin={() => { }} />
            } />

            <Route path="/" element={
                <ProtectedRoute>
                    <Layout onLogout={logout} user={user} />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to={getHomeRoute(user)} replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="demands" element={<Demands />} />
                <Route path="demand-detail" element={<DemandDetail />} />
                <Route path="settings" element={<Settings />} />
                <Route path="atividades" element={<ActivityLog />} />
                {/* Módulo Financeiro */}
                <Route path="financeiro">
                    <Route index element={<FinanceiroHome />} />
                    <Route path="dashboard" element={<FinanceiroHome />} />
                    <Route path="contratos" element={<Contracts />} />
                    <Route path="contratos/:contractId/atestacoes" element={<AttestationHistory />} />

                </Route>
                <Route path="prazos">
                    <Route index element={<PrazosDashboard />} />
                    <Route path="contratos" element={<ContractsLegacy />} />
                    <Route path="ver" element={<ViewContractLegacy />} />
                    <Route path="analise" element={<AnalysisLegacy />} />
                    <Route path="etapas" element={<StageControlLegacy />} />
                    <Route path="gestao-dados" element={<DataManagementLegacy />} />
                    <Route path="pesquisa" element={<SearchLegacy />} />
                    <Route path="contratos/novo" element={<NewContractLegacy />} />
                    <Route path="contratos/editar/:id" element={<EditContractLegacy />} />
                    {/* Rotas legadas antigas para compatibilidade se existirem links */}
                    <Route path="novo" element={<NewContractLegacy />} />
                    <Route path="editar/:id" element={<EditContractLegacy />} />
                </Route>

            </Route>

            <Route path="/access-denied" element={<UserNotRegisteredError />} />
            <Route path="*" element={<Navigate to={user ? getHomeRoute(user) : "/login"} replace />} />
        </Routes>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </AuthProvider>
                <Toaster />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
