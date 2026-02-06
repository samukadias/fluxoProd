import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fluxoApi } from '@/api/fluxoClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, FileText, Building2 } from "lucide-react";
import EspManager from './EspManager';

export default function ContractForm({ contract, onSubmit, isLoading }) {
    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: () => fluxoApi.entities.Client.list('-created_at')
    });

    const { data: analysts = [] } = useQuery({
        queryKey: ['cvac-analysts'],
        queryFn: () => fluxoApi.entities.User.list({
            role: 'analyst',
            department: 'CVAC'
        })
    });

    // Buscar contratos de Prazos para obter PDs por cliente
    const { data: prazosContracts = [] } = useQuery({
        queryKey: ['deadline-contracts'],
        queryFn: () => fluxoApi.entities.Contract.list(),
        select: (data) => {
            // Filtrar apenas contratos que têm cliente e contrato (PD)
            return data.filter(c => c.cliente && c.contrato);
        }
    });

    const { user } = useAuth();

    const [formData, setFormData] = useState({
        client_name: '',
        pd_number: '',
        responsible_analyst: user?.name || user?.full_name || '',
        esps: []
    });

    const [availablePDs, setAvailablePDs] = useState([]);

    useEffect(() => {
        if (contract) {
            let parsedEsps = [];
            if (Array.isArray(contract.esps)) {
                parsedEsps = contract.esps;
            } else if (typeof contract.esps === 'string') {
                try {
                    parsedEsps = JSON.parse(contract.esps);
                } catch (e) {
                    parsedEsps = [];
                }
            }

            setFormData({
                client_name: contract.client_name || '',
                pd_number: contract.pd_number || '',
                responsible_analyst: contract.responsible_analyst || '',
                esps: parsedEsps
            });
        } else if (user) {
            // Se for novo contrato (não tem contract prop), preenche com o usuário logado
            // Mas só se o campo ainda estiver vazio
            setFormData(prev => {
                if (!prev.responsible_analyst) {
                    return {
                        ...prev,
                        responsible_analyst: user.full_name || user.name || ''
                    };
                }
                return prev;
            });
        }
    }, [contract, user]);

    // Atualizar PDs disponíveis quando o cliente mudar
    useEffect(() => {
        if (formData.client_name && prazosContracts.length > 0) {
            const clientPDs = prazosContracts
                .filter(c => c.cliente === formData.client_name)
                .map(c => c.contrato)
                .filter(Boolean);

            const uniquePDs = [...new Set(clientPDs)];
            setAvailablePDs(uniquePDs);

            // Se houver apenas um PD, preencher automaticamente
            if (uniquePDs.length === 1 && !formData.pd_number) {
                setFormData(prev => ({ ...prev, pd_number: uniquePDs[0] }));
            }
        } else {
            setAvailablePDs([]);
        }
    }, [formData.client_name, prazosContracts]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare payload with stringified JSON for JSONB columns to avoid driver issues
        const payload = {
            ...formData,
            esps: JSON.stringify(formData.esps || [])
        };

        // Enviar apenas os campos que existem na tabela finance_contracts
        onSubmit(payload);
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Dados do Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="client_name" className="text-slate-700">
                                Cliente *
                            </Label>
                            <Select
                                value={formData.client_name}
                                onValueChange={(value) => updateField('client_name', value)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecione um cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.name}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="pd_number" className="text-slate-700">
                                Número do PD *
                            </Label>
                            {availablePDs.length > 0 ? (
                                <Select
                                    value={formData.pd_number}
                                    onValueChange={(value) => updateField('pd_number', value)}
                                    required
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Selecione um PD cadastrado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePDs.map((pd) => (
                                            <SelectItem key={pd} value={pd}>
                                                {pd}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    id="pd_number"
                                    value={formData.pd_number}
                                    onChange={(e) => updateField('pd_number', e.target.value)}
                                    placeholder={formData.client_name ? "Nenhum PD cadastrado para este cliente" : "Selecione um cliente primeiro"}
                                    className="mt-1"
                                    required
                                    disabled={!formData.client_name}
                                />
                            )}
                            {formData.client_name && availablePDs.length > 0 && (
                                <p className="text-xs text-slate-500 mt-1">
                                    {availablePDs.length} PD(s) encontrado(s) em Prazos
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="responsible_analyst" className="text-slate-700">
                                Analista Responsável *
                            </Label>
                            <Select
                                value={formData.responsible_analyst}
                                onValueChange={(value) => updateField('responsible_analyst', value)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Selecione um analista" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Adicionar usuário logado se não estiver na lista e tiver nome */}
                                    {user && (user.name || user.full_name) && !analysts.find(a => a.name === (user.name || user.full_name)) && (
                                        <SelectItem value={user.name || user.full_name}>
                                            {user.name || user.full_name}
                                        </SelectItem>
                                    )}
                                    {analysts.map((analyst) => (
                                        <SelectItem key={analyst.id} value={analyst.name}>
                                            {analyst.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>



            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-slate-800">ESPs do Contrato</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <EspManager
                        esps={formData.esps}
                        onChange={(esps) => updateField('esps', esps)}
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
                    {isLoading ? 'Salvando...' : 'Salvar Contrato'}
                </Button>
            </div>
        </form>
    );
}
