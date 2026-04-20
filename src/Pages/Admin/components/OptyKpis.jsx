import React from 'react';
import { 
    LayoutDashboard, 
    AlertTriangle, 
    Star, 
    Clock, 
    PlayCircle,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptyKpis({ metrics, loading }) {
    const kpis = [
        {
            label: 'TOTAL OPTYS',
            value: metrics.total,
            subValue: `${metrics.total} solicitações`,
            icon: <LayoutDashboard className="w-5 h-5" />,
            color: 'from-blue-600 to-indigo-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600'
        },
        {
            label: 'ATRASADAS',
            value: metrics.delayed,
            subValue: `${metrics.delayedPercent}% crítico`,
            icon: <AlertTriangle className="w-5 h-5" />,
            color: 'from-rose-600 to-red-600',
            bg: 'bg-rose-50',
            text: 'text-rose-600'
        },
        {
            label: 'ESTRATÉGICO',
            value: metrics.strategic,
            subValue: 'Prioridade P0/P1',
            icon: <Star className="w-5 h-5" />,
            color: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50',
            text: 'text-amber-600'
        },
        {
            label: 'MAIOR ATRASO',
            value: metrics.maxDelay,
            subValue: 'Máximo registrado',
            icon: <Clock className="w-5 h-5" />,
            color: 'from-purple-600 to-indigo-700',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            suffix: 'd'
        },
        {
            label: 'EM CURSO',
            value: metrics.inProgress,
            subValue: 'Produção ativa',
            icon: <PlayCircle className="w-5 h-5" />,
            color: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {kpis.map((kpi, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="relative group cursor-default"
                >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rounded-[2rem] -m-1" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
                    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-6 flex flex-col h-full relative overflow-hidden transition-all group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] group-hover:border-indigo-100/50">
                        {/* Decorative background element */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.1] transition-all bg-gradient-to-br ${kpi.color}`} />
                        
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.text} shadow-inner`}>
                                {kpi.icon}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                <TrendingUp className="w-3 h-3" />
                                +2%
                            </div>
                        </div>

                        <div className="mt-auto">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
                                    {loading ? '...' : kpi.value}
                                </h3>
                                {kpi.suffix && <span className="text-lg font-black text-slate-400">{kpi.suffix}</span>}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                {kpi.subValue}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
