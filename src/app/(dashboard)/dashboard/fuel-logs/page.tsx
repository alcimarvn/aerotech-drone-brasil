import { Metadata } from "next"
import { Fuel, Fuel as FuelIcon, Trash2, Calendar, Gauge, Droplets, DollarSign, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/db"
import { getFuelLogs, deleteFuelLog } from "@/app/actions/fuel-logs"
import { FuelLogModal } from "@/components/dashboard/assets/fuel-log-modal"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { revalidatePath } from "next/cache"
import { asset_type } from "@prisma/client"

export const metadata: Metadata = {
    title: "Log de Combustível | Aerotech",
    description: "Controle de abastecimentos e gastos com combustível"
}

async function DeleteFuelLogButton({ id }: { id: string }) {
    async function handleDelete() {
        "use server"
        await deleteFuelLog(id)
        revalidatePath("/dashboard/fuel-logs")
    }

    return (
        <form action={handleDelete}>
            <Button size="icon" variant="ghost" className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-4 h-4" />
            </Button>
        </form>
    )
}

export default async function FuelLogsPage() {
    const fuelLogs = await getFuelLogs()

    // Fetch assets for the modal (filter for vehicles, generators, etc. if needed)
    // For now, allow all assets but ideally filter by AssetType
    const assets = await db.asset.findMany({
        where: {
            OR: [
                { type: "VEHICLE" as any },
                { type: "GENERATOR" as any },
                { type: "OTHER" as any }
            ]
        }
    })

    const totalCost = fuelLogs.reduce((acc, log) => acc + log.cost, 0)
    const totalLiters = fuelLogs.reduce((acc, log) => acc + log.liters, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <FuelIcon className="w-8 h-8 text-primary" />
                        Log de Combustível
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gerencie os abastecimentos de sua frota e geradores.
                    </p>
                </div>
                <FuelLogModal assets={assets} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
                        <p className="text-xs text-muted-foreground">Histórico acumulado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
                        <Droplets className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLiters.toFixed(2)} L</div>
                        <p className="text-xs text-muted-foreground">Litros abastecidos</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Abastecimentos</CardTitle>
                    <CardDescription>
                        Lista de todos os registros de combustível integrados às despesas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Equipamento</TableHead>
                                <TableHead>Litros</TableHead>
                                <TableHead>Custo</TableHead>
                                <TableHead>Odômetro</TableHead>
                                <TableHead className="text-center">Comprovante</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fuelLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Nenhum registro encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fuelLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">
                                            {format(new Date(log.date), "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{log.asset.name}</span>
                                                <span className="text-xs text-muted-foreground">{log.asset.model}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{log.liters.toFixed(2)} L</TableCell>
                                        <TableCell>{formatCurrency(log.cost)}</TableCell>
                                        <TableCell>{log.odometer ? `${log.odometer} km` : "-"}</TableCell>
                                        <TableCell className="text-center">
                                            {log.receiptUrl ? (
                                                <Button variant="ghost" size="icon" asChild className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                    <a href={log.receiptUrl} target="_blank" rel="noopener noreferrer" title="Ver Comprovante">
                                                        <FileText className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DeleteFuelLogButton id={log.id} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
