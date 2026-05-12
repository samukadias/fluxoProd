import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#a855f7', '#f43f5e', '#14b8a6', '#f97316'];

export default function PendencyCharts({ attestations }) {
    // Pendências por cliente
    const rawPendencyByClient = attestations.reduce((acc, att) => {
        const pendency = (att.measurement_value || 0) - (att.billed_amount || 0);
        if (pendency > 0) {
            const existing = acc.find(item => item.client === att.client_name);
            if (existing) {
                existing.value += pendency;
            } else {
                acc.push({ client: att.client_name, value: pendency });
            }
        }
        return acc;
    }, []);

    const sortedPendency = [...rawPendencyByClient].sort((a, b) => b.value - a.value);
    const top10Pendency = sortedPendency.slice(0, 10);
    const othersPendencyValue = sortedPendency.slice(10).reduce((sum, item) => sum + item.value, 0);
    
    const pendencyChartData = othersPendencyValue > 0 
        ? [...top10Pendency, { client: 'Outros', value: othersPendencyValue }]
        : top10Pendency;

    // Pendências por mês
    const pendencyByMonth = attestations.reduce((acc, att) => {
        const pendency = (att.measurement_value || 0) - (att.billed_amount || 0);
        if (pendency > 0 && att.reference_month) {
            const [year, month] = att.reference_month.split('-');
            const monthLabel = new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
            const existing = acc.find(item => item.month === monthLabel);
            if (existing) {
                existing.value += pendency;
            } else {
                acc.push({ month: monthLabel, value: pendency, rawMonth: att.reference_month });
            }
        }
        return acc;
    }, []).sort((a, b) => a.rawMonth.localeCompare(b.rawMonth));

    // Faturamento por cliente (para rank)
    const billingByClient = attestations.reduce((acc, att) => {
        const billed = parseFloat(att.billed_amount) || 0;
        if (billed > 0) {
            const existing = acc.find(item => item.client === att.client_name);
            if (existing) {
                existing.value += billed;
            } else {
                acc.push({ client: att.client_name, value: billed });
            }
        }
        return acc;
    }, []);

    const topBilling = [...billingByClient]
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    const bottomBilling = [...billingByClient]
        .sort((a, b) => a.value - b.value)
        .slice(0, 5);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact'
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const displayName = data.client || label || payload[0]?.name;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 max-w-xs">
                    <p className="text-slate-600 text-sm whitespace-normal">{displayName}</p>
                    <p className="text-[16px] text-slate-900 font-semibold mt-1">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(payload[0]?.value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-800">Pendências por Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {pendencyChartData.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-slate-500">
                                Sem pendências
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pendencyChartData}
                                                dataKey="value"
                                                nameKey="client"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={130}
                                                innerRadius={80}
                                                paddingAngle={2}
                                            >
                                                {pendencyChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.client === 'Outros' ? '#cbd5e1' : COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 overflow-y-auto max-h-[350px]">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Top 10 Maiores Pendências</h3>
                                    <div className="space-y-4">
                                        {top10Pendency.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 overflow-hidden pr-4">
                                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                    <span className="text-slate-700 text-sm font-medium truncate group-hover:text-slate-900 transition-colors" title={item.client}>{item.client}</span>
                                                </div>
                                                <span className="text-slate-900 font-semibold text-sm whitespace-nowrap">{formatCurrency(item.value)}</span>
                                            </div>
                                        ))}
                                        {othersPendencyValue > 0 && (
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#cbd5e1' }}></div>
                                                    <span className="text-slate-500 text-sm font-medium">Outros Clientes</span>
                                                </div>
                                                <span className="text-slate-500 font-semibold text-sm whitespace-nowrap">{formatCurrency(othersPendencyValue)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-800">Pendências por Mês</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {pendencyByMonth.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-slate-500">
                                Sem pendências
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={pendencyByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        axisLine={{ stroke: '#e2e8f0' }}
                                    />
                                    <YAxis
                                        tickFormatter={formatCurrency}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        axisLine={{ stroke: '#e2e8f0' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="value"
                                        fill="#f59e0b"
                                        radius={[4, 4, 0, 0]}
                                        name="Pendência"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-800">Top 5 Clientes (Faturamento)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {topBilling.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-slate-500">
                                Sem dados de faturamento
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topBilling} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                    <XAxis type="number" tickFormatter={formatCurrency} hide />
                                    <YAxis 
                                        dataKey="client" 
                                        type="category" 
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                                        width={140}
                                        axisLine={{ stroke: '#e2e8f0' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#10b981" 
                                        radius={[0, 4, 4, 0]} 
                                        name="Total Faturado"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-800">5 Menores Faturamentos</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {bottomBilling.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-slate-500">
                                Sem dados de faturamento
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={bottomBilling} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                    <XAxis type="number" tickFormatter={formatCurrency} hide />
                                    <YAxis 
                                        dataKey="client" 
                                        type="category" 
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                                        width={140}
                                        axisLine={{ stroke: '#e2e8f0' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#64748b" 
                                        radius={[0, 4, 4, 0]} 
                                        name="Total Faturado"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
