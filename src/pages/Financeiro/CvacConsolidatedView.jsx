import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fluxoApi } from '@/api/fluxoClient';
import { useAuth } from '@/context/AuthContext';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Edit, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Utility para formatar datas (YYYY-MM-DD para DD/MM/YYYY)
const formatDateToDisplay = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        // compensar timezone se a data vir com 'T00:00:00Z'
        return format(new Date(date.getTime() + date.getTimezoneOffset() * 60000), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
        return dateStr;
    }
};

// Componente de Célula Editável
const EditableCell = ({ value, onSave, type = "text", placeholder = "-" }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
        // Atualiza o localValue se o valor prop mudar externamente (ex: refresh)
        let formattedValue = value;
        if (type === 'date' && value) {
            // Extrai YYYY-MM-DD
            formattedValue = String(value).split('T')[0];
        }
        setLocalValue(formattedValue || '');
    }, [value, type]);

    const handleBlur = () => {
        setIsEditing(false);
        // Só salva se o valor mudou
        let formattedOldValue = value;
        if (type === 'date' && value) formattedOldValue = String(value).split('T')[0];
        
        if (localValue !== (formattedOldValue || '')) {
            onSave(localValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setLocalValue(value || '');
        }
    };

    if (isEditing) {
        return (
            <Input
                type={type === 'currency' ? 'text' : type}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-8 w-full min-w-[100px] text-sm px-2 py-1"
            />
        );
    }

    // Display value formatting
    let displayValue = value || placeholder;
    if (value && type === 'date') {
        displayValue = formatDateToDisplay(value);
    } else if (value && (type === 'number' || type === 'currency')) {
        // Formata como moeda
        displayValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    return (
        <div 
            className="cursor-pointer hover:bg-slate-100 px-2 py-1.5 rounded text-sm min-h-[32px] flex items-center min-w-[100px] text-slate-700"
            onClick={() => setIsEditing(true)}
            title="Clique para editar"
        >
            {displayValue}
        </div>
    );
};

// Componente de Cabeçalho Redimensionável e Ordenável
const ResizableHeader = ({ label, sortKey, sortConfig, onSort, minWidth = '130px' }) => {
    return (
        <TableHead className="p-0 border-r border-slate-200 last:border-r-0 align-top">
            <div 
                className="flex items-center justify-between h-full group border-b-2 border-transparent" 
                style={{ minWidth, width: '100%', resize: 'horizontal', overflow: 'hidden' }}
            >
                <div 
                    className="flex items-center justify-between p-2 flex-1 h-full cursor-pointer hover:bg-slate-200/50 transition-colors"
                    onClick={() => sortKey && onSort(sortKey)}
                >
                    <span className="font-semibold text-slate-700 whitespace-nowrap select-none">{label}</span>
                    {sortKey && (
                        <span className="text-slate-400 ml-2 flex-shrink-0">
                            {sortConfig?.key === sortKey ? (
                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                            ) : (
                                <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </TableHead>
    );
};

export default function CvacConsolidatedView() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Analistas CVAC só veem seus próprios dados; admins e gestores veem tudo
    const userRole = (user?.role || '').toLowerCase();
    const userProfile = (user?.profile_type || '').toLowerCase();
    const isManagerOrAdmin =
        user?.role === 'admin' ||
        user?.department === 'GOR' ||
        userRole === 'manager' ||
        userProfile === 'gestor';
    const analystName = user?.full_name || user?.name;
    
    // Gerar lista de meses (Últimos 12 meses + 2 próximos)
    const monthOptions = React.useMemo(() => {
        const options = [];
        const today = new Date();
        for (let i = -2; i <= 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const value = format(d, 'yyyy-MM');
            const label = format(d, 'MMMM yyyy', { locale: ptBR });
            options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
        }
        return options;
    }, []);

    // Seletor de mês padrão: Mês atual
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estado de Ordenação
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Busca Atestações filtrando pelo mês de referência
    // Se for analista, restringe ao analista logado via responsible_analyst_like
    const { data: attestations = [], isLoading } = useQuery({
        queryKey: ['cvac-consolidated', selectedMonth, isManagerOrAdmin ? 'all' : analystName],
        queryFn: async () => {
            const params = { reference_month: selectedMonth };
            if (!isManagerOrAdmin && analystName) {
                params.responsible_analyst_like = analystName;
            }
            return fluxoApi.entities.MonthlyAttestation.list(params);
        }
    });

    // Filtro local adicional e Ordenação
    const filteredAndSortedAttestations = React.useMemo(() => {
        let result = attestations;
        
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(att => 
                (att.client_name || '').toLowerCase().includes(lowerSearch) ||
                (att.pd_number || '').toLowerCase().includes(lowerSearch) ||
                (att.esp_number || '').toLowerCase().includes(lowerSearch)
            );
        }

        if (sortConfig.key) {
            result = [...result].sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Tratamento especial para datas e valores nulos
                if (aValue === null || aValue === undefined) aValue = '';
                if (bValue === null || bValue === undefined) bValue = '';
                
                // Para string, usar localeCompare. Para números, usar subtração simples.
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                     return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }

                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return result;
    }, [attestations, searchTerm, sortConfig]);

    // Mutation de Atualização (Inline Edit)
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            // Como é um PUT completo (geralmente), precisamos buscar a atestação atual e fazer merge
            const current = attestations.find(a => a.id === id);
            if (!current) throw new Error("Atestação não encontrada");
            const updated = { ...current, ...data };
            return fluxoApi.entities.MonthlyAttestation.update(id, updated);
        },
        onSuccess: () => {
            // Atualiza o cache silenciosamente (sem piscar a tela inteira)
            queryClient.invalidateQueries({ queryKey: ['cvac-consolidated', selectedMonth] });
            toast.success("Dado atualizado!");
        },
        onError: (err) => {
            toast.error(`Erro ao salvar: ${err.message}`);
        }
    });

    const handleSave = (id, field, value) => {
        // Converte string vazia para null para campos numéricos/datas se necessário
        let parsedValue = value;
        if (value === '' && (field.includes('date') || field.includes('amount') || field.includes('value'))) {
            parsedValue = null;
        } else if (field === 'measurement_value' || field === 'billed_amount' || field === 'paid_amount') {
             // Aceita vírgula ou ponto no frontend e converte para número
             if(typeof value === 'string') {
                 const clean = value.replace(/[^\d.,-]/g, '').replace(',', '.');
                 parsedValue = clean ? parseFloat(clean) : null;
             }
        }
        
        updateMutation.mutate({ id, data: { [field]: parsedValue } });
    };

    return (
        <div className="p-6 h-[calc(100vh-64px)] md:h-screen flex flex-col overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Visão Consolidada</h1>
                    <p className="text-slate-600 mt-1">Acompanhamento e edição rápida de atestações</p>
                </div>
                {!isManagerOrAdmin && analystName && (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700">
                        <span className="font-semibold">Filtrando por:</span>
                        <span className="bg-blue-100 px-2 py-0.5 rounded font-medium">{analystName}</span>
                    </div>
                )}
            </div>

            <Card className="border-0 shadow-lg bg-white mb-6 shrink-0">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-end">
                    <div className="space-y-1 w-full sm:w-[250px]">
                        <label className="text-sm font-medium text-slate-700">Mês de Referência</label>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="bg-slate-50">
                                <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1 flex-1 relative">
                        <label className="text-sm font-medium text-slate-700">Pesquisar Cliente / Contrato</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Busca rápida..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-slate-50"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Area (Flex grow and scrollable) */}
            <div className="flex-1 min-h-0 relative bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredAndSortedAttestations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 p-10 text-center">
                        <Search className="w-10 h-10 text-slate-300" />
                        <p className="text-lg font-medium">Nenhuma atestação encontrada</p>
                        <p className="text-sm">Não há atestações cadastradas para {selectedMonth}</p>
                    </div>
                ) : (
                    <Table className="min-w-[1400px]" wrapperClassName="h-full">
                        <TableHeader className="bg-slate-100 sticky top-0 z-10 shadow-sm border-b-2 border-slate-200">
                                <TableRow className="hover:bg-slate-100">
                                    <ResizableHeader label="Cliente" sortKey="client_name" sortConfig={sortConfig} onSort={handleSort} minWidth="200px" />
                                    <ResizableHeader label="Contrato" sortKey="pd_number" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="ESP" sortKey="esp_number" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Nº SEI" sortKey="sei_process_number" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Envio Ateste" sortKey="report_send_date" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Retorno Ateste" sortKey="attestation_return_date" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Envio Faturamento" sortKey="invoice_send_date" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Nota Fiscal" sortKey="invoice_number" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Vlr Medição" sortKey="measurement_value" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Vlr Faturado" sortKey="billed_amount" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Envio Cliente" sortKey="invoice_send_to_client_date" sortConfig={sortConfig} onSort={handleSort} />
                                    <ResizableHeader label="Vlr Recebido" sortKey="paid_amount" sortConfig={sortConfig} onSort={handleSort} />
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedAttestations.map((att) => {
                                    // Verifica se há pendência de preenchimento (algum dos 6 campos obrigatórios está vazio/nulo)
                                    const isPending = (
                                        att.report_send_date == null || att.report_send_date === '' ||
                                        att.attestation_return_date == null || att.attestation_return_date === '' ||
                                        att.invoice_send_date == null || att.invoice_send_date === '' ||
                                        att.measurement_value == null || att.measurement_value === '' ||
                                        att.billed_amount == null || att.billed_amount === '' ||
                                        att.paid_amount == null || att.paid_amount === ''
                                    );
                                    
                                    return (
                                    <TableRow key={att.id} className={`transition-colors ${isPending ? 'bg-amber-50/70 hover:bg-amber-100/70' : 'hover:bg-blue-50/50'}`}>
                                        <TableCell className="font-medium text-slate-900 border-r border-slate-100 truncate max-w-[200px]" title={att.client_name}>
                                            {att.client_name || '-'}
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100 text-slate-600">
                                            {att.pd_number || '-'}
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100 text-slate-600">
                                            {att.esp_number || '-'}
                                        </TableCell>
                                        
                                        {/* Editáveis a partir daqui */}
                                        <TableCell className="border-r border-slate-100">
                                            <EditableCell 
                                                value={att.sei_process_number} 
                                                onSave={(val) => handleSave(att.id, 'sei_process_number', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100">
                                            <EditableCell 
                                                type="date"
                                                value={att.report_send_date} 
                                                onSave={(val) => handleSave(att.id, 'report_send_date', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100 bg-emerald-50/30">
                                            <EditableCell 
                                                type="date"
                                                value={att.attestation_return_date} 
                                                onSave={(val) => handleSave(att.id, 'attestation_return_date', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100 bg-blue-50/30">
                                            <EditableCell 
                                                type="date"
                                                value={att.invoice_send_date} 
                                                onSave={(val) => handleSave(att.id, 'invoice_send_date', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100">
                                            <EditableCell 
                                                value={att.invoice_number} 
                                                onSave={(val) => handleSave(att.id, 'invoice_number', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100">
                                            <EditableCell 
                                                type="currency"
                                                value={att.measurement_value} 
                                                onSave={(val) => handleSave(att.id, 'measurement_value', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100">
                                            <EditableCell 
                                                type="currency"
                                                value={att.billed_amount} 
                                                onSave={(val) => handleSave(att.id, 'billed_amount', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100">
                                            <EditableCell 
                                                type="date"
                                                value={att.invoice_send_to_client_date} 
                                                onSave={(val) => handleSave(att.id, 'invoice_send_to_client_date', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border-r border-slate-100">
                                            <EditableCell 
                                                type="currency"
                                                value={att.paid_amount} 
                                                onSave={(val) => handleSave(att.id, 'paid_amount', val)} 
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => window.open(`/financeiro/contratos/${att.contract_id}/atestacoes`, '_blank')}
                                                className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                                title="Detalhes do Contrato"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                )}
            </div>
        </div>
    );
}
