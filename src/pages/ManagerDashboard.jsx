import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { fluxoApi } from '@/api/fluxoClient';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, AlertTriangle, CheckCircle2, TrendingUp, Layers, Briefcase, Timer, List, RotateCcw, X, ExternalLink, CalendarClock, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from '@/components/dashboard/StatsCard';
import BottleneckChart from '@/components/dashboard/BottleneckChart';
import BottleneckBarChart from '@/components/dashboard/BottleneckBarChart';
import ComplexityChart from '@/components/dashboard/ComplexityChart';
import QualifiedDemandsChart from '@/components/dashboard/QualifiedDemandsChart';
import CancelledRankingChart from '@/components/dashboard/CancelledRankingChart';
import ReopeningReasonsChart from '@/components/dashboard/ReopeningReasonsChart';
import { calculateWorkDays } from '@/Components/demands/EffortCalculator';
import { isAfter, parseISO, format, getYear, subMonths, isSameMonth } from 'date-fns';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import WeeklyTrackingTab from '@/components/dashboard/WeeklyTrackingTab';
import ResumoTab from '@/components/dashboard/ResumoTab';
import FlowEfficiencyTab from '@/components/dashboard/FlowEfficiencyTab';
import PresidencialTab from '@/components/dashboard/PresidencialTab';
import {
    ChartCardSkeleton,
    NextLastDeliveriesSkeleton,
    SlaSectionSkeleton,
    StageSlaSkeleton,
    DoubleChartSkeleton,
    ManagerAdditionalChartsSkeleton,
    WeeklyTrackingSkeleton,
    ResumoTabSkeleton,
    FlowEfficiencySkeleton,
    RequesterOpenDemandsSkeleton
} from '@/components/dashboard/DashboardSkeletons';

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
    "PENDÊNCIA SUPRIMENTOS",
    "PENDÊNCIA FORNECEDOR"
];

const TRATATIVA_STATUSES = [
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "CORREÇÃO",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA SUPRIMENTOS",
    "PENDÊNCIA FORNECEDOR",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS"
];

const CLOSED_STATUSES = ["ENTREGUE", "CANCELADA", "TRIAGEM NÃO ELEGÍVEL"];


export default function ManagerDashboard() {
    const { user } = useAuth();
    const currentYear = getYear(new Date());
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedEntryMonth, setSelectedEntryMonth] = useState('all');
    const [selectedDeliveryMonth, setSelectedDeliveryMonth] = useState('all');
    const [selectedAnalyst, setSelectedAnalyst] = useState('all');
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [selectedHeatmapStatus, setSelectedHeatmapStatus] = useState(null);
    const [selectedExec, setSelectedExec] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');

    const { data: demands = [], isLoading: isLoadingDemands } = useQuery({
        queryKey: ['demands'],
        queryFn: () => fluxoApi.entities.Demand.list()
    });

    const { data: history = [], isLoading: isLoadingHistory } = useQuery({
        queryKey: ['all-history'],
        queryFn: () => fluxoApi.entities.StatusHistory.list()
    });

    const { data: stageHistory = [], isLoading: isLoadingStageHistory } = useQuery({
        queryKey: ['stage-history'],
        queryFn: () => fluxoApi.entities.StageHistory.list()
    });

    const { data: users = [], isLoading: isLoadingUsers } = useQuery({
        queryKey: ['users'],
        queryFn: () => fluxoApi.entities.User.list()
    });

    const analysts = useMemo(() => {
        return users.filter(u =>
            ['analyst', 'manager', 'admin', 'general_manager'].includes(u.role) &&
            (!u.department || u.department === 'CDPC')
        );
    }, [users]);

    const { data: requesters = [], isLoading: isLoadingRequesters } = useQuery({
        queryKey: ['requesters'],
        queryFn: () => fluxoApi.entities.Requester.list()
    });

    const { data: holidays = [], isLoading: isLoadingHolidays } = useQuery({
        queryKey: ['holidays'],
        queryFn: () => fluxoApi.entities.Holiday.list()
    });

    const { data: clients = [], isLoading: isLoadingClients } = useQuery({
        queryKey: ['clients'],
        queryFn: () => fluxoApi.entities.Client.list()
    });

    const { data: cdpcMetrics = {}, isLoading: isLoadingMetrics } = useQuery({
        queryKey: ['cdpc-metrics', selectedYear],
        queryFn: () => fluxoApi.metrics.cdpc({ year: selectedYear })
    });

    const { data: cycles = [], isLoading: isLoadingCycles } = useQuery({
        queryKey: ['cycles'],
        queryFn: () => fluxoApi.entities.Cycle.list()
    });

    const isDashboardLoading = isLoadingDemands || isLoadingHistory || isLoadingStageHistory || isLoadingUsers || isLoadingHolidays || isLoadingMetrics || isLoadingClients || isLoadingRequesters || isLoadingCycles;


    const currentAnalyst = useMemo(() => {
        if (!user || (user.role !== 'analyst' && user.perfil !== 'ANALISTA')) return null;
        // Try to find by email first (most reliable), then by name
        return analysts.find(a =>
            a.email?.toLowerCase() === user.email?.toLowerCase() ||
            a.name?.toLowerCase() === user.name?.toLowerCase() ||
            a.name?.toLowerCase() === user.full_name?.toLowerCase()
        ) || null;
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
            const refDate = d.qualification_date || d.created_date;
            if (refDate) {
                yearsSet.add(String(getYear(parseISO(refDate))));
            }
        });
        yearsSet.add(String(currentYear));
        return Array.from(yearsSet).sort().reverse();
    }, [demands, currentYear]);

    const filteredDemands = useMemo(() => {
        return demands.filter(d => {
            const refDate = d.qualification_date || d.created_date;
            const delivDate = d.delivery_date;

            // Filtro por Safra (Ano)
            if (selectedYear !== 'all') {
                if (refDate) {
                    const demandYear = String(getYear(parseISO(refDate)));
                    if (demandYear !== selectedYear) return false;
                } else {
                    return false;
                }
            }

            // Filtro por Mês (Entrada/Safra)
            if (selectedEntryMonth !== 'all') {
                if (!refDate) return false;
                const entryMonthStr = String(parseISO(refDate).getMonth() + 1).padStart(2, '0');
                if (entryMonthStr !== selectedEntryMonth) return false;
            }

            // Filtro por Mês (Entrega)
            if (selectedDeliveryMonth !== 'all') {
                if (!delivDate) return false;
                const delivMonthStr = String(parseISO(delivDate).getMonth() + 1).padStart(2, '0');
                if (delivMonthStr !== selectedDeliveryMonth) return false;
            }

            // PERMISSÕES:
            // Analista: Apenas suas demandas
            if (user?.role === 'analyst') {
                if (currentAnalyst) {
                    // Match via analysts table (email/name linked)
                    return d.analyst_id === currentAnalyst.id;
                }
                // Fallback: match directly by user ID in case the analyst
                // has no corresponding entry in the 'analysts' table.
                // This prevents the dashboard from showing empty for valid analysts.
                if (user.id) {
                    return d.analyst_id === user.id;
                }
                // If we truly can't identify the analyst, show nothing for safety
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
    }, [demands, selectedYear, selectedEntryMonth, selectedDeliveryMonth, selectedAnalyst, currentAnalyst, currentRequester, user]);

    const executiveCanceledDetails = useMemo(() => {
        if (!selectedExec) return [];
        return demands.filter(d => {
            const refDate = d.qualification_date || d.created_date;
            const demandYear = refDate ? String(getYear(parseISO(refDate))) : null;

            const matchesExec = selectedExec.id === null
                ? (d.requester_id === null || d.requester_id === "" || d.requester_id === 0)
                : String(d.requester_id) === String(selectedExec.id);

            const matchesYear = selectedYear === 'all' || demandYear === selectedYear;
            return matchesExec && d.status === 'CANCELADA' && matchesYear;
        });
    }, [selectedExec, demands, selectedYear]);

    const handleExecClick = (item) => {
        setSelectedExec(item);
        setIsDetailsOpen(true);
    };

    // Map for quick lookup
    const usersMap = useMemo(() => {
        return users.reduce((acc, u) => {
            acc[u.id] = u.name;
            return acc;
        }, {});
    }, [users]);

    const clientsMap = useMemo(() => {
        return clients.reduce((acc, c) => {
            acc[c.id] = c.name;
            return acc;
        }, {});
    }, [clients]);

    const nextDeliveries = useMemo(() => {
        return [...filteredDemands]
            .filter(d => ACTIVE_STATUSES.includes(d.status) && d.status !== 'CONGELADA')
            .sort((a, b) => {
                if (!a.expected_delivery_date) return 1;
                if (!b.expected_delivery_date) return -1;
                return new Date(a.expected_delivery_date) - new Date(b.expected_delivery_date);
            })
            .slice(0, 5);
    }, [filteredDemands]);

    const lastDeliveries = useMemo(() => {
        return [...filteredDemands]
            .filter(d => d.status === 'ENTREGUE' && d.delivery_date)
            .sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date))
            .slice(0, 5);
    }, [filteredDemands]);

    const detailedDemands = useMemo(() => {

        return filteredDemands.filter(d => {
            switch (selectedFilter) {
                case 'backlog':
                    return ["PENDENTE TRIAGEM", "DESIGNADA"].includes(d.status);
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

        // Backlog: PENDENTE TRIAGEM, DESIGNADA
        const backlog = filteredDemands.filter(d =>
            ["PENDENTE TRIAGEM", "DESIGNADA"].includes(d.status)
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

        // Group history by demand to compute durations from timestamps
        const byDemand = {};
        filteredHistory.forEach(h => {
            if (!byDemand[h.demand_id]) byDemand[h.demand_id] = [];
            byDemand[h.demand_id].push(h);
        });

        const statusTotals = {};

        Object.values(byDemand).forEach(demandHistory => {
            // Sort by changed_at ascending
            const sorted = [...demandHistory].sort((a, b) => new Date(a.changed_at) - new Date(b.changed_at));

            sorted.forEach((h, i) => {
                if (!h.from_status) return;

                let minutes = h.time_in_previous_status_minutes;

                // Fallback: compute from timestamps if field is null
                if (!minutes || minutes <= 0) {
                    if (i > 0) {
                        const prevDate = new Date(sorted[i - 1].changed_at);
                        const currDate = new Date(h.changed_at);
                        minutes = Math.round((currDate - prevDate) / 60000);
                    } else {
                        // First entry — try using demand created_date
                        const demand = filteredDemands.find(d => d.id === h.demand_id);
                        if (demand?.created_date) {
                            const createdDate = new Date(demand.created_date);
                            const currDate = new Date(h.changed_at);
                            minutes = Math.round((currDate - createdDate) / 60000);
                        }
                    }
                }

                if (minutes && minutes > 0) {
                    if (!statusTotals[h.from_status]) {
                        statusTotals[h.from_status] = { total_minutes: 0, count: 0 };
                    }
                    statusTotals[h.from_status].total_minutes += minutes;
                    statusTotals[h.from_status].count += 1;
                }
            });
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

        // SLA Geral e Dados Avançados
        const allDelivered = filteredDemands.filter(d => d.status === 'ENTREGUE');

        const delivered = allDelivered.filter(d => {
            if (!d.qualification_date) return false;
            if (d.delivery_date) return true;
            const demandHistory = history.filter(h => h.demand_id === d.id && h.to_status === 'ENTREGUE');
            return demandHistory.length > 0;
        });

        let avgDeliveryDays = 0;
        let complianceRate = 0;
        let minTime = null;
        let maxTime = null;
        let historicalTrend = [];
        let trendPercentage = 0;

        if (delivered.length > 0) {
            let onTimeCount = 0;
            const today = new Date();
            const lastMonth = subMonths(today, 1);

            let thisMonthTotal = 0;
            let thisMonthCount = 0;
            let lastMonthTotal = 0;
            let lastMonthCount = 0;

            const trendDataMap = {};

            const totalDays = delivered.reduce((sum, d) => {
                let deliveryDateStr = d.delivery_date;
                if (!deliveryDateStr) {
                    const demandHistory = history.filter(h => h.demand_id === d.id && h.to_status === 'ENTREGUE');
                    if (demandHistory.length > 0) {
                        deliveryDateStr = demandHistory[demandHistory.length - 1].changed_at;
                    }
                }

                if (!deliveryDateStr) return sum;

                const workDays = calculateWorkDays(d.qualification_date, deliveryDateStr, holidays);
                const frozenDays = Math.floor((d.frozen_time_minutes || 0) / (60 * 24));
                const finalDays = Math.max(0, workDays - frozenDays);

                // Min e Max
                if (minTime === null || finalDays < minTime) minTime = finalDays;
                if (maxTime === null || finalDays > maxTime) maxTime = finalDays;

                // Compliance de prazo
                if (d.expected_delivery_date) {
                    const expectedTimestamp = parseISO(d.expected_delivery_date).getTime();
                    const deliveredTimestamp = new Date(deliveryDateStr).getTime();
                    if (deliveredTimestamp <= expectedTimestamp) onTimeCount++;
                } else {
                    // Sem data de entrega prevista? Assume dentro do prazo pra média (ou pode descontar do total)
                    onTimeCount++;
                }

                // Trendline grouping details
                const deliveryDateObj = new Date(deliveryDateStr);
                const monthKey = format(deliveryDateObj, 'yyyy-MM');
                if (!trendDataMap[monthKey]) trendDataMap[monthKey] = { total: 0, count: 0 };
                trendDataMap[monthKey].total += finalDays;
                trendDataMap[monthKey].count += 1;

                if (isSameMonth(deliveryDateObj, today)) {
                    thisMonthTotal += finalDays;
                    thisMonthCount++;
                } else if (isSameMonth(deliveryDateObj, lastMonth)) {
                    lastMonthTotal += finalDays;
                    lastMonthCount++;
                }

                return sum + finalDays;
            }, 0);

            avgDeliveryDays = Math.round(totalDays / delivered.length * 10) / 10;
            complianceRate = Math.round((onTimeCount / delivered.length) * 100);

            const thisMonthAvg = thisMonthCount > 0 ? thisMonthTotal / thisMonthCount : 0;
            const lastMonthAvg = lastMonthCount > 0 ? lastMonthTotal / lastMonthCount : 0;

            if (lastMonthAvg > 0 && thisMonthAvg > 0) {
                trendPercentage = Math.round(((thisMonthAvg - lastMonthAvg) / lastMonthAvg) * 100);
            }

            historicalTrend = Object.keys(trendDataMap).sort().map(monthKey => ({
                name: monthKey,
                uv: trendDataMap[monthKey].count > 0 ? (trendDataMap[monthKey].total / trendDataMap[monthKey].count) : 0
            })).slice(-6); // Ultimos 6 meses
        }

        return {
            statusAvg,
            avgDeliveryDays,
            deliveredCount: delivered.length,
            complianceRate,
            minTime: minTime !== null ? Math.round(minTime * 10) / 10 : 0,
            maxTime: maxTime !== null ? Math.round(maxTime * 10) / 10 : 0,
            trendPercentage,
            historicalTrend
        };
    }, [bottleneckData, filteredDemands, holidays, history]);

    // CDPC Stage SLA
    const stageSlaData = useMemo(() => {
        const stageTotals = {}; // { StageName: { totalMinutes: 0, count: 0 } }

        const demandIds = new Set(filteredDemands.map(d => d.id));
        const filteredStageHistory = stageHistory.filter(h => demandIds.has(h.demand_id));

        filteredStageHistory.forEach(h => {
            if (h.stage && h.duration_minutes) {
                // Map legacy Stage "KIT" to "ESP" to match the new flow
                let stageName = h.stage;
                if (stageName === 'KIT') stageName = 'ESP';

                if (!stageTotals[stageName]) {
                    stageTotals[stageName] = { totalMinutes: 0, count: 0 };
                }
                stageTotals[stageName].totalMinutes += h.duration_minutes;
                stageTotals[stageName].count += 1;
            }
        });

        const order = ["Triagem", "Qualificação", "PO", "OO", "RT", "ESP"];

        const averages = order.map(stage => {
            const data = stageTotals[stage] || { totalMinutes: 0, count: 0 };
            return {
                stage,
                avgDays: data.count > 0 ? (data.totalMinutes / 1440).toFixed(1) : 0
            };
        });

        return averages;
    }, [stageHistory, filteredDemands]);

    const isManager = user?.role === 'manager' || user?.perfil === 'GESTOR' || user?.department === 'GOR' || (user?.department === 'CDPC' && user?.role === 'manager');
    const isRequester = user?.role === 'requester';
    const isAnalystCDPC = user?.role === 'analyst' && user?.department === 'CDPC';

    return (
        <div className="p-6 min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col mb-6">
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

                {/* ── Barra de Filtros Global (sempre visível) ── */}
                <div className="flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl px-5 pt-8 pb-4 shadow-sm mb-6">
                    {/* Linha dos filtros — sempre centralizada */}
                    <div className="flex flex-wrap justify-center items-end gap-x-5 gap-y-6">
                        <div className="flex flex-col gap-1" title="Filtra todas as métricas do dashboard pelo ano em que a demanda deu entrada (criação ou qualificação).">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-help">Ano (Safra)</span>
                            <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isDashboardLoading}>
                                <SelectTrigger className="w-24 bg-white">
                                    <SelectValue placeholder="Ano" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os anos</SelectItem>
                                    {years.map(y => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1" title="Filtra as métricas pelo mês em que a demanda entrou na esteira (data de qualificação ou criação).">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-help">Mês Entrada (Safra)</span>
                            <Select value={selectedEntryMonth} onValueChange={setSelectedEntryMonth} disabled={isDashboardLoading}>
                                <SelectTrigger className="w-36 bg-white">
                                    <SelectValue placeholder="Mês (Entrada)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os meses</SelectItem>
                                    <SelectItem value="01">Janeiro</SelectItem>
                                    <SelectItem value="02">Fevereiro</SelectItem>
                                    <SelectItem value="03">Março</SelectItem>
                                    <SelectItem value="04">Abril</SelectItem>
                                    <SelectItem value="05">Maio</SelectItem>
                                    <SelectItem value="06">Junho</SelectItem>
                                    <SelectItem value="07">Julho</SelectItem>
                                    <SelectItem value="08">Agosto</SelectItem>
                                    <SelectItem value="09">Setembro</SelectItem>
                                    <SelectItem value="10">Outubro</SelectItem>
                                    <SelectItem value="11">Novembro</SelectItem>
                                    <SelectItem value="12">Dezembro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1" title="Filtra as métricas pelo mês em que a demanda foi efetivamente entregue (data de entrega real).">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-help">Mês Entrega</span>
                            <Select value={selectedDeliveryMonth} onValueChange={setSelectedDeliveryMonth} disabled={isDashboardLoading}>
                                <SelectTrigger className="w-36 bg-white">
                                    <SelectValue placeholder="Mês (Entrega)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os meses</SelectItem>
                                    <SelectItem value="01">Janeiro</SelectItem>
                                    <SelectItem value="02">Fevereiro</SelectItem>
                                    <SelectItem value="03">Março</SelectItem>
                                    <SelectItem value="04">Abril</SelectItem>
                                    <SelectItem value="05">Maio</SelectItem>
                                    <SelectItem value="06">Junho</SelectItem>
                                    <SelectItem value="07">Julho</SelectItem>
                                    <SelectItem value="08">Agosto</SelectItem>
                                    <SelectItem value="09">Setembro</SelectItem>
                                    <SelectItem value="10">Outubro</SelectItem>
                                    <SelectItem value="11">Novembro</SelectItem>
                                    <SelectItem value="12">Dezembro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isManager && (
                            <div className="flex flex-col gap-1" title="Filtra o dashboard para exibir apenas as demandas atribuídas ao analista selecionado.">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-help">Responsável (Analista)</span>
                                <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst} disabled={isDashboardLoading}>
                                    <SelectTrigger className="w-52 bg-white">
                                        <SelectValue placeholder="Responsável" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os Responsáveis</SelectItem>
                                        {[...analysts].sort((a, b) => a.name.localeCompare(b.name)).map(a => (
                                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Linha do botão "Limpar" — centralizada e independente */}
                    {(selectedEntryMonth !== 'all' || selectedDeliveryMonth !== 'all' || selectedAnalyst !== 'all') && (
                        <div className="flex justify-center">
                            <button
                                onClick={() => { setSelectedEntryMonth('all'); setSelectedDeliveryMonth('all'); setSelectedAnalyst('all'); }}
                                disabled={isDashboardLoading}
                                className="text-xs text-indigo-600 font-semibold border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Clique para limpar todos os filtros e voltar à visão completa."
                            >
                                × Limpar filtros
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Abas de Navegação ── */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'overview'
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'weekly'
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Acompanhamento Semanal
                    </button>
                    <button
                        onClick={() => setActiveTab('resumo')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'resumo'
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Resumo
                    </button>
                    <button
                        onClick={() => setActiveTab('efficiency')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'efficiency'
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Eficiência e Fluxo
                    </button>
                    <button
                        onClick={() => setActiveTab('presidencial')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'presidencial'
                                ? 'bg-white text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Visão Presidencial
                    </button>
                </div>

                {/* ── Aba: Acompanhamento Semanal ── */}
                {activeTab === 'weekly' && (
                    isDashboardLoading ? (
                        <WeeklyTrackingSkeleton />
                    ) : (
                        <WeeklyTrackingTab
                            analystId={selectedAnalyst}
                            demands={demands}
                            history={history}
                            stageHistory={stageHistory}
                        />
                    )
                )}

                {/* ── Aba: Resumo ── */}
                {activeTab === 'resumo' && (
                    isDashboardLoading ? (
                        <ResumoTabSkeleton />
                    ) : (
                        <ResumoTab
                            analystId={selectedAnalyst}
                            demands={demands}
                            analysts={analysts}
                            usersMap={usersMap}
                            selectedYear={selectedYear}
                            selectedEntryMonth={selectedEntryMonth}
                            selectedDeliveryMonth={selectedDeliveryMonth}
                        />
                    )
                )}

                {/* ── Aba: Eficiência e Fluxo ── */}
                {activeTab === 'efficiency' && (
                    isDashboardLoading ? (
                        <FlowEfficiencySkeleton />
                    ) : (
                        <FlowEfficiencyTab
                            demands={demands}
                            history={history}
                            stageHistory={stageHistory}
                            usersMap={usersMap}
                            analysts={analysts}
                            holidays={holidays}
                            selectedYear={selectedYear}
                            selectedEntryMonth={selectedEntryMonth}
                            selectedDeliveryMonth={selectedDeliveryMonth}
                            analystId={selectedAnalyst}
                        />
                    )
                )}

                {/* ── Aba: Visão Presidencial ── */}
                {activeTab === 'presidencial' && (
                    <PresidencialTab
                        demands={filteredDemands}
                        users={users}
                        clients={clients}
                        cycles={cycles}
                        isLoading={isDashboardLoading}
                    />
                )}

                {/* ── Aba: Visão Geral ── */}
                {activeTab === 'overview' && (<div className="contents">
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAnalystCDPC ? 'lg:grid-cols-5' : 'lg:grid-cols-6'} gap-4 mb-8`}>
                    <StatsCard
                        title="Total de Demandas"
                        tooltip="Volume total de demandas criadas/qualificadas no período selecionado."
                        value={stats.total}
                        icon={FileText}
                        type="default"
                        onClick={() => setSelectedFilter(selectedFilter === 'total' ? null : 'total')}
                        isLoading={isDashboardLoading}
                    />
                    {/* Hide Backlog for Analyst CDPC */}
                    {!isAnalystCDPC && (
                        <StatsCard
                            title="Backlog"
                            tooltip="Demandas que estão aguardando início (Pendente Triagem, Designada)."
                            value={stats.backlog}
                            icon={Layers}
                            type="info"
                            onClick={() => setSelectedFilter(selectedFilter === 'backlog' ? null : 'backlog')}
                            isLoading={isDashboardLoading}
                        />
                    )}
                    <StatsCard
                        title="Em Tratativa"
                        tooltip="Demandas que estão em execução no momento (Em andamento, correção, pendências, etc)."
                        value={stats.tratativa}
                        icon={Briefcase}
                        type="purple"
                        onClick={() => setSelectedFilter(selectedFilter === 'tratativa' ? null : 'tratativa')}
                        isLoading={isDashboardLoading}
                    />
                    <StatsCard
                        title="Em Aberto"
                        tooltip="Demandas ativas, incluindo backlog e em tratativa (exceto congeladas)."
                        value={stats.open}
                        icon={Clock}
                        type="warning"
                        onClick={() => setSelectedFilter(selectedFilter === 'open' ? null : 'open')}
                        isLoading={isDashboardLoading}
                    />
                    <StatsCard
                        title="Atrasadas"
                        tooltip="Demandas ativas que já ultrapassaram a data de previsão de entrega."
                        value={stats.overdue}
                        icon={AlertTriangle}
                        type="danger"
                        onClick={() => setSelectedFilter(selectedFilter === 'overdue' ? null : 'overdue')}
                        isLoading={isDashboardLoading}
                    />
                    <StatsCard
                        title="Entregues"
                        tooltip="Demandas que foram concluídas e entregues."
                        value={stats.delivered}
                        icon={CheckCircle2}
                        type="success"
                        onClick={() => setSelectedFilter(selectedFilter === 'delivered' ? null : 'delivered')}
                        isLoading={isDashboardLoading}
                    />
                </div>

                {/* ── Próximas Entregas & Últimas Entregues (Widget) ── */}
                {!isRequester && (
                    isDashboardLoading ? (
                        <NextLastDeliveriesSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Próximas Entregas */}
                            <Card className="border-indigo-100/50 shadow-md">
                                <CardHeader className="bg-indigo-50/30 pb-3 border-b border-indigo-50">
                                    <CardTitle title="Lista das próximas demandas ativas com prazo de entrega mais próximo e urgente." className="text-sm font-bold text-slate-700 flex items-center gap-2 cursor-help">
                                        <CalendarClock className="w-5 h-5 text-indigo-500" />
                                        Próximas Entregas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                        {nextDeliveries.length > 0 ? nextDeliveries.map(d => {
                                            const isOverdue = d.expected_delivery_date && isAfter(new Date(), parseISO(d.expected_delivery_date));
                                            return (
                                                <div key={d.id} className="py-3 px-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                    <div className="flex flex-col overflow-hidden mr-4">
                                                        <span className="text-sm font-semibold text-slate-800 truncate" title={d.product || 'Sem Produto'}>
                                                            {d.product || 'Sem Produto'}
                                                        </span>
                                                        <span className="text-xs text-slate-500 truncate" title={d.title || d.project_name || '-'}>
                                                            #{d.demand_number || d.id} • {usersMap[d.analyst_id] || 'Sem Analista'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-end shrink-0">
                                                        <span className={`text-xs font-mono font-medium ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                                            {d.expected_delivery_date ? format(parseISO(d.expected_delivery_date), 'dd/MM/yyyy') : 'Sem Prazo'}
                                                        </span>
                                                        {isOverdue && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase font-bold mt-1">Atrasada</span>}
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <div className="p-6 text-center text-sm text-slate-400">Nenhuma demanda ativa no momento.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Últimas Entregues */}
                            <Card className="border-emerald-100/50 shadow-md">
                                <CardHeader className="bg-emerald-50/30 pb-3 border-b border-emerald-50">
                                    <CardTitle title="Lista das últimas demandas que foram marcadas como ENTREGUE." className="text-sm font-bold text-slate-700 flex items-center gap-2 cursor-help">
                                        <PackageCheck className="w-5 h-5 text-emerald-500" />
                                        Últimas Entregues
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                                        {lastDeliveries.length > 0 ? lastDeliveries.map(d => (
                                            <div key={d.id} className="py-3 px-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                                <div className="flex flex-col overflow-hidden mr-4">
                                                    <span className="text-sm font-semibold text-slate-800 truncate" title={d.product || 'Sem Produto'}>
                                                        {d.product || 'Sem Produto'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 truncate" title={d.title || d.project_name || '-'}>
                                                        #{d.demand_number || d.id} • {usersMap[d.analyst_id] || 'Sem Analista'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end shrink-0">
                                                    <span className="text-xs font-mono font-medium text-emerald-700">
                                                        {d.delivery_date ? format(parseISO(d.delivery_date), 'dd/MM/yyyy') : '-'}
                                                    </span>
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase font-bold mt-1">Entregue</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-6 text-center text-sm text-slate-400">Nenhuma demanda entregue no período.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                )}

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
                                            <th className="px-6 py-3">Nº Demanda</th>
                                            <th className="px-6 py-3">Produto / Demanda</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Responsável</th>
                                            <th className="px-6 py-3">Previsão</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {detailedDemands.length > 0 ? detailedDemands.map(d => (
                                            <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 w-[120px]">
                                                    #{d.demand_number || d.id}
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
                    isDashboardLoading ? (
                        <SlaSectionSkeleton />
                    ) : (
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
                                    {/* SLA Geral Avançado */}
                                    <div className={`relative overflow-hidden rounded-xl p-6 text-white shadow-md border group ${slaData.avgDeliveryDays <= 10 ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-400/20' :
                                        slaData.avgDeliveryDays <= 15 ? 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400/20' :
                                            'bg-gradient-to-br from-red-500 to-red-700 border-red-400/20'
                                        }`}>
                                        {/* Sparkline Translúcido (Fundo) */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none translate-y-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={slaData.historicalTrend}>
                                                    <Line
                                                        type="monotone"
                                                        dataKey="uv"
                                                        stroke="#ffffff"
                                                        strokeWidth={4}
                                                        dot={false}
                                                        isAnimationActive={true}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full justify-between">
                                            <div>
                                                <p className="text-sm font-medium opacity-90 flex items-center justify-between">
                                                    SLA Geral (Média de Entrega)
                                                    {slaData.trendPercentage !== 0 && (
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${slaData.trendPercentage < 0 ? 'bg-white/20 text-white' : 'bg-black/20 text-white'}`} title="Comparado ao mês passado">
                                                            {slaData.trendPercentage > 0 ? '↑' : '↓'} {Math.abs(slaData.trendPercentage)}%
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <p className="text-5xl font-extrabold tracking-tight">
                                                        {slaData.avgDeliveryDays}
                                                    </p>
                                                    <span className="text-lg font-medium opacity-80">dias úteis</span>
                                                </div>
                                                <p className="text-xs opacity-75 mt-1">
                                                    Baseado em {slaData.deliveredCount} demandas entregues
                                                </p>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">Compliance Geral</p>
                                                    <p className="text-lg font-bold mt-0.5 flex items-center gap-1.5 opacity-90">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                        {slaData.complianceRate}% no prazo
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">Limites de Tempo</p>
                                                    <div className="text-sm font-medium mt-0.5 flex flex-col gap-0.5 opacity-90">
                                                        <span className="flex items-center gap-1"><span title="Mais rápida">🏃</span> {slaData.minTime}d</span>
                                                        <span className="flex items-center gap-1"><span title="Mais demorada">🐢</span> {slaData.maxTime}d</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                    )
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
                    <div className="grid grid-cols-1 gap-6 mb-8">
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
                    </div>
                )}

                {/* Cancelamentos e Reaberturas - New Sections */}
                {!isRequester && isManager && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between gap-2 w-full">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        Ranking de Cancelamentos por Executivo
                                    </div>
                                    {cdpcMetrics.cancelledThisYear !== undefined && (
                                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold border border-red-200 shadow-sm" title="Total Global de Cancelamentos">
                                            {cdpcMetrics.cancelledThisYear}
                                        </div>
                                    )}
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Quantidade de demandas canceladas no período (Clique para ver detalhes)
                                </p>
                            </CardHeader>
                            <CardContent>
                                <CancelledRankingChart 
                                    data={cdpcMetrics.cancelledByExecutive} 
                                    onItemClick={handleExecClick}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between gap-2 w-full">
                                    <div className="flex items-center gap-2">
                                        <RotateCcw className="w-5 h-5 text-amber-500" />
                                        Reaberturas por Motivo
                                    </div>
                                    {cdpcMetrics.reopeningsByReason?.length > 0 && (
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold border border-amber-200 shadow-sm">
                                            {cdpcMetrics.reopeningsByReason.reduce((acc, curr) => acc + curr.count, 0)}
                                        </div>
                                    )}
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Principais razões para reabertura de demandas entregues
                                </p>
                            </CardHeader>
                            <CardContent>
                                <ReopeningReasonsChart data={cdpcMetrics.reopeningsByReason} />
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
                )
                }

                {
                    isManager && (
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
                                    <BottleneckBarChart data={bottleneckData} onBarClick={(status) => setSelectedHeatmapStatus(selectedHeatmapStatus === status ? null : status)} />

                                    {selectedHeatmapStatus && (() => {
                                        // Find demands that had this status in their history
                                        const demandIdsWithStatus = new Set();
                                        history.forEach(h => {
                                            if (h.from_status === selectedHeatmapStatus || h.to_status === selectedHeatmapStatus) {
                                                demandIdsWithStatus.add(h.demand_id);
                                            }
                                        });
                                        const matchingDemands = filteredDemands.filter(d => demandIdsWithStatus.has(d.id));

                                        return (
                                            <div className="mt-4 border-t pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-sm font-semibold text-slate-700">
                                                        Demandas que passaram por <span className="text-indigo-600">{selectedHeatmapStatus}</span>
                                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{matchingDemands.length}</span>
                                                    </h4>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedHeatmapStatus(null)} className="text-slate-400 hover:text-slate-600 text-xs">
                                                        Fechar
                                                    </Button>
                                                </div>
                                                <div className="overflow-x-auto max-h-[300px]">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="text-xs text-slate-600 uppercase bg-slate-50 sticky top-0">
                                                            <tr>
                                                                <th className="px-3 py-2">ID</th>
                                                                <th className="px-3 py-2">Produto</th>
                                                                <th className="px-3 py-2">Status Atual</th>
                                                                <th className="px-3 py-2">Responsável</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {matchingDemands.length > 0 ? matchingDemands.map(d => (
                                                                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                                                                    <td className="px-3 py-2 font-medium text-slate-900">#{d.demand_number || d.id}</td>
                                                                    <td className="px-3 py-2 text-slate-700">{d.product}</td>
                                                                    <td className="px-3 py-2">
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                                                                        ${d.status === 'ENTREGUE' ? 'bg-emerald-100 text-emerald-700' :
                                                                                d.status === 'CANCELADA' ? 'bg-slate-100 text-slate-600' :
                                                                                    'bg-blue-100 text-blue-700'}`}>
                                                                            {d.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-3 py-2 text-slate-600">{usersMap[d.analyst_id] || '-'}</td>
                                                                </tr>
                                                            )) : (
                                                                <tr>
                                                                    <td colSpan={4} className="px-3 py-6 text-center text-slate-400">Nenhuma demanda encontrada.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })()}
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
                    )
                }
                </div>)}
            </div >

            {/* Drill-down Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Demandas Canceladas: {selectedExec?.name}
                            </div>
                            <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-50">
                                {executiveCanceledDetails.length} demandas
                            </Badge>
                        </DialogTitle>
                        <p className="text-sm text-slate-500 mt-1">
                            Detalhamento das propostas canceladas por este executivo em {selectedYear}
                        </p>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-6 pt-2">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-[120px]">Nº Demanda</TableHead>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Nome do Cliente</TableHead>
                                        <TableHead>Referência</TableHead>
                                        <TableHead className="text-right">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {executiveCanceledDetails.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                                                Nenhuma demanda encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        executiveCanceledDetails.map((d) => (
                                            <TableRow key={d.id} className="hover:bg-slate-50/50">
                                                <TableCell className="font-bold text-slate-900">
                                                    {d.demand_number || `#${d.id}`}
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">{d.product}</TableCell>
                                                <TableCell className="text-xs text-slate-500">
                                                    {clientsMap[d.client_id] || d.client_id || '-'}
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-400">
                                                    {format(parseISO(d.qualification_date || d.created_date), 'dd/MM/yyyy')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <a
                                                        href={`/demand-detail?id=${d.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                                    >
                                                        Ver <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t bg-slate-50 flex justify-end">
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                            Fechar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}
