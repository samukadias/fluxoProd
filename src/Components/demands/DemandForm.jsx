import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LIST = [
    "PENDENTE TRIAGEM",
    "TRIAGEM NÃO ELEGÍVEL",
    "DESIGNADA",
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA FORNECEDOR",
    "CONGELADA",
    "ENTREGUE",
    "CANCELADA"
];

export default function DemandForm({
    demand,
    onSave,
    onCancel,
    isLoading,
    analysts = [],
    clients = [],
    cycles = [],
    requesters = [],
    userRole = 'user',
    isNew = false
}) {
    const [formData, setFormData] = useState({
        demand_number: demand?.demand_number || '',
        product: demand?.product || '',
        artifact: demand?.artifact || 'Orçamento',
        weight: demand?.weight ?? 1,
        complexity: demand?.complexity || 'Média',
        qualification_date: demand?.qualification_date || '',
        expected_delivery_date: demand?.expected_delivery_date || '',
        status: demand?.status || 'PENDENTE TRIAGEM',
        observation: demand?.observation || '',
        client_id: demand?.client_id || '',
        cycle_id: demand?.cycle_id || '',
        analyst_id: demand?.analyst_id || '',
        requester_id: demand?.requester_id || ''
    });

    const isGestor = userRole === 'admin';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const DatePicker = ({ value, onChange, label, disabled }) => (
        <div className="space-y-2">
            <Label className="text-sm text-slate-600">{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !value && "text-slate-400"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(parseISO(value), "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value ? parseISO(value) : undefined}
                        onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        locale={ptBR}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Nº Demanda</Label>
                    <Input
                        value={formData.demand_number}
                        onChange={(e) => setFormData({ ...formData, demand_number: e.target.value })}
                        placeholder="Opcional"
                        className="h-10"
                    />
                </div>

                <div className="space-y-2 lg:col-span-2">
                    <Label className="text-sm text-slate-600">Produto *</Label>
                    <Input
                        value={formData.product}
                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        placeholder="Nome do produto ou descrição da demanda"
                        required
                        className="h-10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Artefato *</Label>
                    <Select
                        value={formData.artifact}
                        onValueChange={(v) => setFormData({ ...formData, artifact: v })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Orçamento">Orçamento</SelectItem>
                            <SelectItem value="Proposta">Proposta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Peso</Label>
                    <Select
                        value={String(formData.weight)}
                        onValueChange={(v) => setFormData({ ...formData, weight: Number(v) })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[0, 1, 2, 3, 4].map(w => (
                                <SelectItem key={w} value={String(w)}>{w}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Complexidade</Label>
                    <Select
                        value={formData.complexity}
                        onValueChange={(v) => setFormData({ ...formData, complexity: v })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Cliente</Label>
                    <Select
                        value={formData.client_id || "none"}
                        onValueChange={(v) => setFormData({ ...formData, client_id: v === "none" ? "" : v })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            {clients.filter(c => c.active !== false).map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Ciclo</Label>
                    <Select
                        value={formData.cycle_id || "none"}
                        onValueChange={(v) => setFormData({ ...formData, cycle_id: v === "none" ? "" : v })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            {cycles.filter(c => c.active !== false).map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Responsável</Label>
                    <Select
                        value={formData.analyst_id || "none"}
                        onValueChange={(v) => setFormData({ ...formData, analyst_id: v === "none" ? "" : v })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Não designado</SelectItem>
                            {analysts.filter(a => a.active !== false).map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Solicitante</Label>
                    <Select
                        value={formData.requester_id || "none"}
                        onValueChange={(v) => setFormData({ ...formData, requester_id: v === "none" ? "" : v })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            {requesters.filter(r => r.active !== false).map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DatePicker
                    label="Data de Qualificação"
                    value={formData.qualification_date}
                    onChange={(v) => setFormData({ ...formData, qualification_date: v })}
                    disabled={!isGestor && !isNew}
                />

                <DatePicker
                    label="Previsão de Entrega"
                    value={formData.expected_delivery_date}
                    onChange={(v) => setFormData({ ...formData, expected_delivery_date: v })}
                />

                <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(v) => setFormData({ ...formData, status: v })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_LIST.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm text-slate-600">Observações</Label>
                <Textarea
                    value={formData.observation}
                    onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                    placeholder="Detalhes adicionais sobre a demanda..."
                    rows={4}
                    className="resize-none"
                />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
