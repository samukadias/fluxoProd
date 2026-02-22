import React, { useState } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, List, Settings, LogOut, Menu, DollarSign, CalendarClock, FileText, UserCog, BarChart3, GitBranch, Database, Search, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from '../assets/logo.svg';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SidebarItem = ({ icon: Icon, label, to, onClick, end, isCollapsed }) => {
    const linkContent = (
        <NavLink
            to={to}
            onClick={onClick}
            end={end}
            className={({ isActive }) => cn(
                "flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive
                    ? "bg-indigo-500/20 text-indigo-400 shadow-none border border-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-indigo-400" : "text-slate-500")} />
                    {!isCollapsed && <span className="truncate">{label}</span>}
                </>
            )}
        </NavLink>
    );

    if (isCollapsed) {
        return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-slate-800 text-slate-100 border-slate-700">
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return linkContent;
};

export default function Layout({ onLogout, user }) {
    const [open, setOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300">
            <div className={cn("p-6 border-b border-slate-800 flex items-center", isCollapsed ? "justify-center px-4" : "justify-between")}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={logo} alt="GOR Logo" className="w-8 h-8 opacity-90 flex-shrink-0" />
                    {!isCollapsed && <span className="text-lg font-bold text-white tracking-tight truncate">GOR</span>}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("text-slate-400 hover:text-white hover:bg-slate-800 hidden md:flex", isCollapsed && "absolute right-[-14px] top-6 h-7 w-7 rounded-full bg-slate-800 border border-slate-700")}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {/* Módulo CDPC (Antigo Fluxo/Demandas) */}
                {(user?.department === 'GOR' || user?.allowed_modules?.includes('flow') || user?.department === 'CDPC') && (
                    <>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard CDPC" to="/dashboard" onClick={() => setOpen(false)} end isCollapsed={isCollapsed} />
                        <div className={cn("space-y-1 mt-1 border-l border-slate-800/50", isCollapsed ? "pl-0 ml-0 border-none" : "pl-2 sm:ml-4")}>
                            <SidebarItem icon={List} label="Demandas CDPC" to="/demands" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                        </div>
                    </>
                )}

                {/* Módulo CVAC (Antigo Financeiro) */}
                {(user?.department === 'GOR' || user?.allowed_modules?.includes('finance') || user?.department === 'CVAC') && (
                    <>
                        {((user?.department === 'CVAC' && (user?.role === 'manager' || user?.role === 'analyst' || user?.profile_type === 'analista')) || user?.department === 'GOR' || user?.perfil === 'GESTOR') && (
                            <SidebarItem icon={DollarSign} label="Dashboard CVAC" to="/financeiro" onClick={() => setOpen(false)} end isCollapsed={isCollapsed} />
                        )}

                        <div className={cn("space-y-1 mt-1 border-l border-slate-800/50", isCollapsed ? "pl-0 ml-0 border-none" : "pl-2 sm:ml-4")}>
                            <SidebarItem icon={FileText} label="Contratos CVAC" to="/financeiro/contratos" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                        </div>
                    </>
                )}

                {/* Módulo COCR (Antigo Prazos) */}
                {(user?.department === 'GOR' || user?.allowed_modules?.includes('contracts') || user?.department === 'COCR') && (
                    <>
                        <SidebarItem icon={CalendarClock} label="Dashboard COCR" to="/prazos" onClick={() => setOpen(false)} end isCollapsed={isCollapsed} />

                        {user?.role !== 'client' && (
                            <div className={cn("space-y-1 mt-1 border-l border-slate-800/50", isCollapsed ? "pl-0 ml-0 border-none" : "pl-2 sm:ml-4")}>
                                <SidebarItem icon={FileText} label="Contratos" to="/prazos/contratos" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                                <SidebarItem icon={Search} label="Pesquisar" to="/prazos/pesquisa" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                                <SidebarItem icon={BarChart3} label="Análise" to="/prazos/analise" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                                <SidebarItem icon={GitBranch} label="Controle de Etapas" to="/prazos/etapas" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                                <SidebarItem icon={Database} label="Gestão de Dados" to="/prazos/gestao-dados" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                            </div>
                        )}
                    </>
                )}

                {/* Administration */}
                {(user?.permissions?.includes('view_executive_dashboard') || user?.permissions?.includes('manage_settings')) && (
                    <>
                        {user?.permissions?.includes('view_executive_dashboard') && (
                            <SidebarItem icon={BarChart3} label="Visão Executiva (Gerencial)" to="/gerencial" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                        )}
                        {user?.permissions?.includes('manage_settings') && (
                            <SidebarItem icon={Settings} label="Administração" to="/settings" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                        )}
                    </>
                )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col items-center">
                {user && (
                    <div className={cn("mb-4 w-full", isCollapsed ? "px-0 text-center flex flex-col items-center" : "px-2")}>
                        {!isCollapsed ? (
                            <>
                                <p className="text-xs text-indigo-400 font-semibold mb-1">
                                    {(() => {
                                        const hour = new Date().getHours();
                                        if (hour < 12) return 'Bom dia,';
                                        if (hour < 18) return 'Boa tarde,';
                                        return 'Boa noite,';
                                    })()}
                                </p>
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </>
                        ) : (
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold uppercase cursor-pointer">
                                            {user.name?.charAt(0)}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-800 text-slate-100 border-slate-700">
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-slate-400">{user.email}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                )}
                {(user?.role === 'admin') && (
                    <div className={cn("py-2", isCollapsed ? "px-0" : "px-3 w-full")}>
                        <NotificationCenter isCollapsed={isCollapsed} />
                    </div>
                )}
                {(user?.role === 'admin') && (
                    <SidebarItem icon={Activity} label="Histórico" to="/atividades" onClick={() => setOpen(false)} isCollapsed={isCollapsed} />
                )}

                {isCollapsed ? (
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    onClick={onLogout}
                                >
                                    <LogOut className="w-5 h-5 flex-shrink-0" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-slate-800 text-slate-100 border-slate-700">
                                Sair
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2"
                        onClick={onLogout}
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Sair
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <div className={cn("hidden md:block fixed h-full z-30 transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
                <SidebarContent />
            </div>

            {/* Mobile Header & Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-800 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="GOR Logo" className="w-8 h-8" />
                    <span className="font-bold text-white">GOR</span>
                </div>
                {user?.role === 'admin' && (
                    <div className="flex items-center gap-2">
                        <NotificationCenter />
                    </div>
                )}
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
            <main className={cn("flex-1 pt-16 md:pt-0 min-h-screen transition-all duration-300 w-full overflow-x-hidden", isCollapsed ? "md:ml-20" : "md:ml-64")}>
                <Outlet />
            </main>
        </div>
    );
}
