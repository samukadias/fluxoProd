import React, { useState, useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { X, Info, Clock, AlertCircle } from 'lucide-react';

export default function OptyCharts({ data, loading }) {
    const [selectedOpty, setSelectedOpty] = useState(null);

    // Status color mapping for CDPC
    const COLORS = {
        'PENDENTE TRIAGEM': '#8B5CF6',
        'QUALIFICAÇÃO': '#EC4899',
        'EM QUALIFICAÇÃO': '#EC4899',
        'EM ANDAMENTO': '#06B6D4',
        'DESIGNADA': '#F59E0B',
        'ENTREGUE': '#10B981',
        'CANCELADA': '#64748B',
        'DEFAULT': '#94A3B8'
    };

    const statusData = useMemo(() => {
        const relevantStatuses = ['PENDENTE TRIAGEM', 'DESIGNADA', 'QUALIFICAÇÃO', 'EM QUALIFICAÇÃO', 'EM ANDAMENTO', 'PENDÊNCIA DOS', 'PENDÊNCIA DOP'];
        const counts = data.reduce((acc, curr) => {
            if (relevantStatuses.includes(curr.status)) {
                acc[curr.status] = (acc[curr.status] || 0) + 1;
            } else if (!['ENTREGUE', 'CANCELADA'].includes(curr.status)) {
                acc['OUTROS'] = (acc['OUTROS'] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [data]);

    const responsibleData = useMemo(() => {
        const counts = data.reduce((acc, curr) => {
            if (['ENTREGUE', 'CANCELADA'].includes(curr.status)) return acc;
            const firstName = curr.responsible.split(' ')[0];
            acc[firstName] = (acc[firstName] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [data]);

    const priorityData = useMemo(() => {
        const activeData = data.filter(d => !['ENTREGUE', 'CANCELADA'].includes(d.status));
        const priorities = [
            { label: 'P0 - Estratégico', weight: 0, color: '#EF4444' },
            { label: 'P1 - Muito Alta', weight: 1, color: '#F97316' },
            { label: 'P2 - Alta', weight: 2, color: '#EAB308' },
            { label: 'P3 - Média', weight: 3, color: '#22C55E' },
            { label: 'P4 - Baixa', weight: 4, color: '#64748B' },
        ];
        return priorities.map(p => ({
            ...p,
            value: activeData.filter(d => d.weight === p.weight).length
        }));
    }, [data]);

    const delayData = useMemo(() => {
        return data
            .filter(d => d.delay > 0 && !['ENTREGUE', 'CANCELADA'].includes(d.status))
            .sort((a, b) => b.delay - a.delay)
            .slice(0, 15)
            .map(d => ({ 
                id: d.demand_number || d.id.slice(-4), 
                title: d.title,
                status: d.status,
                observations: d.observation || d.pendency || 'Nenhuma observação pendente.',
                days: d.delay 
            }));
    }, [data]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Distribuição por Status */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col items-center">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 self-start">Distribuição por Status</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.DEFAULT} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Opty por Responsável */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 lg:col-span-1">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Opty por Responsável</h3>
                    <div className="h-72 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={responsibleData}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip cursor={{ fill: '#F8FAFC' }} />
                                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribuição por Prioridade */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Distribuição por Prioridade</h3>
                    <div className="space-y-5 mt-4">
                        {priorityData.map((p, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                        <span className="text-[10px] font-bold text-slate-600">{p.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">{p.value}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-700" 
                                        style={{ width: `${(p.value / (data.length || 1)) * 100}%`, backgroundColor: p.color }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dias de Atraso por Opty */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mt-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dias de Atraso por Opty</h3>
                        <p className="text-[9px] text-slate-400 font-medium uppercase mt-1">Clique na barra para detalhes</p>
                    </div>
                    {selectedOpty && (
                        <button 
                            onClick={() => setSelectedOpty(null)}
                            className="text-[10px] font-black text-rose-500 hover:bg-rose-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 uppercase"
                        >
                            <X className="w-3 h-3" /> Limpar Seleção
                        </button>
                    )}
                </div>
                
                <div className="flex flex-col gap-6">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={delayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="id" 
                                    tick={{ fontSize: 8, fontWeight: 700, fill: '#94A3B8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    tick={{ fontSize: 8, fontWeight: 700, fill: '#94A3B8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip cursor={{ fill: '#F8FAFC' }} />
                                <Bar 
                                    dataKey="days" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={24}
                                    onClick={(data) => setSelectedOpty(data)}
                                    className="cursor-pointer"
                                >
                                    {delayData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={selectedOpty?.id === entry.id ? '#4F46E5' : (entry.days > 30 ? '#EF4444' : entry.days > 15 ? '#F97316' : '#F59E0B')} 
                                            className="transition-all duration-300"
                                            fillOpacity={selectedOpty && selectedOpty.id !== entry.id ? 0.3 : 1}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Detail Card Below */}
                    <div className="min-h-[120px]">
                        {selectedOpty ? (
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase shadow-sm">
                                            #{selectedOpty.id}
                                        </div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase leading-tight">
                                            {selectedOpty.title}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[selectedOpty.status] || COLORS.DEFAULT }} />
                                            <span className="text-[10px] font-black text-slate-700 uppercase">{selectedOpty.status}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 font-black text-[10px] uppercase">
                                            <Clock className="w-3 h-3" />
                                            Atraso de {selectedOpty.days} dias
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> Observações / Pendências
                                    </p>
                                    <p className="text-xs font-bold text-slate-600 italic leading-relaxed whitespace-pre-wrap">
                                        {selectedOpty.observations}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center py-8 text-center bg-slate-50/30">
                                <Info className="w-6 h-6 text-slate-200 mb-2" />
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                    Selecione uma barra no gráfico para ver o detalhamento completo aqui
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
