import React from 'react';
import { Landmark, Calendar, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

/**
 * CvacTab — conteúdo completo da aba CVAC na Visão Executiva.
 * Dados ainda estáticos — conectar ao backend quando houver endpoint de faturamento.
 */
export default function CvacTab() {
    return (
        <main className="max-w-7xl mx-auto space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="mb-2">
                <h2 className="text-lg font-bold text-slate-800">Previsão, Execução e Caixa</h2>
                <p className="text-sm text-slate-500">Visão financeira consolidada e comparativos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Mês Atual */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-5 flex justify-between items-center">
                        <span>Fevereiro 2026 (Mês Atual)</span>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded uppercase tracking-wider border border-blue-100">Previsão: 26/Fev</span>
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-1 font-medium">Valor Previsto</p>
                            <p className="text-4xl font-extrabold text-slate-800 tracking-tight">R$ 2.10M</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-1 font-medium">Crescimento (vs Fev/25)</p>
                            <p className="text-2xl font-bold text-emerald-500 flex items-center bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                                <TrendingUp className="w-5 h-5 mr-2" /> +16%
                            </p>
                            <p className="text-xs text-slate-400 mt-2">Ano anterior: R$ 1.80M</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-slate-600">Apontamento Realizado</span>
                            <span className="font-bold text-blue-600">71% (R$ 1.5M)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '71%' }} />
                        </div>
                    </div>
                </div>

                {/* Card Acumulado Ano */}
                <div className="rounded-2xl shadow-lg border-0 p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-700/50 rounded-full blur-3xl mix-blend-screen" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-slate-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Acumulado do Ano (2026)
                    </h3>
                    <div className="flex mb-8 text-center divide-x divide-slate-700/50 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="flex-1 px-4">
                            <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Previsão Anual</p>
                            <p className="text-3xl font-black text-white">R$ 25.0M</p>
                        </div>
                        <div className="flex-1 px-4">
                            <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Realizado Agora</p>
                            <p className="text-3xl font-black text-emerald-400">R$ 4.2M</p>
                        </div>
                    </div>
                    <div className="pt-2">
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                            <span className="font-medium">Meta Anual</span>
                            <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded text-xs">16.8% alcançado</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-3 rounded-full overflow-hidden border border-slate-600/50">
                            <div className="bg-emerald-400 h-3 rounded-full relative" style={{ width: '16.8%' }}>
                                <div className="absolute inset-0 bg-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fluxo de Caixa + Pendências */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider mb-6 flex items-center gap-2">
                        <Landmark className="w-4 h-4" /> Fluxo de Caixa (Faturado)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Faturado</p>
                            <p className="text-2xl font-black text-slate-800">R$ 4.20M</p>
                        </div>
                        <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-colors cursor-default">
                            <div className="text-emerald-500 mb-2 flex justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Recebido em Caixa</p>
                            <p className="text-2xl font-black text-emerald-600">R$ 3.80M</p>
                        </div>
                        <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-50 transition-colors cursor-default">
                            <div className="text-amber-500 mb-2 flex justify-center"><Clock className="w-6 h-6" /></div>
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">A Receber</p>
                            <p className="text-2xl font-black text-amber-600">R$ 400 Mil</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-rose-100 bg-rose-50/50 flex items-center">
                        <AlertCircle className="w-4 h-4 text-rose-600 mr-2" />
                        <h3 className="font-semibold text-rose-700 text-sm">Principais Pendências</h3>
                    </div>
                    <div className="p-5 flex-1 bg-slate-50/50">
                        <ul className="space-y-3">
                            <li className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-rose-200 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-800 text-sm">Cliente AlphaGov</span>
                                    <span className="text-[10px] font-bold text-white bg-rose-500 px-2 py-1 rounded uppercase tracking-wider">Atrasado 15d</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-slate-500 font-medium">NF-e 1029</span>
                                    <span className="font-bold text-slate-800">R$ 200.000</span>
                                </div>
                            </li>
                            <li className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-amber-200 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-800 text-sm">Secretaria XYZ</span>
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded uppercase tracking-wider">A vencer (hoje)</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-slate-500 font-medium">NF-e 1035</span>
                                    <span className="font-bold text-slate-800">R$ 150.000</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
