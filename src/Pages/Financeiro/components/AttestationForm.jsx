import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Calendar, DollarSign, AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AttestationForm({ attestation, contract, onSubmit, isLoading }) {
    // contract é o objeto contrato que está sendo utilizado para criar uma atestação

    // esps handling:
    // O contrato vem com esps array. O form deve permitir selecionar uma.
    // Se esps for JSONB (string) do DB, temos que parsear. Se for array direto, ok.
    // O backend novo retorna JSONB como array normal no pg.

    const [formData, setFormData] = useState({
        contract_id: '',
        client_name: '',
        pd_number: '',
        responsible_analyst: '',
        esp_number: '',
        sei_process_number: '',
        sei_send_area: '',
        reference_month: '',
        report_generation_date: '',
        report_send_date: '',
        attestation_return_date: '',
        invoice_send_to_client_date: '',
        invoice_number: '',
        billed_amount: 0,
        paid_amount: 0,
        invoice_send_date: '',
        observations: ''
    });

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (attestation) {
            setFormData({
                contract_id: attestation.contract_id || '',
                client_name: attestation.client_name || '',
                pd_number: attestation.pd_number || '',
                responsible_analyst: attestation.responsible_analyst || '',
                esp_number: attestation.esp_number || '',
                sei_process_number: attestation.sei_process_number || '',
                sei_send_area: attestation.sei_send_area || '',
                reference_month: attestation.reference_month || '',
                report_generation_date: attestation.report_generation_date ? attestation.report_generation_date.split('T')[0] : '',
                report_send_date: attestation.report_send_date ? attestation.report_send_date.split('T')[0] : '',
                attestation_return_date: attestation.attestation_return_date ? attestation.attestation_return_date.split('T')[0] : '',
                invoice_send_to_client_date: attestation.invoice_send_to_client_date ? attestation.invoice_send_to_client_date.split('T')[0] : '',
                invoice_number: attestation.invoice_number || '',
                billed_amount: attestation.billed_amount || 0,
                paid_amount: attestation.paid_amount || 0,
                invoice_send_date: attestation.invoice_send_date ? attestation.invoice_send_date.split('T')[0] : '',
                observations: attestation.observations || ''
            });
        } else if (contract) {
            setFormData(prev => ({
                ...prev,
                contract_id: contract.id,
                client_name: contract.company_name || contract.company_name || contract.client_name || '', // Adapter para diferentes nomes de campo
                pd_number: contract.pd_number || '',
                responsible_analyst: contract.responsible_analyst || contract.analista_responsavel || ''
            }));
        }
    }, [attestation, contract]);

    const validateDates = () => {
        const newErrors = [];
        const reportDate = formData.report_generation_date ? new Date(formData.report_generation_date) : null;
        const returnDate = formData.attestation_return_date ? new Date(formData.attestation_return_date) : null;
        const invoiceDate = formData.invoice_send_to_client_date ? new Date(formData.invoice_send_to_client_date) : null;

        if (reportDate && returnDate && returnDate < reportDate) {
            newErrors.push('A data de retorno da atestação não pode ser anterior à data de geração do relatório.');
        }
        if (reportDate && invoiceDate && invoiceDate < reportDate) {
            newErrors.push('A data de envio da fatura não pode ser anterior à data de geração do relatório.');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const validateRequiredFields = () => {
        const newErrors = [];

        if (!formData.reference_month) {
            newErrors.push('O campo "Mês de Referência" é obrigatório.');
        }

        if (!formData.esp_number) {
            newErrors.push('O campo "ESP" é obrigatório.');
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar campos obrigatórios primeiro
        const requiredErrors = validateRequiredFields();

        if (requiredErrors.length > 0) {
            setErrors(requiredErrors);
            return;
        }

        // Depois validar datas
        if (validateDates()) {
            onSubmit(formData);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const pendency = (formData.billed_amount || 0) - (formData.paid_amount || 0);

    const generateMonthOptions = () => {
        const options = [];
        const now = new Date();
        for (let i = 0; i < 24; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            options.push({ value, label });
        }
        return options;
    };

    // Helper para extrair ESPs do contrato
    const getEsps = () => {
        if (contract && contract.esps) {
            // Se vier como string (JSON não parseado pelo driver pg)
            if (typeof contract.esps === 'string') {
                try { return JSON.parse(contract.esps); } catch (e) { return []; }
            }
            return contract.esps;
        }
        return [];
    };

    const contractEsps = getEsps();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.length > 0 && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {errors.map((error, i) => (
                            <div key={i}>{error}</div>
                        ))}
                    </AlertDescription>
                </Alert>
            )}

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Período e ESP
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-slate-700">Mês de Referência *</Label>
                            <Select
                                value={formData.reference_month}
                                onValueChange={(value) => updateField('reference_month', value)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecione o mês" />
                                </SelectTrigger>
                                <SelectContent>
                                    {generateMonthOptions().map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-slate-700">ESP *</Label>
                            <Select
                                value={formData.esp_number}
                                onValueChange={(value) => updateField('esp_number', value)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder={contractEsps.length > 0 ? "Selecione a ESP" : "Nenhuma ESP cadastrada no contrato"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {contractEsps.length > 0 ? contractEsps.map((esp, i) => (
                                        <SelectItem key={i} value={esp.esp_number}>
                                            {esp.esp_number} - {esp.object_description?.substring(0, 30)}...
                                        </SelectItem>
                                    )) : <SelectItem value="custom" disabled>Nenhuma ESP disponível</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SEI Information Block */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Informações do SEI
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-slate-700">Número do Processo no SEI</Label>
                            <Input
                                value={formData.sei_process_number}
                                onChange={(e) => updateField('sei_process_number', e.target.value)}
                                placeholder="Ex: 00000.000000/0000-00"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-700">Área de Envio no SEI</Label>
                            <Input
                                value={formData.sei_send_area}
                                onChange={(e) => updateField('sei_send_area', e.target.value)}
                                placeholder="Ex: Coordenação Financeira"
                                className="mt-1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Datas do Processo
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <Label className="text-slate-700 text-sm">Data Geração Relatório</Label>
                            <Input
                                type="date"
                                value={formData.report_generation_date}
                                onChange={(e) => updateField('report_generation_date', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-700 text-sm">Envio p/ Atestação</Label>
                            <Input
                                type="date"
                                value={formData.report_send_date}
                                onChange={(e) => updateField('report_send_date', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-700 text-sm">Retorno Atestação</Label>
                            <Input
                                type="date"
                                value={formData.attestation_return_date}
                                onChange={(e) => updateField('attestation_return_date', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-700 text-sm">Envio Fatura p/ Cliente</Label>
                            <Input
                                type="date"
                                value={formData.invoice_send_to_client_date}
                                onChange={(e) => updateField('invoice_send_to_client_date', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        Dados Financeiros
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label className="text-slate-700">Número da Nota Fiscal</Label>
                            <Input
                                value={formData.invoice_number}
                                onChange={(e) => updateField('invoice_number', e.target.value)}
                                placeholder="Ex: NF-001234"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-slate-700">Envio da NF p/ Cliente</Label>
                            <Input
                                type="date"
                                value={formData.invoice_send_date}
                                onChange={(e) => updateField('invoice_send_date', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label className="text-slate-700">Valor Faturado (Enviado)</Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.billed_amount}
                                    onChange={(e) => updateField('billed_amount', parseFloat(e.target.value) || 0)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-slate-700">Valor Pago (Recebido)</Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.paid_amount}
                                    onChange={(e) => updateField('paid_amount', parseFloat(e.target.value) || 0)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-slate-700">Pendência</Label>
                            <div className={`mt-1 p-2.5 rounded-lg border font-semibold text-center ${pendency > 0
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-green-50 border-green-200 text-green-700'
                                }`}>
                                {pendency > 0
                                    ? `R$ ${pendency.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                    : 'Não há pendências'
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-slate-800">
                        Observações
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Textarea
                        value={formData.observations}
                        onChange={(e) => updateField('observations', e.target.value)}
                        placeholder="Adicione observações relevantes sobre esta atestação..."
                        rows={4}
                        className="resize-none"
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl shadow-lg shadow-blue-600/20"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar Atestação'}
                </Button>
            </div>
        </form>
    );
}
