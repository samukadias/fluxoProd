import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardFilters({
    filters,
    onFilterChange,
    clients,
    pds,
    esps,
    months,
    analysts
}) {
    const handleClearFilters = () => {
        onFilterChange({
            client: 'all',
            pd: 'all',
            esp: 'all',
            month: 'all'
        });
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-700">Filtros</span>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="ml-auto text-slate-500 hover:text-slate-700"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Limpar
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Cliente</Label>
                        <Select
                            value={filters.client}
                            onValueChange={(value) => onFilterChange({ ...filters, client: value })}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {clients.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">PD</Label>
                        <Select
                            value={filters.pd}
                            onValueChange={(value) => onFilterChange({ ...filters, pd: value })}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {pds.map(pd => (
                                    <SelectItem key={pd} value={pd}>{pd}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">ESP</Label>
                        <Select
                            value={filters.esp}
                            onValueChange={(value) => onFilterChange({ ...filters, esp: value })}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                {esps.map(esp => (
                                    <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Mês</Label>
                        <Select
                            value={filters.month}
                            onValueChange={(value) => onFilterChange({ ...filters, month: value })}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {months.map(m => (
                                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Analista</Label>
                        <Select
                            value={filters.analyst}
                            onValueChange={(value) => onFilterChange({ ...filters, analyst: value })}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {analysts.map(a => (
                                    <SelectItem key={a} value={a}>{a}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
