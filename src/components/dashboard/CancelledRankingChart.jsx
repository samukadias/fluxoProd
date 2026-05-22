import React from 'react';

export default function CancelledRankingChart({ data = [], onItemClick }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                <p className="text-sm">Nenhum cancelamento registrado no período</p>
            </div>
        );
    }

    // Ordenar do maior para o menor
    const sortedData = [...data].sort((a, b) => b.count - a.count);

    return (
        <div className="flex flex-col gap-3 py-2 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {sortedData.map((item, index) => (
                <div 
                    key={index} 
                    className={`flex items-center justify-between group transition-all p-1 rounded-lg ${onItemClick ? 'cursor-pointer hover:bg-red-50/50' : ''}`}
                    onClick={() => onItemClick && onItemClick(item)}
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {index + 1}
                        </div>
                        <span className="text-sm text-slate-700 font-medium truncate group-hover:text-red-700 transition-colors" title={item.name}>
                            {item.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                        <div className="h-[2px] w-8 bg-slate-100 group-hover:bg-red-100 transition-colors" />
                        <span className="text-base font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 min-w-[32px] text-center">
                            {item.count}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
