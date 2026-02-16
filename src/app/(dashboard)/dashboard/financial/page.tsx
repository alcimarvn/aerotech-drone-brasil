"use client"

import { useState, useEffect, useCallback } from "react"
import {
    RefreshCw,
    ArrowUpCircle,
    ArrowDownCircle,
    LayoutDashboard,
    PieChart,
    Calendar,
    Search
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FinancialStats } from "@/components/dashboard/financial/financial-stats"
import { FinancialCharts } from "@/components/dashboard/financial/financial-charts"
import { CashFlowTabs } from "@/components/dashboard/financial/cash-flow-tabs"
import { ExpenseModal } from "@/components/dashboard/financial/expense-modal"
import { ReportsSection } from "@/components/dashboard/financial/reports-section"
import {
    getFinancialSummary,
    getMonthlyPerformance,
    getCashFlow,
    getExpenseCategories
} from "@/app/actions/financial"
import { cn } from "@/lib/utils"

export default function FinancialPage() {
    const [stats, setStats] = useState<any>(null)
    const [performance, setPerformance] = useState<any[]>([])
    const [inputs, setInputs] = useState<any[]>([])
    const [outputs, setOutputs] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [summaryData, perfData, inData, outData, catData] = await Promise.all([
                getFinancialSummary(),
                getMonthlyPerformance(),
                getCashFlow("INPUT"),
                getCashFlow("OUTPUT"),
                getExpenseCategories()
            ])

            setStats(summaryData)
            setPerformance(perfData)
            setInputs(inData)
            setOutputs(outData)
            setCategories(catData)
        } catch (error) {
            console.error("Error loading financial data:", error)
            toast.error("Erro ao carregar dados financeiros")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 rounded-xl">
                            <PieChart className="w-6 h-6 text-white" />
                        </div>
                        Gestão Financeira
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium"> Controle de faturamento, despesas operacionais e fluxo de caixa. </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchData}
                        disabled={isLoading}
                        className="h-11 w-11 rounded-xl bg-white border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-emerald-600 transition-all"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </Button>
                    <ExpenseModal categories={categories} onSuccess={fetchData} />
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                    <Skeleton className="h-[500px] w-full rounded-2xl" />
                </div>
            ) : (
                <>
                    {/* Dashboard Stats */}
                    <div className="animate-in slide-in-from-bottom-2 duration-500 print:hidden">
                        <FinancialStats stats={stats} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
                        {/* Monthly Chart */}
                        <div className="lg:col-span-2 animate-in slide-in-from-bottom-4 duration-500 delay-150">
                            <FinancialCharts data={performance} />
                        </div>

                        {/* Quick Balance/Tips Card */}
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                                <div className="relative z-10">
                                    <h4 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Saúde Financeira</h4>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-3xl font-black mb-1"> {stats.netProfit >= 0 ? "+" : ""} {Math.round((stats.netProfit / (stats.totalRevenue || 1)) * 100)}%</p>
                                            <p className="text-slate-400 text-xs">Margem líquida acumulada</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-sm font-medium text-slate-300 italic">"Mantenha as despesas operacionais abaixo de 40% do faturamento para uma operação saudável."</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
                            </div>

                            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                                <h4 className="text-emerald-800 text-sm font-bold flex items-center gap-2 mb-3">
                                    <Calendar className="w-4 h-4" /> Resumo do Mês
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-600/70 font-medium">Previsão Entradas</span>
                                        <span className="text-emerald-700 font-bold">R$ 0,00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-emerald-600/70 font-medium">Saídas Confirmadas</span>
                                        <span className="text-rose-600 font-bold">-{(stats.monthlyExpenses).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cash Flow Tabs */}
                    <div className="animate-in slide-in-from-bottom-6 duration-700 delay-500 pt-4 print:hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <LayoutDashboard className="w-5 h-5 text-slate-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fluxo de Caixa Detalhado</h2>
                        </div>
                        <CashFlowTabs inputs={inputs} outputs={outputs} />
                    </div>

                    {/* Management Reports Section */}
                    <div className="animate-in slide-in-from-bottom-6 duration-700 delay-700 pt-8">
                        <ReportsSection stats={stats} />
                    </div>
                </>
            )}
        </div>
    )
}
