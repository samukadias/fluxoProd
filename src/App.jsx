import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Dashboard from "./pages/Dashboard";
import Demands from "./pages/Demands";
import DemandDetail from "./pages/DemandDetail";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

// Components
import UserNotRegisteredError from "./components/UserNotRegisteredError";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute = ({ children, user }) => {
    const location = useLocation();
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate user from localStorage
        const storedUser = localStorage.getItem('fluxo_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Invalid user data", e);
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('fluxo_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('fluxo_user');
    };

    if (loading) return null; // Or a loading spinner

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={
                            user ? <Navigate to={user.role === 'requester' ? "/demands" : "/dashboard"} replace /> : <Login onLogin={handleLogin} />
                        } />

                        <Route path="/" element={
                            <ProtectedRoute user={user}>
                                <Layout onLogout={handleLogout} user={user} />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Navigate to={user?.role === 'requester' ? "/demands" : "/dashboard"} replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="demands" element={<Demands />} />
                            <Route path="demand-detail" element={<DemandDetail />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        <Route path="/access-denied" element={<UserNotRegisteredError />} />
                        <Route path="*" element={<Navigate to={user?.role === 'requester' ? "/demands" : "/dashboard"} replace />} />
                    </Routes>
                </BrowserRouter>
                <Toaster />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
