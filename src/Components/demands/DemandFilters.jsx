import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const STATUS_LIST = [
    "PENDENTE TRIAGEM",
    "TRIAGEM NÃO ELEGÍVEL",
    "DESIGNADA",
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "CORREÇÃO",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA SUPRIMENTOS",
    "PENDÊNCIA FORNECEDOR",
    "CONGELADA",
    "ENTREGUE",
    "CANCELADA"
];

export default function DemandFilters({
    filters,
    setFilters,
    analysts = [],
    clients = [],
    cycles = []
}) {
    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'active',
            analyst_id: 'all',
            client_id: 'all',
            cycle_id: 'all',
            complexity: 'all'
        });
    };

    const hasActiveFilters = filters.search ||
        filters.status !== 'all' ||
        filters.analyst_id !== 'all' ||
        filters.client_id !== 'all' ||
        filters.cycle_id !== 'all' ||
        filters.complexity !== 'all';

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Filtros</h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-slate-500 hover:text-slate-700 h-8"
                    >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Limpar
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nº ou produto..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="pl-9 h-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <Select
                    value={filters.status}
                    onValueChange={(v) => setFilters({ ...filters, status: v })}
                >
                    <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">EM ABERTO</SelectItem>
                        <SelectItem value="all">TODOS OS STATUS</SelectItem>
                        {STATUS_LIST.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.analyst_id}
                    onValueChange={(v) => setFilters({ ...filters, analyst_id: v })}
                >
                    <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="Responsável" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Responsáveis</SelectItem>
                        {analysts.map(a => (
                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.client_id}
                    onValueChange={(v) => setFilters({ ...filters, client_id: v })}
                >
                    <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Clientes</SelectItem>
                        {clients.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.complexity}
                    onValueChange={(v) => setFilters({ ...filters, complexity: v })}
                >
                    <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="Complexidade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
