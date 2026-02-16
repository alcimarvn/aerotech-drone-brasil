"use client"

import { useState, useEffect } from "react"
import {
    FileBarChart,
    Calendar,
    Users,
    Droplets,
    TrendingUp,
    Download,
    Printer,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    FileText
} from "lucide-react"
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getFinancialReport } from "@/app/actions/financial"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ReportPrintHeader } from "./report-print-header"

interface ReportsSectionProps {
    stats?: {
        accountsReceivable: number
        accountsPayable: number
    }
}

export function ReportsSection({ stats }: ReportsSectionProps) {
    const [reportType, setReportType] = useState<"CASH_FLOW" | "BY_CLIENT" | "BY_CATEGORY">("CASH_FLOW")
    const [period, setPeriod] = useState("current")
    const [customStartDate, setCustomStartDate] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"))
    const [customEndDate, setCustomEndDate] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"))
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const formatSafeDate = (date: any) => {
        try {
            const d = new Date(date)
            if (isNaN(d.getTime())) return "---"
            return format(d, "dd/MM/yyyy")
        } catch (e) {
            return "---"
        }
    }

    const fetchReport = async () => {
        // Se for filtro personalizado, só busca se as datas estiverem completas (10 caracteres: YYYY-MM-DD)
        if (period === "custom" && (customStartDate.length < 10 || customEndDate.length < 10)) {
            return
        }

        setIsLoading(true)
        setData([]) // Limpa dados anteriores para evitar colisões de renderização
        try {
            let start = startOfMonth(new Date())
            let end = endOfMonth(new Date())

            if (period === "last") {
                start = startOfMonth(subMonths(new Date(), 1))
                end = endOfMonth(subMonths(new Date(), 1))
            } else if (period === "3months") {
                start = startOfMonth(subMonths(new Date(), 2))
                end = endOfMonth(new Date())
            } else if (period === "6months") {
                start = startOfMonth(subMonths(new Date(), 5))
                end = endOfMonth(new Date())
            } else if (period === "12months") {
                start = startOfMonth(subMonths(new Date(), 11))
                end = endOfMonth(new Date())
            } else if (period === "thisYear") {
                start = startOfYear(new Date())
                end = endOfYear(new Date())
            } else if (period === "lastYear") {
                start = startOfYear(subYears(new Date(), 1))
                end = endOfYear(subYears(new Date(), 1))
            } else if (period === "custom") {
                start = new Date(customStartDate)
                end = new Date(customEndDate)

                // Verifica se as datas convertidas são válidas
                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    setIsLoading(false)
                    return
                }

                // Ajustar para início/fim do dia
                start.setHours(0, 0, 0, 0)
                end.setHours(23, 59, 59, 999)
            }

            const result = await getFinancialReport(reportType, start, end)
            setData(result || [])
        } catch (error) {
            console.error("Error loading report:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleExport = () => {
        if (!data || data.length === 0) {
            toast.error("Não há dados para exportar.")
            return
        }

        try {
            let csvContent = "\uFEFF" // BOM para Excel reconhecer UTF-8

            if (reportType === "CASH_FLOW") {
                csvContent += "Data;Tipo;Descrição;Categoria;Valor\n"
                data.forEach(item => {
                    csvContent += `${formatSafeDate(item.date)};${item.type};${item.description};${item.category};${item.amount}\n`
                })
            } else if (reportType === "BY_CLIENT") {
                csvContent += "Cliente;OSs Realizadas;Total Faturado\n"
                data.forEach(client => {
                    csvContent += `${client.name};${client.osCount};${client.total}\n`
                })
            } else if (reportType === "BY_CATEGORY") {
                csvContent += "Categoria;Lançamentos;Total\n"
                data.forEach(cat => {
                    csvContent += `${cat.name};${cat.count};${cat.total}\n`
                })
            }

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            const fileName = `relatorio_${reportType.toLowerCase()}_${format(new Date(), "ddMMyyyy")}.csv`

            link.setAttribute("href", url)
            link.setAttribute("download", fileName)
            link.style.visibility = "hidden"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success("Relatório exportado com sucesso!")
        } catch (error) {
            console.error("Export error:", error)
            toast.error("Erro ao exportar relatório.")
        }
    }

    useEffect(() => {
        fetchReport()
    }, [reportType, period, customStartDate, customEndDate])

    return (
        <>
            <ReportPrintHeader
                title={
                    reportType === "CASH_FLOW" ? "Fluxo de Caixa Detalhado" :
                        reportType === "BY_CLIENT" ? "Relatório de Faturamento por Cliente" :
                            "Despesas por Categoria"
                }
                period={
                    period === "current" ? "Mês Atual" :
                        period === "last" ? "Mês Anterior" :
                            period === "3months" ? "Últimos 3 Meses" :
                                period === "6months" ? "Últimos 6 Meses" :
                                    period === "12months" ? "Últimos 12 Meses" :
                                        period === "thisYear" ? `Ano Atual (${new Date().getFullYear()})` :
                                            period === "lastYear" ? `Ano Anterior (${new Date().getFullYear() - 1})` :
                                                `Personalizado (${formatSafeDate(customStartDate)} - ${formatSafeDate(customEndDate)})`
                }
                filterDescription={data.length > 0 ? `${data.length} registros encontrados` : "Nenhum registro"}
            />
            <Card className="border-slate-200/60 shadow-sm overflow-hidden print:shadow-none print:border-none">
                <CardHeader className="bg-slate-50/50 border-b border-slate-200/60 pb-6 print:hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FileBarChart className="w-5 h-5 text-emerald-600" />
                                Relatórios Gerenciais
                            </CardTitle>
                            <CardDescription>Visualize o desempenho financeiro por diferentes ângulos.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                                    <SelectValue placeholder="Período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="current">Mês Atual</SelectItem>
                                    <SelectItem value="last">Mês Anterior</SelectItem>
                                    <SelectItem value="3months">Últimos 3 Meses</SelectItem>
                                    <SelectItem value="6months">Últimos 6 Meses</SelectItem>
                                    <SelectItem value="12months">Últimos 12 Meses</SelectItem>
                                    <SelectItem value="thisYear">Ano Atual ({new Date().getFullYear()})</SelectItem>
                                    <SelectItem value="lastYear">Ano Anterior ({new Date().getFullYear() - 1})</SelectItem>
                                    <SelectItem value="custom">Personalizado...</SelectItem>
                                </SelectContent>
                            </Select>

                            {period === "custom" && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                                    <Input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        className="w-[150px] bg-white h-10"
                                    />
                                    <span className="text-slate-400 font-medium">até</span>
                                    <Input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        className="w-[150px] bg-white h-10"
                                    />
                                </div>
                            )}
                            <Button
                                variant="outline"
                                className="gap-2 bg-white print:hidden"
                                onClick={handleExport}
                                disabled={isLoading || data.length === 0}
                            >
                                <Download className="w-4 h-4" /> Exportar
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 bg-white print:hidden"
                                onClick={handlePrint}
                                disabled={isLoading || data.length === 0}
                            >
                                <Printer className="w-4 h-4" /> Imprimir
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs value={reportType} onValueChange={(v: any) => setReportType(v)} className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-white height-auto h-auto p-0 print:hidden">
                            <TabsTrigger
                                value="CASH_FLOW"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50/30 px-6 py-4"
                            >
                                Fluxo de Caixa
                            </TabsTrigger>
                            <TabsTrigger
                                value="BY_CLIENT"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50/30 px-6 py-4"
                            >
                                Por Cliente
                            </TabsTrigger>
                            <TabsTrigger
                                value="BY_CATEGORY"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50/30 px-6 py-4"
                            >
                                Por Categoria
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-6">
                            {/* Totals Summary */}
                            {!isLoading && data.length > 0 && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                                    {reportType === "CASH_FLOW" && (
                                        <>
                                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                                <p className="text-sm text-emerald-600 font-medium">Total Entradas</p>
                                                <p className="text-2xl font-bold text-emerald-700">
                                                    {formatCurrency(data.filter(i => i.type === "ENTRADA").reduce((acc, curr) => acc + curr.amount, 0))}
                                                </p>
                                            </div>
                                            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                                                <p className="text-sm text-rose-600 font-medium">Total Saídas</p>
                                                <p className="text-2xl font-bold text-rose-700">
                                                    {formatCurrency(data.filter(i => i.type === "SAÍDA").reduce((acc, curr) => acc + curr.amount, 0))}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <p className="text-sm text-slate-600 font-medium">Saldo do Período</p>
                                                <p className={`text-2xl font-bold ${(data.filter(i => i.type === "ENTRADA").reduce((acc, curr) => acc + curr.amount, 0) -
                                                    data.filter(i => i.type === "SAÍDA").reduce((acc, curr) => acc + curr.amount, 0)) >= 0
                                                    ? "text-emerald-600" : "text-rose-600"
                                                    }`}>
                                                    {formatCurrency(
                                                        data.filter(i => i.type === "ENTRADA").reduce((acc, curr) => acc + curr.amount, 0) -
                                                        data.filter(i => i.type === "SAÍDA").reduce((acc, curr) => acc + curr.amount, 0)
                                                    )}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    {/* Pending / Forecast Section (Global) */}
                                    {reportType === "CASH_FLOW" && stats && (
                                        <>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 print:bg-blue-50 print:border-blue-100">
                                                <p className="text-sm text-blue-600 font-medium">A Receber (Geral)</p>
                                                <p className="text-2xl font-bold text-blue-700">
                                                    {formatCurrency(stats.accountsReceivable)}
                                                </p>
                                            </div>
                                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 print:bg-amber-50 print:border-amber-100">
                                                <p className="text-sm text-amber-600 font-medium">A Pagar (Geral)</p>
                                                <p className="text-2xl font-bold text-amber-700">
                                                    {formatCurrency(stats.accountsPayable)}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    {reportType === "BY_CLIENT" && (
                                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 md:col-span-3">
                                            <p className="text-sm text-emerald-600 font-medium">Faturamento Total do Período</p>
                                            <p className="text-2xl font-bold text-emerald-700">
                                                {formatCurrency(data.reduce((acc, curr) => acc + curr.total, 0))}
                                            </p>
                                        </div>
                                    )}
                                    {reportType === "BY_CATEGORY" && (
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 md:col-span-3">
                                            <p className="text-sm text-slate-600 font-medium">Total de Despesas do Período</p>
                                            <p className="text-2xl font-bold text-slate-700">
                                                {formatCurrency(data.reduce((acc, curr) => acc + curr.total, 0))}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            {isLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-[200px] w-full" />
                                </div>
                            ) : data.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
                                    <Search className="w-8 h-8 opacity-20" />
                                    <p>Nenhum dado encontrado para o período selecionado.</p>
                                </div>
                            ) : (
                                <>
                                    {reportType === "CASH_FLOW" && (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Data</TableHead>
                                                    <TableHead>Tipo</TableHead>
                                                    <TableHead>Descrição</TableHead>
                                                    <TableHead>Categoria</TableHead>
                                                    <TableHead className="text-center">Comprovante</TableHead>
                                                    <TableHead className="text-right">Valor</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            {formatSafeDate(item.date)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === "ENTRADA"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : "bg-rose-100 text-rose-800"
                                                                }`}>
                                                                {item.type}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                                                        <TableCell className="text-slate-500">{item.category}</TableCell>
                                                        <TableCell className="text-center"> {/* Added TableCell */}
                                                            {item.receiptUrl ? (
                                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                                    <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer" title="Ver Comprovante">
                                                                        <FileText className="w-4 h-4" />
                                                                    </a>
                                                                </Button>
                                                            ) : (
                                                                <span className="text-slate-300">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className={`text-right font-bold ${item.type === "ENTRADA" ? "text-emerald-600" : "text-rose-600"
                                                            }`}>
                                                            {item.type === "SAÍDA" ? "-" : "+"} {formatCurrency(item.amount)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}

                                    {reportType === "BY_CLIENT" && (
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {data.map((client) => (
                                                <Card key={client.id} className="border-slate-100 bg-slate-50/50">
                                                    <CardContent className="pt-6">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase">
                                                                {client.name?.charAt(0) || "?"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold truncate">{client.name || "Cliente sem nome"}</p>
                                                                <p className="text-xs text-slate-500">{client.osCount || 0} OSs Realizadas</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-2xl font-black text-slate-900">{formatCurrency(client.total)}</p>
                                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Faturamento Total</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    {reportType === "BY_CATEGORY" && (
                                        <div className="space-y-4 max-w-2xl">
                                            {data.map((cat) => (
                                                <div key={cat.id} className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="font-bold text-slate-900">{cat.name}</p>
                                                            <p className="text-xs text-slate-500">{cat.count > 0 ? `${cat.count} lançamentos` : "Pagamentos globais"}</p>
                                                        </div>
                                                        <p className="font-black text-slate-900">{formatCurrency(cat.total)}</p>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full"
                                                            style={{ width: `${Math.min(100, (cat.total / data[0].total) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    )
}
