import React, { useState, useEffect, useMemo } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { cn } from "@/lib/utils";
import {
    PieChart,
    Layers,
    FileSignature,
    Landmark,
    Cuboid,
    ArrowDownToLine,
    CheckSquare,
    Flame,
    AlertTriangle,
    Building2,
    TrendingDown,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    RefreshCw
} from "lucide-react";

export default function GerencialDashboard() {
    const [activeTab, setActiveTab] = useState('cdpc');
    const user = JSON.parse(localStorage.getItem('fluxo_user') || '{}');

    // --- CDPC Real Data ---
    const [demands, setDemands] = useState([]);
    const [clients, setClients] = useState([]);
    const [cdpcLoading, setCdpcLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        Promise.all([
            fluxoApi.entities.Demand.list({ status: 'all' }).catch(() => []),
            fluxoApi.entities.Client.list().catch(() => [])
        ]).then(([demandsData, clientsData]) => {
            setDemands(Array.isArray(demandsData) ? demandsData : []);
            setClients(Array.isArray(clientsData) ? clientsData : []);
            setLastUpdated(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            setCdpcLoading(false);
        });
    }, []);

    const cdpcMetrics = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-indexed

        const isThisMonth = (dateStr) => {
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        };
        const isThisYear = (dateStr) => {
            if (!dateStr) return false;
            return new Date(dateStr).getFullYear() === currentYear;
        };

        const backlog = demands.filter(d => d.status !== 'ENTREGUE' && d.status !== 'CANCELADA');
        const entriesThisMonth = demands.filter(d => isThisMonth(d.qualification_date));
        const deliveredThisMonth = demands.filter(d => d.status === 'ENTREGUE' && isThisMonth(d.delivery_date));
        const highPriority = backlog.filter(d =>
            (d.artifact === 'PROPOSTA' || d.artifact === 'Proposta') && (d.weight === 0 || d.weight === 1)
        );
        const deliveredThisYear = demands.filter(d => d.status === 'ENTREGUE' && isThisYear(d.delivery_date));
        const demandsThisYear = demands.filter(d => isThisYear(d.created_date));
        const demandsWithValue = demandsThisYear.filter(d => parseFloat(d.value) > 0);
        const valueThisYear = demandsWithValue.reduce((sum, d) => sum + parseFloat(d.value), 0);
        const valuedDemandsCount = demandsWithValue.length;

        // Top clients by active backlog demand count
        const clientCount = {};
        backlog.forEach(d => {
            if (d.client_id) {
                clientCount[d.client_id] = (clientCount[d.client_id] || 0) + 1;
            }
        });
        const topClients = Object.entries(clientCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([clientId, count]) => {
                const client = clients.find(c => String(c.id) === String(clientId));
                return { name: client?.name || `Cliente #${clientId}`, count };
            });

        return { backlog, entriesThisMonth, deliveredThisMonth, highPriority, deliveredThisYear, valueThisYear, valuedDemandsCount, topClients };
    }, [demands, clients]);

    const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: val >= 1000000 ? 'compact' : 'standard', maximumFractionDigits: val >= 1000000 ? 2 : 0 });

    return (
        <div className="min-h-screen flex flex-col pt-4 overflow-hidden bg-slate-50 relative">

            {/* Header */}
            <header className="bg-white mx-6 rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-sm">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Visão Executiva</h1>
                        <p className="text-sm text-slate-500 font-medium">Dashboard Gerencial • {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 hidden sm:flex">
                    <div className="text-right mr-2">
                        <p className="text-sm font-semibold text-slate-700">Olá, {user?.name || 'Gerente'}</p>
                        <p className="text-xs text-slate-500">Última atualização: {lastUpdated || 'carregando...'}</p>
                    </div>
                    <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-slate-600 font-bold uppercase">
                        {user?.name?.charAt(0) || 'G'}
                    </div>
                </div>
            </header>

            {/* Navegação de Abas */}
            <div className="px-8 border-b border-slate-200 mb-6 flex gap-8 shrink-0">
                <button
                    onClick={() => setActiveTab('cdpc')}
                    className={cn(
                        "pb-3 text-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-2",
                        activeTab === 'cdpc' ? "color-blue-600 text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300"
                    )}
                >
                    <Layers className="w-4 h-4" /> CDPC (Demandas)
                </button>
                <button
                    onClick={() => setActiveTab('cocr')}
                    className={cn(
                        "pb-3 text-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-2",
                        activeTab === 'cocr' ? "color-blue-600 text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300"
                    )}
                >
                    <FileSignature className="w-4 h-4" /> COCR (Contratos)
                </button>
                <button
                    onClick={() => setActiveTab('cvac')}
                    className={cn(
                        "pb-3 text-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-2",
                        activeTab === 'cvac' ? "color-blue-600 text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800 border-b-2 border-transparent hover:border-slate-300"
                    )}
                >
                    <Landmark className="w-4 h-4" /> CVAC (Faturamento)
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-thumb-slate-300 scrollbar-track-transparent">

                {/* ABA CDPC */}
                {activeTab === 'cdpc' && (
                    <main className="max-w-7xl mx-auto space-y-6">
                        <div className="mb-2">
                            <h2 className="text-lg font-bold text-slate-800">Volume &amp; Capacidade</h2>
                            <p className="text-sm text-slate-500">Métricas de fluxo e entrega de propostas</p>
                        </div>

                        {/* Cards Superiores */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-600 group-hover:scale-110 transition-transform"><Cuboid className="w-20 h-20" /></div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Backlog Total</p>
                                <p className="text-3xl font-bold text-slate-800">
                                    {cdpcLoading ? '...' : cdpcMetrics.backlog.length}
                                </p>
                                <p className="text-[10px] text-blue-600 mt-2 font-bold bg-blue-50 w-fit px-2 py-1 rounded">demandas ativas</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform"><ArrowDownToLine className="w-20 h-20" /></div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Entradas Mês</p>
                                <p className="text-3xl font-bold text-slate-800">
                                    {cdpcLoading ? '...' : cdpcMetrics.entriesThisMonth.length}
                                </p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">{new Date().toLocaleDateString('pt-BR', { month: 'short' })}</p>
                            </div>
                            <div className="rounded-2xl shadow-sm border p-5 relative overflow-hidden bg-gradient-to-br from-white to-emerald-50 border-emerald-100 group hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform"><CheckSquare className="w-20 h-20" /></div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Entregues Mês</p>
                                <p className="text-3xl font-bold text-emerald-600">
                                    {cdpcLoading ? '...' : cdpcMetrics.deliveredThisMonth.length}
                                </p>
                                {!cdpcLoading && cdpcMetrics.entriesThisMonth.length > 0 && (
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3">
                                        <div
                                            className="bg-emerald-500 h-1.5 rounded-full"
                                            style={{ width: `${Math.min(100, Math.round((cdpcMetrics.deliveredThisMonth.length / cdpcMetrics.entriesThisMonth.length) * 100))}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="rounded-2xl shadow-sm border p-5 relative overflow-hidden bg-gradient-to-br from-white to-rose-50 border-rose-100 group hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-rose-600 group-hover:scale-110 transition-transform"><Flame className="w-20 h-20" /></div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Alta Prioridade</p>
                                <p className="text-3xl font-bold text-rose-600">
                                    {cdpcLoading ? '...' : cdpcMetrics.highPriority.length}
                                </p>
                                <p className="text-[10px] text-rose-600 mt-2 font-bold bg-white/50 w-fit px-2 py-1 rounded">Propostas P0/P1</p>
                            </div>
                        </div>

                        {/* Acumulado ano e Top Clientes */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
                                <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-6">Acumulado {new Date().getFullYear()}</h3>
                                <div className="flex items-center justify-around">
                                    <div className="text-center">
                                        <p className="text-5xl font-black text-slate-800 mb-2">
                                            {cdpcLoading ? '...' : cdpcMetrics.deliveredThisYear.length}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500">Demandas Entregues</p>
                                    </div>
                                    <div className="h-16 w-px bg-slate-200" />
                                    <div className="text-center">
                                        {cdpcLoading ? (
                                            <p className="text-4xl font-black text-slate-400 mb-2">...</p>
                                        ) : cdpcMetrics.valueThisYear > 0 ? (
                                            <p className="text-4xl font-black text-emerald-600 mb-2">{formatCurrency(cdpcMetrics.valueThisYear)}</p>
                                        ) : (
                                            <p className="text-xl font-semibold text-slate-400 mb-2">Sem valor registrado</p>
                                        )}
                                        <p className="text-sm font-medium text-slate-500 mb-1">Valor Global Gerado</p>
                                        {!cdpcLoading && cdpcMetrics.valueThisYear > 0 && (
                                            <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                                                em {cdpcMetrics.valuedDemandsCount} demanda{cdpcMetrics.valuedDemandsCount !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden flex flex-col">
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-700 text-sm">Top Clientes (Backlog Ativo)</h3>
                                    {cdpcMetrics.highPriority.length > 0 && (
                                        <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Crítico</span>
                                    )}
                                </div>
                                <div className="p-4 flex-1">
                                    {cdpcLoading ? (
                                        <p className="text-sm text-slate-400">Carregando...</p>
                                    ) : cdpcMetrics.topClients.length === 0 ? (
                                        <p className="text-sm text-slate-400">Nenhuma demanda ativa.</p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {cdpcMetrics.topClients.map((c, i) => (
                                                <li key={c.name} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-rose-500 animate-pulse' : i === 1 ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                                        <p className="text-sm font-medium text-slate-800">{c.name}</p>
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">{c.count} demanda{c.count !== 1 ? 's' : ''}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                )}

                {/* ABA COCR */}
                {activeTab === 'cocr' && (
                    <main className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-2">
                            <h2 className="text-lg font-bold text-slate-800">Visão Executiva do Mês</h2>
                            <p className="text-sm text-slate-500">Assinaturas, DEX, Aditamentos e Riscos</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                                <p className="text-sm font-medium text-slate-500 mb-1">Total de Contratos (Mês)</p>
                                <p className="text-3xl font-bold text-slate-800">85</p>
                            </div>
                            <div className="rounded-2xl shadow-sm border p-5 bg-gradient-to-br from-white to-blue-50 border-blue-100">
                                <p className="text-sm font-medium text-slate-500 mb-1">Valor Global (Mês)</p>
                                <p className="text-2xl font-bold text-blue-700">R$ 4.500.000</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                                <p className="text-sm font-medium text-slate-500 mb-1">Aguardando Assinatura</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-amber-500">14</p>
                                    <p className="text-xs text-slate-400">contratos</p>
                                </div>
                            </div>
                            <div className="rounded-2xl shadow-sm border p-5 bg-amber-50 border-amber-100">
                                <p className="text-sm font-medium text-amber-700 mb-1">Valor Travado (Assinatura)</p>
                                <p className="text-2xl font-bold text-amber-600">R$ 850.000</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden">
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center">
                                        <AlertTriangle className="w-4 h-4 text-rose-500 mr-2" />
                                        <h3 className="font-semibold text-slate-700 text-sm">Risco de Renovação / DEX</h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Para DEX (5 itens)</p>
                                            <ul className="text-sm text-slate-700 space-y-3">
                                                <li className="flex justify-between border-b border-slate-50 pb-2">
                                                    <span className="font-medium">CT 001/2026 - Prefeitura X</span>
                                                    <span className="text-[10px] text-white bg-rose-500 px-2 py-1 rounded font-bold uppercase">Urgente</span>
                                                </li>
                                                <li className="flex justify-between border-b border-slate-50 pb-2">
                                                    <span className="text-slate-600">CT 042/2025 - Câmara Y</span>
                                                </li>
                                                <li className="flex justify-between pb-1">
                                                    <span className="text-slate-600">CT 099/2025 - Autarquia Z</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mt-6 pt-5 border-t border-slate-100">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Renovação Inviável</p>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-rose-100 text-rose-600 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg">8</div>
                                                <span className="text-sm text-slate-600 leading-tight">Contratos que precisam de nova licitação</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div className="rounded-2xl shadow-sm border p-5 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white border-indigo-100">
                                    <div>
                                        <p className="text-sm font-semibold uppercase text-indigo-800 tracking-wider mb-1">Volume de Aditamentos (Mês)</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-3xl font-black text-indigo-600">12</p>
                                            <p className="text-sm font-medium text-indigo-400">contratos aditados</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-400 uppercase mb-1">Valor Adicionado</p>
                                        <p className="text-2xl font-bold text-slate-800">+ R$ 600.000</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 flex justify-between bg-slate-50">
                                        <h3 className="font-semibold text-slate-700 text-sm">Qualidade do Preço / Impacto Financeiro</h3>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="p-6 border-r border-slate-100 text-center">
                                            <div className="w-10 h-10 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-3">
                                                <TrendingDown className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tabela Defasada</p>
                                            <p className="text-2xl font-bold text-amber-600 mb-1">4 contratos</p>
                                            <p className="text-sm text-slate-500 bg-slate-50 py-1 rounded w-fit mx-auto px-3">R$ 300.000 alocados</p>
                                        </div>
                                        <div className="p-6 text-center">
                                            <div className="w-10 h-10 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                                <TrendingDown className="w-5 h-5 text-slate-500" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descontos Concedidos</p>
                                            <p className="text-2xl font-bold text-slate-700 mb-2">10 contratos</p>
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <span className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-md">Dif: -R$ 50.000</span>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">(Tabela: R$ 550k • Final: R$ 500k)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                )}

                {/* ABA CVAC */}
                {activeTab === 'cvac' && (
                    <main className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-2">
                            <h2 className="text-lg font-bold text-slate-800">Previsão, Execução e Caixa</h2>
                            <p className="text-sm text-slate-500">Visão financeira consolidada e comparativos</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-5 flex justify-between items-center">
                                    <span>Fevereiro 2026 (Mês Atual)</span>
                                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded uppercase tracking-wider border border-blue-100">Previsão: 26/Fev</span>
                                </h3>

                                <div className="flex flex-col md:flex-row gap-6 mb-8">
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-500 mb-1 font-medium">Valor Previsto</p>
                                        <p className="text-4xl font-extrabold text-slate-800 tracking-tight">R$ 2.10M</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-500 mb-1 font-medium">Crescimento (vs Fev/25)</p>
                                        <p className="text-2xl font-bold text-emerald-500 flex items-center bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                                            <TrendingUp className="w-5 h-5 mr-2" /> +16%
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2">Ano anterior: R$ 1.80M</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-semibold text-slate-600">Apontamento Realizado</span>
                                        <span className="font-bold text-blue-600">71% (R$ 1.5M)</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '71%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl shadow-lg border-0 p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden">
                                {/* Background flair */}
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-700/50 rounded-full blur-3xl mix-blend-screen"></div>

                                <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-slate-400 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Acumulado do Ano (2026)
                                </h3>

                                <div className="flex mb-8 text-center divide-x divide-slate-700/50 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <div className="flex-1 px-4">
                                        <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Previsão Anual</p>
                                        <p className="text-3xl font-black text-white">R$ 25.0M</p>
                                    </div>
                                    <div className="flex-1 px-4">
                                        <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Realizado Agora</p>
                                        <p className="text-3xl font-black text-emerald-400">R$ 4.2M</p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between text-sm mb-2 text-slate-300">
                                        <span className="font-medium">Meta Anual</span>
                                        <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-xs">16.8% alcançado</span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 h-3 rounded-full overflow-hidden border border-slate-600/50">
                                        <div className="bg-emerald-400 h-3 rounded-full relative" style={{ width: '16.8%' }}>
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-6 flex items-center gap-2">
                                    <Landmark className="w-4 h-4" /> Fluxo de Caixa (Faturado)
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Faturado</p>
                                        <p className="text-2xl font-black text-slate-800">R$ 4.20M</p>
                                    </div>
                                    <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-colors cursor-default">
                                        <div className="text-emerald-500 mb-2 flex justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Recebido em Caixa</p>
                                        <p className="text-2xl font-black text-emerald-600">R$ 3.80M</p>
                                    </div>
                                    <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-50 transition-colors cursor-default">
                                        <div className="text-amber-500 mb-2 flex justify-center"><Clock className="w-6 h-6" /></div>
                                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">A Receber</p>
                                        <p className="text-2xl font-black text-amber-600">R$ 400 Mil</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-rose-100 bg-rose-50/50 flex items-center">
                                    <AlertCircle className="w-4 h-4 text-rose-600 mr-2" />
                                    <h3 className="font-semibold text-rose-700 text-sm">Principais Pendências</h3>
                                </div>
                                <div className="p-5 flex-1 bg-slate-50/50">
                                    <ul className="space-y-3">
                                        <li className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-rose-200 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-slate-800 text-sm">Cliente AlphaGov</span>
                                                <span className="text-[10px] font-bold text-white bg-rose-500 px-2 py-1 rounded uppercase tracking-wider">Atrasado 15d</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs text-slate-500 font-medium">NF-e 1029</span>
                                                <span className="font-bold text-slate-800">R$ 200.000</span>
                                            </div>
                                        </li>
                                        <li className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-amber-200 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-slate-800 text-sm">Secretaria XYZ</span>
                                                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded uppercase tracking-wider">A vencer (hoje)</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs text-slate-500 font-medium">NF-e 1035</span>
                                                <span className="font-bold text-slate-800">R$ 150.000</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}
