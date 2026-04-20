import React, { useState, useEffect } from 'react';
import { fluxoApi } from '@/api/fluxoClient';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, DollarSign, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import PendencyCard from "./components/PendencyCard";
import PendencyTable from "./components/PendencyTable";
import PendencyCharts from "./components/PendencyCharts";
import DashboardFilters from "./components/DashboardFilters";
import AttestationDetailsDialog from "./components/AttestationDetailsDialog";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    const [filters, setFilters] = useState({
        client: 'all',
        pd: 'all',
        esp: 'all',
        year: currentYear,
        month: 'all',
        analyst: 'all'
    });

    const [selectedAttestation, setSelectedAttestation] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const userRole = (user?.role || '').toLowerCase();
    const userProfile = (user?.profile_type || user?.perfil || '').toLowerCase();

    // Define explicit Manager/Admin roles
    const isManager =
        userRole === 'admin' ||
        userRole === 'gestor' ||
        userRole === 'manager' ||
        userRole === 'executive' ||
        userRole === 'general_manager' ||
        userProfile === 'admin' ||
        userProfile === 'gestor' ||
        userProfile === 'executive';

    // If NOT a manager, treat as restricted Analyst view by default
    const isAnalyst = !isManager;
    const analystName = user?.full_name || user?.name;

    console.log('Dashboard CVAC Filter:', { isManager, isAnalyst, analystName });

    const { data: attestations = [], isLoading, isError, error } = useQuery({
        queryKey: ['all-attestations', isAnalyst ? analystName : 'all'],
        queryFn: () => {
            // Merge sort and filter params
            const params = {
                sort: '-reference_month',
                ...(isAnalyst ? { responsible_analyst_like: analystName } : {})
            };
            return fluxoApi.entities.MonthlyAttestation.list(params);
        }
    });

    // Extrair opções de filtros (com proteção contra null/undefined)
    const { clients, pds, esps, analysts, months } = React.useMemo(() => {
        const safeData = attestations || [];
        return {
            clients: [...new Set(safeData.map(a => a?.client_name).filter(Boolean))],
            pds: [...new Set(safeData.map(a => a?.pd_number).filter(Boolean))],
            esps: [...new Set(safeData.map(a => a?.esp_number).filter(Boolean))],
            analysts: [...new Set(safeData.map(a => a?.responsible_analyst).filter(Boolean))],
            months: [...new Set(safeData.map(a => a?.reference_month).filter(Boolean))]
                .sort()
                .reverse()
                .map(m => {
                    const [year, month] = m.split('-');
                    return {
                        value: m,
                        label: new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                    };
                })
        };
    }, [attestations]);

    // Aplicar filtros
    const filteredAttestations = React.useMemo(() => {
        return attestations.filter(att => {
            if (filters.client !== 'all' && att.client_name !== filters.client) return false;
            if (filters.pd !== 'all' && att.pd_number !== filters.pd) return false;
            if (filters.esp !== 'all' && att.esp_number !== filters.esp) return false;
            if (filters.analyst !== 'all' && att.responsible_analyst !== filters.analyst) return false;

            if (att.reference_month) {
                const [attYear, attMonth] = att.reference_month.split('-');
                if (filters.year !== 'all' && attYear !== filters.year) return false;
                if (filters.month !== 'all' && attMonth !== filters.month) return false;
            } else {
                // Se não tem mês de referência e estamos filtrando por algo específico de data, esconde
                if (filters.year !== 'all' || filters.month !== 'all') return false;
            }

            return true;
        });
    }, [attestations, filters]);

    // Calcular métricas financeiras reais via useMemo para poupar cálculos repetitivos
    const metrics = React.useMemo(() => {
        return {
            totalBilled: filteredAttestations.reduce((sum, att) => sum + (parseFloat(att.billed_amount) || 0), 0),
            totalPaid: filteredAttestations.reduce((sum, att) => sum + (parseFloat(att.paid_amount) || 0), 0),
            totalMeasurement: filteredAttestations.reduce((sum, att) => sum + (parseFloat(att.measurement_value) || 0), 0),
            totalExpected: filteredAttestations.reduce((sum, att) => sum + (parseFloat(att.expected_amount) || 0), 0),
            invoiceCount: filteredAttestations.filter(att => att.invoice_number && att.invoice_number.trim() !== '').length,
            pendencyCount: filteredAttestations.filter(att =>
                (parseFloat(att.measurement_value) || 0) > (parseFloat(att.billed_amount) || 0)
            ).length,
            attestationsWithPendency: filteredAttestations.filter(att =>
                (parseFloat(att.measurement_value) || 0) > (parseFloat(att.billed_amount) || 0)
            )
        };
    }, [filteredAttestations]);

    const { totalBilled, totalPaid, totalMeasurement, totalExpected, invoiceCount, pendencyCount, attestationsWithPendency } = metrics;
    const pendencyValue = totalMeasurement - totalBilled;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard de Atestações</h1>
                    <p className="text-slate-600 mt-1">Acompanhe medição apontada, faturada e análise de GAP</p>
                </div>

                {/* Cards - Ordem do fluxo financeiro: Esperado → Apontado → Faturado → Recebido → Pendência */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <PendencyCard
                        title="Total Esperado"
                        value={totalExpected}
                        subtitle="Projeção de recebimento"
                        type="default"
                        icon={DollarSign}
                    />
                    <PendencyCard
                        title="Total Apontado"
                        value={totalMeasurement}
                        subtitle={`${filteredAttestations.length} registros no período`}
                        type="warning"
                        icon={Users}
                    />
                    <PendencyCard
                        title="Total Faturado"
                        value={totalBilled}
                        subtitle={`${invoiceCount} NF${invoiceCount !== 1 ? 's' : ''} emitida${invoiceCount !== 1 ? 's' : ''}`}
                        type="default"
                        icon={DollarSign}
                    />
                    <PendencyCard
                        title="Total Recebido"
                        value={totalPaid}
                        subtitle="Valores liquidados"
                        type="success"
                        icon={CheckCircle2}
                    />
                    <PendencyCard
                        title="Pendência" 
                        value={pendencyValue}
                        subtitle={pendencyValue > 0 ? `${pendencyCount} registro${pendencyCount !== 1 ? 's' : ''} em aberto` : 'Sem pendências'}
                        type={pendencyValue > 0 ? 'danger' : 'success'}
                        icon={AlertTriangle}
                    />
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <DashboardFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        clients={clients}
                        pds={pds}
                        esps={esps}
                        months={months}
                        analysts={analysts}
                    />
                </div>

                {/* Charts */}
                <div className="mb-8">
                    <PendencyCharts attestations={filteredAttestations} />
                </div>

                {/* Table */}
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">
                        Detalhamento de Pendências
                    </h2>
                    {isError && (
                        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
                            Erro ao carregar dados: {error?.message || 'Erro desconhecido'}
                        </div>
                    )}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <PendencyTable
                            attestations={attestationsWithPendency}
                            onViewDetails={(att) => {
                                setSelectedAttestation(att);
                                setDetailsDialogOpen(true);
                            }}
                        />
                    )}
                </div>
            </div>

            <AttestationDetailsDialog
                attestation={selectedAttestation}
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
            />
        </div>
    );
}
