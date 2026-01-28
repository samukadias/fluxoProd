import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { Calendar, User, Building2, Clock, AlertTriangle } from "lucide-react";
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ACTIVE_STATUSES = [
    "PENDENTE TRIAGEM",
    "DESIGNADA",
    "EM QUALIFICAÇÃO",
    "EM ANDAMENTO",
    "PENDÊNCIA DDS",
    "PENDÊNCIA DOP",
    "PENDÊNCIA DOP E DDS",
    "PENDÊNCIA COMERCIAL",
    "PENDÊNCIA FORNECEDOR"
];

export default function DemandCard({ demand, analyst, client }) {
    const isOverdue = demand.expected_delivery_date &&
        ACTIVE_STATUSES.includes(demand.status) &&
        isAfter(new Date(), parseISO(demand.expected_delivery_date));

    return (
        <Link to={createPageUrl(`demand-detail?id=${demand.id}`)}>
            <div className={cn(
                "bg-white rounded-xl border p-4 hover:shadow-md transition-all duration-200 cursor-pointer group",
                isOverdue ? "border-red-300 bg-red-50/30" : "border-slate-200 hover:border-indigo-200"
            )}>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-500">
                                #{demand.demand_number || demand.id?.slice(-6)}
                            </span>
                            {isOverdue && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                                    <AlertTriangle className="w-3 h-3" />
                                    ATRASADA
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                            {demand.product}
                        </h3>
                    </div>
                    <StatusBadge status={demand.status} size="sm" />
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded">
                        {demand.artifact}
                    </span>
                    <PriorityBadge weight={demand.weight} complexity={demand.complexity} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    {client && (
                        <span className="inline-flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {client.name}
                        </span>
                    )}
                    {analyst && (
                        <span className="inline-flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {analyst.name}
                        </span>
                    )}
                    {demand.expected_delivery_date && (
                        <span className={cn(
                            "inline-flex items-center gap-1",
                            isOverdue && "text-red-600 font-medium"
                        )}>
                            <Calendar className="w-3.5 h-3.5" />
                            {format(parseISO(demand.expected_delivery_date), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
