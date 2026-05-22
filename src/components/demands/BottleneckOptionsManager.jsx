import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fluxClient } from '@/api/fluxoClient';

const fetchAllOptions = async () => {
    const res = await fluxClient.get('/bottleneck-options/all');
    return res.data;
};

const createOption = async (label) => {
    const res = await fluxClient.post('/bottleneck-options', { label });
    return res.data;
};

const toggleOption = async ({ id, active }) => {
    const res = await fluxClient.put(`/bottleneck-options/${id}`, { active: !active });
    return res.data;
};

export default function BottleneckOptionsManager() {
    const queryClient = useQueryClient();
    const [newLabel, setNewLabel] = useState('');

    const { data: options = [], isLoading } = useQuery({
        queryKey: ['bottleneck-options-all'],
        queryFn: fetchAllOptions
    });

    const createMutation = useMutation({
        mutationFn: createOption,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bottleneck-options-all'] });
            queryClient.invalidateQueries({ queryKey: ['bottleneck-options'] });
            setNewLabel('');
            toast.success('Gargalo criado com sucesso!');
        },
        onError: (err) => toast.error(err.message)
    });

    const toggleMutation = useMutation({
        mutationFn: toggleOption,
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ['bottleneck-options-all'] });
            queryClient.invalidateQueries({ queryKey: ['bottleneck-options'] });
            toast.success(vars.active ? 'Gargalo desativado' : 'Gargalo reativado');
        },
        onError: (err) => toast.error(err.message)
    });

    const handleAdd = () => {
        if (!newLabel.trim()) return toast.error('Digite um nome para o gargalo.');
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
                Gerencie as opções de gargalo que aparecem no formulário de demandas.
                Opções desativadas não aparecem no select, mas são preservadas nas demandas existentes.
            </p>

            {/* Adicionar nova opção */}
            <div className="flex gap-2">
                <Input
                    placeholder="Nome do novo gargalo..."
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

            {/* Lista de opções */}
            <div className="space-y-2">
                {options.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">Nenhum gargalo cadastrado ainda.</p>
                )}
                {options.map((option) => (
                    <div
                        key={option.id}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors ${option.active
                                ? 'bg-white border-slate-200'
                                : 'bg-slate-50 border-slate-100 opacity-60'
                            }`}
                    >
                        <span className={`text-sm font-medium ${option.active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                            {option.label}
                        </span>
                        <button
                            onClick={() => toggleMutation.mutate({ id: option.id, active: option.active })}
                            disabled={toggleMutation.isPending}
                            className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
                            title={option.active ? 'Desativar gargalo' : 'Reativar gargalo'}
                        >
                            {option.active ? (
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
