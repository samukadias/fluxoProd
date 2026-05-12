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
    Loader2,
    Calendar,
    User,
    Activity,
    List,
    Building2,
    Package,
    Briefcase,
    Layers,
    Database,
    FileDown
} from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { fluxoApi } from '@/api/fluxoClient';
import OptyKpis from './components/OptyKpis';
import OptyCharts from './components/OptyCharts';
import OptyCard from './components/OptyCard';
import DemandDetailModal from '@/Components/demands/DemandDetailModal';
import * as XLSX from 'xlsx';

export default function CdpcDashboard() {
    const [viewMode, setViewMode] = useState('geral');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        responsible: 'Todos',
        status: 'active',
        client: 'Todos',
        productType: 'Todos',
        demandTypes: [],
        stage: 'Todos'
    });
    const [openDemandTypeFilter, setOpenDemandTypeFilter] = useState(false);

    const [selectedDemandId, setSelectedDemandId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDetailClick = (id) => {
        setSelectedDemandId(id);
        setIsModalOpen(true);
    };

    const [isFullExporting, setIsFullExporting] = useState(false);

    const handleFullExport = async () => {
        setIsFullExporting(true);
        try {
            const [demands, users, clients, cycles, demandServices] = await Promise.all([
                fluxoApi.entities.Demand.list(),
                fluxoApi.entities.User.list(),
                fluxoApi.entities.Client.list(),
                fluxoApi.entities.Cycle.list(),
                fluxoApi.entities.DemandService.list(),
            ]);

            const userMap = new Map(users.map(u => [u.id, u.name]));
            const clientMap = new Map(clients.map(c => [c.id, c.name]));
            const cycleMap = new Map(cycles.map(c => [c.id, c.name]));
            const serviceMap = new Map(demandServices.map(s => [String(s.id), s.service_name]));

            const weightLabel = (w) => {
                const n = Number(w);
                if (n === 0) return 'P0 - Estratégico';
                if (n === 1) return 'P1 - Muito Alta';
                if (n === 2) return 'P2 - Alta';
                if (n === 3) return 'P3 - Média';
                return 'P4 - Baixa';
            };

            const exportData = demands.map(d => {
                // demand_types is JSONB array of {id, name}
                let demandTypesStr = '';
                try {
                    const types = Array.isArray(d.demand_types) ? d.demand_types : JSON.parse(d.demand_types || '[]');
                    demandTypesStr = types.map(t => t.name || serviceMap.get(String(t.id)) || '').filter(Boolean).join(', ');
                } catch (e) { /* ignore */ }

                const row = {
                    demand_number: d.demand_number,
                    product: d.product,
                    status: d.status,
                    stage: d.stage,
                    priority_label: d.weight != null ? weightLabel(d.weight) : '',
                    product_type: d.product_type,
                    demand_types_names: demandTypesStr,
                    artifact: d.artifact,
                    value: d.value,
                    margem_bruta: d.margem_bruta,
                    margem_liquida: d.margem_liquida,
                    client_name: clientMap.get(d.client_id) || '',
                    analyst_name: userMap.get(d.analyst_id) || '',
                    requester_name: userMap.get(d.requester_id) || '',
                    support_analyst_name: userMap.get(d.support_analyst_id) || '',
                    architect_support_analyst_name: userMap.get(d.architect_support_analyst_id) || '',
                    cycle_name: cycleMap.get(d.cycle_id) || '',
                    created_date: d.created_date,
                    qualification_date: d.qualification_date,
                    expected_delivery_date: d.expected_delivery_date,
                    delivery_date: d.delivery_date,
                    delivery_date_change_reason: d.delivery_date_change_reason,
                    frozen_time_minutes: d.frozen_time_minutes,
                    observation: d.observation,
                };

                const columnMap = {
                    demand_number: 'Nº Demanda',
                    product: 'Produto',
                    status: 'Status',
                    stage: 'Etapa',
                    priority_label: 'Prioridade',
                    product_type: 'Tipo Produto',
                    demand_types_names: 'Tipos de Demanda',
                    artifact: 'Artefato',
                    value: 'Valor (R$)',
                    margem_bruta: 'Margem Bruta (%)',
                    margem_liquida: 'Margem Líquida (%)',
                    client_name: 'Cliente',
                    analyst_name: 'Analista Responsável',
                    requester_name: 'Executivo/Solicitante',
                    support_analyst_name: 'Suporte Pré-Vendas',
                    architect_support_analyst_name: 'Suporte Arquiteto',
                    cycle_name: 'Ciclo',
                    created_date: 'Data Criação',
                    qualification_date: 'Data Qualificação',
                    expected_delivery_date: 'Previsão Entrega',
                    delivery_date: 'Data Entrega Real',
                    delivery_date_change_reason: 'Motivo Alteração Prazo',
                    frozen_time_minutes: 'Tempo Congelado (min)',
                    observation: 'Última Observação/Anotação',
                };

                const mappedRow = {};
                Object.entries(columnMap).forEach(([key, displayName]) => {
                    let value = row[key];
                    // Format dates
                    if (value && typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
                        try { value = new Date(value).toLocaleDateString('pt-BR'); } catch (e) { /* keep */ }
                    }
                    // Format booleans
                    if (typeof value === 'boolean') value = value ? 'Sim' : 'Não';
                    mappedRow[displayName] = value ?? '';
                });
                return mappedRow;
            });

            const ws = XLSX.utils.json_to_sheet(exportData);
            // Auto-size columns
            const colWidths = Object.keys(exportData[0] || {}).map(key => ({
                wch: Math.max(key.length, ...exportData.slice(0, 100).map(row => String(row[key] || '').length)) + 2
            }));
            ws['!cols'] = colWidths;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Demandas');
            XLSX.writeFile(wb, `demandas_completas_cdpc_${new Date().toISOString().slice(0, 10)}.xlsx`);

            toast.success("Exportação completa concluída com sucesso!");
        } catch (err) {
            console.error('Full export error:', err);
            toast.error("Erro ao realizar exportação completa");
        } finally {
            setIsFullExporting(false);
        }
    };

    const exportToExcel = () => {
        const rows = filteredOptys.map(o => ({
            'Nº Demanda': o.demand_number || '',
            'Título': o.title,
            'Tipo Produto': o.product_type || '',
            'Tipos Demanda': o.demand_types ? o.demand_types.map(dt => dt.name).join(', ') : '',
            'Status': o.status,
            'Prioridade': o.priority,
            'Responsável': o.responsible,
            'Cliente': o.client,
            'Artefato': o.artifact,
            'Previsão Entrega': o.forecast,
            'Atraso (dias)': o.delay || 0,
            'Última Observação': o.observation || '',
            'Autor da Obs.': o.last_annotation_author || '',
            'Data da Obs.': o.last_annotation_date 
                ? new Date(o.last_annotation_date).toLocaleString('pt-BR')
                : '',
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        // Auto-width
        const colWidths = Object.keys(rows[0] || {}).map(k => ({ wch: Math.max(k.length, 20) }));
        ws['!cols'] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Demandas CDPC');
        const dateStr = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `CDPC_Demandas_${dateStr}.xlsx`);
    };

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

    const { data: demandServices = [] } = useQuery({
        queryKey: ['demand_services'],
        queryFn: () => fluxoApi.entities.DemandService.list()
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
                client_id: d.client_id,
                forecast: d.expected_delivery_date ? new Date(d.expected_delivery_date).toLocaleDateString('pt-BR') : '-',
                artifact: d.artifact || '-',
                delay: delay,
                isDelayed: delay > 0,
                pendency: d.current_pendency || null,
                observation: d.observation || null,
                is_legacy_observation: d.is_legacy_observation,
                last_annotation_author: d.last_annotation_author || null,
                last_annotation_date: d.last_annotation_date || null,
                weight: d.weight ?? 4,
                product_type: d.product_type,
                demand_types: d.demand_types || [],
                stage: d.stage,
                expected_delivery_date_raw: d.expected_delivery_date || null,
                delivery_date_raw: d.delivery_date || null
            };
        });
    }, [rawDemands, usersMap, clientsMap]);

    const filteredOptys = useMemo(() => {
        return allDemandsAsOptys.filter(opty => {
            const search = searchTerm.toLowerCase().trim();
            const matchesSearch = !search || 
                                opty.title.toLowerCase().includes(search) || 
                                opty.id.includes(search) || 
                                opty.client.toLowerCase().includes(search) ||
                                (opty.demand_number && opty.demand_number.toLowerCase().includes(search));
            
            const matchesResponsible = filters.responsible === 'Todos' || opty.responsible === filters.responsible;
            const matchesClient = filters.client === 'Todos' || opty.client === filters.client;
            
            let matchesStatus = true;
            if (filters.status === 'active') {
                matchesStatus = !['ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL'].includes(opty.status);
            } else if (filters.status !== 'Todos') {
                matchesStatus = opty.status === filters.status;
            }

            const matchesProductType = filters.productType === 'Todos' || opty.product_type === filters.productType;
            
            let matchesDemandType = true;
            if (filters.demandTypes.length > 0) {
                // If any of the selected filter types exist in the opty's demand_types
                matchesDemandType = filters.demandTypes.some(typeId => 
                    opty.demand_types.some(dt => String(dt.id) === String(typeId))
                );
            }

            const matchesStage = filters.stage === 'Todos' || opty.stage === filters.stage;
            
            return matchesSearch && matchesResponsible && matchesClient && matchesStatus && matchesProductType && matchesDemandType && matchesStage;
        });
    }, [allDemandsAsOptys, searchTerm, filters]);

    const metrics = useMemo(() => {
        const baseData = filteredOptys.length > 0 ? filteredOptys : allDemandsAsOptys;
        const activeOptys = filteredOptys.filter(o => !['ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL'].includes(o.status));
        
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

    const clientsList = useMemo(() => {
        const names = [...new Set(allDemandsAsOptys.map(o => o.client))].sort();
        return ['Todos', ...names];
    }, [allDemandsAsOptys]);

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
        <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-x-hidden">
            {/* Top Navigation / Header - Premium Glassmorphism */}
            <header className="sticky top-0 z-50 w-full bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-700/50 shadow-2xl transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-5">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-indigo-600/20 p-2.5 rounded-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                        >
                            <BarChart3 className="w-7 h-7 text-indigo-400" />
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight uppercase leading-none mb-1.5 flex items-center gap-2">
                                Acompanhamento de Propostas
                                <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full font-bold">ALPHA v1</span>
                            </h1>
                            <div className="flex items-center gap-3 text-slate-400">
                                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Activity className="w-2.5 h-2.5" /> Dashboard Administrativo
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-slate-800/40 p-1.5 rounded-xl flex border border-slate-700/50 backdrop-blur-sm self-stretch">
                            <button 
                                onClick={() => setViewMode('geral')}
                                className={cn(
                                    "px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all duration-300 flex items-center gap-2",
                                    viewMode === 'geral' 
                                        ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                )}
                            >
                                <LayoutGrid className="w-3 h-3" /> Visão Geral
                            </button>
                            <button 
                                onClick={() => setViewMode('lista')}
                                className={cn(
                                    "px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all duration-300 flex items-center gap-2",
                                    viewMode === 'lista' 
                                        ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                )}
                            >
                                <List className="w-3 h-3" /> Lista Detalhada
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-[1600px] mx-auto px-6 mt-8 space-y-8"
            >
                {/* Global Filters - Premium Look */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/60 p-5 flex flex-wrap items-end gap-6">
                    <div className="flex-1 min-w-[300px] group">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex items-center gap-1.5">
                            <Search className="w-3 h-3" /> Buscar Proposta
                        </p>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <Search className="w-full h-full" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Buscar por ID, Número ou Título..."
                                className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-56">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex items-center gap-1.5">
                            <User className="w-3 h-3" /> Responsável
                        </p>
                        <div className="relative">
                            <select 
                                className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all cursor-pointer"
                                value={filters.responsible}
                                onChange={(e) => setFilters(prev => ({ ...prev, responsible: e.target.value }))}
                            >
                                {responsiblesList.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-270 pointer-events-none" />
                        </div>
                    </div>

                    <div className="w-56">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex items-center gap-1.5">
                            <Filter className="w-3 h-3" /> Status
                        </p>
                        <div className="relative">
                            <select 
                                className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all cursor-pointer"
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                {statuses.map(s => <option key={s} value={s}>{s === 'active' ? '🔥 Pendentes' : s}</option>)}
                            </select>
                            <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-270 pointer-events-none" />
                        </div>
                    </div>

                    <div className="w-48">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex items-center gap-1.5">
                            <Building2 className="w-3 h-3" /> Cliente
                        </p>
                        <div className="relative">
                            <select 
                                className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all cursor-pointer"
                                value={filters.client}
                                onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
                            >
                                {clientsList.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-270 pointer-events-none" />
                        </div>
                    </div>

                    <div className="w-48">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex items-center gap-1.5">
                            <Package className="w-3 h-3" /> Tipo Produto
                        </p>
                        <div className="relative">
                            <select 
                                className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all cursor-pointer"
                                value={filters.productType}
                                onChange={(e) => setFilters(prev => ({ ...prev, productType: e.target.value }))}
                            >
                                <option value="Todos">Todos</option>
                                <option value="APP">APP</option>
                                <option value="ITO">ITO</option>
                                <option value="APP + ITO">APP + ITO</option>
                            </select>
                            <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-270 pointer-events-none" />
                        </div>
                    </div>

                    <div className="w-64">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3" /> Tipo Serviço
                        </p>
                        <Popover open={openDemandTypeFilter} onOpenChange={setOpenDemandTypeFilter}>
                            <PopoverTrigger asChild>
                                <button
                                    className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm text-left flex justify-between items-center focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all h-[48px]"
                                >
                                    <span className="truncate">
                                        {filters.demandTypes.length === 0 
                                            ? "Todos" 
                                            : `${filters.demandTypes.length} serviço(s) selecionado(s)`}
                                    </span>
                                    <ChevronLeft className="w-4 h-4 text-slate-400 rotate-270" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Buscar serviço..." />
                                    <CommandList>
                                        <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
                                        <CommandGroup>
                                            {demandServices.filter(s => s.active !== false).map((service) => {
                                                const isSelected = filters.demandTypes.includes(String(service.id));
                                                return (
                                                    <CommandItem
                                                        key={service.id}
                                                        value={service.name}
                                                        onSelect={() => {
                                                            setFilters(prev => {
                                                                const newDemandTypes = isSelected
                                                                    ? prev.demandTypes.filter(id => id !== String(service.id))
                                                                    : [...prev.demandTypes, String(service.id)];
                                                                return { ...prev, demandTypes: newDemandTypes };
                                                            });
                                                        }}
                                                    >
                                                        <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                        <span>{service.name}</span>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="w-48">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest flex items-center gap-1.5">
                            <Layers className="w-3 h-3" /> Etapa
                        </p>
                        <div className="relative">
                            <select 
                                className="w-full bg-slate-100/50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm appearance-none outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-bold text-slate-700 transition-all cursor-pointer"
                                value={filters.stage}
                                onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                            >
                                <option value="Todos">Todas as Etapas</option>
                                <option value="Triagem">Triagem</option>
                                <option value="Qualificação">Qualificação</option>
                                <option value="PO">PO</option>
                                <option value="OO">OO</option>
                                <option value="RT">RT</option>
                                <option value="ESP">ESP</option>
                            </select>
                            <ChevronLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-270 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleFullExport}
                            disabled={isFullExporting}
                            title="Exportação Completa (Todos os dados)"
                            className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-3.5 rounded-2xl hover:bg-emerald-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isFullExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportToExcel}
                            disabled={filteredOptys.length === 0}
                            title="Exportar dados filtrados para Excel"
                            className="bg-indigo-50 text-indigo-600 border border-indigo-200 p-3.5 rounded-2xl hover:bg-indigo-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <Download className="w-5 h-5" />
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => refetch()}
                            disabled={loadingDemands}
                            title="Atualizar dados"
                            className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loadingDemands ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>

                {/* Dashboard Modes */}
                {loadingDemands ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse uppercase text-xs tracking-widest">Carregando dados reais...</p>
                    </div>
                ) : viewMode === 'geral' ? (
                    <div className="space-y-8">
                        <OptyKpis metrics={metrics} loading={false} />
                        <OptyCharts data={filteredOptys} loading={false} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-8 h-1 bg-indigo-500 rounded-full" />
                                {filteredOptys.length} OPORTUNIDADES ENCONTRADAS
                            </h3>
                        </div>
                        <AnimatePresence mode="popLayout">
                            <motion.div 
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredOptys.map((opty, idx) => (
                                    <motion.div
                                        key={opty.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <OptyCard opty={opty} onDetailClick={handleDetailClick} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                        {filteredOptys.length === 0 && (
                            <div className="bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Nenhuma Opty corresponde aos filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Float Summary (Only in List Mode) - Premium Floating Dock */}
            <AnimatePresence>
                {viewMode === 'lista' && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl text-white px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-700/50 flex items-center gap-10 z-50"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Volumetría</span>
                            <span className="text-2xl font-black tabular-nums">{metrics.total}</span>
                        </div>
                        <div className="h-10 w-px bg-slate-700/50" />
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-rose-500/80 uppercase tracking-[0.3em] mb-1">Atrasadas</span>
                            <span className="text-2xl font-black text-rose-500 tabular-nums">{metrics.delayed}</span>
                        </div>
                        <div className="h-10 w-px bg-slate-700/50" />
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Em Curso</span>
                            <span className="text-2xl font-black text-indigo-400 tabular-nums">{metrics.inProgress}</span>
                        </div>
                        <div className="ml-4 h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="p-3 hover:bg-indigo-600 rounded-full transition-all text-indigo-400 hover:text-white"
                            >
                                <ChevronLeft className="w-5 h-5 rotate-90" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Demand Detail Modal */}
            <DemandDetailModal 
                demandId={selectedDemandId}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
