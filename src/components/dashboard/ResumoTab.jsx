import { useMemo, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
} from 'recharts';

// ── Constants ────────────────────────────────────────────────────────────────
const STAGE_ORDER  = ['Triagem', 'Qualificação', 'PO', 'OO', 'RT', 'ESP', 'Sem Etapa'];
const MONTH_NAMES  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const PRIORITY_LABELS = { 0:'P0', 1:'P1', 2:'P2', 3:'P3', 4:'P4' };
const PRIORITY_COLORS = {
    0: '#7c3aed', // violet — Estratégico
    1: '#dc2626', // red    — Muito Alta
    2: '#ea580c', // orange — Alta
    3: '#ca8a04', // amber  — Média
    4: '#65a30d', // lime   — Baixa
};

const STATUS_COLORS = {
    'BACKLOG':                '#94a3b8',
    'EM TRATATIVA':           '#6366f1',
    'EM QUALIFICAÇÃO':        '#3b82f6',
    'AGUARDANDO CLIENTE':     '#f59e0b',
    'AGUARDANDO ANALISTA':    '#f97316',
    'TRIAGEM NÃO ELEGÍVEL':   '#ef4444',
    'ENTREGUE':               '#22c55e',
    'CANCELADA':              '#64748b',
    'CONGELADA':              '#a1a1aa',
};

const CLOSED_STATUSES = new Set(['ENTREGUE','CANCELADA','CONGELADA','TRIAGEM NÃO ELEGÍVEL']);
const isActive = d => !CLOSED_STATUSES.has(d.status);

const getColor = (status) =>
    STATUS_COLORS[status] || '#cbd5e1';

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const PieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, payload: { percent } } = payload[0];
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-2.5 text-xs">
            <p className="font-bold text-slate-800">{name}</p>
            <p className="text-slate-600">{value} demanda{value !== 1 ? 's' : ''} — {(percent * 100).toFixed(1)}%</p>
        </div>
    );
};

const BarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-2.5 text-xs">
            <p className="font-bold text-slate-800">{label}</p>
            <p className="text-indigo-600">{payload[0].value} demanda{payload[0].value !== 1 ? 's' : ''} ativas</p>
        </div>
    );
};

// ── Section Card ──────────────────────────────────────────────────────────────
const SectionCard = ({ title, subtitle, children }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// ── Heatmap Cell ──────────────────────────────────────────────────────────────
const HeatCell = ({ value, max, onClick }) => {
    const intensity = max > 0 ? value / max : 0;
    const bg = intensity === 0
        ? 'bg-slate-50 text-slate-300'
        : intensity < 0.25  ? 'bg-indigo-100 text-indigo-700'
        : intensity < 0.5   ? 'bg-indigo-300 text-indigo-900'
        : intensity < 0.75  ? 'bg-indigo-500 text-white'
        : 'bg-indigo-700 text-white';
        
    const interactiveClass = value > 0 ? 'cursor-pointer hover:ring-2 hover:ring-indigo-300 hover:scale-105 z-10' : '';
    
    return (
        <div onClick={value > 0 ? onClick : undefined} className={`${bg} ${interactiveClass} rounded-lg h-10 flex items-center justify-center text-xs font-bold transition-all relative`}>
            {value > 0 ? value : '—'}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResumoTab({
    demands = [],
    analysts = [],
    analystId: parentAnalystId = 'all',
    usersMap = {},
    selectedYear,
    selectedEntryMonth = 'all',
    selectedDeliveryMonth = 'all',
}) {
    const [selectedHeatmapCell, setSelectedHeatmapCell] = useState(null);

    const filtered = useMemo(() => {
        return demands.filter(d => {
            const refEntry = d.qualification_date || d.created_date;

            // Ano
            if (selectedYear && selectedYear !== 'all' && refEntry) {
                const y = new Date(refEntry).getFullYear();
                if (String(y) !== String(selectedYear)) return false;
            }

            // Analista
            if (parentAnalystId !== 'all' && String(d.analyst_id) !== String(parentAnalystId)) return false;

            // Mês de Entrada (formato '01'..'12' ou 'all')
            if (selectedEntryMonth !== 'all') {
                if (!refEntry) return false;
                const m = String(new Date(refEntry).getMonth() + 1).padStart(2, '0');
                if (m !== selectedEntryMonth) return false;
            }

            // Mês de Entrega
            if (selectedDeliveryMonth !== 'all') {
                if (!d.delivery_date) return false;
                const m = String(new Date(d.delivery_date).getMonth() + 1).padStart(2, '0');
                if (m !== selectedDeliveryMonth) return false;
            }

            return true;
        });
    }, [demands, parentAnalystId, selectedEntryMonth, selectedDeliveryMonth, selectedYear]);

    // Ignora Ano e Mês — usado exclusivamente no Heatmap (mostra demandas ATIVAS independente de período)
    const heatmapFiltered = useMemo(() => {
        return demands.filter(d => {
            if (parentAnalystId !== 'all' && String(d.analyst_id) !== String(parentAnalystId)) return false;
            return true;
        });
    }, [demands, parentAnalystId]);


    // 1. Distribuição por Status
    const statusData = useMemo(() => {
        const counts = {};
        filtered.forEach(d => {
            const s = d.status || 'SEM STATUS';
            counts[s] = (counts[s] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [filtered]);

    // 2. Carga por Analista (apenas demandas ativas)
    const analystData = useMemo(() => {
        const counts = {};
        filtered
            .filter(isActive)
            .forEach(d => {
                const id = d.analyst_id;
                if (!id) return;
                counts[id] = (counts[id] || 0) + 1;
            });

        return Object.entries(counts)
            .map(([id, value]) => ({
                name: usersMap[id] || analysts.find(a => String(a.id) === String(id))?.name || `Analista ${id}`,
                value,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 15); // max 15
    }, [filtered, usersMap, analysts]);

    // 3. Heatmap: Stage × Priority (active demands)
    const heatmapData = useMemo(() => {
        const grid = {}; // grid[stage][priority] = count
        STAGE_ORDER.forEach(s => { grid[s] = { 0:0, 1:0, 2:0, 3:0, 4:0 }; });

        heatmapFiltered
            .filter(isActive)
            .forEach(d => {
                let stage = d.stage;
                if (!stage || !STAGE_ORDER.includes(stage)) stage = 'Sem Etapa';
                const p = d.weight ?? 4;
                if (grid[stage] && grid[stage][p] !== undefined) grid[stage][p]++;
            });

        const max = Math.max(1, ...Object.values(grid).flatMap(row => Object.values(row)));
        return { grid, max };
    }, [heatmapFiltered]);

    const totalDemands  = statusData.reduce((s, d) => s + d.value, 0);
    const activeDemands = filtered.filter(isActive).length;
    const heatmapActiveDemands = heatmapFiltered.filter(isActive).length;

    return (
        <div className="space-y-6">
            {/* KPI strip */}
            <div className="flex flex-wrap gap-4">
                {[
                    { label: 'Total de Demandas', value: totalDemands, color: 'indigo' },
                    { label: 'Demandas Ativas', value: activeDemands, color: 'emerald' },
                    { label: 'Analistas com Carga', value: analystData.length, color: 'amber' },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-3 flex flex-col gap-0.5 min-w-[160px]`}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                        <span className={`text-2xl font-black text-${color}-600`}>{value}</span>
                    </div>
                ))}
            </div>

            {/* Row 1: Status donut + Analista bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Donut */}
                <SectionCard
                    title="Distribuição por Status"
                    subtitle={`${totalDemands} demandas no total`}
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pt-2">
                        <div className="relative h-[220px] w-[220px] shrink-0 flex items-center justify-center">
                            {/* Inner Label */}
                            <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                                <span className="text-3xl font-black text-slate-800 tracking-tight">{totalDemands}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%" cy="50%"
                                        innerRadius={70} outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry) => (
                                            <Cell key={entry.name} fill={getColor(entry.name)} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<PieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 w-full min-w-0 pt-2">
                            <ul className="space-y-3 w-full">
                                {statusData.map(({ name, value }) => {
                                    const pct = totalDemands > 0 ? ((value / totalDemands) * 100).toFixed(1) : 0;
                                    return (
                                        <li key={name} className="flex flex-col gap-1.5 text-xs group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5 overflow-hidden">
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-125" style={{ background: getColor(name) }} />
                                                    <span className="truncate font-semibold text-slate-700 transition-colors group-hover:text-slate-900">{name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="font-bold text-slate-400 text-[10px] w-8 text-right">{pct}%</span>
                                                    <span className="font-black text-slate-800 tabular-nums w-6 text-right">{value}</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500 ease-out" 
                                                    style={{ width: `${pct}%`, backgroundColor: getColor(name) }} 
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </SectionCard>

                {/* Analista Bar */}
                <SectionCard
                    title="Carga por Analista"
                    subtitle="Demandas ativas por responsável"
                >
                    {analystData.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">Sem dados</p>
                    ) : (
                        <div style={{ height: Math.max(180, analystData.length * 36) }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={analystData}
                                    layout="vertical"
                                    margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<BarTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                                        <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </SectionCard>
            </div>

            {/* Row 2: Heatmap Stage × Priority */}
            <SectionCard
                title="Heatmap por Prioridade"
                subtitle="Concentração de demandas ativas por etapa e prioridade"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px]">
                        <thead>
                            <tr>
                                <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 w-36">
                                    Etapa
                                </th>
                                {[0,1,2,3,4].map(p => (
                                    <th key={p} className="pb-3 text-center">
                                        <span className="inline-flex flex-col items-center gap-0.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: PRIORITY_COLORS[p] }}>
                                                {PRIORITY_LABELS[p]}
                                            </span>
                                        </span>
                                    </th>
                                ))}
                                <th className="pb-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="space-y-1">
                            {STAGE_ORDER.map(stage => {
                                const row = heatmapData.grid[stage];
                                const rowTotal = Object.values(row).reduce((s, v) => s + v, 0);
                                return (
                                    <tr key={stage} className="group">
                                        <td className="pr-4 py-1 text-xs font-semibold text-slate-700">
                                            {stage}
                                        </td>
                                        {[0,1,2,3,4].map(p => (
                                            <td key={p} className="px-1 py-1 relative">
                                                <HeatCell value={row[p]} max={heatmapData.max} onClick={() => setSelectedHeatmapCell({ stage, priority: p })} />
                                            </td>
                                        ))}
                                        <td className="pl-2 py-1 text-center text-xs font-black text-slate-600">
                                            {rowTotal || '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Totals row */}
                            <tr className="border-t border-slate-200">
                                <td className="pt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</td>
                                {[0,1,2,3,4].map(p => {
                                    const colTotal = STAGE_ORDER.reduce((s, st) => s + (heatmapData.grid[st]?.[p] || 0), 0);
                                    return (
                                        <td key={p} className="pt-3 text-center text-xs font-black" style={{ color: PRIORITY_COLORS[p] }}>
                                            {colTotal || '—'}
                                        </td>
                                    );
                                })}
                                <td className="pt-3 text-center text-xs font-black text-slate-800">{heatmapActiveDemands}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold">INTENSIDADE:</span>
                    {[
                        { label: 'Nenhum', cls: 'bg-slate-100' },
                        { label: 'Baixo',  cls: 'bg-indigo-100' },
                        { label: 'Médio',  cls: 'bg-indigo-300' },
                        { label: 'Alto',   cls: 'bg-indigo-500' },
                        { label: 'Crítico',cls: 'bg-indigo-700' },
                    ].map(({ label, cls }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <div className={`w-4 h-4 rounded ${cls}`} />
                            <span className="text-[10px] text-slate-500">{label}</span>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Modal de Detalhamento do Heatmap */}
            {selectedHeatmapCell && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Demandas Ativas na Célula</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Etapa: <span className="font-semibold text-slate-700">{selectedHeatmapCell.stage}</span> • 
                                    Prioridade: <span className="font-bold ml-1" style={{ color: PRIORITY_COLORS[selectedHeatmapCell.priority] }}>{PRIORITY_LABELS[selectedHeatmapCell.priority]}</span>
                                </p>
                            </div>
                            <button onClick={() => setSelectedHeatmapCell(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-0 flex-1 custom-scrollbar">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="bg-white sticky top-0 text-[10px] uppercase font-black text-slate-400 z-10 shadow-sm border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 whitespace-nowrap tracking-widest">Nº Demanda</th>
                                        <th className="px-6 py-3 tracking-widest">Produto / Título</th>
                                        <th className="px-6 py-3 tracking-widest">Analista</th>
                                        <th className="px-6 py-3 tracking-widest">Status</th>
                                        <th className="px-6 py-3 whitespace-nowrap tracking-widest">Dt. Qual.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {heatmapFiltered
                                        .filter(isActive)
                                        .filter(d => {
                                            let s = d.stage;
                                            if (!s || !STAGE_ORDER.includes(s)) s = 'Sem Etapa';
                                            const p = d.weight ?? 4;
                                            return s === selectedHeatmapCell.stage && p === selectedHeatmapCell.priority;
                                        })
                                        .map(d => (
                                            <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-3 font-bold text-slate-800 whitespace-nowrap">{d.demand_number || '-'}</td>
                                                <td className="px-6 py-3 min-w-[200px] text-slate-700 font-medium">{d.product || 'Sem Título'}</td>
                                                <td className="px-6 py-3 font-medium text-slate-600 whitespace-nowrap">
                                                    {usersMap[d.analyst_id] || analysts.find(a => String(a.id) === String(d.analyst_id))?.name || 'Não Designado'}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border" style={{ backgroundColor: `${getColor(d.status)}10`, color: getColor(d.status), borderColor: `${getColor(d.status)}30` }}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-xs tabular-nums font-semibold text-slate-500 whitespace-nowrap">
                                                    {d.qualification_date ? new Date(d.qualification_date).toLocaleDateString('pt-BR') : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
