import { useState } from 'react';
import { fluxoApi, fluxClient } from '@/api/fluxoClient';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Edit2, Clock, Calendar, User, Building2, Layers, AlertTriangle, Trash2, Timer, RotateCcw, PackageCheck, RefreshCw, CheckCircle2, MessageSquare, Send } from "lucide-react";
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import StatusTimeline from './StatusTimeline';
import DemandProcessChart from './DemandProcessChart';
import { StageStepper } from './StageStepper';
import DemandForm from './DemandForm';
import ReopenDemandModal from './ReopenDemandModal';
import { calculateWorkDays, calculateSLA } from './EffortCalculator';
import { format, parseISO, isAfter, differenceInCalendarDays } from 'date-fns';
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
    "PENDÊNCIA SUPRIMENTOS",
    "PENDÊNCIA FORNECEDOR",
    "REABERTA",
    "ASSINADA"
];

const STATUS_LIST = [
    "PENDENTE TRIAGEM",
    "TRIAGEM NÃO ELEGÍVEL",
    "DESIGNADA",
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "CORREÇÃO",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA SUPRIMENTOS",
    "PENDÊNCIA FORNECEDOR",
    "CONGELADA",
    "ENTREGUE",
    "CANCELADA"
];

const PRIORITIES = [
    { value: 0, label: '0 - Estratégico' },
    { value: 1, label: '1 - Muito Alto' },
    { value: 2, label: '2 - Alto' },
    { value: 3, label: '3 - Padrão' },
    { value: 4, label: '4 - Baixo' }
];

const MANAGER_ROLES = ['manager', 'admin', 'gestor'];

export default function DemandDetailContent({ demandId, onBack, isModal = false }) {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showReopenModal, setShowReopenModal] = useState(false);
    const [showRedeliverDialog, setShowRedeliverDialog] = useState(false);
    const [showAssinadaDialog, setShowAssinadaDialog] = useState(false);
    const [showProcessMap, setShowProcessMap] = useState(false);

    const hasEditPermission = user && !['requester', 'viewer'].includes(user.role);

    const { data: demand, isLoading: loadingDemand } = useQuery({
        queryKey: ['demand', demandId],
        queryFn: () => fluxoApi.entities.Demand.get(demandId),
        enabled: !!demandId,
        staleTime: 2 * 60 * 1000,
    });

    const { data: history = [] } = useQuery({
        queryKey: ['history', demandId],
        queryFn: () => fluxoApi.entities.StatusHistory.list({ demand_id: demandId, sort: 'changed_at' }),
        enabled: !!demandId,
        staleTime: 2 * 60 * 1000,
    });

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: () => fluxoApi.entities.Holiday.list(),
        staleTime: 15 * 60 * 1000,
    });

    const { data: stageHistory = [] } = useQuery({
        queryKey: ['stage-history', demandId],
        queryFn: () => fluxoApi.entities.StageHistory.list({ demand_id: demandId }),
        enabled: !!demandId,
        staleTime: 2 * 60 * 1000,
    });

    const { data: reopenings = [] } = useQuery({
        queryKey: ['reopenings', demandId],
        queryFn: () => fluxoApi.demands.reopenings(demandId).catch(() => []),
        enabled: !!demandId,
        staleTime: 2 * 60 * 1000,
    });

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: () => fluxoApi.entities.User.list(),
        staleTime: 15 * 60 * 1000,
    });

    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: () => fluxoApi.entities.Client.list(),
        staleTime: 15 * 60 * 1000,
    });

    const { data: cycles = [] } = useQuery({
        queryKey: ['cycles'],
        queryFn: () => fluxoApi.entities.Cycle.list(),
        staleTime: 15 * 60 * 1000,
    });

    const { data: bottleneckOptions = [] } = useQuery({
        queryKey: ['bottleneck-options'],
        queryFn: async () => { const res = await fluxClient.get('/bottleneck-options/all'); return res.data; },
        staleTime: 15 * 60 * 1000,
    });

    const analysts = users.filter(u =>
        (['analyst', 'manager', 'admin'].includes(u.role) &&
            (!u.department || u.department === 'CDPC')) ||
        (demand && String(u.id) === String(demand.analyst_id))
    );

    const requesters = users.filter(u =>
        (['requester', 'analyst', 'manager', 'admin'].includes(u.role) &&
            (!u.department || u.department === 'CDPC')) ||
        (demand && String(u.id) === String(demand.requester_id))
    );

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            if (data.status) {
                const newStatus = data.status;
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
                            console.error('Erro ao enviar notificação:', e);
                        }
                    }
                }
            }

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

            return fluxoApi.entities.Demand.update(demandId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demand', demandId] });
            queryClient.invalidateQueries({ queryKey: ['history', demandId] });
            setShowEditForm(false);
            toast.success('Demanda atualizada!');
        },
        onError: (error) => {
            console.error('Erro ao atualizar demanda:', error);
            toast.error(error.message || 'Erro ao atualizar a demanda.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            for (const h of history) {
                await fluxoApi.entities.StatusHistory.delete(h.id);
            }
            return fluxoApi.entities.Demand.delete(demandId);
        },
        onSuccess: () => {
            toast.success('Demanda excluída!');
            if (isModal) {
                 queryClient.invalidateQueries({ queryKey: ['demands'] });
                 if (onBack) onBack();
            } else {
                window.location.href = '/demands';
            }
        }
    });

    const redeliverMutation = useMutation({
        mutationFn: () => fluxoApi.demands.redeliver(demandId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demand', demandId] });
            queryClient.invalidateQueries({ queryKey: ['history', demandId] });
            queryClient.invalidateQueries({ queryKey: ['reopenings', demandId] });
            queryClient.invalidateQueries({ queryKey: ['demands'] });
            setShowRedeliverDialog(false);
            toast.success('Demanda re-entregue com sucesso!');
        },
        onError: (err) => toast.error(err.message)
    });

    const markAssinadaMutation = useMutation({
        mutationFn: () => updateMutation.mutateAsync({ status: 'ASSINADA' }),
        onSuccess: () => {
            setShowAssinadaDialog(false);
            toast.success('Demanda marcada como ASSINADA!');
        }
    });

    const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);

    const clearHistoryMutation = useMutation({
        mutationFn: () => fluxoApi.demands.clearHistory(demandId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['history', demandId] });
            setShowClearHistoryDialog(false);
            toast.success('Histórico limpo com sucesso!');
        },
        onError: () => toast.error('Erro ao limpar histórico')
    });

    // Annotations Section
    const [newAnnotation, setNewAnnotation] = useState('');

    const { data: annotations = [], isLoading: loadingAnnotations } = useQuery({
        queryKey: ['annotations', demandId],
        queryFn: () => fluxoApi.demands.getAnnotations(demandId),
        enabled: !!demandId,
    });

    const addAnnotationMutation = useMutation({
        mutationFn: (text) => fluxoApi.demands.addAnnotation(demandId, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['annotations', demandId] });
            setNewAnnotation('');
            toast.success('Anotação adicionada!');
        },
        onError: (err) => toast.error(err.message || 'Erro ao adicionar anotação')
    });

    const deleteAnnotationMutation = useMutation({
        mutationFn: (id) => fluxoApi.demands.deleteAnnotation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['annotations', demandId] });
            toast.success('Anotação excluída!');
        },
        onError: (err) => toast.error(err.message || 'Erro ao excluir anotação')
    });

    if (loadingDemand) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
        );
    }

    if (!demand) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-slate-700">Demanda não encontrada</h2>
                {onBack && <Button variant="link" onClick={onBack} className="mt-4">Voltar</Button>}
            </div>
        );
    }

    const analyst = analysts.find(a => a.id === demand.analyst_id);
    const client = clients.find(c => c.id === demand.client_id);
    const cycle = cycles.find(c => c.id === demand.cycle_id);

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

    const FINAL_STATUSES = ['ENTREGUE', 'CANCELADA', 'ASSINADA'];
    const sortedHistory = [...history].sort((a, b) => new Date(a.changed_at) - new Date(b.changed_at));
    let totalDemandDays = 0;
    if (demand.created_date) {
        const startDate = new Date(demand.created_date);
        if (FINAL_STATUSES.includes(demand.status) && sortedHistory.length > 0) {
            const lastChanged = new Date(sortedHistory[sortedHistory.length - 1].changed_at);
            totalDemandDays = Math.max(0, differenceInCalendarDays(lastChanged, startDate));
        } else {
            totalDemandDays = Math.max(0, differenceInCalendarDays(new Date(), startDate));
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {user?.role === 'admin' && (
                        <Button
                            variant="outline"
                            onClick={() => setShowProcessMap(true)}
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        >
                            <Layers className="w-4 h-4 mr-2" />
                            Mapa
                        </Button>
                    )}
                    {user?.role === 'admin' && demand?.status === 'ENTREGUE' && (
                        <Button
                            variant="default"
                            onClick={() => setShowAssinadaDialog(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Assinada
                        </Button>
                    )}
                    {user && MANAGER_ROLES.includes(user.role) && demand?.status === 'ENTREGUE' && (
                        <Button
                            variant="outline"
                            onClick={() => setShowReopenModal(true)}
                            className="text-amber-700 border-amber-300 hover:bg-amber-50"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reabrir
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {user && !['requester', 'viewer'].includes(user.role) && (
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Fluxo de Etapas (CDPC)</h3>
                <StageStepper
                    currentStage={demand.stage || 'Triagem'}
                    stageHistory={stageHistory}
                    onStageClick={(newStage) => {
                        if (!['requester', 'viewer'].includes(user?.role)) {
                            updateMutation.mutate({ stage: newStage });
                        }
                    }}
                    readOnly={['requester', 'viewer'].includes(user?.role)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <div className={isOverdue ? "bg-red-50 border-b border-red-100 p-6" : "bg-gradient-to-r from-indigo-50 to-violet-50 p-6"}>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-mono font-bold text-slate-600">
                                            #{demand.demand_number || demand.id?.slice(-6)}
                                        </span>
                                        {isOverdue && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                                <AlertTriangle className="w-3 h-3" />
                                                ATRASADA
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl font-bold text-slate-900 line-clamp-2">
                                        {demand.product}
                                    </h1>
                                </div>
                                {hasEditPermission ? (
                                    <div className="relative group">
                                        <Select
                                            value={demand.status}
                                            onValueChange={(v) => {
                                                const updates = { status: v };
                                                if (v === 'ENTREGUE' && !demand.delivery_date) {
                                                    updates.delivery_date = format(new Date(), 'yyyy-MM-dd');
                                                }
                                                updateMutation.mutate(updates);
                                            }}
                                            disabled={updateMutation.isPending}
                                        >
                                            <SelectTrigger className="h-auto w-auto p-0 border-0 shadow-none bg-transparent focus:ring-0 [&>svg]:hidden data-[state=open]:opacity-80 hover:opacity-80 transition-opacity shrink-0">
                                                <StatusBadge status={demand.status} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_LIST.map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                            Alterar
                                        </div>
                                    </div>
                                ) : (
                                    <StatusBadge status={demand.status} />
                                )}
                            </div>
                        </div>

                        <CardContent className="p-6 space-y-3">
                            <div className="grid gap-3" style={{ gridTemplateColumns: '0.8fr 1fr 1.2fr' }}>
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Artefato</span>
                                    <span className="font-semibold text-slate-800 text-sm truncate">{demand.artifact}</span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 relative group">
                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Prioridade</span>
                                    {hasEditPermission ? (
                                        <Select
                                            value={String(demand.weight ?? 4)}
                                            onValueChange={(v) => updateMutation.mutate({ weight: Number(v) })}
                                            disabled={updateMutation.isPending}
                                        >
                                            <SelectTrigger className="h-auto w-auto p-0 border-0 shadow-none bg-transparent focus:ring-0 [&>svg]:hidden data-[state=open]:opacity-80 hover:opacity-80 transition-opacity shrink-0 justify-start">
                                                <PriorityBadge weight={demand.weight} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRIORITIES.map(p => (
                                                    <SelectItem key={p.value} value={String(p.value)}>
                                                        {p.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <PriorityBadge weight={demand.weight} />
                                    )}
                                </div>
                                <div className={`rounded-xl p-3 flex flex-col gap-1 ${demand.value != null ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}`}>
                                    <span className={`text-[11px] font-medium uppercase tracking-wider ${demand.value != null ? 'text-emerald-600' : 'text-slate-400'}`}>Valor</span>
                                    <span className={`font-bold ${demand.value != null ? 'text-emerald-700 text-base' : 'text-slate-400 text-sm'}`}>
                                        {demand.value != null
                                            ? Number(demand.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                            : 'Não informado'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Esforço</span>
                                    <span className="font-semibold text-slate-800 text-sm">{effortDays} dias úteis</span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">SLA</span>
                                    <span className="font-semibold text-slate-800 text-sm">{slaDays} dias corridos</span>
                                </div>
                            </div>

                            {client && (
                                <div className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                                    <Building2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Cliente</p>
                                        <p className="font-semibold text-slate-800 text-sm leading-snug truncate">{client.name}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                {analyst && (
                                    <div className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                                        <User className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Responsável</p>
                                            <p className="font-semibold text-slate-800 text-sm leading-snug truncate">{analyst.name}</p>
                                        </div>
                                    </div>
                                )}
                                {cycle && (
                                    <div className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                                        <Layers className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Ciclo</p>
                                            <p className="font-semibold text-slate-800 text-sm leading-snug truncate">{cycle.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Removido o campo fixo de observação - agora via Mural de Anotações abaixo */}

                            {demand.bottleneck_id && (() => {
                                const opt = bottleneckOptions.find(o => o.id === demand.bottleneck_id);
                                return opt ? (
                                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium text-amber-600 uppercase tracking-wider mb-0.5">Gargalo</p>
                                            <p className="font-semibold text-amber-800 text-sm leading-snug">{opt.label}</p>
                                        </div>
                                    </div>
                                ) : null;
                            })()}
                        </CardContent>
                    </Card>

                    {/* Novo Mural de Anotações */}
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden mt-6">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                                Anotações e Comentários
                            </CardTitle>
                            <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">
                                {annotations.length} registros
                            </span>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Input para nova anotação */}
                            {user?.role !== 'viewer' && (
                                <div className="space-y-3">
                                    <textarea
                                        value={newAnnotation}
                                        onChange={(e) => setNewAnnotation(e.target.value)}
                                        placeholder="Adicione um comentário ou anotação importante..."
                                        rows={3}
                                        className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm placeholder:text-slate-400"
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => {
                                                if (!newAnnotation.trim()) return;
                                                addAnnotationMutation.mutate(newAnnotation);
                                            }}
                                            disabled={!newAnnotation.trim() || addAnnotationMutation.isPending}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 shadow-md hover:shadow-indigo-200 transition-all font-semibold"
                                        >
                                            {addAnnotationMutation.isPending ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            ) : (
                                                <Send className="w-4 h-4 mr-2" />
                                            )}
                                            Adicionar Anotação
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Lista de anotações */}
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {loadingAnnotations ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-20 w-full rounded-xl" />
                                        <Skeleton className="h-20 w-full rounded-xl" />
                                    </div>
                                ) : annotations.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                                        <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                        <p className="text-sm text-slate-400">Nenhuma anotação registrada ainda.</p>
                                    </div>
                                ) : (
                                    annotations.map((ann) => (
                                        <div key={ann.id} className="relative group bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 transition-all shadow-sm">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{ann.user_name}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            {format(parseISO(ann.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {(user?.role === 'admin' || user?.profile_type === 'admin') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => deleteAnnotationMutation.mutate(ann.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-600 leading-relaxed pl-9">
                                                {ann.text}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-0 shadow-lg rounded-2xl">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                Histórico
                                {totalDemandDays > 0 && (
                                    <span className="inline-flex items-center gap-1 ml-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500 text-white shadow-sm">
                                        {totalDemandDays}d
                                    </span>
                                )}
                            </CardTitle>
                            {user?.role === 'admin' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-400 hover:text-red-600"
                                    onClick={() => setShowClearHistoryDialog(true)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <StatusTimeline history={history} currentStatus={demand.status} demandCreatedAt={demand.created_date} />
                        </CardContent>
                    </Card>

                    {reopenings.length > 0 && (
                        <Card className="border-0 shadow-lg rounded-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                                    <RefreshCw className="w-5 h-5" />
                                    Reaberturas
                                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100">
                                        {reopenings.length}x
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {reopenings.map((r, idx) => (
                                    <div key={r.id} className="border border-slate-100 rounded-xl p-3 space-y-2 bg-amber-50/40">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-amber-700 uppercase">Reabertura #{idx + 1}</span>
                                            {!r.redelivered_at && <span className="text-[9px] font-black text-amber-600 animate-pulse uppercase">Em aberto</span>}
                                        </div>
                                        <p className="text-xs font-medium text-slate-800">{r.reason_label}</p>
                                        <p className="text-[11px] text-slate-500">{format(new Date(r.reopened_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modals & Dialogs */}
            <AlertDialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Limpar Histórico?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => clearHistoryMutation.mutate()} className="bg-red-600">Limpar Tudo</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                        userDepartment={user?.department}
                    />
                </DialogContent>
            </Dialog>

            <ReopenDemandModal
                open={showReopenModal}
                onOpenChange={setShowReopenModal}
                demandId={demandId}
                demandName={demand?.product}
            />

            <AlertDialog open={showRedeliverDialog} onOpenChange={setShowRedeliverDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Re-entregar demanda?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => redeliverMutation.mutate()} className="bg-emerald-600">Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showAssinadaDialog} onOpenChange={setShowAssinadaDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Marcar como Assinada?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => markAssinadaMutation.mutate()} className="bg-indigo-600">Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir demanda?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-red-600">Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={showProcessMap} onOpenChange={setShowProcessMap}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 md:p-6">
                    <DialogHeader className="sr-only"><DialogTitle>Mapa do Processo</DialogTitle></DialogHeader>
                    <DemandProcessChart history={history} demandCreatedAt={demand.created_date} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
