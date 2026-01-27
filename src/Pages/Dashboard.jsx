import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import StatsCard from '@/components/dashboard/StatsCard';
import BottleneckChart from '@/components/dashboard/BottleneckChart';
import ComplexityChart from '@/components/dashboard/ComplexityChart';
import { calculateWorkDays } from '@/components/demands/EffortCalculator';
import { isAfter, parseISO, format, getYear } from 'date-fns';

const ACTIVE_STATUSES = [
    "PENDENTE TRIAGEM",
    "DESIGNADA",
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA FORNECEDOR"
];

const CLOSED_STATUSES = ["ENTREGUE", "CANCELADA", "TRIAGEM NÃO ELEGÍVEL"];

export default function DashboardPage() {
    const currentYear = getYear(new Date());
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedAnalyst, setSelectedAnalyst] = useState('all');

    const { data: demands = [] } = useQuery({
        queryKey: ['demands'],
        queryFn: () => base44.entities.Demand.list()
    });

    const { data: history = [] } = useQuery({
        queryKey: ['all-history'],
        queryFn: () => base44.entities.StatusHistory.list()
    });

    const { data: analysts = [] } = useQuery({
        queryKey: ['analysts'],
        queryFn: () => base44.entities.Analyst.list()
    });

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: () => base44.entities.Holiday.list()
    });

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
            if (selectedAnalyst !== 'all' && d.analyst_id !== selectedAnalyst) return false;
            return true;
        });
    }, [demands, selectedYear, selectedAnalyst]);

    const stats = useMemo(() => {
        const total = filteredDemands.length;
        const open = filteredDemands.filter(d => ACTIVE_STATUSES.includes(d.status)).length;
        const overdue = filteredDemands.filter(d =>
            d.expected_delivery_date &&
            ACTIVE_STATUSES.includes(d.status) &&
            isAfter(new Date(), parseISO(d.expected_delivery_date))
        ).length;
        const delivered = filteredDemands.filter(d => d.status === 'ENTREGUE').length;

        return { total, open, overdue, delivered };
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Visão geral e análise de gargalos
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
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Total de Demandas"
                        value={stats.total}
                        icon={FileText}
                        iconClassName="bg-indigo-100"
                    />
                    <StatsCard
                        title="Em Aberto"
                        value={stats.open}
                        icon={Clock}
                        iconClassName="bg-amber-100"
                    />
                    <StatsCard
                        title="Atrasadas"
                        value={stats.overdue}
                        icon={AlertTriangle}
                        iconClassName="bg-red-100"
                    />
                    <StatsCard
                        title="Entregues"
                        value={stats.delivered}
                        icon={CheckCircle2}
                        iconClassName="bg-emerald-100"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                                Mapa de Calor - Gargalos
                            </CardTitle>
                            <p className="text-sm text-slate-500">
                                Tempo acumulado em cada status (identifica onde o processo estaciona)
                            </p>
                        </CardHeader>
                        <CardContent>
                            <BottleneckChart data={bottleneckData} />
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg rounded-2xl">
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
            </div>
        </div>
    );
}
