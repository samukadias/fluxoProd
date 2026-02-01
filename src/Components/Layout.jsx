import React from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, List, Settings, LogOut, Menu, DollarSign, CalendarClock, FileText, UserCog, BarChart3, GitBranch, Database, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SidebarItem = ({ icon: Icon, label, to, onClick, end }) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            end={end}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                    {label}
                </>
            )}
        </NavLink>
    );
};

export default function Layout({ onLogout, user }) {
    const [open, setOpen] = React.useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold">F</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">FluxoProd</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                {/* Módulo CDPC (Antigo Fluxo/Demandas) */}
                {(user?.department === 'GOR' || user?.allowed_modules?.includes('flow') || user?.department === 'CDPC') && (
                    <>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard CDPC" to="/dashboard" onClick={() => setOpen(false)} end />
                        <div className="pl-2 space-y-1 mt-1 border-l sm:ml-4 border-slate-200">
                            <SidebarItem icon={List} label="Demandas CDPC" to="/demands" onClick={() => setOpen(false)} />
                        </div>
                    </>
                )}

                {/* Módulo CVAC (Antigo Financeiro) */}
                {(user?.department === 'GOR' || user?.allowed_modules?.includes('finance') || user?.department === 'CVAC') && (
                    <>
                        {/* Dashboard CVAC: Visible to Managers (CVAC/GOR) */}
                        {((user?.department === 'CVAC' && user?.role === 'manager') || user?.department === 'GOR' || user?.perfil === 'GESTOR') && (
                            <SidebarItem icon={DollarSign} label="Dashboard CVAC" to="/financeiro" onClick={() => setOpen(false)} end />
                        )}

                        <div className="pl-2 space-y-1 mt-1 border-l sm:ml-4 border-slate-200">
                            <SidebarItem icon={FileText} label="Contratos CVAC" to="/financeiro/contratos" onClick={() => setOpen(false)} />
                        </div>
                    </>
                )}

                {/* Módulo COCR (Antigo Prazos) */}
                {(user?.department === 'GOR' || user?.allowed_modules?.includes('contracts') || user?.department === 'COCR') && (
                    <>
                        <SidebarItem icon={CalendarClock} label="Dashboard COCR" to="/prazos" onClick={() => setOpen(false)} end />
                        <div className="pl-2 space-y-1 mt-1 border-l sm:ml-4 border-slate-200">
                            <SidebarItem icon={FileText} label="Contratos" to="/prazos/contratos" onClick={() => setOpen(false)} />
                            <SidebarItem icon={Search} label="Pesquisar" to="/prazos/pesquisa" onClick={() => setOpen(false)} />
                            <SidebarItem icon={BarChart3} label="Análise" to="/prazos/analise" onClick={() => setOpen(false)} />
                            <SidebarItem icon={GitBranch} label="Controle de Etapas" to="/prazos/etapas" onClick={() => setOpen(false)} />
                            <SidebarItem icon={Database} label="Gestão de Dados" to="/prazos/gestao-dados" onClick={() => setOpen(false)} />
                        </div>
                    </>
                )}

                {/* Administration: Only Managers and Admins */}
                {(user?.role === 'admin' || user?.role === 'manager') && (
                    <>
                        <SidebarItem icon={Settings} label="Administração" to="/settings" onClick={() => setOpen(false)} />
                    </>
                )}
            </div>

            <div className="p-4 border-t border-slate-100">
                {user && (
                    <div className="mb-4 px-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                )}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={onLogout}
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sair
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 fixed h-full z-30">
                <SidebarContent />
            </div>

            {/* Mobile Header & Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold">F</span>
                    </div>
                    <span className="font-bold text-slate-900">FluxoProd</span>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6 text-slate-600" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
