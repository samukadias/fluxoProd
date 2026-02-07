import React, { useState, useEffect } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Plus, Search, Building2, ChevronRight,
    Edit, History, Loader2, FolderOpen, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ContractForm from './components/ContractForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Contracts() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    // Obter usuário do localStorage para verificar permissões
    const user = JSON.parse(localStorage.getItem('fluxo_user') || localStorage.getItem('user') || '{}');
    console.log('User status para exclusão:', {
        role: user?.role,
        perfil: user?.perfil,
        profile_type: user?.profile_type
    });

    const { data: contracts = [], isLoading } = useQuery({
        queryKey: ['finance-contracts'],
        queryFn: () => fluxoApi.entities.FinanceContract.list('-created_at')
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            console.log('=== CRIANDO CONTRATO FINANCEIRO ===');
            console.log('Dados enviados:', data);

            return toast.promise(
                fluxoApi.entities.FinanceContract.create(data),
                {
                    loading: 'Criando contrato...',
                    success: 'Contrato criado com sucesso!',
                    error: (err) => `Erro: ${err.response?.data?.error || err.message}`
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance-contracts'] });
            setShowForm(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            console.log('=== ATUALIZANDO CONTRATO ===');
            console.log('ID:', id);
            return toast.promise(
                fluxoApi.entities.FinanceContract.update(id, data),
                {
                    loading: 'Atualizando contrato...',
                    success: 'Contrato atualizado com sucesso!',
                    error: (err) => `Erro: ${err.response?.data?.error || err.message}`
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance-contracts'] });
            setShowForm(false);
            setEditingContract(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            console.log('=== EXCLUINDO CONTRATO ===');
            return toast.promise(
                fluxoApi.entities.FinanceContract.delete(id),
                {
                    loading: 'Excluindo contrato...',
                    success: 'Contrato excluído com sucesso!',
                    error: (err) => `Erro: ${err.response?.data?.error || err.message}`
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance-contracts'] });
            // Se deletou, o useEffect lá em baixo vai cuidar do redirect se precisar
        }
    });

    const handleSubmit = (data) => {
        console.log('=== HANDLE SUBMIT CHAMADO ===');
        console.log('Editing contract:', editingContract);
        console.log('Data recebida:', data);

        if (editingContract) {
            updateMutation.mutate({ id: editingContract.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    // Agrupar contratos por cliente
    const clientGroups = contracts.reduce((groups, contract) => {
        const client = contract.client_name || 'Sem Cliente';
        if (!groups[client]) groups[client] = [];
        groups[client].push(contract);
        return groups;
    }, {});

    const clientsList = Object.keys(clientGroups).sort();

    const filteredContracts = selectedClient
        ? clientGroups[selectedClient].filter(contract =>
            contract.pd_number?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    // Auto-redirect quando todos os contratos de um cliente são excluídos
    useEffect(() => {
        // Se um cliente está selecionado mas não tem mais contratos (após exclusão)
        if (selectedClient && clientGroups[selectedClient]?.length === 0) {
            console.log('Cliente sem contratos detectado, voltando para lista de clientes...');
            setSelectedClient(null);
            setSearchTerm('');
        }
    }, [selectedClient, clientGroups]);

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Contratos</h1>
                        <p className="text-slate-600 mt-1">Gerencie os contratos da empresa</p>
                    </div>
<<<<<<< HEAD
                    {!selectedClient && (
                        <Button
                            onClick={() => {
                                setEditingContract(null);
                                setShowForm(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Contrato
                        </Button>
                    )}
=======
                    <Button
                        onClick={() => {
                            setEditingContract(null);
                            setShowForm(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Contrato
                    </Button>
>>>>>>> b0affbe18c16533c8cdd62eb233f9bbe66e897a1
                </div>

                {/* Seleção de Cliente */}
                {!selectedClient ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {clientsList.map((client, index) => (
                                <motion.div
                                    key={client}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        className="border-0 shadow-lg bg-white hover:shadow-xl transition-all cursor-pointer"
                                        onClick={() => setSelectedClient(client)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-6 h-6 text-blue-600" />
                                                </div>
<<<<<<< HEAD
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate" title={client}>
=======
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
>>>>>>> b0affbe18c16533c8cdd62eb233f9bbe66e897a1
                                                        {client}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        {clientGroups[client].length} contrato(s)
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <>
                        {/* Breadcrumb/Voltar */}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedClient(null);
                                setSearchTerm('');
                            }}
                            className="mb-6"
                        >
                            ← Voltar para Clientes
                        </Button>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur mb-6">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{selectedClient}</h2>
                                        <p className="text-sm text-slate-600">
                                            {clientGroups[selectedClient].length} contrato(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Buscar por PD..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contracts List */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : filteredContracts.length === 0 ? (
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                                <CardContent className="py-20 text-center">
                                    <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                                        Nenhum contrato encontrado
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        {searchTerm ? 'Tente uma busca diferente' : 'Comece cadastrando seu primeiro contrato'}
                                    </p>
                                    {!searchTerm && (
                                        <Button
                                            onClick={() => setShowForm(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Cadastrar Contrato
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                <AnimatePresence>
                                    {filteredContracts.map((contract, index) => (
                                        <motion.div
                                            key={contract.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
                                                <CardContent className="p-0">
                                                    <div className="flex flex-col md:flex-row md:items-center">
                                                        <div className="flex-1 p-6">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                    <Building2 className="w-6 h-6 text-blue-600" />
                                                                </div>
<<<<<<< HEAD
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate" title={contract.client_name || contract.company_name}>
=======
                                                                <div className="flex-1">
                                                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
>>>>>>> b0affbe18c16533c8cdd62eb233f9bbe66e897a1
                                                                        {contract.client_name || contract.company_name}
                                                                    </h3>
                                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                                                        <Badge variant="outline" className="bg-slate-50">
                                                                            PD: {contract.pd_number}
                                                                        </Badge>
                                                                        {contract.sei_process_number && (
                                                                            <Badge variant="outline" className="bg-slate-50">
                                                                                SEI: {contract.sei_process_number}
                                                                            </Badge>
                                                                        )}
                                                                        <Badge className="bg-blue-100 text-blue-700">
                                                                            {(() => {
                                                                                const esps = Array.isArray(contract.esps) ? contract.esps : (typeof contract.esps === 'string' ? (JSON.parse(contract.esps || '[]')) : []);
                                                                                return esps.length;
                                                                            })()} ESP(s)
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 p-4 md:pr-6 border-t md:border-t-0 md:border-l border-slate-100">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setEditingContract(contract);
                                                                    setShowForm(true);
                                                                }}
                                                                className="text-slate-600"
                                                            >
                                                                <Edit className="w-4 h-4 mr-1" />
                                                                Editar
                                                            </Button>

                                                            {/* Botão Excluir - para gestores */}
                                                            {(user?.role === 'manager' || user?.role === 'admin' || user?.role === 'gestor' ||
                                                                user?.perfil === 'GESTOR' || user?.perfil === 'ADMIN' ||
                                                                user?.profile_type === 'gestor') && (
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                                            >
                                                                                <Trash2 className="w-4 h-4 mr-1" />
                                                                                Excluir
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Tem certeza que deseja excluir o contrato <strong>{contract.pd_number}</strong> do cliente <strong>{contract.client_name}</strong>?
                                                                                    <br /><br />
                                                                                    Esta ação não pode ser desfeita e todas as atestações relacionadas também serão perdidas.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => deleteMutation.mutate(contract.id)}
                                                                                    className="bg-red-600 hover:bg-red-700"
                                                                                    disabled={deleteMutation.isPending}
                                                                                >
                                                                                    {deleteMutation.isPending ? 'Excluindo...' : 'Excluir Contrato'}
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                )}
                                                            <Link to={`/financeiro/contratos/${contract.id}/atestacoes`}>
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                >
                                                                    <History className="w-4 h-4 mr-1" />
                                                                    Atestações
                                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Form Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
                        </DialogTitle>
                    </DialogHeader>
                    <ContractForm
                        contract={editingContract}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
