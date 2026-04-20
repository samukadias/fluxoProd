import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X, ArrowUpDown, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";


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
    requesters = [],
    clients = [],
    cycles = [],
    activeRoleMap = {}
}) {
    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'active',
            analyst_id: 'all',
            analyst_type: 'analyst_id',
            client_id: 'all',
            cycle_id: 'all',
            cycle_ids: [],
            weight: 'all',
            weights: [],
            sortBy: 'date_desc'
        });
    };

    const hasActiveFilters = filters.search ||
        filters.status !== 'all' ||
        filters.analyst_id !== 'all' ||
        filters.client_id !== 'all' ||
        filters.cycle_id !== 'all' ||
        (filters.cycle_ids && filters.cycle_ids.length > 0) ||
        filters.weight !== 'all' ||
        (filters.weights && filters.weights.length > 0) ||
        (filters.sortBy && filters.sortBy !== 'date_desc');


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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Busca</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nº ou produto..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="pl-9 h-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="col-span-1 space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</Label>
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
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Perfil</Label>
                    <div className="flex gap-2">
                        <Select
                            value={filters.analyst_type || 'analyst_id'}
                            onValueChange={(v) => setFilters({ ...filters, analyst_type: v, analyst_id: 'all' })}
                        >
                            <SelectTrigger className="h-10 border-slate-200 w-[180px] shrink-0 [&>span]:truncate">
                                <SelectValue placeholder="Tipo de Papel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="analyst_id">Responsável</SelectItem>
                                <SelectItem value="support_analyst_id">Suporte Pré-Vendas</SelectItem>
                                <SelectItem value="architect_support_analyst_id">Suporte Arquiteto</SelectItem>
                                <SelectItem value="executive_id">Executivo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.analyst_id}
                            onValueChange={(v) => setFilters({ ...filters, analyst_id: v })}
                        >
                            <SelectTrigger className="h-10 border-slate-200 flex-1 min-w-0 [&>span]:truncate">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {(() => {
                                    const roleType = filters.analyst_type || 'analyst_id';
                                    const sourceList = roleType === 'executive_id' ? requesters : analysts;
                                    
                                    const validIds = activeRoleMap[roleType];
                                    const filteredList = validIds && validIds.length > 0
                                        ? sourceList.filter(user => validIds.includes(String(user.id)))
                                        : sourceList;

                                    return [...filteredList]
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(user => (
                                            <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>
                                        ));
                                })()}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="col-span-1 space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</Label>
                    <Select
                        value={filters.client_id}
                        onValueChange={(v) => setFilters({ ...filters, client_id: v })}
                    >
                        <SelectTrigger className="h-10 border-slate-200">
                            <SelectValue placeholder="Cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Clientes</SelectItem>
                            {[...clients].sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-1 space-y-1.5 flex flex-col">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5 mt-1 lg:mt-0">Ciclo</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="h-10 justify-between font-normal border-slate-200 w-full"
                            >
                                <span className="truncate mr-2 text-sm text-slate-700">
                                    {(filters.cycle_ids && filters.cycle_ids.length > 0) ? `${filters.cycle_ids.length} selecionado(s)` : "Todos os Ciclos"}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <div className="max-h-[300px] overflow-y-auto p-1">
                                <div
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100"
                                    onClick={() => setFilters({ ...filters, cycle_ids: [] })}
                                >
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        (!filters.cycle_ids || filters.cycle_ids.length === 0) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                    )}>
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Todos os Ciclos</span>
                                </div>
                                <div className="h-px bg-slate-200 my-1 mx-2" />
                                {[...cycles].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(c => {
                                    const isSelected = filters.cycle_ids?.includes(c.id.toString());
                                    return (
                                        <div
                                            key={c.id}
                                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100"
                                            onClick={() => {
                                                const currentIds = filters.cycle_ids || [];
                                                const cid = c.id.toString();
                                                const newIds = currentIds.includes(cid) ? currentIds.filter(id => id !== cid) : [...currentIds, cid];
                                                setFilters({ ...filters, cycle_ids: newIds });
                                            }}
                                        >
                                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                            )}>
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{c.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="col-span-1 space-y-1.5 flex flex-col">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5 mt-1 lg:mt-0">Prioridade</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="h-10 justify-between font-normal border-slate-200 w-full"
                            >
                                <span className="truncate mr-2 text-sm text-slate-700">
                                    {(filters.weights && filters.weights.length > 0) ? `${filters.weights.length} selecionada(s)` : "Todas"}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <div className="max-h-[300px] overflow-y-auto p-1">
                                <div
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100"
                                    onClick={() => setFilters({ ...filters, weights: [] })}
                                >
                                    <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        (!filters.weights || filters.weights.length === 0) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                    )}>
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>Todas as Prioridades</span>
                                </div>
                                <div className="h-px bg-slate-200 my-1 mx-2" />
                                {[
                                    { id: '0', name: 'P0 - Estratégico' },
                                    { id: '1', name: 'P1 - Muito Alto' },
                                    { id: '2', name: 'P2 - Alto' },
                                    { id: '3', name: 'P3 - Padrão' },
                                    { id: '4', name: 'P4 - Baixo' }
                                ].map(p => {
                                    const isSelected = filters.weights?.includes(p.id);
                                    return (
                                        <div
                                            key={p.id}
                                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100"
                                            onClick={() => {
                                                const currentIds = filters.weights || [];
                                                const newIds = currentIds.includes(p.id) ? currentIds.filter(id => id !== p.id) : [...currentIds, p.id];
                                                setFilters({ ...filters, weights: newIds });
                                            }}
                                        >
                                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                            )}>
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{p.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="col-span-1 space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" />
                        Ordenar
                    </Label>
                    <Select
                        value={filters.sortBy || 'date_desc'}
                        onValueChange={(v) => setFilters({ ...filters, sortBy: v })}
                    >
                        <SelectTrigger className="h-10 border-slate-200">
                            <SelectValue placeholder="Ordenar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date_desc">↓ Mais recentes</SelectItem>
                            <SelectItem value="date_asc">↑ Mais antigas</SelectItem>
                            <SelectItem value="alpha_asc">A → Z (produto)</SelectItem>
                            <SelectItem value="alpha_desc">Z → A (produto)</SelectItem>
                            <SelectItem value="priority">Prioridade (maior → menor)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

        </div>
    );
}
