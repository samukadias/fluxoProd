import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Skeleton genérico de Card de Gráfico
export function ChartCardSkeleton({ height = "h-[300px]" }) {
    return (
        <Card className="w-full border-slate-200/60 shadow-sm">
            <CardHeader className="pb-2">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-1/3 mb-2" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
                <div className={`w-full ${height} bg-slate-50/50 rounded-lg flex flex-col justify-between p-4`}>
                    <div className="flex items-end justify-between h-full gap-4 pt-10">
                        {[35, 60, 45, 80, 50, 75, 40, 90, 65, 85].map((h, i) => (
                            <div
                                key={i}
                                className="bg-slate-200/50 w-full rounded-t animate-pulse"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Skeleton para os cards de Próximas Entregas e Últimas Entregues
export function NextLastDeliveriesSkeleton() {
    const list = [1, 2, 3, 4, 5];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Próximas Entregas Skeleton */}
            <Card className="border-indigo-100/50 shadow-md">
                <CardHeader className="bg-indigo-50/30 pb-3 border-b border-indigo-50">
                    <div className="h-5 bg-slate-200 rounded animate-pulse w-1/3" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {list.map((i) => (
                            <div key={i} className="py-3 px-4 flex items-center justify-between">
                                <div className="flex-1 space-y-2 mr-4">
                                    <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                                </div>
                                <div className="flex flex-col items-end shrink-0 space-y-1">
                                    <div className="h-4 bg-slate-200 rounded animate-pulse w-16" />
                                    <div className="h-3 bg-slate-100 rounded animate-pulse w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Últimas Entregues Skeleton */}
            <Card className="border-emerald-100/50 shadow-md">
                <CardHeader className="bg-emerald-50/30 pb-3 border-b border-emerald-50">
                    <div className="h-5 bg-slate-200 rounded animate-pulse w-1/3" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {list.map((i) => (
                            <div key={i} className="py-3 px-4 flex items-center justify-between">
                                <div className="flex-1 space-y-2 mr-4">
                                    <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                                    <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                                </div>
                                <div className="flex flex-col items-end shrink-0 space-y-1">
                                    <div className="h-4 bg-slate-200 rounded animate-pulse w-16" />
                                    <div className="h-3 bg-slate-100 rounded animate-pulse w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Skeleton para a Seção de Análise de SLA (SLA Geral e Tabela de SLA por Status)
export function SlaSectionSkeleton() {
    const statusItems = [1, 2, 3, 4, 5, 6];
    return (
        <Card className="mb-8 border-slate-200/60 shadow-sm">
            <CardHeader className="pb-4">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-1/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card de SLA Geral (imita o gradiente com cor neutra em loading) */}
                    <div className="rounded-xl p-6 bg-slate-100/70 border border-slate-200 animate-pulse flex flex-col justify-between h-[220px]">
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                            <div className="h-10 bg-slate-200 rounded w-1/3" />
                            <div className="h-3 bg-slate-200 rounded w-1/4" />
                        </div>
                        <div className="pt-4 border-t border-slate-200/60 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                            </div>
                        </div>
                    </div>

                    {/* Tabela de SLA por Status */}
                    <div className="space-y-3">
                        <div className="h-8 bg-slate-100 rounded w-full animate-pulse" />
                        {statusItems.map((i) => (
                            <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/3" />
                                <div className="h-4 bg-slate-200 rounded animate-pulse w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Skeleton para SLA por Etapa (CDPC)
export function StageSlaSkeleton() {
    const stages = [1, 2, 3, 4, 5, 6];
    return (
        <Card className="mb-8 border-slate-200/60 shadow-sm">
            <CardHeader className="pb-4">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-1/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {stages.map((i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 animate-pulse">
                            <div className="h-3 bg-slate-200 rounded w-3/4" />
                            <div className="h-6 bg-slate-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Skeleton para dois gráficos lado a lado
export function DoubleChartSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCardSkeleton height="h-[250px]" />
            <ChartCardSkeleton height="h-[250px]" />
        </div>
    );
}

// Skeleton para mapa de calor e demandas qualificadas para gestores
export function ManagerAdditionalChartsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6">
            <ChartCardSkeleton height="h-[250px]" />
            <ChartCardSkeleton height="h-[250px]" />
        </div>
    );
}

// Skeleton da aba Acompanhamento Semanal
export function WeeklyTrackingSkeleton() {
    const list = [1, 2, 3, 4, 5];
    return (
        <Card className="w-full p-6 border-slate-200/60 shadow-sm">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-1/4 mb-6" />
            <div className="space-y-4">
                {list.map((i) => (
                    <div key={i} className="flex space-x-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
                                <div className="h-3 bg-slate-100 rounded animate-pulse w-5/6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// Skeleton da aba Resumo
export function ResumoTabSkeleton() {
    const cards = [1, 2, 3, 4];
    const rows = [1, 2, 3, 4, 5];
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cards.map((i) => (
                    <Card key={i} className="p-6 space-y-3 border-slate-200/60 shadow-sm">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                        <div className="h-8 bg-slate-200 rounded animate-pulse w-1/3" />
                    </Card>
                ))}
            </div>
            <Card className="p-6 border-slate-200/60 shadow-sm">
                <div className="h-6 bg-slate-200 rounded animate-pulse w-1/4 mb-4" />
                <div className="space-y-3">
                    {rows.map((i) => (
                        <div key={i} className="h-10 bg-slate-100/80 rounded animate-pulse w-full" />
                    ))}
                </div>
            </Card>
        </div>
    );
}

// Skeleton da aba Eficiência e Fluxo
export function FlowEfficiencySkeleton() {
    const cards = [1, 2, 3, 4];
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cards.map((i) => (
                    <Card key={i} className="p-6 space-y-3 border-slate-200/60 shadow-sm">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                        <div className="h-8 bg-slate-200 rounded animate-pulse w-1/3" />
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCardSkeleton height="h-[300px]" />
                <ChartCardSkeleton height="h-[300px]" />
            </div>
        </div>
    );
}

// Skeleton de Demandas em Aberto para Requesters
export function RequesterOpenDemandsSkeleton() {
    const rows = [1, 2, 3, 4];
    return (
        <Card className="mt-6 border-slate-200/60 shadow-sm col-span-1 lg:col-span-2">
            <CardHeader className="pb-4">
                <div className="h-5 bg-slate-200 rounded animate-pulse w-1/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="h-8 bg-slate-100 rounded w-full animate-pulse" />
                    {rows.map((i) => (
                        <div key={i} className="h-10 bg-slate-50 rounded animate-pulse w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
