import { useMemo, useState } from 'react';
import { format, parseISO, subMonths, isSameMonth, getYear } from 'date-fns';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import { 
    Clock, Timer, Activity, AlertTriangle, TrendingUp, Gauge, 
    UserCheck, Sparkles, HelpCircle, Info, Calendar, Zap 
} from 'lucide-react';
import { calculateWorkDays } from '@/components/demands/EffortCalculator';

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

const ACTIVE_WORK_STATUSES = ["EM QUALIFICAÇÃO", "EM ANDAMENTO", "CORREÇÃO"];

const QUEUE_WAIT_STATUSES = [
    "PENDENTE TRIAGEM",
    "DESIGNADA",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA SUPRIMENTOS",
    "PENDÊNCIA FORNECEDOR",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS"
];

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function FlowEfficiencyTab({
    demands = [],
    history = [],
    stageHistory = [],
    usersMap = {},
    analysts = [],
    holidays = [],
    selectedYear,
    selectedEntryMonth = 'all',
    selectedDeliveryMonth = 'all',
    analystId = 'all'
}) {
    const [wipLimitValue, setWipLimitValue] = useState(3);
    const [showWipHelp, setShowWipHelp] = useState(false);
    const [showEfficiencyHelp, setShowEfficiencyHelp] = useState(false);

    // 1. Filtragem das demandas com base no cabeçalho global
    const filteredDemands = useMemo(() => {
        return demands.filter(d => {
            const refDate = d.qualification_date || d.created_date;
            const delivDate = d.delivery_date;

            // Filtro por Safra (Ano)
            if (refDate && selectedYear !== 'all') {
                const demandYear = String(getYear(parseISO(refDate)));
                if (demandYear !== selectedYear) return false;
            }

            // Filtro por Mês de Entrada
            if (selectedEntryMonth !== 'all') {
                if (!refDate) return false;
                const entryMonthStr = String(parseISO(refDate).getMonth() + 1).padStart(2, '0');
                if (entryMonthStr !== selectedEntryMonth) return false;
            }

            // Filtro por Mês de Entrega
            if (selectedDeliveryMonth !== 'all') {
                if (!delivDate) return false;
                const delivMonthStr = String(parseISO(delivDate).getMonth() + 1).padStart(2, '0');
                if (delivMonthStr !== selectedDeliveryMonth) return false;
            }

            // Filtro por Analista
            if (analystId !== 'all' && d.analyst_id !== analystId) return false;

            return true;
        });
    }, [demands, selectedYear, selectedEntryMonth, selectedDeliveryMonth, analystId]);

    // 2. Mapeamento do Histórico de Status por Demanda
    const historyByDemand = useMemo(() => {
        const map = {};
        history.forEach(h => {
            if (!map[h.demand_id]) map[h.demand_id] = [];
            map[h.demand_id].push(h);
        });
        return map;
    }, [history]);

    // 3. Cálculo das Métricas de Lead Time, Cycle Time e Eficiência
    const flowMetrics = useMemo(() => {
        const completed = filteredDemands.filter(d => d.status === 'ENTREGUE');
        
        let totalLeadTime = 0;
        let totalCycleTime = 0;
        let totalEfficiency = 0;
        let countedLead = 0;
        let countedCycle = 0;
        let countedEfficiency = 0;

        const demandDetailsList = [];

        completed.forEach(d => {
            const startRef = d.created_date;
            const qualRef = d.qualification_date;
            
            // Determina a data de entrega real a partir do histórico se o delivery_date não existir
            let endRef = d.delivery_date;
            if (!endRef && historyByDemand[d.id]) {
                const deliveryHist = historyByDemand[d.id]
                    .filter(h => h.to_status === 'ENTREGUE')
                    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
                if (deliveryHist.length > 0) {
                    endRef = deliveryHist[0].changed_at;
                }
            }

            if (!endRef) return;

            // 3.1 Lead Time (Criada -> Entregue)
            if (startRef) {
                const workDays = calculateWorkDays(startRef, endRef, holidays);
                const frozenDays = Math.floor((d.frozen_time_minutes || 0) / 1440);
                const netDays = Math.max(0, workDays - frozenDays);
                totalLeadTime += netDays;
                countedLead++;
                d.calculatedLeadTime = netDays;
            }

            // 3.2 Cycle Time (Qualificada -> Entregue)
            const cycleStart = qualRef || startRef;
            if (cycleStart) {
                const workDays = calculateWorkDays(cycleStart, endRef, holidays);
                const frozenDays = Math.floor((d.frozen_time_minutes || 0) / 1440);
                const netDays = Math.max(0, workDays - frozenDays);
                totalCycleTime += netDays;
                countedCycle++;
                d.calculatedCycleTime = netDays;
            }

            // 3.3 Eficiência de Fluxo Individual
            // Somamos os tempos em cada status no histórico
            let activeMinutes = 0;
            let waitMinutes = 0;
            let frozenMinutes = d.frozen_time_minutes || 0;

            const dHistory = historyByDemand[d.id] || [];
            dHistory.forEach(h => {
                const status = h.from_status;
                if (!status) return;

                const minutes = h.time_in_previous_status_minutes || 0;

                if (ACTIVE_WORK_STATUSES.includes(status)) {
                    activeMinutes += minutes;
                } else if (QUEUE_WAIT_STATUSES.includes(status)) {
                    waitMinutes += minutes;
                } else if (status === "CONGELADA") {
                    frozenMinutes = Math.max(frozenMinutes, minutes);
                }
            });

            // Se o histórico estiver vazio ou incompleto, tentamos calcular do zero com base em estimativas
            if (activeMinutes === 0 && waitMinutes === 0 && d.calculatedCycleTime !== undefined) {
                // Caso não tenhamos histórico detalhado, estimamos baseado na complexidade ou datas
                // Para não falsear os dados, apenas pulamos do cálculo de eficiência individual
            } else {
                const totalLifecycleTime = activeMinutes + waitMinutes;
                if (totalLifecycleTime > 0) {
                    const efficiency = (activeMinutes / totalLifecycleTime) * 100;
                    totalEfficiency += efficiency;
                    countedEfficiency++;
                    d.calculatedEfficiency = efficiency;
                    d.activeMinutes = activeMinutes;
                    d.waitMinutes = waitMinutes;
                }
            }

            demandDetailsList.push({
                id: d.id,
                demandNumber: d.demand_number || String(d.id),
                product: d.product || 'Sem Produto',
                deliveryDate: endRef,
                leadTime: d.calculatedLeadTime || 0,
                cycleTime: d.calculatedCycleTime || 0,
                efficiency: d.calculatedEfficiency !== undefined ? Math.round(d.calculatedEfficiency) : null,
                activeDays: d.activeMinutes ? (d.activeMinutes / 1440).toFixed(1) : null,
                waitDays: d.waitMinutes ? (d.waitMinutes / 1440).toFixed(1) : null,
            });
        });

        // 85% Percentile para SLA comercial do Lead Time
        let leadTimePercentile85 = 0;
        if (demandDetailsList.length > 0) {
            const sortedLeads = [...demandDetailsList].map(x => x.leadTime).sort((a, b) => a - b);
            const index = Math.floor(sortedLeads.length * 0.85);
            leadTimePercentile85 = sortedLeads[index] || 0;
        }

        return {
            avgLeadTime: countedLead > 0 ? Math.round((totalLeadTime / countedLead) * 10) / 10 : 0,
            avgCycleTime: countedCycle > 0 ? Math.round((totalCycleTime / countedCycle) * 10) / 10 : 0,
            avgEfficiency: countedEfficiency > 0 ? Math.round(totalEfficiency / countedEfficiency) : 0,
            leadTimePercentile85,
            completedCount: completed.length,
            demandDetailsList
        };
    }, [filteredDemands, historyByDemand, holidays]);

    // 4. Cálculo de WIP por Analista (Demandas em Tratativa / Ativas)
    const analystsWipData = useMemo(() => {
        // Contamos apenas demandas ativas (não concluídas/canceladas) que estejam nos status de execução
        const activeDemands = demands.filter(d => 
            !["ENTREGUE", "CANCELADA", "TRIAGEM NÃO ELEGÍVEL"].includes(d.status) &&
            d.status !== "CONGELADA"
        );

        const wipDemands = {};
        analysts.forEach(a => { wipDemands[a.id] = []; });

        activeDemands.forEach(d => {
            if (d.analyst_id && wipDemands[d.analyst_id] !== undefined) {
                wipDemands[d.analyst_id].push({
                    id: d.id,
                    number: d.demand_number || String(d.id),
                    product: d.product || 'Sem Produto',
                    status: d.status
                });
            }
        });

        return analysts.map(a => {
            const list = wipDemands[a.id] || [];
            const count = list.length;
            const status = count > wipLimitValue 
                ? 'overload' 
                : count === 0 
                    ? 'empty' 
                    : 'healthy';

            return {
                id: a.id,
                name: a.name,
                wip: count,
                status,
                demandsList: list
            };
        }).sort((a, b) => b.wip - a.wip);
    }, [demands, analysts, wipLimitValue]);

    // 5. Histórico Mensal de Tempos (Lead Time e Cycle Time)
    const monthlyTrendData = useMemo(() => {
        const monthlyData = {};

        flowMetrics.demandDetailsList.forEach(d => {
            try {
                const dateObj = new Date(d.deliveryDate);
                const year = dateObj.getFullYear();
                
                // Filtra para mostrar o ano selecionado (ou últimos meses se for 'all')
                if (selectedYear !== 'all' && String(year) !== selectedYear) return;

                const monthKey = format(dateObj, 'yyyy-MM');
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = {
                        monthKey,
                        leadSum: 0,
                        cycleSum: 0,
                        leadCount: 0,
                        cycleCount: 0,
                        effSum: 0,
                        effCount: 0
                    };
                }

                if (d.leadTime) {
                    monthlyData[monthKey].leadSum += d.leadTime;
                    monthlyData[monthKey].leadCount++;
                }
                if (d.cycleTime) {
                    monthlyData[monthKey].cycleSum += d.cycleTime;
                    monthlyData[monthKey].cycleCount++;
                }
                if (d.efficiency !== null) {
                    monthlyData[monthKey].effSum += d.efficiency;
                    monthlyData[monthKey].effCount++;
                }
            } catch (e) {
                console.error("Erro no processamento da data do gráfico de tendências:", e);
            }
        });

        return Object.keys(monthlyData).sort().map(key => {
            const item = monthlyData[key];
            const [y, m] = key.split('-');
            const monthName = MONTH_NAMES[parseInt(m, 10) - 1].substring(0, 3);
            
            return {
                name: `${monthName}/${y.substring(2)}`,
                "Lead Time (Dias)": item.leadCount > 0 ? Math.round((item.leadSum / item.leadCount) * 10) / 10 : 0,
                "Cycle Time (Dias)": item.cycleCount > 0 ? Math.round((item.cycleSum / item.cycleCount) * 10) / 10 : 0,
                "Eficiência (%)": item.effCount > 0 ? Math.round(item.effSum / item.effCount) : 0,
            };
        });
    }, [flowMetrics, selectedYear]);

    // 6. Distribuição Média das Categorias de Tempo (Barras Empilhadas)
    const timeDistributionData = useMemo(() => {
        let totalActiveMin = 0;
        let totalWaitMin = 0;
        let totalFrozenMin = 0;
        let totalCount = 0;

        filteredDemands.filter(d => d.status === 'ENTREGUE').forEach(d => {
            let active = 0;
            let wait = 0;
            let frozen = d.frozen_time_minutes || 0;

            const dHistory = historyByDemand[d.id] || [];
            dHistory.forEach(h => {
                const status = h.from_status;
                if (!status) return;
                const minutes = h.time_in_previous_status_minutes || 0;

                if (ACTIVE_WORK_STATUSES.includes(status)) {
                    active += minutes;
                } else if (QUEUE_WAIT_STATUSES.includes(status)) {
                    wait += minutes;
                } else if (status === 'CONGELADA') {
                    frozen = Math.max(frozen, minutes);
                }
            });

            // Se a demanda tem histórico registrado
            if (active > 0 || wait > 0) {
                totalActiveMin += active;
                totalWaitMin += wait;
                totalFrozenMin += frozen;
                totalCount++;
            }
        });

        if (totalCount === 0) return [];

        const activeDays = totalActiveMin / 1440 / totalCount;
        const waitDays = totalWaitMin / 1440 / totalCount;
        const frozenDays = totalFrozenMin / 1440 / totalCount;

        return [
            {
                name: 'Distribuição Média de Dias',
                'Trabalho Ativo': parseFloat(activeDays.toFixed(1)),
                'Filas e Pendências': parseFloat(waitDays.toFixed(1)),
                'Tempo Congelado': parseFloat(frozenDays.toFixed(1)),
            }
        ];
    }, [filteredDemands, historyByDemand]);

    // 7. Scatter Plot (Previsibilidade de Lead Time)
    const scatterData = useMemo(() => {
        return flowMetrics.demandDetailsList.map(d => {
            const dateStr = d.deliveryDate ? format(parseISO(d.deliveryDate), 'dd/MM/yy') : '-';
            return {
                id: d.id,
                demandNumber: d.demandNumber,
                product: d.product,
                leadTime: d.leadTime,
                cycleTime: d.cycleTime,
                efficiency: d.efficiency,
                dateStr,
                timestamp: d.deliveryDate ? new Date(d.deliveryDate).getTime() : 0,
            };
        }).sort((a, b) => a.timestamp - b.timestamp);
    }, [flowMetrics]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* ── KPIs Gerais da Aba de Fluxo ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Lead Time Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Clock className="w-24 h-24 text-indigo-900" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Time Médio</span>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{flowMetrics.avgLeadTime}</span>
                        <span className="text-xs font-semibold text-slate-400">dias úteis</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        Da criação à entrega (safra atual)
                    </p>
                </div>

                {/* Cycle Time Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Timer className="w-24 h-24 text-teal-900" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cycle Time Médio</span>
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                            <Timer className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{flowMetrics.avgCycleTime}</span>
                        <span className="text-xs font-semibold text-slate-400">dias úteis</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        Da qualificação operacional à entrega
                    </p>
                </div>

                {/* Eficiência do Fluxo Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Gauge className="w-24 h-24 text-violet-900" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            Eficiência de Fluxo
                            <button onClick={() => setShowEfficiencyHelp(!showEfficiencyHelp)} className="text-slate-300 hover:text-slate-500 transition-colors">
                                <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                        </span>
                        <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                            <Gauge className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{flowMetrics.avgEfficiency}%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Mercado recomenda de 15% a 40%
                    </p>
                    
                    {showEfficiencyHelp && (
                        <div className="absolute inset-0 bg-slate-900/95 text-white p-4 text-xs flex flex-col justify-between z-20 animate-in fade-in duration-200">
                            <div>
                                <h4 className="font-bold mb-1 flex items-center gap-1 text-indigo-400">
                                    <Gauge className="w-4 h-4" /> Eficiência de Fluxo
                                </h4>
                                <p className="leading-relaxed opacity-95">
                                    Mede a fatia de tempo em que a demanda esteve de fato sendo trabalhada ("Em Andamento", "Qualificação"), dividida pelo tempo total do ciclo, descartando filas e pendências.
                                </p>
                            </div>
                            <button onClick={() => setShowEfficiencyHelp(false)} className="mt-2 text-right font-bold text-indigo-400 hover:text-white transition-colors">
                                Entendi
                            </button>
                        </div>
                    )}
                </div>

                {/* Previsibilidade 85% Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-24 h-24 text-amber-900" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Previsibilidade (85%)</span>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{flowMetrics.leadTimePercentile85}</span>
                        <span className="text-xs font-semibold text-slate-400">dias ou menos</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-indigo-500" />
                        85% das propostas entregues no prazo
                    </p>
                </div>
            </div>

            {/* ── Seção 1: Tendência Histórica & Composição de Tempos ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico de Linha: Tendência Histórica */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-indigo-500" />
                                Tendência de Tempos de Ciclo
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">Evolução do Lead Time e Cycle Time médio de entrega ao longo dos meses</p>
                        </div>
                    </div>
                    <div className="p-6">
                        {monthlyTrendData.length === 0 ? (
                            <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                                Nenhuma demanda concluída no período selecionado para traçar tendências.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                                    <Tooltip content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null;
                                        return (
                                            <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs space-y-1">
                                                <p className="font-bold text-slate-800 mb-1.5">{label}</p>
                                                {payload.map(p => (
                                                    <div key={p.name} className="flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                                                        <span className="text-slate-500">{p.name}:</span>
                                                        <span className="font-bold text-slate-800">{p.value} {p.name.includes('%') ? '' : 'dias'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                    <Line type="monotone" dataKey="Lead Time (Dias)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="Cycle Time (Dias)" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="Eficiência (%)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Gráfico de Barras Empilhadas: Composição do Tempo */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-indigo-500" />
                            Composição Média do Tempo
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">Onde as propostas concluídas passam a maior parte do ciclo de vida</p>
                    </div>
                    <div className="p-6 flex flex-col justify-between h-[348px]">
                        {timeDistributionData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                Sem histórico de status para analisar a composição de tempos.
                            </div>
                        ) : (
                            <>
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={timeDistributionData} layout="vertical" margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                                            <XAxis type="number" hide />
                                            <YAxis type="category" dataKey="name" hide />
                                            <Tooltip content={({ active, payload }) => {
                                                if (!active || !payload?.length) return null;
                                                return (
                                                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs space-y-1.5">
                                                        <p className="font-bold text-slate-800 mb-1">Fração do Ciclo de Vida</p>
                                                        {payload.map(p => (
                                                            <div key={p.name} className="flex items-center justify-between gap-4">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                                                                    <span className="text-slate-500">{p.name}:</span>
                                                                </div>
                                                                <span className="font-bold text-slate-800">{p.value} dias</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }} />
                                            <Bar dataKey="Trabalho Ativo" stackId="a" fill="#14b8a6" radius={[4, 0, 0, 4]} />
                                            <Bar dataKey="Filas e Pendências" stackId="a" fill="#f59e0b" />
                                            <Bar dataKey="Tempo Congelado" stackId="a" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-2 border-t border-slate-100 pt-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                                            <span className="text-slate-600 font-medium">Trabalho Ativo (Interno)</span>
                                        </div>
                                        <span className="font-bold text-slate-700">{timeDistributionData[0]['Trabalho Ativo']} dias</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                            <span className="text-slate-600 font-medium">Filas e Pendências (Espera)</span>
                                        </div>
                                        <span className="font-bold text-slate-700">{timeDistributionData[0]['Filas e Pendências']} dias</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                                            <span className="text-slate-600 font-medium">Tempo Suspenso (Congelado)</span>
                                        </div>
                                        <span className="font-bold text-slate-700">{timeDistributionData[0]['Tempo Congelado']} dias</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Seção 2: Controle de Limite de WIP (Work In Progress) ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            <UserCheck className="w-5 h-5 text-indigo-500" />
                            Controle de Carga de Trabalho (Limites de WIP)
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">Gestão de demandas em execução por analista CDPC ativo</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 border px-3 py-1.5 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta WIP Máximo:</span>
                            <input 
                                type="number" 
                                min="1" 
                                max="10" 
                                value={wipLimitValue} 
                                onChange={(e) => setWipLimitValue(Math.max(1, parseInt(e.target.value, 10) || 3))}
                                className="w-12 text-center bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-600 py-0.5"
                            />
                        </div>
                        <button 
                            onClick={() => setShowWipHelp(!showWipHelp)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Por que limitar o WIP?"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {showWipHelp && (
                        <div className="mb-6 p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-800 leading-relaxed space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <p className="font-bold flex items-center gap-1 text-indigo-900">
                                <Sparkles className="w-4 h-4 text-amber-500" /> O que é WIP Limit (Limite de Trabalho em Progresso) e por que é uma prática recomendada?
                            </p>
                            <p>
                                Limitar a quantidade de demandas sendo resolvidas ao mesmo tempo impede a sobrecarga ("multitasking"), garante foco e elimina filas internas. Na prática ágil do Kanban, ao reduzir as tarefas simultâneas, cada demanda é concluída muito mais rápido. A regra de ouro é: <strong>"Pare de começar e comece a terminar"</strong>.
                            </p>
                            <button 
                                onClick={() => setShowWipHelp(false)} 
                                className="text-xs text-indigo-600 font-bold hover:underline"
                            >
                                Fechar explicação
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {analystsWipData.map(analyst => {
                            const pct = Math.min(100, (analyst.wip / wipLimitValue) * 100);
                            const isOver = analyst.wip > wipLimitValue;
                            
                            return (
                                <div 
                                    key={analyst.id} 
                                    className={`rounded-xl border p-4 transition-all relative group ${
                                        isOver 
                                            ? 'bg-rose-50/30 border-rose-200' 
                                            : analyst.wip === 0 
                                                ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                                                : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md'
                                    }`}
                                >
                                    {/* Tooltip de Detalhes do WIP (Hover Card) */}
                                    {analyst.wip > 0 && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 bg-slate-950/95 backdrop-blur-md text-white rounded-xl shadow-2xl p-4 border border-slate-800 z-50 pointer-events-none transition-all duration-200 opacity-0 scale-95 origin-bottom group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto flex flex-col gap-2.5">
                                            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                                                <span className="font-bold text-xs text-slate-200">Demandas Contabilizadas</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                    isOver ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                                                }`}>
                                                    {analyst.wip} {analyst.wip === 1 ? 'ativa' : 'ativas'}
                                                </span>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                                                {analyst.demandsList.map(dem => {
                                                    const isActive = ACTIVE_WORK_STATUSES.includes(dem.status);
                                                    return (
                                                        <div key={dem.id} className="text-xs flex flex-col gap-1 p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800/40">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-mono font-bold text-slate-300">#{dem.number}</span>
                                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                                                                    isActive
                                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                }`}>
                                                                    {dem.status}
                                                                </span>
                                                            </div>
                                                            <span className="text-slate-400 font-medium text-[11px] truncate" title={dem.product}>
                                                                {dem.product}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {/* Seta do Tooltip */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-slate-950/95" />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <span className="text-xs font-bold text-slate-800 truncate" title={analyst.name}>
                                                {analyst.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 mt-0.5">Analista CDPC</span>
                                        </div>
                                        
                                        {isOver ? (
                                            <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-black uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                                                <AlertTriangle className="w-2.5 h-2.5" />
                                                WIP Excedido
                                            </span>
                                        ) : analyst.wip === 0 ? (
                                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                Livre
                                            </span>
                                        ) : (
                                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                Saudável
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-baseline gap-1 mt-4 mb-2">
                                        <span className={`text-3xl font-black ${isOver ? 'text-rose-600' : 'text-slate-800'}`}>{analyst.wip}</span>
                                        <span className="text-xs text-slate-400">/ {wipLimitValue} propostas</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isOver ? 'bg-rose-500' : 'bg-indigo-600'
                                            }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Seção 3: Previsibilidade de Prazos (Scatter Plot) ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        Gráfico de Dispersão de Lead Time (Previsibilidade de SLA)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Análise de variabilidade do tempo total de entrega das propostas concluídas</p>
                </div>
                <div className="p-6">
                    {scatterData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                            Sem demandas entregues para traçar o gráfico de dispersão.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis 
                                        type="number" 
                                        dataKey="timestamp" 
                                        name="Data de Entrega" 
                                        domain={['auto', 'auto']}
                                        tickFormatter={(t) => format(new Date(t), 'dd/MM/yy')}
                                        tick={{ fontSize: 11, fill: '#64748b' }}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        type="number" 
                                        dataKey="leadTime" 
                                        name="Lead Time (Dias)"
                                        tick={{ fontSize: 11, fill: '#64748b' }}
                                        tickLine={false}
                                    />
                                    <ZAxis type="number" dataKey="efficiency" range={[50, 450]} name="Eficiência" unit="%" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-xs space-y-2 max-w-[280px]">
                                                <p className="font-bold text-slate-800 border-b pb-1">Demanda #{data.demandNumber}</p>
                                                <p className="text-slate-600 truncate"><span className="font-semibold text-slate-700">Produto:</span> {data.product}</p>
                                                <p className="text-slate-600"><span className="font-semibold text-slate-700">Entrega:</span> {data.dateStr}</p>
                                                <div className="grid grid-cols-2 gap-2 mt-1 pt-1.5 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Lead Time</p>
                                                        <p className="font-extrabold text-indigo-600 text-sm">{data.leadTime} dias</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Eficiência</p>
                                                        <p className="font-extrabold text-violet-600 text-sm">{data.efficiency}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }} />
                                    <Scatter name="Demandas" data={scatterData} fill="#6366f1">
                                        {scatterData.map((entry, index) => {
                                            // Colore o ponto de acordo com a eficiência de fluxo
                                            const color = entry.efficiency === null
                                                ? '#94a3b8'
                                                : entry.efficiency < 20
                                                    ? '#ef4444' // vermelho (baixa eficiência)
                                                    : entry.efficiency < 40
                                                        ? '#f59e0b' // amarelo
                                                        : '#10b981'; // verde (boa eficiência)
                                            return <Cell key={`cell-${index}`} fill={color} />;
                                        })}
                                    </Scatter>
                                    
                                    {/* Linha guia de SLA médio */}
                                    <ReferenceLine 
                                        y={flowMetrics.avgLeadTime} 
                                        stroke="#475569" 
                                        strokeDasharray="3 3"
                                        label={{ value: `Média (${flowMetrics.avgLeadTime}d)`, position: 'top', fill: '#475569', fontSize: 10, fontWeight: 'bold' }} 
                                    />
                                    
                                    {/* Linha de Previsibilidade 85% */}
                                    <ReferenceLine 
                                        y={flowMetrics.leadTimePercentile85} 
                                        stroke="#8b5cf6" 
                                        strokeWidth={2}
                                        label={{ value: `85% das entregas (${flowMetrics.leadTimePercentile85}d)`, position: 'insideTopLeft', fill: '#8b5cf6', fontSize: 10, fontWeight: 'bold' }} 
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                            <div className="flex items-center gap-4 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span>Alta Eficiência (&gt;=40%)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span>Eficiência Média (20% - 39%)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <span>Baixa Eficiência (&lt;20%)</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
