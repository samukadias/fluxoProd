import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function PendencyTable({ attestations, onViewDetails }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const formatMonth = (monthStr) => {
        if (!monthStr) return '-';
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    };

    const [limit, setLimit] = useState(20);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAttestations = useMemo(() => {
        let sortableItems = [...attestations];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'pendency') {
                    aValue = (parseFloat(a.measurement_value) || 0) - (parseFloat(a.billed_amount) || 0);
                    bValue = (parseFloat(b.measurement_value) || 0) - (parseFloat(b.billed_amount) || 0);
                } else if (sortConfig.key === 'measurement_value' || sortConfig.key === 'billed_amount') {
                    aValue = parseFloat(aValue) || 0;
                    bValue = parseFloat(bValue) || 0;
                } else {
                    aValue = aValue ? aValue.toString().toLowerCase() : '';
                    bValue = bValue ? bValue.toString().toLowerCase() : '';
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [attestations, sortConfig]);

    const visibleAttestations = sortedAttestations.slice(0, limit);

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-40" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-3 h-3 ml-1 inline-block text-indigo-600" />
            : <ArrowDown className="w-3 h-3 ml-1 inline-block text-indigo-600" />;
    };

    const SortableHead = ({ columnKey, children, className = "" }) => (
        <TableHead 
            className={`font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors select-none ${className}`}
            onClick={() => handleSort(columnKey)}
        >
            <div className={`flex items-center ${className.includes('text-right') ? 'justify-end' : className.includes('text-center') ? 'justify-center' : ''}`}>
                {children}
                <SortIcon columnKey={columnKey} />
            </div>
        </TableHead>
    );

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-100">
                        <SortableHead columnKey="client_name">Cliente</SortableHead>
                        <SortableHead columnKey="responsible_analyst">Analista</SortableHead>
                        <SortableHead columnKey="pd_number">PD</SortableHead>
                        <SortableHead columnKey="esp_number">ESP</SortableHead>
                        <SortableHead columnKey="reference_month">Mês</SortableHead>
                        <SortableHead columnKey="measurement_value" className="text-right">Apontado</SortableHead>
                        <SortableHead columnKey="billed_amount" className="text-right">Faturado</SortableHead>
                        <SortableHead columnKey="pendency" className="text-right">Pendência</SortableHead>
                        <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attestations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                                Nenhum registro encontrado
                            </TableCell>
                        </TableRow>
                    ) : (
                        visibleAttestations.map((att, index) => {
                            const measurementValue = parseFloat(att.measurement_value) || 0;
                            const billedAmount = parseFloat(att.billed_amount) || 0;
                            const pendency = measurementValue - billedAmount;
                            const hasPendency = pendency > 0;

                            return (
                                <TableRow
                                    key={att.id}
                                    className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${hasPendency ? 'bg-amber-50/10' : ''}`}
                                >
                                    <TableCell className="font-medium text-slate-800">
                                        {att.client_name}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{att.responsible_analyst || '-'}</TableCell>
                                    <TableCell className="text-slate-600">{att.pd_number}</TableCell>
                                    <TableCell className="text-slate-600">{att.esp_number}</TableCell>
                                    <TableCell className="text-slate-600">{formatMonth(att.reference_month)}</TableCell>
                                    <TableCell className="text-right text-slate-700">
                                        {formatCurrency(measurementValue)}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-700">
                                        {formatCurrency(billedAmount)}
                                    </TableCell>
                                    <TableCell className={`text-right font-semibold ${hasPendency ? 'text-amber-600' : 'text-green-600'
                                        }`}>
                                        {hasPendency ? formatCurrency(pendency) : '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {hasPendency ? (
                                                <>
                                                    <Badge variant="destructive" className="bg-amber-100 text-amber-700 border-amber-200">
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        Pendência
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onViewDetails && onViewDetails(att)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Liquidado
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onViewDetails && onViewDetails(att)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
        {attestations.length > limit && (
            <div className="flex justify-center">
                <Button 
                    variant="outline" 
                    onClick={() => setLimit(prev => prev + 50)}
                    className="bg-white hover:bg-slate-50 text-slate-600"
                >
                    Exibir Mais Pendências ({attestations.length - limit} restantes)
                </Button>
            </div>
        )}
        </div>
    );
}
