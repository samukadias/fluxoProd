import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OptyCard({ opty }) {
    const navigate = useNavigate();
    // Mock mapping for demo/layout
    const statusColors = {
        'PENDENTE TRIAGEM': 'bg-violet-100 text-violet-700',
        'DESIGNADA': 'bg-blue-100 text-blue-700 font-black',
        'EM QUALIFICAÇÃO': 'bg-pink-100 text-pink-700',
        'QUALIFICAÇÃO': 'bg-pink-100 text-pink-700',
        'EM ANDAMENTO': 'bg-cyan-100 text-cyan-700',
        'CORREÇÃO': 'bg-rose-100 text-rose-700',
        'CONGELADA': 'bg-slate-100 text-slate-500 border border-slate-200',
        'ENTREGUE': 'bg-emerald-100 text-emerald-700',
        'CANCELADA': 'bg-slate-100 text-slate-400',
        'OUTROS': 'bg-slate-100 text-slate-600'
    };

    const priorityColors = {
        'P0 - Estratégico': 'text-rose-600',
        'P1 - Muito Alta': 'text-orange-600',
        'P2 - Alta': 'text-amber-600',
        'P3 - Média': 'text-emerald-600',
        'P4 - Baixa': 'text-slate-500',
    };

    const delayColor = opty.delay > 30 ? 'bg-rose-500' : opty.delay > 15 ? 'bg-orange-500' : 'bg-emerald-500';

    return (
        <div 
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow flex flex-col h-full group cursor-pointer"
            onClick={() => navigate(`/demand-detail?id=${opty.id}`)}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-600 uppercase">
                        #{opty.demand_number || opty.id.slice(-6)}
                    </span>
                    <h4 className="text-sm font-black text-slate-800 uppercase leading-tight mt-1 line-clamp-2" title={opty.title}>
                        {opty.title}
                    </h4>
                </div>
                {opty.isDelayed && (
                    <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100 uppercase">
                        ATRASADA
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${statusColors[opty.status] || 'bg-slate-100 text-slate-600'}`}>
                    {opty.status}
                </span>
                {opty.pendency && (
                    <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 uppercase">
                        {opty.pendency}
                    </span>
                )}
                <span className={`text-[9px] font-black uppercase ${priorityColors[opty.priority] || 'text-slate-500'}`}>
                    {opty.priority}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4 flex-1">
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Responsável</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase">{opty.responsible}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cliente</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase truncate" title={opty.client}>{opty.client}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Previsão</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase">{opty.forecast}</p>
                </div>
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Artefato</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase" title={opty.artifact}>{opty.artifact || '-'}</p>
                </div>
            </div>

            <div className="mt-auto">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Atraso</span>
                    <span className={`text-[10px] font-black ${opty.delay > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {opty.delay > 0 ? `+${opty.delay}d` : 'No Prazo'}
                    </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${delayColor}`}
                        style={{ width: `${Math.min(100, (opty.delay / 45) * 100)}%` }}
                    />
                </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    className="w-full py-1.5 text-[10px] font-black text-blue-600 hover:bg-blue-50 rounded uppercase transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/demand-detail?id=${opty.id}`);
                    }}
                >
                    Ver Detalhes →
                </button>
            </div>
        </div>
    );
}
