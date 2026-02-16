import { Suspense } from "react"
import { Package, Search, PenSquare, Plus, Eye } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAssets } from "@/app/actions/assets"
import { AssetModal } from "@/components/dashboard/assets/asset-modal"
import { DeleteAssetButton } from "@/components/dashboard/assets/delete-asset-button"
import { formatCurrency } from "@/lib/utils"

export default async function AssetsPage() {
    const assets = await getAssets()

    const typeLabels: Record<string, string> = {
        "DRONE": "Drone",
        "VEHICLE": "Veículo",
        "TRAILER": "Reboque",
        "BATTERY": "Bateria",
        "OTHER": "Outro"
    }

    const statusLabels: Record<string, { label: string, color: string }> = {
        "ACTIVE": { label: "Ativo", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        "MAINTENANCE": { label: "Em Manutenção", color: "bg-amber-100 text-amber-700 border-amber-200" },
        "RETIRED": { label: "Aposentado", color: "bg-slate-100 text-slate-500 border-slate-200" }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Package className="w-8 h-8 text-primary" />
                        Equipamentos (Ativos)
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Gerencie seus drones, veículos, baterias e outros equipamentos.
                    </p>
                </div>
                <div className="flex gap-2">
                    <AssetModal />
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="bg-white border-b flex flex-row items-center justify-between py-4">
                    <CardTitle className="text-lg font-medium text-slate-900">Lista de Equipamentos</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Buscar equipamento..."
                                className="pl-9 h-9 w-[250px] bg-slate-50 border-slate-200"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="py-3">Nome / Modelo</TableHead>
                                <TableHead className="py-3">Tipo</TableHead>
                                <TableHead className="py-3">Nº Série</TableHead>
                                <TableHead className="py-3">Aquisição</TableHead>
                                <TableHead className="py-3">Status</TableHead>
                                <TableHead className="py-3 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        Nenhum equipamento cadastrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assets.map((asset) => (
                                    <TableRow key={asset.id} className="group hover:bg-slate-50/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">{asset.name}</span>
                                                {asset.model && (
                                                    <span className="text-xs text-slate-500">{asset.model}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {typeLabels[asset.type] || asset.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-mono text-xs">
                                            {asset.serialNumber || "---"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-700">
                                                    {asset.purchaseDate ? format(asset.purchaseDate, "dd/MM/yyyy") : "---"}
                                                </span>
                                                {asset.purchasePrice && (
                                                    <span className="text-xs text-slate-500">
                                                        {formatCurrency(asset.purchasePrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`px-2 py-0.5 text-[10px] uppercase font-bold border shadow-none ${statusLabels[asset.status]?.color || "bg-slate-100 text-slate-500"}`}>
                                                {statusLabels[asset.status]?.label || asset.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" asChild>
                                                    <Link href={`/dashboard/assets/${asset.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AssetModal
                                                    asset={asset}
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                                            <PenSquare className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                />
                                                <DeleteAssetButton assetId={asset.id} />
                                            </div>
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
