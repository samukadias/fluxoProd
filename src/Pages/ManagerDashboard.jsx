import React, { useState, useEffect, useMemo } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { FileText, Clock, AlertTriangle, CheckCircle2, TrendingUp, Layers, Briefcase, Timer, List } from "lucide-react";
import { Button } from "@/Components/ui/button";
import StatsCard from '@/Components/dashboard/StatsCard';
import BottleneckChart from '@/Components/dashboard/BottleneckChart';
import BottleneckBarChart from '@/Components/dashboard/BottleneckBarChart';
import ComplexityChart from '@/Components/dashboard/ComplexityChart';
import QualifiedDemandsChart from '@/Components/dashboard/QualifiedDemandsChart';
import { calculateWorkDays } from '@/Components/demands/EffortCalculator';
import { isAfter, parseISO, format, getYear } from 'date-fns';

const ACTIVE_STATUSES = [
    "PENDENTE TRIAGEM",
    "DESIGNADA",
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "CORREÇÃO",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA FORNECEDOR"
];

const TRATATIVA_STATUSES = [
    "EM ANDAMENTO",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA FORNECEDOR",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS"
];

const CLOSED_STATUSES = ["ENTREGUE", "CANCELADA", "TRIAGEM NÃO ELEGÍVEL"];


export default function ManagerDashboard() {
    const currentYear = getYear(new Date());
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedAnalyst, setSelectedAnalyst] = useState('all');
    const [selectedFilter, setSelectedFilter] = useState(null); // 'backlog', 'tratativa', 'open', 'overdue', 'delivered', 'total'
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('fluxo_user') || localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const { data: demands = [] } = useQuery({
        queryKey: ['demands'],
        queryFn: () => fluxoApi.entities.Demand.list()
    });

    const { data: history = [] } = useQuery({
        queryKey: ['all-history'],
        queryFn: () => fluxoApi.entities.StatusHistory.list()
    });

    const { data: stageHistory = [] } = useQuery({
        queryKey: ['stage-history'],
        queryFn: () => fluxoApi.entities.StageHistory.list()
    });

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: () => fluxoApi.entities.User.list()
    });

    const analysts = useMemo(() => {
        return users.filter(u =>
            ['analyst', 'manager', 'admin', 'general_manager'].includes(u.role) &&
            (!u.department || u.department === 'CDPC')
        );
    }, [users]);

    const { data: requesters = [] } = useQuery({
        queryKey: ['requesters'],
        queryFn: () => fluxoApi.entities.Requester.list()
    });

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: () => fluxoApi.entities.Holiday.list()
    });

    const currentAnalyst = useMemo(() => {
        if (!user || (user.role !== 'analyst' && user.perfil !== 'ANALISTA')) return null;
        return analysts.find(a =>
            a.email?.toLowerCase() === user.email?.toLowerCase() ||
            a.name?.toLowerCase() === user.name?.toLowerCase() ||
            a.name?.toLowerCase() === user.full_name?.toLowerCase()
        );
    }, [user, analysts]);

    const currentRequester = useMemo(() => {
        // Se o usuario for solicitante, tenta achar ele na lista de solicitantes pelo email
        if (!user || user.role !== 'requester') return null;
        // Assume que demands tem requester_id ou requester_email
        // Se a tabela demands tem requester_id, precisamos do ID.
        return requesters.find(r => r.email === user.email);
    }, [user, requesters]);

    useEffect(() => {
        if (currentAnalyst) {
            setSelectedAnalyst(currentAnalyst.id);
        }
    }, [currentAnalyst]);

    const years = useMemo(() => {
        const yearsSet = new Set();
        demands.forEach(d => {
            if (d.created_date) {
                yearsSet.add(String(getYear(parseISO(d.created_date))));
            }
        });
        yearsSet.add(String(currentYear));
        return Array.from(yearsSet).sort().reverse();
    }, [demands, currentYear]);

    const filteredDemands = useMemo(() => {
        return demands.filter(d => {
            if (d.created_date) {
                const demandYear = String(getYear(parseISO(d.created_date)));
                if (demandYear !== selectedYear) return false;
            }

            // PERMISSÕES:
            // Analista: Apenas suas demandas
            // Se for analista (role ou perfil), OBRIGATORIAMENTE filtra
            if (user?.role === 'analyst' || user?.perfil === 'ANALISTA') {
                if (currentAnalyst) {
                    return d.analyst_id === currentAnalyst.id;
                }
                // Se é analista mas não achamos o cadastro dele na tabela 'analysts', 
                // por segurança não mostra nada (ou vaza tudo)
                return false;
            }

            // Solicitante: Apenas demandas que ele solicitou
            if (currentRequester) {
                // Verifica se bate o ID ou se o nome do solicitante bate (caso o backend retorne o nome direto)
                return d.requester_id === currentRequester.id || d.requester_name === currentRequester.name;
            }

            if (selectedAnalyst !== 'all' && d.analyst_id !== selectedAnalyst) return false;
            return true;
        });
    }, [demands, selectedYear, selectedAnalyst, currentAnalyst, currentRequester, user]);

    // Map for quick lookup
    const usersMap = useMemo(() => {
        return users.reduce((acc, u) => {
            acc[u.id] = u.name;
            return acc;
        }, {});
    }, [users]);

    const detailedDemands = useMemo(() => {
        if (!selectedFilter) return [];

        return filteredDemands.filter(d => {
            switch (selectedFilter) {
                case 'backlog':
                    return ["PENDENTE TRIAGEM", "TRIAGEM NÃO ELEGÍVEL", "DESIGNADA"].includes(d.status);
                case 'tratativa':
                    return TRATATIVA_STATUSES.includes(d.status);
                case 'open':
                    return ACTIVE_STATUSES.includes(d.status) && d.status !== 'CONGELADA';
                case 'overdue':
                    return d.expected_delivery_date &&
                        ACTIVE_STATUSES.includes(d.status) &&
                        isAfter(new Date(), parseISO(d.expected_delivery_date));
                case 'delivered':
                    return d.status === 'ENTREGUE';
                default: // 'total'
                    return true;
            }
        });
    }, [filteredDemands, selectedFilter]);

    const getFilterTitle = () => {
        switch (selectedFilter) {
            case 'backlog': return 'Demandas em Backlog';
            case 'tratativa': return 'Demandas em Tratativa';
            case 'open': return 'Demandas em Aberto';
            case 'overdue': return 'Demandas Atrasadas';
            case 'delivered': return 'Demandas Entregues';
            default: return 'Todas as Demandas';
        }
    };

    const stats = useMemo(() => {
        const total = filteredDemands.length;

        // Backlog: PENDENTE TRIAGEM, TRIAGEM NÃO ELEGÍVEL, DESIGNADA
        const backlog = filteredDemands.filter(d =>
            ["PENDENTE TRIAGEM", "TRIAGEM NÃO ELEGÍVEL", "DESIGNADA"].includes(d.status)
        ).length;

        // Em Tratativa
        const tratativa = filteredDemands.filter(d =>
            TRATATIVA_STATUSES.includes(d.status)
        ).length;

        // Open: Active Statuses AND NOT CONGELADA
        const open = filteredDemands.filter(d =>
            ACTIVE_STATUSES.includes(d.status) && d.status !== 'CONGELADA'
        ).length;

        const overdue = filteredDemands.filter(d =>
            d.expected_delivery_date &&
            ACTIVE_STATUSES.includes(d.status) &&
            isAfter(new Date(), parseISO(d.expected_delivery_date))
        ).length;
        const delivered = filteredDemands.filter(d => d.status === 'ENTREGUE').length;

        return { total, backlog, tratativa, open, overdue, delivered };
    }, [filteredDemands]);

    const bottleneckData = useMemo(() => {
        const demandIds = new Set(filteredDemands.map(d => d.id));
        const filteredHistory = history.filter(h => demandIds.has(h.demand_id));

        const statusTotals = {};
        filteredHistory.forEach(h => {
            if (h.from_status && h.time_in_previous_status_minutes) {
                if (!statusTotals[h.from_status]) {
                    statusTotals[h.from_status] = { total_minutes: 0, count: 0 };
                }
                statusTotals[h.from_status].total_minutes += h.time_in_previous_status_minutes;
                statusTotals[h.from_status].count += 1;
            }
        });

        return Object.entries(statusTotals).map(([status, data]) => ({
            status,
            total_minutes: data.total_minutes,
            count: data.count
        }));
    }, [filteredDemands, history]);

    const complexityData = useMemo(() => {
        const completedDemands = filteredDemands.filter(d =>
            d.status === 'ENTREGUE' && d.qualification_date && d.delivery_date
        );

        const complexityGroups = { Baixa: [], Média: [], Alta: [] };

        completedDemands.forEach(d => {
            const workDays = calculateWorkDays(d.qualification_date, d.delivery_date, holidays);
            const frozenDays = Math.floor((d.frozen_time_minutes || 0) / (60 * 24));
            const effectiveDays = Math.max(0, workDays - frozenDays);

            if (complexityGroups[d.complexity]) {
                complexityGroups[d.complexity].push(effectiveDays);
            }
        });

        const averages = {};
        Object.entries(complexityGroups).forEach(([complexity, days]) => {
            if (days.length > 0) {
                averages[complexity] = days.reduce((a, b) => a + b, 0) / days.length;
            }
        });

        return averages;
    }, [filteredDemands, holidays]);

    // SLA Metrics
    const slaData = useMemo(() => {
        // SLA por Status: Average minutes per status
        const statusAvg = {};
        bottleneckData.forEach(d => {
            statusAvg[d.status] = d.count > 0 ? Math.round(d.total_minutes / d.count) : 0;
        });

        // SLA Geral: Avg days from qualification_date to delivery_date (delivered only)
        // Fallback: use status_history to find when status changed to ENTREGUE
        const allDelivered = filteredDemands.filter(d => d.status === 'ENTREGUE');

        const delivered = allDelivered.filter(d => {
            // Must have qualification_date
            if (!d.qualification_date) return false;
            // Must have delivery_date OR we can find it in history
            if (d.delivery_date) return true;
            // Check history for ENTREGUE transition
            const demandHistory = history.filter(h => h.demand_id === d.id && h.to_status === 'ENTREGUE');
            return demandHistory.length > 0;
        });

        let avgDeliveryDays = 0;
        if (delivered.length > 0) {
            const totalDays = delivered.reduce((sum, d) => {
                // Get delivery date from field or fallback to history
                let deliveryDateStr = d.delivery_date;
                if (!deliveryDateStr) {
                    const demandHistory = history.filter(h => h.demand_id === d.id && h.to_status === 'ENTREGUE');
                    if (demandHistory.length > 0) {
                        // Use the timestamp of the ENTREGUE transition
                        deliveryDateStr = demandHistory[demandHistory.length - 1].changed_at;
                    }
                }
                if (!deliveryDateStr) return sum;

                const workDays = calculateWorkDays(d.qualification_date, deliveryDateStr, holidays);
                const frozenDays = Math.floor((d.frozen_time_minutes || 0) / (60 * 24));
                return sum + Math.max(0, workDays - frozenDays);
            }, 0);
            avgDeliveryDays = Math.round(totalDays / delivered.length * 10) / 10;
        }

        return { statusAvg, avgDeliveryDays, deliveredCount: delivered.length };
    }, [bottleneckData, filteredDemands, holidays, history]);

    // CDPC Stage SLA
    const stageSlaData = useMemo(() => {
        const stageTotals = {}; // { StageName: { totalMinutes: 0, count: 0 } }

        stageHistory.forEach(h => {
            if (h.stage && h.duration_minutes) {
                if (!stageTotals[h.stage]) {
                    stageTotals[h.stage] = { totalMinutes: 0, count: 0 };
                }
                stageTotals[h.stage].totalMinutes += h.duration_minutes;
                stageTotals[h.stage].count += 1;
            }
        });

        const averages = Object.entries(stageTotals).map(([stage, data]) => ({
            stage,
            avgDays: data.count > 0 ? (data.totalMinutes / 1440).toFixed(1) : 0
        })).sort((a, b) => {
            // Sort by logical order if possible
            const order = ["Triagem", "Qualificação", "PO", "OO", "RT", "KIT"];
            return order.indexOf(a.stage) - order.indexOf(b.stage);
        });

        return averages;
    }, [stageHistory]);

    const isManager = user?.role === 'manager' || user?.perfil === 'GESTOR' || user?.department === 'GOR' || (user?.department === 'CDPC' && user?.role === 'manager');
    const isRequester = user?.role === 'requester';
    const isAnalystCDPC = (user?.role === 'analyst' || user?.perfil === 'ANALISTA') && user?.department === 'CDPC';

    return (
        <div className="p-6 min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Dashboard CDPC
                            {(user?.name || user?.full_name) && (
                                <span className="text-lg sm:text-2xl font-normal text-slate-500">
                                    | Olá, <span className="text-indigo-600">{(user.name || user.full_name).split(' ')[0]}</span>
                                </span>
                            )}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {isRequester ? "Minhas Solicitações" : "Visão geral e análise de gargalos"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-28 bg-white">
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(y => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isManager && (
                            <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
                                <SelectTrigger className="w-48 bg-white">
                                    <SelectValue placeholder="Responsável" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Responsáveis</SelectItem>
                                    {analysts.map(a => (
                                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAnalystCDPC ? 'lg:grid-cols-5' : 'lg:grid-cols-6'} gap-4 mb-8`}>
                    <StatsCard
                        title="Total de Demandas"
                        value={stats.total}
                        icon={FileText}
                        type="default"
                        onClick={() => setSelectedFilter(selectedFilter === 'total' ? null : 'total')}
                    />
                    {/* Hide Backlog for Analyst CDPC */}
                    {!isAnalystCDPC && (
                        <StatsCard
                            title="Backlog"
                            value={stats.backlog}
                            icon={Layers}
                            type="info"
                            onClick={() => setSelectedFilter(selectedFilter === 'backlog' ? null : 'backlog')}
                        />
                    )}
                    <StatsCard
                        title="Em Tratativa"
                        value={stats.tratativa}
                        icon={Briefcase}
                        type="purple"
                        onClick={() => setSelectedFilter(selectedFilter === 'tratativa' ? null : 'tratativa')}
                    />
                    <StatsCard
                        title="Em Aberto"
                        value={stats.open}
                        icon={Clock}
                        type="warning"
                        onClick={() => setSelectedFilter(selectedFilter === 'open' ? null : 'open')}
                    />
                    <StatsCard
                        title="Atrasadas"
                        value={stats.overdue}
                        icon={AlertTriangle}
                        type="danger"
                        onClick={() => setSelectedFilter(selectedFilter === 'overdue' ? null : 'overdue')}
                    />
                    <StatsCard
                        title="Entregues"
                        value={stats.delivered}
                        icon={CheckCircle2}
                        type="success"
                        onClick={() => setSelectedFilter(selectedFilter === 'delivered' ? null : 'delivered')}
                    />
                </div>

                {/* Filtered Demands List (Drill Down) */}
                {selectedFilter && (
                    <Card className="mb-8 border-slate-200 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 border-b border-slate-100">
                            <div>
                                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                                    <List className="w-5 h-5 text-indigo-600" />
                                    {getFilterTitle()}
                                </CardTitle>
                                <p className="text-sm text-slate-500 mt-1">
                                    Exibindo {detailedDemands.length} registros
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedFilter(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                Fechar
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto max-h-[400px]">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Produto / Demanda</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Responsável</th>
                                            <th className="px-6 py-3">Previsão</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {detailedDemands.length > 0 ? detailedDemands.map(d => (
                                            <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 w-[100px]">
                                                    #{d.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-800">{d.product}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">{d.title || d.project_name || 'Sem título'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${d.status === 'ENTREGUE' ? 'bg-emerald-100 text-emerald-700' :
                                                            d.status === 'CANCELADA' ? 'bg-slate-100 text-slate-600' :
                                                                d.status === 'ATRASADA' || (d.expected_delivery_date && isAfter(new Date(), parseISO(d.expected_delivery_date)) && ACTIVE_STATUSES.includes(d.status)) ? 'bg-red-100 text-red-700' :
                                                                    'bg-blue-100 text-blue-700'}`}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {usersMap[d.analyst_id] || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                                                    {d.expected_delivery_date ? format(parseISO(d.expected_delivery_date), 'dd/MM/yyyy') : '-'}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                                    Nenhuma demanda encontrada para este filtro.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SLA Section - Visible to all (non-requesters) */}
                {!isRequester && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Timer className="w-5 h-5 text-indigo-600" />
                                Análise de SLA
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                Tempo médio em cada status e tempo médio de entrega
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* SLA Geral */}
                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                                    <p className="text-sm font-medium opacity-80">SLA Geral (Média de Entrega)</p>
                                    <p className="text-4xl font-bold mt-2">
                                        {slaData.avgDeliveryDays} <span className="text-lg font-normal">dias úteis</span>
                                    </p>
                                    <p className="text-xs opacity-70 mt-2">
                                        Baseado em {slaData.deliveredCount} demandas entregues
                                    </p>
                                </div>

                                {/* SLA por Status */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="text-xs text-slate-600 uppercase bg-slate-100">
                                            <tr>
                                                <th className="px-3 py-2 text-left">Status</th>
                                                <th className="px-3 py-2 text-right">Tempo Médio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(slaData.statusAvg)
                                                .sort((a, b) => b[1] - a[1])
                                                .slice(0, 8)
                                                .map(([status, minutes]) => (
                                                    <tr key={status} className="border-b hover:bg-slate-50">
                                                        <td className="px-3 py-2 font-medium text-slate-700">{status}</td>
                                                        <td className="px-3 py-2 text-right text-slate-500">
                                                            {(minutes / 1440).toFixed(1)} dias
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* CDPC Stage SLA */}
                {!isRequester && stageSlaData.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layers className="w-5 h-5 text-indigo-600" />
                                SLA por Etapa (CDPC)
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                Tempo médio de permanência em cada etapa do fluxo
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                {stageSlaData.map((item) => (
                                    <div key={item.stage} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 truncate" title={item.stage}>
                                            {item.stage}
                                        </div>
                                        <div className="text-xl font-bold text-slate-700">
                                            {item.avgDays} <span className="text-sm font-normal text-slate-400">dias</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!isRequester && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    {isManager ? 'Relação Volume x Lentidão' : 'Mapa de Calor - Gargalos'}
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    {isManager
                                        ? 'Identifique se o gargalo é por volume (x) ou demora (y)'
                                        : 'Tempo acumulado em cada status'}
                                </p>
                            </CardHeader>
                            <CardContent>
                                {isManager
                                    ? <BottleneckChart data={bottleneckData} />
                                    : <BottleneckBarChart data={bottleneckData} />
                                }
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                    Tempo Médio por Complexidade
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Dias úteis médios para conclusão por nível
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ComplexityChart data={complexityData} />
                            </CardContent>
                        </Card>
                    </div>
                )}

                {isRequester && (
                    <Card className="col-span-1 lg:col-span-2 mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                Demandas em Aberto
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                Acompanhe o status das suas solicitações pendentes
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3">ID</th>
                                            <th className="px-4 py-3">Título</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Data Prevista</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDemands
                                            .filter(d => ACTIVE_STATUSES.includes(d.status))
                                            .map(d => (
                                                <tr key={d.id} className="border-b hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium">#{d.id}</td>
                                                    <td className="px-4 py-3">{d.title || d.project_name || 'Sem Título'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                            {d.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {d.expected_delivery_date ? format(parseISO(d.expected_delivery_date), 'dd/MM/yyyy') : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        {filteredDemands.filter(d => ACTIVE_STATUSES.includes(d.status)).length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                                                    Nenhuma demanda em aberto encontrada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isManager && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    Mapa de Calor - Visão Geral
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Tempo total acumulado de todas as demandas em cada etapa
                                </p>
                            </CardHeader>
                            <CardContent>
                                <BottleneckBarChart data={bottleneckData} />
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                    Demandas Qualificadas
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Volume de demandas qualificadas por período
                                </p>
                            </CardHeader>
                            <CardContent>
                                <QualifiedDemandsChart demands={demands} />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    );
}
