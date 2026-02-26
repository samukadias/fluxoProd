import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContractFilters({ filters, onFiltersChange, contracts }) {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Extrair listas únicas de clientes e analistas
  const uniqueClients = useMemo(() => {
    if (!contracts) return [];
    const clients = new Set(contracts.map(c => c.cliente).filter(Boolean));
    return Array.from(clients).sort();
  }, [contracts]);

  const uniqueAnalysts = useMemo(() => {
    if (!contracts) return [];
    const analysts = new Set(contracts.map(c => c.analista_responsavel).filter(Boolean));
    return Array.from(analysts).sort();
  }, [contracts]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={filters.cliente || "all"} onValueChange={(value) => updateFilter("cliente", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniqueClients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Analista Responsável</Label>
            <Select value={filters.analista || "all"} onValueChange={(value) => updateFilter("analista", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o analista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniqueAnalysts.map(analyst => (
                  <SelectItem key={analyst} value={analyst}>{analyst}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status do Contrato</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Renovado">Renovado</SelectItem>
                <SelectItem value="Encerrado">Encerrado</SelectItem>
                <SelectItem value="Expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status do Vencimento</Label>
            <Select value={filters.vencimento} onValueChange={(value) => updateFilter("vencimento", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o vencimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Atenção">Atenção</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Busca Geral</Label>
            <Input
              placeholder="Buscar contrato..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}