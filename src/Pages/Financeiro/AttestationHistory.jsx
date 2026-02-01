import React, { useState, useEffect } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus, ArrowLeft, Calendar, Edit,
    Loader2, FileText, AlertTriangle, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AttestationForm from './components/AttestationForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function AttestationHistory() {
    const navigate = useNavigate();
    const { contractId } = useParams();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editingAttestation, setEditingAttestation] = useState(null);
    const [contract, setContract] = useState(null);

    // Se não tiver param na URL, tentar query param (retrocompatibilidade)
    const urlParams = new URLSearchParams(window.location.search);
    const cid = contractId || urlParams.get('contractId');

    useEffect(() => {
        if (!cid) {
            navigate('/financeiro/contratos');
        }
    }, [cid, navigate]);

    const { data: contractData, isLoading: loadingContract } = useQuery({
        queryKey: ['contract', cid],
        queryFn: async () => {
            // fluxoApi não tem .filter direto como base44, tem que usar .list ou .get se tiver ID
            // Supondo que .list retorne todos e filtremos, ou .get(id) se implementado.
            // O createCrud implementado no fluxoClient usa axios.get(resource) ou axios.post(resource, data).
            // CRUD generico geralmente tem get by id: axios.get(`${resource}/${id}`)
            try {
                // Tenta buscar por ID direto se a API suportar /api/contracts/:id
                // fluxoClient.createCrud não expõe getById explicitamente no código que vi (só create, list, update, delete).
                // Mas list aceita params. Vamos assumir que list retorna lista.
                // Se a API backend feita com `createCrudRoutes` suportar filtros via query string...
                // O `createCrudRoutes` no server/index.js implementa:
                // router.get('/', async (req, res) => { ... const items = await db.query(`SELECT * FROM ${tableName} ORDER BY id DESC`) ... })
                // Ele NÃO implementa filtro por ID na listagem nem getById individual no código que vi antes.
                // ESPERA! createCrudRoutes tem `router.put('/:id', ...)` e `router.delete('/:id', ...)`.
                // FALTOU `router.get('/:id', ...)` no createCrudRoutes do server/index.js!
                // Vou ter que fazer um patch/workaround: listar todos e filtrar no front (ineficiente mas funciona agora) ou adicionar getById no backend.
                // Vou adicionar getById no backend depois. Por enquanto, vou listar todos e encontrar no array.
                const allContracts = await fluxoApi.entities.FinanceContract.list();
                return allContracts.find(c => c.id === parseInt(cid));
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        enabled: !!cid
    });

    useEffect(() => {
        if (contractData) {
            setContract(contractData);
        }
    }, [contractData]);

    const { data: attestations = [], isLoading: loadingAttestations } = useQuery({
        queryKey: ['attestations', cid],
        queryFn: async () => {
            const all = await fluxoApi.entities.MonthlyAttestation.list(); // Traz todos
            // Filtrar manualmente
            return all.filter(a => a.contract_id === parseInt(cid)).sort((a, b) => b.reference_month.localeCompare(a.reference_month));
        },
        enabled: !!cid
    });

    const createMutation = useMutation({
        mutationFn: (data) => fluxoApi.entities.MonthlyAttestation.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attestations', cid] });
            setShowForm(false);
        },
        onError: (error) => {
            console.error('❌ [Mutation] Erro ao criar:', error);
            toast.error('Erro ao salvar atestação: ' + (error.response?.data?.error || error.message));
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => fluxoApi.entities.MonthlyAttestation.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attestations', cid] });
            setShowForm(false);
            setEditingAttestation(null);
        }
    });

    const handleSubmit = (data) => {


        // Garantir contract_id
        const payload = { ...data, contract_id: parseInt(cid) };


        if (editingAttestation) {

            updateMutation.mutate({ id: editingAttestation.id, data: payload });
        } else {

            createMutation.mutate(payload);
        }
    };

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
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    // Helper parse ESPs
    const getEsps = () => {
        if (contract && contract.esps) {
            if (Array.isArray(contract.esps)) return contract.esps;
            if (typeof contract.esps === 'string') {
                try { return JSON.parse(contract.esps); } catch (e) { return []; }
            }
        }
        return [];
    };

    if (loadingContract || !contract) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/financeiro/contratos">
                        <Button variant="ghost" className="mb-4 text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para Contratos
                        </Button>
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Histórico de Atestações
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Badge className="bg-blue-100 text-blue-700">
                                    {contract.client_name || contract.company_name}
                                </Badge>
                                <Badge variant="outline">
                                    PD: {contract.pd_number}
                                </Badge>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingAttestation(null);
                                setShowForm(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Atestação
                        </Button>
                    </div>
                </div>

                {/* ESPs do Contrato */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur mb-6">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            ESPs do Contrato
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-2">
                            {getEsps().length > 0 ? (
                                getEsps().map((esp, i) => (
                                    <Badge key={i} variant="outline" className="py-2 px-3">
                                        <span className="font-semibold">{esp.esp_number}</span>
                                        <span className="text-slate-500 ml-2">
                                            {esp.object_description?.substring(0, 40)}...
                                        </span>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-slate-500">Nenhuma ESP cadastrada</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Attestations Table */}
                {loadingAttestations ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : attestations.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                        <CardContent className="py-20 text-center">
                            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                Nenhuma atestação registrada
                            </h3>
                            <p className="text-slate-500 mb-6">
                                Comece registrando a primeira atestação mensal
                            </p>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Registrar Atestação
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-0 shadow-lg bg-white overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 border-b border-slate-100">
                                        <TableHead className="font-semibold text-slate-700">Mês</TableHead>
                                        <TableHead className="font-semibold text-slate-700">ESP</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Relatório</TableHead>
                                        <TableHead className="font-semibold text-slate-700">Atestação</TableHead>
                                        <TableHead className="font-semibold text-slate-700 text-right">Faturado</TableHead>
                                        <TableHead className="font-semibold text-slate-700 text-right">Pago</TableHead>
                                        <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                                        <TableHead className="font-semibold text-slate-700 text-center">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {attestations.map((att, index) => {
                                            const pendency = (att.billed_amount || 0) - (att.paid_amount || 0);
                                            const hasPendency = pendency > 0;

                                            return (
                                                <motion.tr
                                                    key={att.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${hasPendency ? 'bg-red-50/30' : ''
                                                        }`}
                                                >
                                                    <TableCell className="font-medium text-slate-800">
                                                        {formatMonth(att.reference_month)}
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        {att.esp_number || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        <div className="text-xs">
                                                            <div>Gerado: {formatDate(att.report_generation_date)}</div>
                                                            <div>Enviado: {formatDate(att.report_send_date)}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        <div className="text-xs">
                                                            <div>Retorno: {formatDate(att.attestation_return_date)}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-slate-700 font-medium">
                                                        {formatCurrency(att.billed_amount)}
                                                    </TableCell>
                                                    <TableCell className="text-right text-slate-700 font-medium">
                                                        {formatCurrency(att.paid_amount)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {hasPendency ? (
                                                            <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                                {formatCurrency(pendency)}
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                                Quitado
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingAttestation(att);
                                                                setShowForm(true);
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>

            {/* Form Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editingAttestation ? 'Editar Atestação' : 'Nova Atestação Mensal'}
                        </DialogTitle>
                    </DialogHeader>
                    <AttestationForm
                        attestation={editingAttestation}
                        contract={contract}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
