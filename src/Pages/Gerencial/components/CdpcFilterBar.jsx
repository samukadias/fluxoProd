import React from 'react';

/**
 * CdpcFilterBar — barra de filtros do painel CDPC.
 * Recebe os filtros e handlers como props para manter a lógica no componente-pai.
 */
export default function CdpcFilterBar({ filters, onFilterChange, onReset, cycles, defaultMonthStr }) {
    const isFiltered = filters.month !== defaultMonthStr || filters.cycle_id !== '' || filters.artifact !== '';

    const handleChange = (key, value) => {
        onFilterChange(key, value);
    };

    return (
        <div className="flex flex-wrap items-end gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Mês</label>
                <select
                    className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    value={filters.month}
                    onChange={(e) => handleChange('month', e.target.value)}
                >
                    <option value="">Todos os Meses</option>
                    <option value="01">Janeiro</option>
                    <option value="02">Fevereiro</option>
                    <option value="03">Março</option>
                    <option value="04">Abril</option>
                    <option value="05">Maio</option>
                    <option value="06">Junho</option>
                    <option value="07">Julho</option>
                    <option value="08">Agosto</option>
                    <option value="09">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Ano</label>
                <select
                    className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 outline-none cursor-pointer w-24 hover:bg-slate-100 transition-colors"
                    value={filters.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                >
                    {[0, 1, 2].map(offset => {
                        const year = new Date().getFullYear() - offset;
                        return <option key={year} value={year}>{year}</option>;
                    })}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Ciclo de Vendas</label>
                <select
                    className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 outline-none cursor-pointer max-w-[150px] hover:bg-slate-100 transition-colors"
                    value={filters.cycle_id}
                    onChange={(e) => handleChange('cycle_id', e.target.value)}
                >
                    <option value="">Todos os Ciclos</option>
                    {cycles.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Artefato</label>
                <select
                    className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 outline-none cursor-pointer w-32 hover:bg-slate-100 transition-colors"
                    value={filters.artifact}
                    onChange={(e) => handleChange('artifact', e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="Orçamento">Orçamento</option>
                    <option value="Proposta">Proposta</option>
                </select>
            </div>

            {isFiltered && (
                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 self-end text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                    title="Redefinir todos os filtros"
                >
                    <span>✕</span> Limpar
                </button>
            )}
        </div>
    );
}
