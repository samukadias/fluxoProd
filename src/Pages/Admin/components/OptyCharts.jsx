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
import { X, Info, Clock, AlertCircle, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PREVENT_RENDER_BORDERS = { stroke: 'none' };

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 shadow-2xl rounded-2xl border border-slate-700 p-4 backdrop-blur-md">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-700 pb-2">{label || payload[0].name}</p>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color || payload[0].fill }} />
                    <span className="text-xl font-black text-white">{payload[0].value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Solicitações</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function OptyCharts({ data, loading }) {
    const [selectedOpty, setSelectedOpty] = useState(null);

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
            .slice(0, 8);
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
                id: d.demand_number || (typeof d.id === 'string' ? d.id.slice(-4) : d.id), 
                title: d.title,
                status: d.status,
                observations: d.observation || d.pendency || 'Nenhuma observação pendente.',
                days: d.delay 
            }));
    }, [data]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Distribuição por Status */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-6 flex flex-col items-center"
                >
                    <div className="flex items-center justify-between w-full mb-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <PieChartIcon className="w-3.5 h-3.5 text-indigo-500" /> Distribuição por Status
                        </h3>
                    </div>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={65}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.DEFAULT} className="transition-all hover:opacity-80 cursor-pointer" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Ativos</span>
                            <span className="text-3xl font-black text-slate-800">{data.filter(d => !['ENTREGUE', 'CANCELADA'].includes(d.status)).length}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Opty por Responsável */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-6 lg:col-span-1"
                >
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                         <BarChart2 className="w-3.5 h-3.5 text-indigo-500" /> Carga por Analista
                    </h3>
                    <div className="h-72 w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={responsibleData}
                                margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                                barGap={12}
                            >
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tick={{ fontSize: 9, fontWeight: 900, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={60}
                                />
                                <Tooltip cursor={{ fill: '#F1F5F9', radius: 8 }} content={<CustomTooltip />} />
                                <Bar dataKey="count" fill="#6366F1" radius={[0, 8, 8, 0]} barSize={14} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Distribuição por Prioridade */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-6"
                >
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                         <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Heatmap de Prioridade
                    </h3>
                    <div className="space-y-6">
                        {priorityData.map((p, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" style={{ backgroundColor: p.color }} />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">{p.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-800">{p.value}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.value / (data.length || 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full rounded-full shadow-sm" 
                                        style={{ backgroundColor: p.color }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Dias de Atraso por Opty - Premium Timeline Bar */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-200/60 p-8 mt-10 relative overflow-hidden"
            >
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Clock className="w-4 h-4 text-rose-500" /> Diagnóstico de Latência (Inflow)
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Principais pontos de retenção no cronograma</p>
                    </div>
                    {selectedOpty && (
                        <motion.button 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={() => setSelectedOpty(null)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase border border-rose-100"
                        >
                            <X className="w-4 h-4" /> Resetar Visualização
                        </motion.button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    <div className="xl:col-span-3 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={delayData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="id" 
                                    tick={{ fontSize: 9, fontWeight: 900, fill: '#94A3B8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis 
                                    tick={{ fontSize: 9, fontWeight: 900, fill: '#94A3B8' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip cursor={{ fill: '#F8FAFC', radius: 12 }} content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="days" 
                                    radius={[12, 12, 4, 4]} 
                                    barSize={28}
                                    onClick={(data) => setSelectedOpty(data)}
                                    className="cursor-pointer"
                                    animationDuration={1500}
                                >
                                    {delayData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={selectedOpty?.id === entry.id ? '#4F46E5' : (entry.days > 30 ? '#EF4444' : entry.days > 15 ? '#F59E0B' : '#6366F1')} 
                                            className="transition-all duration-500 hover:opacity-80"
                                            fillOpacity={selectedOpty && selectedOpty.id !== entry.id ? 0.2 : 0.9}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Detail Card Right Side */}
                    <div className="flex flex-col">
                        <AnimatePresence mode="wait">
                            {selectedOpty ? (
                                <motion.div 
                                    key={selectedOpty.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden flex flex-col"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full pointer-events-none" />
                                    
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                            #{selectedOpty.id}
                                        </div>
                                        <div className="flex items-center gap-2 text-rose-400 text-[9px] font-black uppercase bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                                            <AlertCircle className="w-3 h-3" /> {selectedOpty.days}D Atraso
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-black leading-tight mb-4 uppercase tracking-tight">
                                        {selectedOpty.title}
                                    </h4>

                                    <div className="mt-auto space-y-4">
                                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                <Info className="w-3 h-3 text-indigo-400" /> Histórico de Bloqueio
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-300 italic leading-relaxed line-clamp-4">
                                                "{selectedOpty.observations}"
                                            </p>
                                        </div>
                                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20">
                                            Analisar Opty
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="bg-white p-4 rounded-3xl shadow-sm mb-4 border border-slate-100">
                                        <Clock className="w-8 h-8 text-indigo-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                                        Selecione uma barra no histograma para mergulhar nos detalhes da pendência
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
