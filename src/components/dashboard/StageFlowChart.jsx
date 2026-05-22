import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 shadow-2xl rounded-2xl border border-slate-700 p-4 backdrop-blur-md">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-700 pb-2">{label || payload[0].name}</p>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color || payload[0].fill }} />
                    <span className="text-xl font-black text-white">{payload[0].value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Demandas</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function StageFlowChart({ data }) {
    const [selectedStage, setSelectedStage] = useState(null);

    const stageData = useMemo(() => {
        const activeData = data.filter(d => !['ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL'].includes(d.status));
        const stagesMap = {
            'Triagem': 0,
            'Qualificação': 0,
            'PO': 0,
            'OO': 0,
            'RT': 0,
            'ESP': 0
        };
        
        activeData.forEach(d => {
            if (d.stage && stagesMap[d.stage] !== undefined) {
                stagesMap[d.stage]++;
            }
        });

        return Object.entries(stagesMap).map(([name, value]) => ({ name, value }));
    }, [data]);

    return (
        <div className="relative overflow-hidden w-full h-[450px]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" /> Fluxo de Etapas (CDPC)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Volume de demandas em aberto agrupadas por etapa atual no fluxo</p>
                </div>
                {selectedStage && (
                    <motion.button 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => setSelectedStage(null)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase border border-indigo-100"
                    >
                        <X className="w-4 h-4" /> Resetar Visualização
                    </motion.button>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-4rem)] min-h-0">
                <div className="lg:col-span-3 h-full pb-4 min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stageData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1F5F9" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip cursor={{ fill: '#F8FAFC', radius: 12 }} content={<CustomTooltip />} />
                            <Bar 
                                dataKey="value" 
                                radius={[8, 8, 4, 4]} 
                                barSize={48}
                                onClick={(dataArg) => setSelectedStage(dataArg.name)}
                                className="cursor-pointer"
                                animationDuration={1000}
                            >
                                {stageData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={selectedStage === entry.name ? '#4F46E5' : '#818CF8'} 
                                        className="transition-all duration-300 hover:opacity-80"
                                        fillOpacity={selectedStage && selectedStage !== entry.name ? 0.3 : 1}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Painel de Detalhes Lateral */}
                <div className="flex flex-col h-full lg:pl-2 min-h-0">
                    <AnimatePresence mode="wait">
                        {selectedStage ? (
                            <motion.div 
                                key={selectedStage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full bg-slate-900 rounded-[1.5rem] p-5 text-white shadow-xl relative overflow-hidden flex flex-col min-h-0"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/30 blur-[40px] rounded-full pointer-events-none" />
                                
                                <div className="flex items-center gap-3 mb-4 shrink-0">
                                    <div className="bg-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">
                                        {selectedStage}
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">
                                        {data.filter(d => !['ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL'].includes(d.status) && d.stage === selectedStage).length} demandas
                                    </span>
                                </div>

                                <div className="mt-2 space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                                    {data.filter(d => !['ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL'].includes(d.status) && d.stage === selectedStage)
                                        .map((opty, idx) => (
                                            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10 hover:bg-white/20 transition-colors shrink-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-[10px] font-black text-indigo-300">#{opty.demand_number || (opty.id && String(opty.id).slice(-4))}</p>
                                                    <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">{opty.status}</span>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-100 line-clamp-2 leading-tight">{opty.title || opty.product}</p>
                                            </div>
                                        ))
                                    }
                                    {data.filter(d => !['ENTREGUE', 'CANCELADA', 'CONGELADA', 'TRIAGEM NÃO ELEGÍVEL'].includes(d.status) && d.stage === selectedStage).length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 shrink-0">
                                            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Vazio</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-slate-50/50 rounded-[1.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center min-h-0">
                                <div className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                                    <Layers className="w-6 h-6 text-indigo-300" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Selecione etapa para detalhes
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
