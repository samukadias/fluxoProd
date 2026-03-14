import React from 'react';
import { 
    LayoutDashboard, 
    AlertTriangle, 
    Star, 
    Clock, 
    PlayCircle 
} from 'lucide-react';

export default function OptyKpis({ metrics, loading }) {
    const kpis = [
        {
            label: 'TOTAL OPTYS',
            value: metrics.total,
            subValue: `${metrics.total} unidades`,
            icon: <LayoutDashboard className="w-6 h-6" />,
            color: 'blue'
        },
        {
            label: 'ATRASADAS',
            value: metrics.delayed,
            subValue: `${metrics.delayedPercent}% do total`,
            icon: <AlertTriangle className="w-6 h-6" />,
            color: 'rose'
        },
        {
            label: 'ALTA/ESTRATÉGICO',
            value: metrics.strategic,
            subValue: 'P0 + P1 priorizadas',
            icon: <Star className="w-6 h-6" />,
            color: 'amber'
        },
        {
            label: 'MAIOR ATRASO',
            value: metrics.maxDelay,
            subValue: 'Dia(s) de pendência',
            icon: <Clock className="w-6 h-6" />,
            color: 'indigo',
            prefix: '+'
        },
        {
            label: 'EM ANDAMENTO',
            value: metrics.inProgress,
            subValue: 'Demandas em execução',
            icon: <PlayCircle className="w-6 h-6" />,
            color: 'emerald'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {kpis.map((kpi, idx) => (
                <div 
                    key={idx}
                    className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1`}
                >
                    <div className={`absolute top-0 right-0 p-4 opacity-10 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
                        {kpi.icon}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{kpi.label}</p>
                    <p className={`text-4xl font-black text-slate-800`}>
                        {loading ? '...' : (kpi.prefix || '') + kpi.value + (kpi.label === 'MAIOR ATRASO' ? 'd' : '')}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">{kpi.subValue}</p>
                </div>
            ))}
        </div>
    );
}
