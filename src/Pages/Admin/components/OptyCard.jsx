import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, FileText, ChevronRight, Clock, MapPin } from 'lucide-react';

export default function OptyCard({ opty, onDetailClick }) {
    const statusColors = {
        'PENDENTE TRIAGEM': 'bg-violet-50 text-violet-600 border-violet-100',
        'DESIGNADA': 'bg-blue-50 text-blue-600 border-blue-100',
        'EM QUALIFICAÇÃO': 'bg-pink-50 text-pink-600 border-pink-100',
        'QUALIFICAÇÃO': 'bg-pink-50 text-pink-600 border-pink-100',
        'EM ANDAMENTO': 'bg-cyan-50 text-cyan-600 border-cyan-100',
        'CORREÇÃO': 'bg-rose-50 text-rose-600 border-rose-100',
        'CONGELADA': 'bg-slate-50 text-slate-400 border-slate-200',
        'ENTREGUE': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'CANCELADA': 'bg-slate-50 text-slate-400 border-slate-200',
        'OUTROS': 'bg-slate-50 text-slate-500 border-slate-200'
    };

    const priorityColors = {
        'P0 - Estratégico': 'text-rose-600',
        'P1 - Muito Alta': 'text-orange-600',
        'P2 - Alta': 'text-amber-600',
        'P3 - Média': 'text-emerald-600',
        'P4 - Baixa': 'text-slate-500',
    };

    const delayTheme = opty.delay > 30 
        ? { color: 'text-rose-600', bg: 'bg-rose-600', light: 'bg-rose-50' } 
        : opty.delay > 15 
            ? { color: 'text-orange-600', bg: 'bg-orange-600', light: 'bg-orange-50' } 
            : { color: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-50' };

    return (
        <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-200/60 p-5 flex flex-col h-full cursor-pointer transition-all hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] hover:border-indigo-200/50"
            onClick={() => onDetailClick(opty.id)}
        >
            {/* Corner Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-[0.02] rounded-tr-[2rem] pointer-events-none group-hover:opacity-[0.08] transition-opacity ${opty.isDelayed ? 'from-rose-600 to-transparent' : 'from-indigo-600 to-transparent'}`} />

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                            #{opty.demand_number || opty.id.slice(-6)}
                        </span>
                        {opty.isDelayed && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg uppercase">
                                <Clock className="w-2.5 h-2.5" /> Atraso
                            </span>
                        )}
                    </div>
                    <h4 className="text-[15px] font-black text-slate-800 uppercase leading-snug tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2" title={opty.title}>
                        {opty.title}
                    </h4>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <div className={`text-[9px] font-black px-2.5 py-1 rounded-xl uppercase border shadow-sm ${statusColors[opty.status] || statusColors.OUTROS}`}>
                    {opty.status}
                </div>
                <div className={`text-[9px] font-black px-2.5 py-1 rounded-xl uppercase border border-slate-100 bg-slate-50 ${priorityColors[opty.priority]}`}>
                    {opty.priority}
                </div>
            </div>

            <div className="space-y-4 mb-6 flex-1">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-slate-100 p-1.5 rounded-lg text-slate-400">
                        <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Responsável</p>
                        <p className="text-xs font-bold text-slate-700">{opty.responsible}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-slate-100 p-1.5 rounded-lg text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Unidade / Cliente</p>
                        <p className="text-xs font-bold text-slate-700 line-clamp-1" title={opty.client}>{opty.client}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-slate-100 p-1.5 rounded-lg text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Previsão</p>
                            <p className="text-xs font-bold text-slate-700">{opty.forecast}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-slate-100 p-1.5 rounded-lg text-slate-400">
                            <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Artefato</p>
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[80px]" title={opty.artifact}>{opty.artifact || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SLA Status</span>
                    <span className={`text-[11px] font-black ${delayTheme.color}`}>
                        {opty.delay > 0 ? `+${opty.delay}d` : 'No Prazo'}
                    </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (opty.delay / 45) * 100)}%` }}
                        className={`h-full rounded-full shadow-sm ${delayTheme.bg}`}
                    />
                </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] font-black text-slate-400 uppercase">Ver dossiê</span>
                <div className="bg-indigo-600 p-1.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </motion.div>
    );
}
