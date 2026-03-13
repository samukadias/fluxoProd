import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function PendencyCharts({ attestations }) {
    // Pendências por cliente
    const pendencyByClient = attestations.reduce((acc, att) => {
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
                acc.push({ month: monthLabel, value: pendency });
            }
        }
        return acc;
    }, []).sort((a, b) => a.month.localeCompare(b.month));

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
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
                    <p className="text-slate-600 text-sm">{label || payload[0]?.name}</p>
                    <p className="text-slate-900 font-semibold">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-800">Pendências por Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {pendencyByClient.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-slate-500">
                                Sem pendências
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pendencyByClient}
                                        dataKey="value"
                                        nameKey="client"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={60}
                                        paddingAngle={2}
                                        label={({ client, value }) => `${client?.substring(0, 10)}...`}
                                    >
                                        {pendencyByClient.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
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
                            <ResponsiveContainer width="100%" height={300}>
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
                                        width={100}
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
                                        width={100}
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
