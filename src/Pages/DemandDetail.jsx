import React, { useState, useEffect } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Edit2, Clock, Calendar, User, Building2, Layers, AlertTriangle, Trash2 } from "lucide-react";
import StatusBadge from '@/components/demands/StatusBadge';
import PriorityBadge from '@/components/demands/PriorityBadge';
import StatusTimeline from '@/components/demands/StatusTimeline';
import DemandForm from '@/components/demands/DemandForm';
import { calculateWorkDays, calculateSLA } from '@/components/demands/EffortCalculator';
import { format, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ACTIVE_STATUSES = [
    "PENDENTE TRIAGEM",
    "DESIGNADA",
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "CORREÇÃO",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA FORNECEDOR"
];

export default function DemandDetailPage() {
    const queryClient = useQueryClient();
    const urlParams = new URLSearchParams(window.location.search);
    const demandId = urlParams.get('id');

    const [user, setUser] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('fluxo_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const { data: demand, isLoading: loadingDemand } = useQuery({
        queryKey: ['demand', demandId],
        queryFn: () => fluxoApi.entities.Demand.get(demandId),
        enabled: !!demandId
    });

    const { data: history = [] } = useQuery({
        queryKey: ['history', demandId],
        queryFn: () => fluxoApi.entities.StatusHistory.list({ demand_id: demandId, sort: 'changed_at' }),
        enabled: !!demandId
    });

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: () => fluxoApi.entities.Holiday.list()
    });

    const { data: analysts = [] } = useQuery({
        queryKey: ['analysts'],
        queryFn: () => fluxoApi.entities.Analyst.list()
    });

    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: () => fluxoApi.entities.Client.list()
    });

    const { data: cycles = [] } = useQuery({
        queryKey: ['cycles'],
        queryFn: () => fluxoApi.entities.Cycle.list()
    });

    const { data: requesters = [] } = useQuery({
        queryKey: ['requesters'],
        queryFn: () => fluxoApi.entities.Requester.list()
    });

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const oldStatus = demand?.status;
            const newStatus = data.status;

            // Calcular tempo no status anterior
            let timeInPreviousStatus = 0;
            if (oldStatus !== newStatus) {
                const lastHistoryEntry = history[history.length - 1];
                if (lastHistoryEntry) {
                    const lastChange = new Date(lastHistoryEntry.changed_at);
                    const now = new Date();
                    timeInPreviousStatus = Math.round((now - lastChange) / (1000 * 60));
                }

                // Lógica de congelamento
                if (oldStatus === 'CONGELADA' && newStatus !== 'CONGELADA') {
                    // Descongelando - calcular tempo congelado
                    if (demand.last_frozen_at) {
                        const frozenSince = new Date(demand.last_frozen_at);
                        const additionalFrozenMinutes = Math.round((new Date() - frozenSince) / (1000 * 60));
                        data.frozen_time_minutes = (demand.frozen_time_minutes || 0) + additionalFrozenMinutes;
                        data.last_frozen_at = null;
                    }
                } else if (newStatus === 'CONGELADA' && oldStatus !== 'CONGELADA') {
                    // Congelando
                    data.last_frozen_at = new Date().toISOString();
                }

                // Registrar histórico
                await fluxoApi.entities.StatusHistory.create({
                    demand_id: demandId,
                    from_status: oldStatus,
                    to_status: newStatus,
                    changed_at: new Date().toISOString(),
                    time_in_previous_status_minutes: timeInPreviousStatus,
                    changed_by: user?.email
                });

                // Notificações
                if (newStatus === 'ENTREGUE' || newStatus === 'CANCELADA') {
                    const requester = requesters.find(r => r.id === demand.requester_id);
                    if (requester?.email) {
                        try {
                            await fluxoApi.integrations.Core.SendEmail({
                                to: requester.email,
                                subject: `Demanda ${newStatus === 'ENTREGUE' ? 'entregue' : 'cancelada'}: ${demand.product}`,
                                body: `A demanda "${demand.product}" foi ${newStatus === 'ENTREGUE' ? 'entregue' : 'cancelada'}.\n\nAcesse o sistema para mais detalhes.`
                            });
                        } catch (e) {
                            console.log('Erro ao enviar notificação:', e);
                        }
                    }
                }

                // Notificar analista se mudou
                if (data.analyst_id && data.analyst_id !== demand.analyst_id) {
                    const analyst = analysts.find(a => a.id === data.analyst_id);
                    if (analyst?.email) {
                        try {
                            await fluxoApi.integrations.Core.SendEmail({
                                to: analyst.email,
                                subject: `Nova demanda designada: ${demand.product}`,
                                body: `Você foi designado como responsável pela demanda "${demand.product}".\n\nAcesse o sistema para mais detalhes.`
                            });
                        } catch (e) {
                            console.log('Erro ao enviar notificação:', e);
                        }
                    }
                }
            }

            return fluxoApi.entities.Demand.update(demandId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demand', demandId] });
            queryClient.invalidateQueries({ queryKey: ['history', demandId] });
            setShowEditForm(false);
            toast.success('Demanda atualizada!');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            // Deletar histórico primeiro
            for (const h of history) {
                await fluxoApi.entities.StatusHistory.delete(h.id);
            }
            return fluxoApi.entities.Demand.delete(demandId);
        },
        onSuccess: () => {
            toast.success('Demanda excluída!');
            window.location.href = createPageUrl('Demands');
        }
    });

    if (loadingDemand) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-48 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!demand) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-700">Demanda não encontrada</h2>
                    <Link to={createPageUrl('Demands')}>
                        <Button variant="link" className="mt-4">Voltar para lista</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const analyst = analysts.find(a => a.id === demand.analyst_id);
    const client = clients.find(c => c.id === demand.client_id);
    const cycle = cycles.find(c => c.id === demand.cycle_id);
    const requester = requesters.find(r => r.id === demand.requester_id);

    const endDate = demand.delivery_date || demand.expected_delivery_date || new Date().toISOString().split('T')[0];
    const effortDays = demand.qualification_date
        ? calculateWorkDays(demand.qualification_date, endDate, holidays) - Math.floor((demand.frozen_time_minutes || 0) / (60 * 24))
        : 0;
    const slaDays = demand.qualification_date
        ? calculateSLA(demand.qualification_date, endDate)
        : 0;

    const isOverdue = demand.expected_delivery_date &&
        ACTIVE_STATUSES.includes(demand.status) &&
        isAfter(new Date(), parseISO(demand.expected_delivery_date));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link to={createPageUrl('Demands')}>
                        <Button variant="ghost" className="text-slate-600">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        {user && user.role !== 'requester' && (
                            <Button
                                variant="outline"
                                onClick={() => setShowEditForm(true)}
                                className="text-slate-600"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        )}
                        {user?.role === 'admin' && (
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(true)}
                                className="text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                            <div className={isOverdue ? "bg-red-50 border-b border-red-100 p-6" : "bg-gradient-to-r from-indigo-50 to-violet-50 p-6"}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-mono text-slate-500">
                                                #{demand.demand_number || demand.id?.slice(-6)}
                                            </span>
                                            {isOverdue && (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    ATRASADA
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900">
                                            {demand.product}
                                        </h1>
                                    </div>
                                    <StatusBadge status={demand.status} />
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs text-slate-500 mb-1">Artefato</div>
                                        <div className="font-semibold text-slate-800">{demand.artifact}</div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs text-slate-500 mb-1">Prioridade</div>
                                        <PriorityBadge weight={demand.weight} complexity={demand.complexity} />
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs text-slate-500 mb-1">Esforço</div>
                                        <div className="font-semibold text-slate-800">{effortDays} dias úteis</div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs text-slate-500 mb-1">SLA</div>
                                        <div className="font-semibold text-slate-800">{slaDays} dias corridos</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {client && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600">Cliente:</span>
                                            <span className="font-medium">{client.name}</span>
                                        </div>
                                    )}
                                    {analyst && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600">Responsável:</span>
                                            <span className="font-medium">{analyst.name}</span>
                                        </div>
                                    )}
                                    {cycle && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Layers className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600">Ciclo:</span>
                                            <span className="font-medium">{cycle.name}</span>
                                        </div>
                                    )}
                                    {requester && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600">Solicitante:</span>
                                            <span className="font-medium">{requester.name}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {demand.qualification_date && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-600">Qualificação:</span>
                                            <span className="font-medium">
                                                {format(parseISO(demand.qualification_date), "dd/MM/yyyy", { locale: ptBR })}
                                            </span>
                                        </div>
                                    )}
                                    {demand.expected_delivery_date && (
                                        <div className={`flex items-center gap-3 text-sm ${isOverdue ? 'text-red-600' : ''}`}>
                                            <Clock className="w-4 h-4" />
                                            <span>Previsão:</span>
                                            <span className="font-medium">
                                                {format(parseISO(demand.expected_delivery_date), "dd/MM/yyyy", { locale: ptBR })}
                                            </span>
                                        </div>
                                    )}
                                    {demand.delivery_date && (
                                        <div className="flex items-center gap-3 text-sm text-emerald-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Entrega:</span>
                                            <span className="font-medium">
                                                {format(parseISO(demand.delivery_date), "dd/MM/yyyy", { locale: ptBR })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {demand.observation && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Observações</h3>
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{demand.observation}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                    Linha do Tempo
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <StatusTimeline history={history} currentStatus={demand.status} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Demanda</DialogTitle>
                    </DialogHeader>
                    <DemandForm
                        demand={demand}
                        onSave={(data) => updateMutation.mutate(data)}
                        onCancel={() => setShowEditForm(false)}
                        isLoading={updateMutation.isPending}
                        analysts={analysts}
                        clients={clients}
                        cycles={cycles}
                        requesters={requesters}
                        userRole={user?.role}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir demanda?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. A demanda e todo seu histórico serão permanentemente removidos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteMutation.mutate()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
