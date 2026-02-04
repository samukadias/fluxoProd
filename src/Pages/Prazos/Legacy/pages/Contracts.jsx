import React, { useState } from "react";
import { useContracts } from "@/hooks/useContracts";
import ContractTable from "../components/contracts/ContractTable";
import ContractFilters from "../components/contracts/ContractFilters";
import ImportExportDialog from "../components/contracts/ImportExportDialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils/legacy";
import { useQueryClient } from "@tanstack/react-query";
import { contractKeys } from "@/hooks/useContracts";

import { useAuth } from "@/context/AuthContext";

export default function Contracts() {
  const { data: contracts = [], isLoading } = useContracts();
  // Obter usuário do localStorage para consistência com o resto do app
  const user = JSON.parse(localStorage.getItem('fluxo_user') || localStorage.getItem('user') || '{}');
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: "",
    status: searchParams.get("status") || "all",
    analista: "all",
    vencimento: "all"
  });
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Filter logic
  const filteredContracts = contracts.filter((contract) => {
    // 1. Filtro de permissão: Quem pode ver o quê?
    const role = user?.role;
    const department = user?.department;
    const userName = (user?.full_name || user?.name || "").trim().toLowerCase();
    const userEmail = (user?.email || "").trim().toLowerCase();

    // Gestores (GOR ou COCR) veem TUDO
    const isManager = department === 'GOR' || (department === 'COCR' && role === 'manager') || user?.perfil === 'GESTOR';

    // Analista (COCR) vê apenas os SEUS contratos
    const isAnalyst = !isManager && (role === 'analyst' || user?.perfil === 'ANALISTA');

    // Cliente vê apenas os SEUS contratos (baseado no nome do Cliente)
    const isClient = !isManager && (role === 'client' || user?.perfil === 'CLIENTE');

    if (isAnalyst) {
      const cAnalyst = (contract.analista_responsavel || "").trim().toLowerCase();
      // Verifica se o analista responsável bate com o nome ou email do usuário logado
      if (cAnalyst !== userName && cAnalyst !== userEmail) {
        return false;
      }
    }

    if (isClient) {
      const cClient = (contract.cliente || "").trim().toLowerCase();
      // Verifica se o cliente do contrato bate com o nome do usuário logado
      if (cClient !== userName) {
        return false;
      }
    }

    // Se não for nem manager, nem analyst, nem client validado acima, bloqueia (failsafe)
    // Mas permitiremos 'admin' ver tudo também
    if (!isManager && !isAnalyst && !isClient && role !== 'admin') {
      // Se não cair em nenhuma regra permissiva, pode ser um user de outro depto tentando ver contracts
      return false;
    }

    const matchesSearch = filters.search === "" || (() => {
      const searchLower = filters.search.toLowerCase();
      return (
        contract.contrato?.toLowerCase().includes(searchLower) ||
        contract.cliente?.toLowerCase().includes(searchLower) ||
        contract.analista_responsavel?.toLowerCase().includes(searchLower) ||
        contract.secao_responsavel?.toLowerCase().includes(searchLower) ||
        contract.objeto?.toLowerCase().includes(searchLower)
      );
    })();

    const matchesStatus = filters.status === "all" || contract.status === filters.status;
    const matchesAnalista = filters.analista === "all" || contract.analista_responsavel === filters.analista;
    const matchesVencimento = filters.vencimento === "all" || contract.status_vencimento === filters.vencimento;

    return matchesSearch && matchesStatus && matchesAnalista && matchesVencimento;
  });

  const handleImportComplete = () => {
    queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    setIsImportDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os contratos do sistema</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Importar/Exportar
          </Button>
          <Link to={createPageUrl("NewContract")}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contrato
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <ContractFilters
        filters={filters}
        onFiltersChange={setFilters}
        contracts={contracts}
      />

      {/* Table */}
      <ContractTable
        contracts={filteredContracts}
        isLoading={isLoading}
      />

      {/* Import Dialog */}
      <ImportExportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        contracts={contracts}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}