import React, { useState, useEffect } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Plus, Search, Building2, ChevronRight,
    Edit, History, Loader2, FolderOpen, Trash2,
    FileSpreadsheet, LayoutGrid, List, Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ContractForm from './components/ContractForm';
import ImportExportDialog from './components/ImportExportDialog';
import AttestationImportExportDialog from './components/AttestationImportExportDialog';
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
    const location = useLocation();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    // Lazy initialize viewMode from localStorage (or default to 'grid')
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('cvacContractsViewMode') || 'grid';
    });

    // Save viewMode to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cvacContractsViewMode', viewMode);
    }, [viewMode]);

    const [showForm, setShowForm] = useState(false);
    const [showImportExport, setShowImportExport] = useState(false);
    const [showBaseCvacImport, setShowBaseCvacImport] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedAnalyst, setSelectedAnalyst] = useState(''); // Filter state
    
    // Limits para evitar travamento de DOM
    const [clientLimit, setClientLimit] = useState(30);
    const [contractLimit, setContractLimit] = useState(30);

    // Resetar limits quando buscar ou trocar modo
    useEffect(() => {
        setClientLimit(30);
        setContractLimit(30);
    }, [debouncedSearchTerm, selectedClient, viewMode]);

    const { user } = useAuth();

    // Detect if user is analyst or manager
    const userRole = (user?.role || '').toLowerCase();
    const userProfile = (user?.profile_type || user?.perfil || '').toLowerCase();
    const isAnalyst = userRole.includes('analyst') || userRole.includes('analista') || userProfile.includes('analista');
    const userName = user?.full_name || user?.name;

    // Load ALL contracts (no backend filtering)
    const { data: allContracts = [], isLoading } = useQuery({
        queryKey: ['finance-contracts'],
        queryFn: () => fluxoApi.entities.FinanceContract.list('-created_at')
    });

    // Get unique analysts from contracts
    const analysts = [...new Set(allContracts.map(c => c.responsible_analyst).filter(Boolean))].sort();

    // Auto-select logged user on first load (analysts only see their own contracts)
    useEffect(() => {
        if (isAnalyst && userName && !selectedAnalyst) {
            // Analysts: auto-select and lock to their name
            setSelectedAnalyst(userName);
        }
    }, [user, isAnalyst, userName, selectedAnalyst]);

    // Filter contracts by selected analyst (or show all if 'all' selected)
    const contracts = selectedAnalyst && selectedAnalyst !== 'all'
        ? allContracts.filter(c => c.responsible_analyst === selectedAnalyst)
        : allContracts;

    // Restore selected client from navigation state (e.g. back button from attestations)
    useEffect(() => {
        if (location.state?.selectedClient && !selectedClient) {
            setSelectedClient(location.state.selectedClient);
            // Limpa o state usando o React Router em vez do history nativo.
            // Isso garante que o location.state local não fique 'preso' na próxima renderização 
            // e cause o botão Home a pular de volta para o cliente indefinidamente.
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, selectedClient, navigate]);

    const createMutation = useMutation({
        mutationFn: (data) => fluxoApi.entities.FinanceContract.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance-contracts'] });
            setShowForm(false);
            toast.success('Contrato criado com sucesso!');
        },
        onError: (err) => {
            toast.error(`Erro: ${err.response?.data?.error || err.message}`);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => fluxoApi.entities.FinanceContract.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance-contracts'] });
            setShowForm(false);
            setEditingContract(null);
            toast.success('Contrato atualizado com sucesso!');
        },
        onError: (err) => {
            toast.error(`Erro: ${err.response?.data?.error || err.message}`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => fluxoApi.entities.FinanceContract.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance-contracts'] });
            toast.success('Contrato excluído com sucesso!');
        },
        onError: (err) => {
            toast.error(`Erro: ${err.response?.data?.error || err.message}`);
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

    // Agrupar contratos por cliente (ou por PD se não tiver cliente)
    const clientGroups = React.useMemo(() => {
        return contracts.reduce((groups, contract) => {
            // Use client_name if available, otherwise use pd_number as identifier
            const client = contract.client_name || contract.pd_number || 'Sem Identificação';
            if (!groups[client]) groups[client] = [];
            groups[client].push(contract);
            return groups;
        }, {});
    }, [contracts]);

    const clientsList = React.useMemo(() => Object.keys(clientGroups).sort(), [clientGroups]);

    const filteredContracts = selectedClient
        ? clientGroups[selectedClient].filter(contract =>
            contract.pd_number?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        : [];

    const visibleClients = React.useMemo(() => {
        return clientsList
            .filter(client => client.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    }, [clientsList, debouncedSearchTerm]);

    const displayedClients = visibleClients.slice(0, clientLimit);
    const displayedContracts = filteredContracts.slice(0, contractLimit);

    // Auto-redirect quando todos os contratos de um cliente são excluídos
    useEffect(() => {
        // Se um cliente está selecionado mas não tem mais contratos (após exclusão)
        if (selectedClient && (!clientGroups[selectedClient] || clientGroups[selectedClient].length === 0)) {
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
                    <div className="flex gap-2">
                        {!selectedClient && (
                            <Button
                                variant="outline"
                                onClick={() => setShowBaseCvacImport(true)}
                                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Importar BASE CVAC
                            </Button>
                        )}
                        {!selectedClient && (
                            <Button
                                variant="outline"
                                onClick={() => setShowImportExport(true)}
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Importar/Exportar
                            </Button>
                        )}
                        {(!selectedClient && userRole !== 'viewer') && (
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
                    </div>
                </div>

                {/* Seleção de Cliente */}
                {!selectedClient ? (
                    <div className="space-y-6">
                        {/* Analyst Filter Dropdown & View Mode */}
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex w-full md:w-auto items-center gap-2 max-w-md flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Pesquisar cliente..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white shadow-sm border-slate-200"
                                    />
                                </div>
                                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className={`px-2 py-1 h-8 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className={`px-2 py-1 h-8 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Analyst Filter - Conditional based on role */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                                    Analista Responsável:
                                </label>
                                {isAnalyst ? (
                                    // Analysts: Show read-only badge
                                    <Badge className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                        {userName}
                                    </Badge>
                                ) : (
                                    // Managers: Show dropdown filter
                                    <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
                                        <SelectTrigger className="w-[200px] bg-white shadow-sm">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os Analistas</SelectItem>
                                            {analysts.map(analyst => (
                                                <SelectItem key={analyst} value={analyst}>
                                                    {analyst}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {displayedClients.map((client, index) => (
                                            <motion.div
                                                key={client}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: Math.min(index * 0.02, 0.15) }} // Reduzido drasticamente para não enfileirar muito
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
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate" title={client}>
                                                                    {client}
                                                                </h3>
                                                                <p className="text-sm text-slate-600">
                                                                    {clientGroups[client].length} contrato(s)
                                                                </p>
                                                                {clientGroups[client][0]?.responsible_analyst && (
                                                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                                        <span className="font-medium text-slate-400">Responsável:</span>
                                                                        {clientGroups[client][0].responsible_analyst}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                {visibleClients.length > clientLimit && (
                                    <div className="flex justify-center mt-6">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setClientLimit(prev => prev + 30)}
                                            className="bg-white hover:bg-slate-50 text-slate-600"
                                        >
                                            Carregar Mais Clientes ({visibleClients.length - clientLimit} restantes)
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Card className="border-0 shadow-sm bg-white overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead>Cliente</TableHead>
                                                    <TableHead>Contratos</TableHead>
                                                    <TableHead>Analista Responsável</TableHead>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {displayedClients.map((client) => {
                                                        const group = clientGroups[client];
                                                        return (
                                                            <TableRow 
                                                                key={client} 
                                                                className="cursor-pointer hover:bg-slate-50 transition-colors"
                                                                onClick={() => setSelectedClient(client)}
                                                            >
                                                                <TableCell className="font-medium text-slate-900">{client}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary">{group.length} contrato(s)</Badge>
                                                                </TableCell>
                                                                <TableCell className="text-slate-600">
                                                                    {group[0]?.responsible_analyst || '-'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                                {visibleClients.length > clientLimit && (
                                    <div className="flex justify-center mt-4">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setClientLimit(prev => prev + 30)}
                                            className="bg-white hover:bg-slate-50 text-slate-600"
                                        >
                                            Carregar Mais Clientes ({visibleClients.length - clientLimit} restantes)
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
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
                            className="mb-6 text-slate-600 hover:text-slate-900"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Home
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
                                            {clientGroups[selectedClient]?.length || 0} contrato(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <Input
                                            placeholder="Buscar por PD..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className={`px-2 py-1 h-10 ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className={`px-2 py-1 h-10 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List className="w-4 h-4" />
                                        </Button>
                                    </div>
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
                        ) : viewMode === 'grid' ? (
                            <div className="space-y-6">
                                <div className="grid gap-4">
                                    <AnimatePresence>
                                        {displayedContracts.map((contract, index) => (
                                            <motion.div
                                                key={contract.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ delay: Math.min(index * 0.02, 0.15) }}
                                            >
                                                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
                                                    <CardContent className="p-0">
                                                        <div className="flex flex-col md:flex-row md:items-center">
                                                            <div className="flex-1 p-6">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                        <Building2 className="w-6 h-6 text-blue-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate" title={contract.client_name || contract.company_name}>
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
                                                                {userRole !== 'viewer' && (
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
                                                                )}

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
                                {filteredContracts.length > contractLimit && (
                                    <div className="flex justify-center mt-6">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setContractLimit(prev => prev + 30)}
                                            className="bg-white hover:bg-slate-50 text-slate-600"
                                        >
                                            Carregar Mais Contratos ({filteredContracts.length - contractLimit} restantes)
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Card className="border-0 shadow-sm bg-white overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead>Identificador</TableHead>
                                                    <TableHead>Processo SEI</TableHead>
                                                    <TableHead>ESPs</TableHead>
                                                    <TableHead className="text-right">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {displayedContracts.map((contract) => (
                                                    <TableRow key={contract.id} className="hover:bg-slate-50">
                                                        <TableCell className="font-medium">
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-900 max-w-[250px] truncate" title={contract.client_name || contract.company_name}>
                                                                    {contract.client_name || contract.company_name}
                                                                </span>
                                                                <span className="text-xs text-slate-500">PD: {contract.pd_number}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {contract.sei_process_number ? (
                                                                <Badge variant="outline" className="bg-slate-50 text-slate-600">
                                                                    {contract.sei_process_number}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-slate-400 text-sm">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                                {(() => {
                                                                    const esps = Array.isArray(contract.esps) ? contract.esps : (typeof contract.esps === 'string' ? (JSON.parse(contract.esps || '[]')) : []);
                                                                    return esps.length;
                                                                })()} ESP(s)
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {userRole !== 'viewer' && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setEditingContract(contract);
                                                                            setShowForm(true);
                                                                        }}
                                                                        className="text-slate-600 h-8 px-2"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                )}

                                                                {(user?.role === 'manager' || user?.role === 'admin' || user?.role === 'gestor' ||
                                                                    user?.perfil === 'GESTOR' || user?.perfil === 'ADMIN' ||
                                                                    user?.profile_type === 'gestor') && (
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                                                                    title="Excluir"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        Tem certeza que deseja excluir o contrato <strong>{contract.pd_number}</strong>?
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                    <AlertDialogAction
                                                                                        onClick={() => deleteMutation.mutate(contract.id)}
                                                                                        className="bg-red-600 hover:bg-red-700"
                                                                                        disabled={deleteMutation.isPending}
                                                                                    >
                                                                                        {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    )}
                                                                <Link to={`/financeiro/contratos/${contract.id}/atestacoes`}>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                    >
                                                                        <History className="w-4 h-4 mr-1" />
                                                                        <span className="hidden sm:inline">Atestações</span>
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                                {filteredContracts.length > contractLimit && (
                                    <div className="flex justify-center mt-4">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setContractLimit(prev => prev + 30)}
                                            className="bg-white hover:bg-slate-50 text-slate-600"
                                        >
                                            Carregar Mais Contratos ({filteredContracts.length - contractLimit} restantes)
                                        </Button>
                                    </div>
                                )}
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
            {/* Import/Export Dialog (contracts) */}
            <ImportExportDialog
                open={showImportExport}
                onOpenChange={setShowImportExport}
                contracts={allContracts}
                onImportComplete={() => queryClient.invalidateQueries({ queryKey: ['finance-contracts'] })}
            />
            {/* BASE CVAC Import Dialog */}
            <AttestationImportExportDialog
                open={showBaseCvacImport}
                onOpenChange={setShowBaseCvacImport}
                attestations={[]}
                onImportComplete={() => queryClient.invalidateQueries({ queryKey: ['finance-contracts'] })}
            />
        </div>

    );
}
