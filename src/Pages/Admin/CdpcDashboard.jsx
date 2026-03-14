import React, { useState, useMemo } from 'react';
import { 
    Search, 
    Filter, 
    LayoutGrid, 
    BarChart3, 
    Download,
    RefreshCw,
    ChevronLeft,
    Clock,
    Loader2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fluxoApi } from '@/api/fluxoClient';
import OptyKpis from './components/OptyKpis';
import OptyCharts from './components/OptyCharts';
import OptyCard from './components/OptyCard';

export default function CdpcDashboard() {
    const [viewMode, setViewMode] = useState('geral');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        responsible: 'Todos',
        status: 'active'
    });

    // --- Data Fetching ---
    const { data: rawDemands = [], isLoading: loadingDemands, refetch } = useQuery({
        queryKey: ['demands'],
        queryFn: () => fluxoApi.entities.Demand.list('-created_date')
    });

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: () => fluxoApi.entities.User.list()
    });

    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: () => fluxoApi.entities.Client.list()
    });

    // --- Data Processing & Mapping ---
    const usersMap = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);
    const clientsMap = useMemo(() => Object.fromEntries(clients.map(c => [c.id, c])), [clients]);

    const weightToPriority = (weight) => {
        const w = Number(weight);
        if (w === 0) return 'P0 - Estratégico';
        if (w === 1) return 'P1 - Muito Alta';
        if (w === 2) return 'P2 - Alta';
        if (w === 3) return 'P3 - Média';
        return 'P4 - Baixa';
    };

    const allDemandsAsOptys = useMemo(() => {
        return rawDemands.map(d => {
            const client = clientsMap[d.client_id];
            const analyst = usersMap[d.analyst_id];
            
            // Calculate delay
            const now = new Date();
            const forecastDate = d.expected_delivery_date ? new Date(d.expected_delivery_date) : null;
            let delay = 0;
            if (forecastDate && !['ENTREGUE', 'CANCELADA'].includes(d.status) && now > forecastDate) {
                delay = Math.ceil((now - forecastDate) / (1000 * 60 * 60 * 24));
            }

            return {
                id: String(d.id),
                demand_number: d.demand_number,
                title: d.product || 'Sem Título',
                status: d.status,
                priority: weightToPriority(d.weight ?? 4),
                responsible: analyst ? analyst.name : 'Não Designado',
                client: client ? client.name : 'Cliente Externo',
                forecast: d.expected_delivery_date ? new Date(d.expected_delivery_date).toLocaleDateString('pt-BR') : '-',
                artifact: d.artifact || '-',
                delay: delay,
                isDelayed: delay > 0,
                pendency: d.current_pendency || null,
                observation: d.observation || null,
                weight: d.weight ?? 4
            };
        });
    }, [rawDemands, usersMap, clientsMap]);

    const filteredOptys = useMemo(() => {
        return allDemandsAsOptys.filter(opty => {
            const search = searchTerm.toLowerCase().trim();
            const matchesSearch = !search || 
                                opty.title.toLowerCase().includes(search) || 
                                opty.id.includes(search) || 
                                (opty.demand_number && opty.demand_number.toLowerCase().includes(search));
            
            const matchesResponsible = filters.responsible === 'Todos' || opty.responsible === filters.responsible;
            
            let matchesStatus = true;
            if (filters.status === 'active') {
                matchesStatus = !['ENTREGUE', 'CANCELADA', 'CONGELADA'].includes(opty.status);
            } else if (filters.status !== 'Todos') {
                matchesStatus = opty.status === filters.status;
            }
            
            return matchesSearch && matchesResponsible && matchesStatus;
        });
    }, [allDemandsAsOptys, searchTerm, filters]);

    const metrics = useMemo(() => {
        const baseData = filteredOptys.length > 0 ? filteredOptys : allDemandsAsOptys;
        const activeOptys = filteredOptys.filter(o => !['ENTREGUE', 'CANCELADA', 'CONGELADA'].includes(o.status));
        
        // If searching/filtering, metrics should reflect the filtered subset
        const targetOptys = activeOptys.length > 0 ? activeOptys : []; // Fallback empty if nothing matches
        
        const total = activeOptys.length;
        const delayed = activeOptys.filter(o => o.isDelayed).length;
        const strategic = activeOptys.filter(o => o.weight <= 1).length;
        const maxDelay = activeOptys.reduce((max, o) => Math.max(max, o.delay), 0);
        const inProgress = activeOptys.filter(o => ['EM ANDAMENTO', 'QUALIFICAÇÃO'].includes(o.status)).length;

        return {
            total,
            delayed,
            delayedPercent: total > 0 ? Math.round((delayed / total) * 100) : 0,
            strategic,
            maxDelay,
            inProgress
        };
    }, [filteredOptys, allDemandsAsOptys]);

    const responsiblesList = useMemo(() => {
        const cdpcUsers = users.filter(u => 
            ['analyst', 'manager', 'admin', 'gestor', 'viewer'].includes(u.role) && 
            (!u.department || u.department === 'CDPC')
        );
        const names = cdpcUsers.map(u => u.name);
        return ['Todos', ...new Set(names)].sort();
    }, [users]);

    const statuses = [
        'active', 
        'Todos',
        'PENDENTE TRIAGEM', 
        'DESIGNADA', 
        'QUALIFICAÇÃO', // Added 'QUALIFICAÇÃO'
        'EM QUALIFICAÇÃO', 
        'EM ANDAMENTO', 
        'CORREÇÃO', 
        'PENDÊNCIA DDS', 
        'PENDÊNCIA DOP', 
        'CONGELADA', 
        'ENTREGUE', 
        'CANCELADA'
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Navigation / Header */}
            <div className="bg-[#0F172A] text-white px-6 py-4 flex justify-between items-center shadow-lg border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight uppercase">Acompanhamento de Propostas</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Dashboard Administrativo • Atualizado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-slate-800/50 p-1 rounded-lg flex border border-slate-700">
                        <button 
                            onClick={() => setViewMode('geral')}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-black uppercase rounded transition-all",
                                viewMode === 'geral' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                            )}
                        >
                            Visão Geral
                        </button>
                        <button 
                            onClick={() => setViewMode('lista')}
                            className={cn(
                                "px-4 py-1.5 text-[10px] font-black uppercase rounded transition-all",
                                viewMode === 'lista' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                            )}
                        >
                            Lista
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 mt-6 space-y-6">
                {/* Global Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[240px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Buscar Proposta</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Buscar por ID, Número ou Título..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-48">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Responsável</p>
                        <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            value={filters.responsible}
                            onChange={(e) => setFilters(prev => ({ ...prev, responsible: e.target.value }))}
                        >
                            {responsiblesList.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div className="w-48">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Status</p>
                        <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            {statuses.map(s => <option key={s} value={s}>{s === 'active' ? 'Ativas' : s}</option>)}
                        </select>
                    </div>

                    <button 
                        onClick={() => refetch()}
                        disabled={loadingDemands}
                        className="bg-slate-800 text-white p-2.5 rounded-lg hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loadingDemands ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                </div>

                {/* Dashboard Modes */}
                {loadingDemands ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse uppercase text-xs tracking-widest">Carregando dados reais...</p>
                    </div>
                ) : viewMode === 'geral' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <OptyKpis metrics={metrics} loading={false} />
                        <OptyCharts data={filteredOptys} loading={false} />
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                                {filteredOptys.length} OPORTUNIDADES ENCONTRADAS
                            </h3>
                            <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase">
                                <Download className="w-3 h-3" /> Exportar CSV
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredOptys.map(opty => (
                                <OptyCard key={opty.id} opty={opty} />
                            ))}
                        </div>
                        {filteredOptys.length === 0 && (
                            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-20 text-center">
                                <Search className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium italic">Nenhuma Opty corresponde aos filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Float Summary (Only in List Mode) */}
            {viewMode === 'lista' && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-6 z-50 animate-in slide-in-from-right-10 duration-500">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</span>
                        <span className="text-xl font-black">{metrics.total}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-700" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em]">Atrasadas</span>
                        <span className="text-xl font-black text-rose-500">{metrics.delayed}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-700" />
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 rotate-90" />
                    </button>
                </div>
            )}
        </div>
    );
}
