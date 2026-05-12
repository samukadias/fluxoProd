import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HelpCircle } from 'lucide-react';

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const STAGE_ORDER = ['Triagem','Qualificação','PO','OO','RT','ESP'];
const CLOSED = new Set(['ENTREGUE','CANCELADA','CONGELADA','TRIAGEM NÃO ELEGÍVEL']);
const PRIORITY_LABELS = { 0:'P0 — Estratégico', 1:'P1 — Muito Alta', 2:'P2 — Alta', 3:'P3 — Média', 4:'P4 — Baixa' };

// Tooltip descriptions for each metric
const METRIC_TOOLTIPS = {
    total: 'Quantidade total de demandas ativas (em aberto) ao final da semana.',
    entradas: 'Novas demandas que entraram (criadas ou qualificadas) durante a semana.',
    reaberturas: 'Demandas que retornaram do status ENTREGUE para um status ativo.',
    cancelamentos: 'Demandas que foram canceladas durante a semana.',
    entregues: 'Demandas que foram concluídas e entregues durante a semana.',
    comEvolucao: 'Demandas que avançaram de etapa no pipeline (ex: Triagem → PO).',
    semEvolucao: 'Demandas ativas que permaneceram na mesma etapa durante toda a semana.',
    comRegressao: 'Demandas que retrocederam de etapa (ex: OO → Qualificação).',
};

// Returns Mon-Sun weeks that overlap with the month
function getWeeksForMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0); lastDay.setHours(23,59,59,999);
    const dow = firstDay.getDay();
    const start = new Date(firstDay); start.setDate(firstDay.getDate() - (dow === 0 ? 6 : dow - 1)); start.setHours(0,0,0,0);
    const weeks = [];
    let cur = new Date(start);
    while (cur <= lastDay) {
        const end = new Date(cur); end.setDate(cur.getDate() + 6); end.setHours(23,59,59,999);
        weeks.push({ start: new Date(cur), end: new Date(end > lastDay ? lastDay : end) });
        cur.setDate(cur.getDate() + 7);
    }
    return weeks;
}

function computeWeekMetrics(demands, demandIds, histByDemand, stageHistByDemand, weekStart, weekEnd) {
    // Active at end of week snapshot
    const active = demands.filter(d => {
        if (!demandIds.has(d.id)) return false;
        const ref = d.qualification_date || d.created_date;
        if (!ref || new Date(ref) > weekEnd) return false;
        if (!CLOSED.has(d.status)) return true;
        if (d.status === 'ENTREGUE' && d.delivery_date) return new Date(d.delivery_date) > weekEnd;
        if (d.status === 'CANCELADA') {
            const ev = (histByDemand[d.id] || []).filter(h => h.to_status === 'CANCELADA').sort((a,b) => new Date(b.changed_at)-new Date(a.changed_at));
            return ev.length > 0 && new Date(ev[0].changed_at) > weekEnd;
        }
        return false;
    });

    const byPriority = {0:0,1:0,2:0,3:0,4:0};
    const byStage = {}; STAGE_ORDER.forEach(s => byStage[s]=0);

    active.forEach(d => {
        byPriority[d.weight ?? 4]++;
        const sh = (stageHistByDemand[d.id] || []).find(s => {
            const e = s.entered_at && new Date(s.entered_at);
            const x = s.exited_at  && new Date(s.exited_at);
            return e && e <= weekEnd && (!x || x > weekEnd);
        });
        const stage = sh ? sh.stage : d.stage;
        if (stage && byStage[stage] !== undefined) byStage[stage]++;
    });

    // Events this week
    const entradas=new Set(), reaberturas=new Set(), cancelamentos=new Set(), entregues=new Set();
    demands.forEach(d => {
        if (!demandIds.has(d.id)) return;
        const ref = d.qualification_date || d.created_date;
        if (ref) { const dt=new Date(ref); if (dt>=weekStart&&dt<=weekEnd) entradas.add(d.id); }
    });
    (Object.entries(histByDemand)).forEach(([id, evts]) => {
        if (!demandIds.has(id)) return;
        evts.forEach(h => {
            const at = h.changed_at && new Date(h.changed_at);
            if (!at || at < weekStart || at > weekEnd) return;
            if (!h.from_status && h.to_status && !CLOSED.has(h.to_status)) entradas.add(id);
            if (h.from_status==='ENTREGUE' && !CLOSED.has(h.to_status)) reaberturas.add(id);
            if (h.to_status==='CANCELADA') cancelamentos.add(id);
            if (h.to_status==='ENTREGUE') entregues.add(id);
        });
    });

    // Stage evolution
    const stageIdx = s => STAGE_ORDER.indexOf(s);
    const moved=new Set(), evol=new Set(), regr=new Set();
    const weekStages = {};
    Object.entries(stageHistByDemand).forEach(([id, entries]) => {
        if (!demandIds.has(id)) return;
        entries.forEach(sh => {
            const at = sh.entered_at && new Date(sh.entered_at);
            if (!at || at < weekStart || at > weekEnd) return;
            if (!weekStages[id]) weekStages[id]=[];
            weekStages[id].push({ stage: sh.stage, at });
            moved.add(id);
        });
    });
    Object.entries(weekStages).forEach(([id, arr]) => {
        arr.sort((a,b)=>a.at-b.at);
        const diff = stageIdx(arr[arr.length-1].stage) - stageIdx(arr[0].stage);
        if (diff>0) evol.add(id); else if (diff<0) regr.add(id);
    });

    return {
        total: active.length, byPriority, byStage,
        entradas: entradas.size, reaberturas: reaberturas.size,
        cancelamentos: cancelamentos.size, entregues: entregues.size,
        comEvolucao: evol.size, semEvolucao: active.filter(d=>!moved.has(d.id)).length, comRegressao: regr.size,
    };
}

function CellValue({ curr, prev }) {
    if (curr === null || curr === undefined) return <span className="text-slate-300">—</span>;
    const diff = prev != null ? curr - prev : null;
    const pct  = prev != null && prev !== 0 ? Math.round(((curr-prev)/prev)*100) : null;
    return (
        <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-800">{curr}</span>
            {diff !== null && diff !== 0 && (
                <span className={`text-[10px] font-semibold ${diff>0?'text-rose-500':'text-emerald-500'}`}>
                    {diff>0?'+':''}{diff}{pct!=null?` (${pct>0?'+':''}${pct}%)`:' '}
                </span>
            )}
        </div>
    );
}

function CellValueGood({ curr, prev }) {
    // For "good if increasing" metrics (entregues, evolução)
    if (curr === null || curr === undefined) return <span className="text-slate-300">—</span>;
    const diff = prev != null ? curr - prev : null;
    return (
        <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-800">{curr}</span>
            {diff !== null && diff !== 0 && (
                <span className={`text-[10px] font-semibold ${diff>0?'text-emerald-500':'text-rose-500'}`}>
                    {diff>0?'+':''}{diff}
                </span>
            )}
        </div>
    );
}

// Tooltip component for metric row labels
function MetricTooltip({ text }) {
    if (!text) return null;
    return (
        <span className="group relative inline-flex ml-1 cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-60 px-3 py-2 rounded-lg bg-slate-900 text-white text-[11px] leading-snug shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-normal">
                {text}
            </span>
        </span>
    );
}

// Section header colors
const SECTION_COLORS = {
    'VISÃO GERAL': 'bg-indigo-50/80 text-indigo-500 border-indigo-100',
    'PRIORIDADE (Ativos)': 'bg-amber-50/80 text-amber-600 border-amber-100',
    'ETAPA (Ativos)': 'bg-sky-50/80 text-sky-600 border-sky-100',
    'MOVIMENTAÇÕES': 'bg-emerald-50/80 text-emerald-600 border-emerald-100',
    'EVOLUÇÃO DE ETAPA': 'bg-violet-50/80 text-violet-600 border-violet-100',
};

// Evolution chart line colors
const CHART_LINES = [
    { key: 'entradas',      label: 'Entradas',      color: '#22c55e', strokeWidth: 2 },
    { key: 'reaberturas',   label: 'Reaberturas',   color: '#f59e0b', strokeWidth: 2 },
    { key: 'entregues',     label: 'Entregas',       color: '#3b82f6', strokeWidth: 2 },
    { key: 'cancelamentos', label: 'Cancelamentos', color: '#ef4444', strokeWidth: 2 },
    { key: 'total',         label: 'Backlog (Ativas)', color: '#94a3b8', strokeWidth: 2.5, strokeDasharray: '6 3' },
];

// Custom chart tooltip
function ChartTooltipContent({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 space-y-1.5">
            <p className="text-xs font-bold text-slate-700 mb-2">{label}</p>
            {payload.map(p => (
                <div key={p.dataKey} className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <span className="text-slate-600">{p.name}:</span>
                    <span className="font-bold text-slate-900">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function WeeklyTrackingTab({ analystId, demands = [], history = [], stageHistory = [] }) {
    const currentYear  = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [selectedYear,  setSelectedYear]  = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [showHelp, setShowHelp] = useState(false);

    const availableYears = useMemo(() => {
        const ys = new Set([currentYear, currentYear-1]);
        demands.forEach(d => { const r=d.qualification_date||d.created_date; if(r) ys.add(new Date(r).getFullYear()); });
        return [...ys].sort().reverse();
    }, [demands, currentYear]);

    const demandIds = useMemo(() => {
        const base = demands.filter(d => !analystId || analystId==='all' || d.analyst_id===analystId);
        return new Set(base.map(d=>d.id));
    }, [demands, analystId]);

    const histByDemand = useMemo(() => {
        const m = {};
        history.forEach(h => { if(!m[h.demand_id]) m[h.demand_id]=[]; m[h.demand_id].push(h); });
        return m;
    }, [history]);

    const stageHistByDemand = useMemo(() => {
        const m = {};
        stageHistory.forEach(h => { if(!m[h.demand_id]) m[h.demand_id]=[]; m[h.demand_id].push(h); });
        return m;
    }, [stageHistory]);

    const monthsData = useMemo(() => {
        const weeks = getWeeksForMonth(selectedYear, selectedMonth);
        const weeksWithMetrics = weeks.map(w => ({
            ...w,
            metrics: computeWeekMetrics(demands, demandIds, histByDemand, stageHistByDemand, w.start, w.end),
        }));
        return [{ month: selectedMonth, label: `${MONTH_NAMES[selectedMonth]} ${selectedYear}`, weeks: weeksWithMetrics }];
    }, [selectedMonth, selectedYear, demands, demandIds, histByDemand, stageHistByDemand]);

    // Chart data from weeks
    const chartData = useMemo(() => {
        if (!monthsData[0]) return [];
        return monthsData[0].weeks.map((w, i) => ({
            name: `S${i+1} (${format(w.start,'dd/MM')}–${format(w.end,'dd/MM')})`,
            entradas: w.metrics.entradas,
            reaberturas: w.metrics.reaberturas,
            entregues: w.metrics.entregues,
            cancelamentos: w.metrics.cancelamentos,
            total: w.metrics.total,
        }));
    }, [monthsData]);

    const ROWS = [
        { section: 'VISÃO GERAL' },
        { key: 'total', label: 'Total Optys (Ativas)', tooltip: METRIC_TOOLTIPS.total, get: m=>m.total, good: false },
        { section: 'PRIORIDADE (Ativos)' },
        ...([0,1,2,3,4].map(w=>({ key:`p${w}`, label: PRIORITY_LABELS[w], tooltip: `Qtde de demandas ativas com prioridade ${PRIORITY_LABELS[w]} ao fim da semana.`, get: m=>m.byPriority[w], good: false, indent: true }))),
        { section: 'ETAPA (Ativos)' },
        ...STAGE_ORDER.map(s=>({ key:`stage_${s}`, label: s, tooltip: `Qtde de demandas ativas na etapa "${s}" ao fim da semana.`, get: m=>m.byStage[s], good: false, indent: true })),
        { section: 'MOVIMENTAÇÕES' },
        { key: 'entradas',     label: 'Entradas (novas)',           tooltip: METRIC_TOOLTIPS.entradas,      get: m=>m.entradas,     good: true  },
        { key: 'reaberturas',  label: 'Reaberturas',                tooltip: METRIC_TOOLTIPS.reaberturas,   get: m=>m.reaberturas,  good: false },
        { key: 'cancelamentos',label: 'Cancelamentos',              tooltip: METRIC_TOOLTIPS.cancelamentos, get: m=>m.cancelamentos, good: false },
        { key: 'entregues',    label: 'Entregues / Propostas',      tooltip: METRIC_TOOLTIPS.entregues,     get: m=>m.entregues,    good: true  },
        { section: 'EVOLUÇÃO DE ETAPA' },
        { key: 'comEvolucao',  label: '▶ Com evolução de etapa',   tooltip: METRIC_TOOLTIPS.comEvolucao,   get: m=>m.comEvolucao,  good: true  },
        { key: 'semEvolucao',  label: '⏸ Sem evolução de etapa',   tooltip: METRIC_TOOLTIPS.semEvolucao,   get: m=>m.semEvolucao,  good: false },
        { key: 'comRegressao', label: '◀ Com regressão de etapa',  tooltip: METRIC_TOOLTIPS.comRegressao,  get: m=>m.comRegressao, good: false },
    ];

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-end gap-4">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ano</p>
                    <div className="flex gap-1">
                        {availableYears.map(y => (
                            <button key={y} onClick={() => setSelectedYear(y)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                    y===selectedYear ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                }`}>{y}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Meses</p>
                    <div className="flex flex-wrap gap-1">
                        {MONTH_NAMES.map((name, i) => (
                            <button key={i} onClick={() => setSelectedMonth(i)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                                    selectedMonth === i
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                                }`}>{name.substring(0,3)}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Gráfico de Evolução Semanal ═══ */}
            {chartData.length > 0 && (
                <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                    <div className="bg-gradient-to-r from-emerald-900 to-teal-700 px-6 py-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-300" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Evolução Semanal</h3>
                        <span className="ml-auto text-[10px] text-emerald-200 font-semibold">
                            {MONTH_NAMES[selectedMonth]} {selectedYear}
                        </span>
                    </div>
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#e2e8f0' }}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#e2e8f0' }}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                                />
                                {CHART_LINES.map(line => (
                                    <Line
                                        key={line.key}
                                        type="monotone"
                                        dataKey={line.key}
                                        name={line.label}
                                        stroke={line.color}
                                        strokeWidth={line.strokeWidth}
                                        strokeDasharray={line.strokeDasharray}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 2 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ═══ Tabela de Acompanhamento Semanal ═══ */}
            {monthsData.map(({ month, label, weeks }) => (
                <div key={month} className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                    {/* Month header */}
                    <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-6 py-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-300" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{label}</h3>
                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className="ml-2 text-indigo-300 hover:text-white transition-colors"
                            title="Como ler esta tabela?"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <span className="ml-auto text-[10px] text-indigo-300 font-semibold">{weeks.length} semana{weeks.length!==1?'s':''}</span>
                    </div>

                    {/* Help panel */}
                    {showHelp && (
                        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 space-y-2">
                            <p className="text-xs font-bold text-indigo-800 mb-2">📊 Como interpretar esta tabela</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-indigo-700">
                                <div className="flex items-start gap-2">
                                    <span className="w-3 h-3 mt-0.5 rounded-full bg-indigo-200 flex-shrink-0" />
                                    <span><b>Visão Geral / Prioridade / Etapa:</b> Retrato ("foto") da situação ao fim de cada semana.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-3 h-3 mt-0.5 rounded-full bg-emerald-200 flex-shrink-0" />
                                    <span><b>Movimentações:</b> O que aconteceu <i>durante</i> a semana (entradas, entregas, etc).</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-3 h-3 mt-0.5 rounded-full bg-violet-200 flex-shrink-0" />
                                    <span><b>Evolução de Etapa:</b> Se as demandas ativas avançaram, ficaram paradas ou regrediram no pipeline.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-3 h-3 mt-0.5 rounded-full bg-rose-200 flex-shrink-0" />
                                    <span><b>Setas de variação:</b> <span className="text-emerald-600 font-bold">Verde</span> = melhora, <span className="text-rose-500 font-bold">Vermelho</span> = piora.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            {/* Week headers */}
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 py-3 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest w-52 sticky left-0 bg-slate-50 z-10">
                                        Métrica
                                    </th>
                                    {weeks.map((w, wi) => (
                                        <th key={wi} className="px-4 py-3 text-center text-[11px] font-black text-slate-600 uppercase tracking-wide min-w-[120px]">
                                            <div>Semana {wi+1}</div>
                                            <div className="text-[10px] font-normal text-slate-400 mt-0.5 normal-case">
                                                {format(w.start,'dd/MM')} – {format(w.end,'dd/MM')}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((row, ri) => {
                                    if (row.section) {
                                        const sectionColor = SECTION_COLORS[row.section] || 'bg-slate-50/80 text-slate-400 border-slate-100';
                                        return (
                                            <tr key={ri} className={sectionColor.split(' ')[0]}>
                                                <td colSpan={weeks.length+1} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-y ${sectionColor}`}>
                                                    {row.section}
                                                </td>
                                            </tr>
                                        );
                                    }
                                    return (
                                        <tr key={ri} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors">
                                            <td className={`px-4 py-2.5 text-xs font-medium text-slate-700 sticky left-0 bg-white border-r border-slate-100 ${row.indent ? 'pl-7' : ''}`}>
                                                <span className="flex items-center gap-1">
                                                    {row.label}
                                                    <MetricTooltip text={row.tooltip} />
                                                </span>
                                            </td>
                                            {weeks.map((w, wi) => {
                                                const curr = row.get(w.metrics);
                                                const prev = wi>0 ? row.get(weeks[wi-1].metrics) : null;
                                                return (
                                                    <td key={wi} className="px-4 py-2.5 text-center">
                                                        {row.good
                                                            ? <CellValueGood curr={curr} prev={prev} />
                                                            : <CellValue curr={curr} prev={prev} />
                                                        }
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}
