"use client"

import {
    DollarSign,
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface FinancialStatsProps {
    stats: {
        totalRevenue: number
        monthlyExpenses: number
        accountsReceivable: number
        accountsPayable?: number
        netProfit: number
    }
}

export function FinancialStats({ stats }: FinancialStatsProps) {
    const summaryCards = [
        {
            label: "Receitas",
            value: stats.totalRevenue,
            icon: ArrowUpCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            description: "Total recebido (Entradas)"
        },
        {
            label: "Despesas",
            value: stats.monthlyExpenses,
            icon: ArrowDownCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
            description: "Total pago (Saídas)"
        },
        {
            label: "A Receber",
            value: stats.accountsReceivable,
            icon: Wallet,
            color: "text-blue-600",
            bg: "bg-blue-50",
            description: "Faturamento pendente"
        },
        {
            label: "A Pagar",
            value: stats.accountsPayable || 0,
            icon: PiggyBank,
            color: "text-amber-600",
            bg: "bg-amber-50",
            description: "Obrigações pendentes"
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.bg} ${card.color} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">
                                {formatCurrency(card.value)}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">{card.description}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
