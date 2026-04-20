import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fluxClient } from '@/api/fluxoClient';

const fetchAllReasons = async () => {
    const res = await fluxClient.get('/reopening-reasons/all');
    return res.data;
};

const createReason = async (label) => {
    const res = await fluxClient.post('/reopening-reasons', { label });
    return res.data;
};

const toggleReason = async ({ id, active }) => {
    const res = await fluxClient.put(`/reopening-reasons/${id}`, { active: !active });
    return res.data;
};

export default function ReopeningReasonsManager() {
    const queryClient = useQueryClient();
    const [newLabel, setNewLabel] = useState('');

    const { data: reasons = [], isLoading } = useQuery({
        queryKey: ['reopening-reasons-all'],
        queryFn: fetchAllReasons
    });

    const createMutation = useMutation({
        mutationFn: createReason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reopening-reasons-all'] });
            queryClient.invalidateQueries({ queryKey: ['reopening-reasons'] });
            setNewLabel('');
            toast.success('Motivo criado com sucesso!');
        },
        onError: (err) => toast.error(err.message)
    });

    const toggleMutation = useMutation({
        mutationFn: toggleReason,
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['reopening-reasons-all'] });
            queryClient.invalidateQueries({ queryKey: ['reopening-reasons'] });
            toast.success(vars.active ? 'Motivo desativado' : 'Motivo reativado');
        },
        onError: (err) => toast.error(err.message)
    });

    const handleAdd = () => {
        if (!newLabel.trim()) return toast.error('Digite um nome para o motivo.');
        createMutation.mutate(newLabel.trim());
    };

    if (isLoading) return (
        <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
    );

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-500">
                Gerencie os motivos que aparecem ao reabrir uma demanda entregue.
                Motivos desativados não aparecem no select, mas são preservados no histórico.
            </p>

            {/* Adicionar novo motivo */}
            <div className="flex gap-2">
                <Input
                    placeholder="Nome do novo motivo..."
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className="flex-1"
                />
                <Button
                    onClick={handleAdd}
                    disabled={createMutation.isPending || !newLabel.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {createMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <><Plus className="w-4 h-4 mr-1" /> Adicionar</>
                    )}
                </Button>
            </div>

            {/* Lista de motivos */}
            <div className="space-y-2">
                {reasons.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">Nenhum motivo cadastrado ainda.</p>
                )}
                {reasons.map((reason) => (
                    <div
                        key={reason.id}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors ${reason.active
                                ? 'bg-white border-slate-200'
                                : 'bg-slate-50 border-slate-100 opacity-60'
                            }`}
                    >
                        <span className={`text-sm font-medium ${reason.active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                            {reason.label}
                        </span>
                        <button
                            onClick={() => toggleMutation.mutate({ id: reason.id, active: reason.active })}
                            disabled={toggleMutation.isPending}
                            className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
                            title={reason.active ? 'Desativar motivo' : 'Reativar motivo'}
                        >
                            {reason.active ? (
                                <ToggleRight className="w-5 h-5 text-indigo-500" />
                            ) : (
                                <ToggleLeft className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
