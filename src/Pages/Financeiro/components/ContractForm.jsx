import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fluxoApi } from '@/api/fluxoClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Save, FileText, Building2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
    const [openClientCombo, setOpenClientCombo] = useState(false);

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

    // Obter lista única de clientes dos contratos
    const availableClients = React.useMemo(() => {
        return [...new Set(prazosContracts.map(c => c.cliente).filter(Boolean))].sort();
    }, [prazosContracts]);

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
                            <Popover open={openClientCombo} onOpenChange={setOpenClientCombo}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openClientCombo}
                                        className="w-full justify-between h-10 font-normal px-3 mt-1"
                                    >
                                        <span className="truncate">
                                            {formData.client_name || "Selecione um cliente..."}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Buscar cliente..." />
                                        <CommandList>
                                            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                                            <CommandGroup>
                                                {availableClients.map((clientName) => (
                                                    <CommandItem
                                                        key={clientName}
                                                        value={clientName}
                                                        onSelect={() => {
                                                            updateField('client_name', clientName);
                                                            setOpenClientCombo(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.client_name === clientName ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {clientName}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
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

                            {/* Selected Contract Details Card */}
                            {(() => {
                                const selectedContract = prazosContracts.find(
                                    c => c.cliente === formData.client_name && c.contrato === formData.pd_number
                                );

                                if (selectedContract) {
                                    return (
                                        <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-start justify-between">
                                                <span className="font-semibold text-blue-900">Resumo do Contrato (COCR)</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${selectedContract.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {selectedContract.status || 'N/A'}
                                                </span>
                                            </div>

                                            {selectedContract.objeto && (
                                                <div className="text-slate-700">
                                                    <span className="font-medium text-slate-900 block text-xs uppercase tracking-wide opacity-70 mb-0.5">Objeto:</span>
                                                    <p className="line-clamp-3 leading-relaxed">{selectedContract.objeto}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-100/50">
                                                <div>
                                                    <span className="font-medium text-slate-900 block text-xs uppercase tracking-wide opacity-70">Vigência:</span>
                                                    <span className="text-slate-600">
                                                        {selectedContract.data_inicio_efetividade ? new Date(selectedContract.data_inicio_efetividade).toLocaleDateString() : '-'}
                                                        {' a '}
                                                        {selectedContract.data_fim_efetividade ? new Date(selectedContract.data_fim_efetividade).toLocaleDateString() : '-'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-900 block text-xs uppercase tracking-wide opacity-70">Valor Global:</span>
                                                    <span className="text-slate-600">
                                                        {selectedContract.valor_contrato ?
                                                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedContract.valor_contrato)
                                                            : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
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
        </form >
    );
}
