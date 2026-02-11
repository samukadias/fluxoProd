import React, { useState, useEffect, useMemo } from "react";
import { Contract } from "@/entities/Contract";
import { User } from "@/entities/User";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl, formatCurrency, formatCompactCurrency } from "@/utils/legacy";
import {
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Plus,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { differenceInDays, format } from "date-fns";

import StatsCard from "../components/dashboard/StatsCard";
import ContractAlerts from "../components/dashboard/ContractAlerts";
import RecentContracts from "../components/dashboard/RecentContracts";
import FinancialOverview from "../components/dashboard/FinancialOverview";
import ContractsExpiringChart from "../components/dashboard/ContractsExpiringChart";
import DexAlert from "../components/dashboard/DexAlert";

import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const { user } = useAuth(); // Use AuthContext directly, assuming it's synced with localStorage now
  const [isLoading, setIsLoading] = useState(true);
  const [analystFilter, setAnalystFilter] = useState("all");
  const navigate = useNavigate();

  // Extract unique analysts for filter
  const activeAnalysts = useMemo(() => {
    const analysts = contracts
      .map(c => c.analista_responsavel)
      .filter(name => name && name.trim() !== "");
    return [...new Set(analysts)].sort();
  }, [contracts]);

  // Filter contracts specifically for the chart
  const filteredExpiryContracts = useMemo(() => {
    if (analystFilter === "all") return contracts;
    return contracts.filter(c => c.analista_responsavel === analystFilter);
  }, [contracts, analystFilter]);

  useEffect(() => {
    // Only load if user is defined
    if (user) {
      loadContracts();
    }
  }, [user]);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      // Fetch all contracts (or filtered by API if backend supported it, but client-side filter is fine for now)
      let contractData = await Contract.list("-created_date");

      // LOGICA DE PERMISSÃO / FILTRO
      const department = user.department; // GOR, COCR, etc
      const role = user.role; // manager, analyst, client
      const userName = (user.name || user.full_name || "").trim().toLowerCase();
      const userEmail = (user.email || "").trim().toLowerCase();

      // Se for GOR ou Gestor COCR, vê tudo.
      const canViewAll = department === 'GOR' || (department === 'COCR' && role === 'manager') || user.perfil === 'GESTOR';

      if (!canViewAll) {
        if (role === 'analyst' || user.perfil === 'ANALISTA') {
          contractData = contractData.filter(c => {
            const cAnalyst = (c.analista_responsavel || "").trim().toLowerCase();
            return cAnalyst === userName || cAnalyst === userEmail; // Tenta bater nome ou email
          });
        } else if (role === 'client') {
          contractData = contractData.filter(c => {
            const cClient = (c.cliente || "").trim().toLowerCase();
            // Assumindo que o Nome do Usuário Cliente é igual ao nome do Cliente no contrato
            return cClient === userName;
          });
        }
      }

      setContracts(contractData);
    } catch (error) {
      console.error("Erro ao carregar contratos:", error);
    }
    setIsLoading(false);
  };

  const getContractStats = () => {
    const today = new Date();
    const activeContracts = contracts.filter(c => c.status === "Ativo");
    const expiredContracts = contracts.filter(c => c.status === "Expirado");

    const expiringContracts = activeContracts.filter(contract => {
      if (!contract.data_fim_efetividade) return false;
      const daysUntilExpiry = differenceInDays(new Date(contract.data_fim_efetividade), today);
      return daysUntilExpiry <= 60 && daysUntilExpiry >= 0;
    });

    const totalValue = contracts.reduce((sum, contract) => sum + (contract.valor_contrato || 0), 0);
    const totalBilled = contracts.reduce((sum, contract) => sum + (contract.valor_faturado || 0), 0);

    return {
      total: contracts.length,
      active: activeContracts.length,
      expired: expiredContracts.length,
      expiring: expiringContracts.length,
      totalValue,
      totalBilled
    };
  };

  const stats = getContractStats();
  const billingProgress = stats.totalValue > 0 ? (stats.totalBilled / stats.totalValue) * 100 : 0;

  // Título personalizado
  const getDashboardTitle = () => {
    if (user?.role === "client") return "Meu Painel";
    if (user?.role === "analyst") return "Meus Contratos";
    return "Dashboard COCR";
  };

  const isManager = user?.department === 'GOR' || (user?.department === 'COCR' && user?.role === 'manager') || user?.perfil === 'GESTOR';

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-gray-600 mt-1">
            {isManager ? "Visão Geral de Prazos e Contratos" : "Acompanhamento de Contratos"}
          </p>
        </div>
        {/* Apenas Gestores e Analistas podem criar contratos. Clientes não. */}
        {(isManager || user?.role === 'analyst') && (
          <div className="flex gap-3">
            <Link to={createPageUrl("NewContract")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Contrato
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Alerta DEX - Apenas para Gestores */}
      {isManager && (
        <DexAlert contracts={contracts} isLoading={isLoading} />
      )}

      {/* Acesso Rápido - Ferramentas de Gestão */}
      {isManager && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/prazos/analise">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div className="text-center">
                <span className="block font-semibold text-gray-900">Saúde da Carteira</span>
                <span className="text-xs text-gray-500">Rentabilidade e riscos</span>
              </div>
            </Button>
          </Link>
          <Link to="/prazos/etapas">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200">
              <Calendar className="w-6 h-6 text-green-600" />
              <div className="text-center">
                <span className="block font-semibold text-gray-900">Controle de Etapas</span>
                <span className="text-xs text-gray-500">Fluxo de renovações</span>
              </div>
            </Button>
          </Link>
          <Link to="/prazos/gestao-dados">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 border-purple-200">
              <Plus className="w-6 h-6 text-purple-600" />
              <div className="text-center">
                <span className="block font-semibold text-gray-900">Gestão de Dados</span>
                <span className="text-xs text-gray-500">Migração e transferências</span>
              </div>
            </Button>
          </Link>
        </div>
      )}

      {/* CARDS SIMPLE DASHBOARD (Visible to ALL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Contratos"
          value={stats.total}
          icon={FileText}
          color="blue"
          isLoading={isLoading}
          onClick={() => navigate(createPageUrl("Contracts"))}
        />
        <StatsCard
          title="Contratos Ativos"
          value={stats.active}
          icon={TrendingUp}
          color="green"
          isLoading={isLoading}
          onClick={() => navigate(createPageUrl("Contracts") + "?status=Ativo")}
        />
        <StatsCard
          title="Vencendo em 2 Meses"
          value={stats.expiring}
          icon={Calendar}
          color="orange"
          isLoading={isLoading}
          onClick={() => navigate(createPageUrl("Contracts") + "?vencimento=expiring")}
        />
        <StatsCard
          title="Valor Total dos Contratos"
          value={formatCompactCurrency(stats.totalValue)}
          fullValue={formatCurrency(stats.totalValue)}
          icon={DollarSign}
          color="purple"
          isLoading={isLoading}
          progress={billingProgress} // Only relevant if billing data exists
        />
      </div>

      {/* DETAILED VIEWS - ONLY FOR MANAGERS */}
      {isManager && (
        <>
          {/* Gráfico de Vencimentos */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Previsão de Vencimentos</h2>

              <div className="w-full sm:w-64">
                <Select value={analystFilter} onValueChange={setAnalystFilter}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Filtrar por analista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Analistas</SelectItem>
                    {activeAnalysts.map((analyst) => (
                      <SelectItem key={analyst} value={analyst}>
                        {analyst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ContractsExpiringChart contracts={filteredExpiryContracts} isLoading={isLoading} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ContractAlerts contracts={contracts} isLoading={isLoading} />
              <RecentContracts contracts={contracts} isLoading={isLoading} />
            </div>
            <div>
              <FinancialOverview contracts={contracts} isLoading={isLoading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
