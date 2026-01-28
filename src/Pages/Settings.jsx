import React, { useState, useEffect } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Building2, Users, Layers, UserCheck, Calendar, Save, X, UserCog } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('clients');
    const [editItem, setEditItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const stored = localStorage.getItem('fluxo_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const isAdmin = user?.role === 'admin' || user?.role === 'manager';

    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: () => fluxoApi.entities.Client.list()
    });

    const { data: cycles = [] } = useQuery({
        queryKey: ['cycles'],
        queryFn: () => fluxoApi.entities.Cycle.list()
    });

    const { data: analysts = [] } = useQuery({
        queryKey: ['analysts'],
        queryFn: () => fluxoApi.entities.Analyst.list()
    });

    const { data: requesters = [] } = useQuery({
        queryKey: ['requesters'],
        queryFn: () => fluxoApi.entities.Requester.list()
    });

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: () => fluxoApi.entities.Holiday.list()
    });

    const { data: managers = [] } = useQuery({
        queryKey: ['managers'],
        queryFn: () => fluxoApi.entities.User.list({ role: 'manager' })
    });

    const createMutation = useMutation({
        mutationFn: async ({ entity, data }) => {
            return fluxoApi.entities[entity].create(data);
        },
        onSuccess: (_, { entity }) => {
            queryClient.invalidateQueries({ queryKey: [entity.toLowerCase() + 's'] });
            setShowForm(false);
            setFormData({});
            toast.success('Registro criado!');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ entity, id, data }) => {
            return fluxoApi.entities[entity].update(id, data);
        },
        onSuccess: (_, { entity }) => {
            queryClient.invalidateQueries({ queryKey: [entity.toLowerCase() + 's'] });
            setShowForm(false);
            setEditItem(null);
            setFormData({});
            toast.success('Registro atualizado!');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ entity, id }) => {
            return fluxoApi.entities[entity].delete(id);
        },
        onSuccess: (_, { entity }) => {
            queryClient.invalidateQueries({ queryKey: [entity.toLowerCase() + 's'] });
            toast.success('Registro excluído!');
        }
    });

    const handleSave = () => {
        const entityMap = {
            clients: 'Client',
            cycles: 'Cycle',
            analysts: 'Analyst',
            requesters: 'Requester',
            holidays: 'Holiday',
            managers: 'User'
        };
        const entity = entityMap[activeTab];

        let finalData = { ...formData };
        if (activeTab === 'managers') {
            finalData.role = 'manager';
        }

        if (editItem) {
            updateMutation.mutate({ entity, id: editItem.id, data: finalData });
        } else {
            createMutation.mutate({ entity, data: finalData });
        }
    };

    const openForm = (item = null) => {
        setEditItem(item);
        setFormData(item || {});
        setShowForm(true);
    };

    const handleDelete = (entity, id) => {
        if (confirm('Deseja realmente excluir este registro?')) {
            deleteMutation.mutate({ entity, id });
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-700 mb-2">Acesso Restrito</h2>
                        <p className="text-slate-500">
                            Apenas gestores podem acessar as configurações do sistema.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const renderTable = (items, columns, entityName) => (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map(col => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                    <TableHead className="w-24">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} className="text-center py-8 text-slate-400">
                            Nenhum registro encontrado
                        </TableCell>
                    </TableRow>
                ) : (
                    items.map(item => (
                        <TableRow key={item.id}>
                            {columns.map(col => (
                                <TableCell key={col.key}>
                                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                                </TableCell>
                            ))}
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => openForm(item)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(entityName, item.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );

    const renderForm = () => {
        const forms = {
            clients: (
                <>
                    <div className="space-y-2">
                        <Label>Nome do Cliente *</Label>
                        <Input
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={formData.active !== false}
                            onCheckedChange={v => setFormData({ ...formData, active: v })}
                        />
                        <Label>Ativo</Label>
                    </div>
                </>
            ),
            cycles: (
                <>
                    <div className="space-y-2">
                        <Label>Nome do Ciclo *</Label>
                        <Input
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Ciclo 2024.1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data Início</Label>
                            <Input
                                type="date"
                                value={formData.start_date || ''}
                                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Data Término</Label>
                            <Input
                                type="date"
                                value={formData.end_date || ''}
                                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={formData.active !== false}
                            onCheckedChange={v => setFormData({ ...formData, active: v })}
                        />
                        <Label>Ativo</Label>
                    </div>
                </>
            ),
            analysts: (
                <>
                    <div className="space-y-2">
                        <Label>Nome do Analista *</Label>
                        <Input
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome completo"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            value={formData.email || ''}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@empresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Senha {!editItem && '*'}</Label>
                        <Input
                            type="password"
                            value={formData.password || ''}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder={editItem ? "Deixe em branco para manter" : "Senha de acesso"}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={formData.active !== false}
                            onCheckedChange={v => setFormData({ ...formData, active: v })}
                        />
                        <Label>Ativo</Label>
                    </div>
                </>
            ),
            requesters: (
                <>
                    <div className="space-y-2">
                        <Label>Nome do Solicitante *</Label>
                        <Input
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome completo"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            value={formData.email || ''}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@empresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Senha {!editItem && '*'}</Label>
                        <Input
                            type="password"
                            value={formData.password || ''}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder={editItem ? "Deixe em branco para manter" : "Senha de acesso"}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={formData.active !== false}
                            onCheckedChange={v => setFormData({ ...formData, active: v })}
                        />
                        <Label>Ativo</Label>
                    </div>
                </>
            ),
            holidays: (
                <>
                    <div className="space-y-2">
                        <Label>Nome do Feriado *</Label>
                        <Input
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Natal"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Data *</Label>
                        <Input
                            type="date"
                            value={formData.date || ''}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                </>
            ),

            managers: (
                <>
                    <div className="space-y-2">
                        <Label>Nome do Gestor *</Label>
                        <Input
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome completo"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                            type="email"
                            value={formData.email || ''}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@empresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Senha {!editItem && '*'}</Label>
                        <Input
                            type="password"
                            value={formData.password || ''}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder={editItem ? "Deixe em branco para manter" : "Senha de acesso"}
                        />
                    </div>
                </>
            )
        };

        return forms[activeTab];
    };

    const tabConfig = {
        clients: {
            title: 'Clientes',
            icon: Building2,
            data: clients,
            entityName: 'Client',
            columns: [
                { key: 'name', label: 'Nome' },
                {
                    key: 'active',
                    label: 'Status',
                    render: v => v !== false
                        ? <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>
                        : <Badge variant="secondary">Inativo</Badge>
                }
            ]
        },
        cycles: {
            title: 'Ciclos',
            icon: Layers,
            data: cycles,
            entityName: 'Cycle',
            columns: [
                { key: 'name', label: 'Nome' },
                {
                    key: 'start_date',
                    label: 'Início',
                    render: v => v ? format(parseISO(v), 'dd/MM/yyyy', { locale: ptBR }) : '-'
                },
                {
                    key: 'end_date',
                    label: 'Término',
                    render: v => v ? format(parseISO(v), 'dd/MM/yyyy', { locale: ptBR }) : '-'
                },
                {
                    key: 'active',
                    label: 'Status',
                    render: v => v !== false
                        ? <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>
                        : <Badge variant="secondary">Inativo</Badge>
                }
            ]
        },
        analysts: {
            title: 'Analistas (Responsáveis)',
            icon: Users,
            data: analysts,
            entityName: 'Analyst',
            columns: [
                { key: 'name', label: 'Nome' },
                { key: 'email', label: 'Email' },
                {
                    key: 'active',
                    label: 'Status',
                    render: v => v !== false
                        ? <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>
                        : <Badge variant="secondary">Inativo</Badge>
                }
            ]
        },
        requesters: {
            title: 'Solicitantes',
            icon: UserCheck,
            data: requesters,
            entityName: 'Requester',
            columns: [
                { key: 'name', label: 'Nome' },
                { key: 'email', label: 'Email' },
                {
                    key: 'active',
                    label: 'Status',
                    render: v => v !== false
                        ? <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>
                        : <Badge variant="secondary">Inativo</Badge>
                }
            ]
        },
        holidays: {
            title: 'Feriados',
            icon: Calendar,
            data: holidays,
            entityName: 'Holiday',
            columns: [
                { key: 'name', label: 'Nome' },
                {
                    key: 'date',
                    label: 'Data',
                    render: v => v ? format(parseISO(v), 'dd/MM/yyyy', { locale: ptBR }) : '-'
                }
            ]
        },
        managers: {
            title: 'Gestores',
            icon: UserCog,
            data: managers,
            entityName: 'User',
            columns: [
                { key: 'name', label: 'Nome' },
                { key: 'email', label: 'Email' }
            ]
        }
    };

    const currentConfig = tabConfig[activeTab];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Configurações
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gerencie cadastros de apoio do sistema
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6 bg-white border border-slate-200 p-1 rounded-xl">
                        {Object.entries(tabConfig).map(([key, config]) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg"
                            >
                                <config.icon className="w-4 h-4 mr-2" />
                                {config.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {Object.entries(tabConfig).map(([key, config]) => (
                        <TabsContent key={key} value={key}>
                            <Card className="border-0 shadow-lg rounded-2xl">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <config.icon className="w-5 h-5 text-indigo-600" />
                                            {config.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {config.data.length} registro(s)
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => openForm()} className="bg-indigo-600 hover:bg-indigo-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {renderTable(config.data, config.columns, config.entityName)}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editItem ? 'Editar' : 'Novo'} {currentConfig?.title?.replace(/s$/, '')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {renderForm()}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
