"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface DashboardChartsProps {
    data: {
        name: string
        receita: number
        despesas: number
    }[]
}

export function DashboardCharts({ data }: DashboardChartsProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-4 border-slate-200/60 shadow-sm">
                <CardHeader>
                    <CardTitle>Performance Financeira</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center text-slate-400">
                    Sem dados financeiros suficientes para exibir o gráfico.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-slate-200/60 shadow-sm">
            <CardHeader>
                <CardTitle>Performance Financeira (Últimos 6 Meses)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `R$ ${value / 1000}k`}
                                dx={-10}
                            />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number | string | ReadonlyArray<number | string> | undefined) => {
                                    if (typeof value === 'number') return [formatCurrency(value), ""]
                                    if (value !== undefined) return [String(value), ""]
                                    return ["", ""]
                                }}
                            />
                            <Bar
                                dataKey="receita"
                                name="Receita"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                            <Bar
                                dataKey="despesas"
                                name="Despesas"
                                fill="#f43f5e"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
