import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DemandFilters from '@/components/demands/DemandFilters';
import DemandCard from '@/components/demands/DemandCard';
import DemandForm from '@/components/demands/DemandForm';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function DemandsPage() {
    const queryClient = useQueryClient();
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        analyst_id: 'all',
        client_id: 'all',
        cycle_id: 'all',
        complexity: 'all'
    });

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => { });
    }, []);

    const { data: demands = [], isLoading: loadingDemands } = useQuery({
        queryKey: ['demands'],
        queryFn: () => base44.entities.Demand.list('-created_date')
    });

    const { data: analysts = [] } = useQuery({
        queryKey: ['analysts'],
        queryFn: () => base44.entities.Analyst.list()
    });

    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: () => base44.entities.Client.list()
    });

    const { data: cycles = [] } = useQuery({
        queryKey: ['cycles'],
        queryFn: () => base44.entities.Cycle.list()
    });

    const { data: requesters = [] } = useQuery({
        queryKey: ['requesters'],
        queryFn: () => base44.entities.Requester.list()
    });

    const createMutation = useMutation({
        mutationFn: async (data) => {
            const demand = await base44.entities.Demand.create(data);
            await base44.entities.StatusHistory.create({
                demand_id: demand.id,
                from_status: null,
                to_status: data.status || 'PENDENTE TRIAGEM',
                changed_at: new Date().toISOString(),
                time_in_previous_status_minutes: 0,
                changed_by: user?.email
            });

            // Notificar analista se designado
            if (data.analyst_id) {
                const analyst = analysts.find(a => a.id === data.analyst_id);
                if (analyst?.email) {
                    try {
                        await base44.integrations.Core.SendEmail({
                            to: analyst.email,
                            subject: `Nova demanda designada: ${data.product}`,
                            body: `Você foi designado como responsável pela demanda "${data.product}".\n\nAcesse o sistema para mais detalhes.`
                        });
                    } catch (e) {
                        console.log('Erro ao enviar notificação:', e);
                    }
                }
            }

            return demand;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demands'] });
            setShowForm(false);
            toast.success('Demanda criada com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao criar demanda');
        }
    });

    const filteredDemands = demands.filter(d => {
        if (filters.search) {
            const search = filters.search.toLowerCase();
            if (!d.product?.toLowerCase().includes(search) &&
                !d.demand_number?.toLowerCase().includes(search)) {
                return false;
            }
        }
        if (filters.status !== 'all' && d.status !== filters.status) return false;
        if (filters.analyst_id !== 'all' && d.analyst_id !== filters.analyst_id) return false;
        if (filters.client_id !== 'all' && d.client_id !== filters.client_id) return false;
        if (filters.cycle_id !== 'all' && d.cycle_id !== filters.cycle_id) return false;
        if (filters.complexity !== 'all' && d.complexity !== filters.complexity) return false;
        return true;
    });

    const analystsMap = Object.fromEntries(analysts.map(a => [a.id, a]));
    const clientsMap = Object.fromEntries(clients.map(c => [c.id, c]));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Demandas
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {filteredDemands.length} demanda(s) encontrada(s)
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="h-8 w-8 p-0"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="h-8 w-8 p-0"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Demanda
                        </Button>
                    </div>
                </div>

                <DemandFilters
                    filters={filters}
                    setFilters={setFilters}
                    analysts={analysts}
                    clients={clients}
                    cycles={cycles}
                />

                <div className="mt-6">
                    {loadingDemands ? (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "space-y-3"
                        }>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <Skeleton key={i} className="h-40 rounded-xl" />
                            ))}
                        </div>
                    ) : filteredDemands.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <List className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-600 mb-1">
                                Nenhuma demanda encontrada
                            </h3>
                            <p className="text-sm text-slate-400">
                                Ajuste os filtros ou crie uma nova demanda
                            </p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "space-y-3"
                        }>
                            {filteredDemands.map(demand => (
                                <DemandCard
                                    key={demand.id}
                                    demand={demand}
                                    analyst={analystsMap[demand.analyst_id]}
                                    client={clientsMap[demand.client_id]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nova Demanda</DialogTitle>
                    </DialogHeader>
                    <DemandForm
                        onSave={(data) => createMutation.mutate(data)}
                        onCancel={() => setShowForm(false)}
                        isLoading={createMutation.isPending}
                        analysts={analysts}
                        clients={clients}
                        cycles={cycles}
                        requesters={requesters}
                        userRole={user?.role}
                        isNew={true}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
