import React, { useState, useEffect, useRef } from 'react';
import {
    Cuboid,
    ArrowDownToLine,
    CheckSquare,
    Flame,
    TrendingDown,
    CheckCircle2,
    RefreshCw,
    Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const gridColsMap = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
};

/**
 * CdpcTab — conteúdo completo da aba CDPC na Visão Executiva.
 * Recebe métricas, filtros e ciclos como props.
 */
export default function CdpcTab({
    metrics,
    filters,
    loading,
    formatCurrency,
}) {
    const [visibleCards, setVisibleCards] = useState(() => {
        try {
            const saved = localStorage.getItem('fluxo_visible_cdpc_cards');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Error parsing visible cards from localStorage:', e);
        }
        return ['backlog', 'emTratativa', 'novasMes', 'reaberturasMes', 'entregasPeriodo'];
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Salvar no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('fluxo_visible_cdpc_cards', JSON.stringify(visibleCards));
    }, [visibleCards]);

    // Fechar ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleCard = (cardId) => {
        setVisibleCards(prev => {
            if (prev.includes(cardId)) {
                // Não permitir remover o último cartão
                if (prev.length === 1) return prev;
                return prev.filter(id => id !== cardId);
            } else {
                return [...prev, cardId];
            }
        });
    };

    const totalSpans = visibleCards.reduce((acc, cardId) => {
        if (cardId === 'entregasPeriodo') return acc + 2;
        return acc + 1;
    }, 0);

    const gridColsClass = gridColsMap[totalSpans] || 'md:grid-cols-6';

    return (
        <main className="max-w-7xl mx-auto space-y-6">
            {/* Header da seção + Filtros */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div className="flex items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-800">Volume &amp; Capacidade</h2>
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center focus:outline-none"
                                    title="Personalizar visualização"
                                    aria-label="Personalizar visualização"
                                >
                                    <Settings className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-1 duration-150">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cartões Visíveis</h3>
                                        <div className="space-y-2.5">
                                            {[
                                                { id: 'backlog', label: 'Backlog Total' },
                                                { id: 'emTratativa', label: 'Em Tratativa' },
                                                { id: 'novasMes', label: 'Novas Mês' },
                                                { id: 'reaberturasMes', label: 'Reaberturas Mês' },
                                                { id: 'entregasPeriodo', label: 'Entregas do Período' }
                                            ].map(card => {
                                                const isChecked = visibleCards.includes(card.id);
                                                const isDisableToggle = isChecked && visibleCards.length === 1;
                                                return (
                                                    <label
                                                        key={card.id}
                                                        className={`flex items-center justify-between p-2 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                                                            isChecked 
                                                                ? 'bg-indigo-50/50 border-indigo-100 text-indigo-950 hover:bg-indigo-50' 
                                                                : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-50'
                                                        } ${isDisableToggle ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <span>{card.label}</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            disabled={isDisableToggle}
                                                            onChange={() => toggleCard(card.id)}
                                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-3 text-center">As preferências são salvas automaticamente.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">Métricas de fluxo e entrega de propostas</p>
                    </div>
                </div>
            </div>

            {/* Cards Superiores - Primeira Linha */}
            <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
                {visibleCards.includes('backlog') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-600 group-hover:scale-110 transition-transform"><Cuboid className="w-20 h-20" /></div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Backlog Total</p>
                        <p className="text-3xl font-bold text-slate-800">{loading ? '...' : metrics.backlog}</p>
                        <p className="text-[10px] text-blue-600 mt-2 font-bold bg-blue-50 w-fit px-2 py-1 rounded">demandas ativas</p>
                    </div>
                )}

                {visibleCards.includes('emTratativa') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1 col-span-1 border-l-4 border-l-amber-400">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-amber-600 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-20 h-20" /></div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Em Tratativa</p>
                        <p className="text-3xl font-bold text-slate-800">{loading ? '...' : metrics.emTratativa}</p>
                        <p className="text-[10px] text-amber-600 mt-2 font-bold bg-amber-50 w-fit px-2 py-1 rounded">ativas, além da triagem</p>
                    </div>
                )}

                {visibleCards.includes('novasMes') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform"><ArrowDownToLine className="w-20 h-20" /></div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Novas Mês</p>
                        <p className="text-3xl font-bold text-slate-800">{loading ? '...' : metrics.entriesThisMonth}</p>
                        <p className="text-[10px] text-indigo-600 mt-2 font-bold bg-indigo-50 w-fit px-2 py-1 rounded">{metrics.entriesThisYear} no ano</p>
                    </div>
                )}

                {visibleCards.includes('reaberturasMes') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-violet-600 group-hover:scale-110 transition-transform"><RefreshCw className="w-20 h-20" /></div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Reaberturas Mês</p>
                        <p className="text-3xl font-bold text-slate-800">{loading ? '...' : metrics.reopenedThisMonth}</p>
                        <p className="text-[10px] text-violet-600 mt-2 font-bold bg-violet-50 w-fit px-2 py-1 rounded">{metrics.reopenedThisYear} no ano</p>
                    </div>
                )}

                {visibleCards.includes('entregasPeriodo') && (
                    <div className="rounded-2xl shadow-sm border p-4 relative overflow-hidden bg-gradient-to-br from-white to-emerald-50 border-emerald-100 group hover:shadow-md transition-all hover:-translate-y-1 col-span-1 md:col-span-2">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform"><CheckSquare className="w-20 h-20" /></div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Entregas do Período</p>
                        <div className="flex items-end gap-4 mt-1">
                            <p className="text-4xl font-black text-emerald-600">{loading ? '...' : metrics.deliveredThisMonth}</p>
                            <div className="pb-1">
                                <p className="text-sm font-bold text-slate-700">{formatCurrency(metrics.valueThisMonth)}</p>
                                <p className="text-xs text-slate-500">SLA Médio: {loading ? '...' : Number(metrics.slaThisMonth).toFixed(1)} dias</p>
                            </div>
                        </div>
                        {!loading && metrics.entriesThisMonth > 0 && (
                            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3">
                                <div
                                    className="bg-emerald-500 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(100, Math.round((metrics.deliveredThisMonth / metrics.entriesThisMonth) * 100))}%` }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Linha do Meio (Priorização e Top Clientes Priorizados) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl shadow-sm border p-5 bg-gradient-to-br from-white to-rose-50 border-rose-100 flex flex-col justify-center text-center">
                    <p className="text-sm font-medium text-slate-500 mb-1">Priorizados no Mês (P0/P1)</p>
                    <p className="text-4xl font-black text-rose-600">{loading ? '...' : metrics.highPriorityThisMonth}</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">demandas ativas e/ou criadas no período</p>
                </div>

                <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden flex flex-col h-48">
                    <div className="p-3 bg-rose-50 border-b border-rose-100 flex justify-between items-center">
                        <h3 className="font-semibold text-rose-800 text-sm flex items-center gap-2">
                            <Flame className="w-4 h-4" /> Top Clientes Priorizados
                        </h3>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <p className="text-sm text-slate-400">Carregando...</p>
                        ) : metrics.topPrioritizedClientsThisMonth.length === 0 ? (
                            <p className="text-sm text-slate-400">Sem demandas priorizadas no momento.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {metrics.topPrioritizedClientsThisMonth.map((c) => (
                                    <div key={c.name} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                                        <span className="text-xs font-bold text-slate-700 max-w-[150px] truncate" title={c.name}>{c.name}</span>
                                        <span className="w-5 h-5 rounded bg-rose-100 text-rose-700 text-[10px] font-black flex items-center justify-center">{c.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Acumulado Ano e Top Clientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Acumulado */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-6">Acumulado {filters.year}</h3>
                    <div className="flex items-center justify-around mb-6">
                        <div className="text-center">
                            <p className="text-5xl font-black text-slate-800 mb-2">{loading ? '...' : metrics.deliveredThisYear}</p>
                            <p className="text-sm font-medium text-slate-500">Demandas Entregues</p>
                        </div>
                        <div className="h-16 w-px bg-slate-200" />
                        <div className="text-center">
                            {loading ? (
                                <p className="text-4xl font-black text-slate-400 mb-2">...</p>
                            ) : metrics.valueThisYear > 0 ? (
                                <p className="text-4xl font-black text-emerald-600 mb-2">{formatCurrency(metrics.valueThisYear)}</p>
                            ) : (
                                <p className="text-xl font-semibold text-slate-400 mb-2">Sem valor registrado</p>
                            )}
                            <p className="text-sm font-medium text-slate-500 mb-1">Valor Global Gerado</p>
                            {!loading && metrics.valueThisYear > 0 && (
                                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                                    em {metrics.valuedDemandsCount} demanda{metrics.valuedDemandsCount !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Cancelamentos */}
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-200 text-slate-500 p-2 rounded-lg">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Cancelamentos</p>
                                <p className="text-sm font-medium text-slate-700">Mês selecionado: <span className="font-bold text-slate-900">{loading ? '...' : metrics.cancelledThisMonth}</span></p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Cancelado ({filters.year})</p>
                            <p className="text-xl font-black text-slate-700">{loading ? '...' : metrics.cancelledThisYear}</p>
                        </div>
                    </div>
                </div>

                {/* Top Clientes */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 text-sm">Top Clientes (Backlog Ativo)</h3>
                    </div>
                    <div className="p-4 flex-1">
                        {loading ? (
                            <p className="text-sm text-slate-400">Carregando...</p>
                        ) : metrics.topClients.length === 0 ? (
                            <p className="text-sm text-slate-400">Nenhuma demanda ativa.</p>
                        ) : (
                            <ul className="space-y-4">
                                {metrics.topClients.map((c, i) => (
                                    <li key={c.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-indigo-400' : 'bg-slate-300'}`} />
                                            <p className="text-sm font-medium text-slate-800">{c.name}</p>
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">{c.count} demanda{c.count !== 1 ? 's' : ''}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Demandas Reabertas */}
            {!loading && metrics.currentlyReopened?.length > 0 && (
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <h2 className="text-lg font-bold text-slate-800">Demandas Reabertas</h2>
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                            {metrics.currentlyReopened.length} em aberto
                        </span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {metrics.currentlyReopened.map((d) => {
                                const daysOpen = d.reopened_at
                                    ? Math.ceil((Date.now() - new Date(d.reopened_at).getTime()) / 86400000)
                                    : null;
                                return (
                                    <div key={d.id} className="flex items-center justify-between px-5 py-3 hover:bg-amber-50/40 transition-colors">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{d.product}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {d.client_name && <span className="text-xs text-slate-400">{d.client_name}</span>}
                                                {d.reason_label && (
                                                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                                        {d.reason_label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {d.status && d.status !== 'REABERTA' && (
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {d.status}
                                                </span>
                                            )}
                                            {daysOpen !== null && (
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${daysOpen > 5 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {daysOpen}d reaberta
                                                </span>
                                            )}
                                            <Link to={`/demand-detail?id=${d.id}`} className="text-xs text-indigo-600 hover:underline font-medium">
                                                Ver →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
