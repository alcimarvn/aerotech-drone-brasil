"use client"

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface FinancialChartsProps {
    data: any[]
}

export function FinancialCharts({ data }: FinancialChartsProps) {
    if (data.length === 0) {
        return (
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Desempenho Mensal</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-slate-400 italic">
                    Sem dados suficientes para gerar o gráfico.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-slate-900">Histórico de Performance</CardTitle>
                <p className="text-sm text-slate-500">Comparativo de faturamento e despesas nos últimos meses</p>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(value) => `R$${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                }}
                                formatter={(value: any) => [formatCurrency(value), '']}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <Area
                                type="monotone"
                                dataKey="receita"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorReceita)"
                                name="Receita"
                            />
                            <Area
                                type="monotone"
                                dataKey="despesas"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorDespesas)"
                                name="Despesas"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
