"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import {
    ArrowUpCircle,
    ArrowDownCircle,
    ExternalLink,
    SearchX,
    FileText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CashFlowTabsProps {
    inputs: any[]
    outputs: any[]
}

export function CashFlowTabs({ inputs, outputs }: CashFlowTabsProps) {
    const TransactionTable = ({ data, type }: { data: any[], type: "IN" | "OUT" }) => {
        if (data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <SearchX className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-slate-500 font-medium">Nenhuma transação encontrada.</p>
                </div>
            )
        }

        return (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-slate-700">Data</TableHead>
                            <TableHead className="font-bold text-slate-700">Descrição</TableHead>
                            <TableHead className="font-bold text-slate-700">Categoria</TableHead>
                            <TableHead className="font-bold text-slate-700">Valor</TableHead>
                            <TableHead className="w-[80px] text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-xs text-slate-500 font-medium">
                                    {new Date(item.date).toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">{item.description}</span>
                                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {item.id.slice(-6)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-[10px] font-bold h-5 px-2 uppercase bg-slate-100 text-slate-600 border-none">
                                        {item.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className={`font-bold ${type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                                        {type === "IN" ? "+" : "-"} {formatCurrency(item.amount)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {item.receiptUrl && (
                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-blue-600 transition-all" title="Ver Comprovante">
                                                <Link href={item.receiptUrl} target="_blank">
                                                    <FileText className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        )}
                                        {item.referenceId && (
                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-primary transition-all" title="Ver OS">
                                                <Link href={`/dashboard/service-orders?id=${item.referenceId}`}>
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="in" className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-slate-100/50 p-1 h-11 border border-slate-200/60 rounded-xl">
                        <TabsTrigger value="in" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm px-6">
                            <ArrowUpCircle className="w-4 h-4" /> Entradas
                        </TabsTrigger>
                        <TabsTrigger value="out" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm px-6">
                            <ArrowDownCircle className="w-4 h-4" /> Saídas
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="in" className="mt-0 animate-in fade-in-50 duration-500">
                    <TransactionTable data={inputs} type="IN" />
                </TabsContent>

                <TabsContent value="out" className="mt-0 animate-in fade-in-50 duration-500">
                    <TransactionTable data={outputs} type="OUT" />
                </TabsContent>
            </Tabs>
        </div>
    )
}
