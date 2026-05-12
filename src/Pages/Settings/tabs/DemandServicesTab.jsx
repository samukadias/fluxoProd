import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Plus, Loader2 } from "lucide-react";
import { fluxoApi } from '@/api/fluxoClient';

export default function DemandServicesTab() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({ service_name: '', delivery_name: '', active: true });

    const { data: services = [], isLoading } = useQuery({
        queryKey: ['demand_services'],
        queryFn: () => fluxoApi.entities.DemandService.list()
    });

    const createMutation = useMutation({
        mutationFn: (data) => fluxoApi.entities.DemandService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demand_services'] });
            setIsDialogOpen(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => fluxoApi.entities.DemandService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demand_services'] });
            setIsDialogOpen(false);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingService) {
            updateMutation.mutate({ id: editingService.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const openDialog = (service = null) => {
        setEditingService(service);
        setFormData(service ? { service_name: service.service_name, delivery_name: service.delivery_name, active: service.active } : { service_name: '', delivery_name: '', active: true });
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm">Gerencie os tipos de serviços e seus responsáveis (Delivery) disponíveis no preenchimento de demandas.</p>
                <Button onClick={() => openDialog()} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Serviço
                </Button>
            </div>

            <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold">Nome do Serviço</TableHead>
                            <TableHead className="font-semibold">Delivery do Serviço</TableHead>
                            <TableHead className="font-semibold w-[100px]">Status</TableHead>
                            <TableHead className="text-right font-semibold w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.service_name}</TableCell>
                                <TableCell>{service.delivery_name}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {service.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openDialog(service)}>
                                        <Edit2 className="w-4 h-4 text-slate-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {services.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                    Nenhum serviço cadastrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Serviço</Label>
                            <Input
                                id="name"
                                value={formData.service_name}
                                onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                                placeholder="Ex: NUVEM"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delivery">Delivery do Serviço</Label>
                            <Input
                                id="delivery"
                                value={formData.delivery_name}
                                onChange={(e) => setFormData({ ...formData, delivery_name: e.target.value })}
                                placeholder="Ex: BENATO"
                                required
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                            />
                            <Label htmlFor="active">Ativo</Label>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={createMutation.isPending || updateMutation.isPending}>
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
