import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, FileText, Hash, DollarSign, PenSquare, Wrench, AlertTriangle, CheckCircle2, Clock, ImageIcon, FileIcon, Upload, Fuel, Droplets, ExternalLink, Package } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAssetById } from "@/app/actions/assets"
import { AssetModal } from "@/components/dashboard/assets/asset-modal"
import { MaintenanceModal } from "@/components/dashboard/assets/maintenance-modal"
import { DeleteMaintenanceButton } from "@/components/dashboard/assets/delete-maintenance-button"
import { DeleteAssetButton } from "@/components/dashboard/assets/delete-asset-button"

export const metadata: Metadata = {
    title: "Detalhes do Equipamento | Aerotech",
    description: "Visualizar detalhes e histórico do equipamento"
}

interface AssetDetailsPageProps {
    params: {
        id: string
    }
}

export default async function AssetDetailsPage({ params }: AssetDetailsPageProps) {
    const { id } = await params
    const asset = await getAssetById(id) as any

    if (!asset) {
        notFound()
    }

    const typeLabels: Record<string, string> = {
        DRONE: "Drone",
        VEHICLE: "Veículo",
        TRAILER: "Reboque",
        BATTERY: "Bateria",
        GENERATOR: "Gerador",
        CONTROL: "Controle",
        OTHER: "Outro"
    }

    const statusLabels: Record<string, { label: string, color: string, icon: any }> = {
        ACTIVE: { label: "Ativo", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
        MAINTENANCE: { label: "Em Manutenção", color: "bg-amber-100 text-amber-800", icon: Wrench },
        RETIRED: { label: "Aposentado", color: "bg-slate-100 text-slate-800", icon: AlertTriangle }
    }

    const currentStatus = statusLabels[asset.status] || { label: asset.status, color: "bg-slate-100 text-slate-800", icon: AlertTriangle }
    const StatusIcon = currentStatus.icon

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/assets">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{asset.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>{typeLabels[asset.type]}</span>
                        <span>•</span>
                        <span>{asset.model || "Modelo não informado"}</span>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <AssetModal
                        asset={asset}
                        trigger={
                            <Button variant="outline" className="gap-2">
                                <PenSquare className="w-4 h-4" /> Editar
                            </Button>
                        }
                    />
                    <DeleteAssetButton assetId={asset.id} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Lateral - Detalhes e Status */}
                <div className="space-y-6">
                    <Card className="overflow-hidden border-slate-200/60 shadow-sm">
                        <div className="aspect-square bg-slate-100 relative flex items-center justify-center border-b">
                            {asset.imageUrl ? (
                                <img
                                    src={asset.imageUrl}
                                    alt={asset.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center">
                                    <Package className="w-16 h-16 mb-2 opacity-20" />
                                    <span className="text-sm">Sem imagem</span>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Status Atual</div>
                                <Badge className={`${currentStatus.color} hover:${currentStatus.color} gap-1 px-3 py-1`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {currentStatus.label}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <Hash className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Número de Série</div>
                                        <div className="font-semibold text-slate-900">{asset.serialNumber || "N/A"}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Data de Compra</div>
                                        <div className="font-semibold text-slate-900">
                                            {asset.purchaseDate ? format(new Date(asset.purchaseDate), "dd/MM/yyyy") : "---"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Valor do Ativo</div>
                                        <div className="font-semibold text-slate-900">
                                            {asset.purchasePrice ? formatCurrency(asset.purchasePrice) : "---"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {asset.notes && (
                                <>
                                    <Separator />
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5" /> Observações
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed italic">
                                            "{asset.notes}"
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documentos */}
                    <Card className="border-slate-200/60 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileIcon className="w-4 h-4 text-blue-500" />
                                Documentação
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {asset.assetdocument && asset.assetdocument.length > 0 ? (
                                asset.assetdocument.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-[10px]">
                                                {doc.type}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate text-slate-900">{doc.name}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {format(new Date(doc.date), "dd/MM/yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-blue-600 group-hover:bg-white" asChild>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                <Upload className="w-4 h-4 rotate-180" />
                                            </a>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-xl grayscale opacity-50">
                                    <FileIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p className="text-xs font-medium">Nenhum anexo</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Principal - Históricos e Multimídia */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Galeria de Fotos */}
                    {asset.assetimage && asset.assetimage.length > 0 && (
                        <Card className="border-slate-200/60 shadow-sm">
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                                    Galeria Visual
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {asset.assetimage.map((image: any) => (
                                        <div key={image.id} className="group aspect-square relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                                            <img
                                                src={image.url}
                                                alt={image.caption || asset.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-lg" asChild>
                                                    <a href={image.url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Histórico de Manutenções */}
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b bg-slate-50/50">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                                <Wrench className="w-4 h-4 text-amber-500" />
                                Registro de Manutenções
                            </CardTitle>
                            <MaintenanceModal
                                assetId={asset.id}
                                assetName={asset.name}
                            />
                        </CardHeader>
                        <CardContent className="p-0">
                            {asset.maintenance && asset.maintenance.length > 0 ? (
                                <div className="divide-y relative">
                                    {asset.maintenance.map((maintenance: any) => {
                                        const isScheduled = maintenance.status === "SCHEDULED"
                                        const isOverdue = isScheduled && new Date(maintenance.date) < new Date()

                                        const typeStyles = {
                                            PREVENTIVE: { label: "Preventiva", class: "bg-blue-100 text-blue-700 border-blue-200" },
                                            CORRECTIVE: { label: "Corretiva", class: "bg-amber-100 text-amber-700 border-amber-200" },
                                            PREDICTIVE: { label: "Preditiva", class: "bg-purple-100 text-purple-700 border-purple-200" }
                                        } as const;

                                        const typeInfo = maintenance.type && typeStyles[maintenance.type as keyof typeof typeStyles]
                                            ? typeStyles[maintenance.type as keyof typeof typeStyles]
                                            : typeStyles.CORRECTIVE

                                        return (
                                            <div key={maintenance.id} className={`flex gap-4 p-5 hover:bg-slate-50/50 transition-colors ${isScheduled ? 'bg-slate-50/30' : ''}`}>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center border ${isScheduled ? 'bg-slate-100 border-slate-200' : 'bg-amber-50 border-amber-100/50'}`}>
                                                        {isScheduled ? <Clock className="w-5 h-5 text-slate-500" /> : <Wrench className="w-5 h-5 text-amber-600" />}
                                                    </div>
                                                    {isOverdue && (
                                                        <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Atrasada</Badge>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider border ${typeInfo.class}`}>
                                                                    {typeInfo.label}
                                                                </Badge>
                                                                {maintenance.status === "SCHEDULED" && <Badge variant="outline" className="text-[10px] bg-sky-50 text-sky-700 border-sky-200">Agendada</Badge>}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                                                                    {formatCurrency(maintenance.cost)}
                                                                </span>
                                                                <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm ml-2">
                                                                    <MaintenanceModal
                                                                        assetId={asset.id}
                                                                        assetName={asset.name}
                                                                        maintenance={maintenance}
                                                                        trigger={
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-none">
                                                                                <PenSquare className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        }
                                                                    />
                                                                    <DeleteMaintenanceButton maintenanceId={maintenance.id} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <p className="font-semibold text-slate-900 group mb-2">{maintenance.description}</p>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-xs">
                                                        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {maintenance.status === "SCHEDULED" ? "Agendada para: " : "Realizada em: "}
                                                            {format(new Date(maintenance.date), "dd/MM/yyyy")}
                                                        </span>

                                                        {(maintenance.currentOdometer || maintenance.currentHours) && (
                                                            <span className="flex items-center gap-1.5 text-slate-500">
                                                                {maintenance.currentOdometer && <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {maintenance.currentOdometer} km</span>}
                                                                {maintenance.currentOdometer && maintenance.currentHours && <span className="text-slate-300">|</span>}
                                                                {maintenance.currentHours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {maintenance.currentHours} h</span>}
                                                            </span>
                                                        )}

                                                        {maintenance.nextDue && (
                                                            <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md w-fit mt-1 md:col-span-2">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Próxima Preventiva: {format(new Date(maintenance.nextDue), "dd/MM/yyyy")}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <Wrench className="w-10 h-10 mx-auto mb-3 opacity-10" />
                                    <p className="text-sm">Nenhuma manutenção registrada</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Histórico de Abastecimentos */}
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b bg-slate-50/50">
                            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900">
                                <Fuel className="w-4 h-4 text-emerald-500" />
                                Histórico de Abastecimentos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {asset.fuellog && asset.fuellog.length > 0 ? (
                                <div className="divide-y text-sm">
                                    {asset.fuellog.map((log: any) => (
                                        <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="h-9 w-9 flex-shrink-0 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100/50">
                                                <Droplets className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between font-medium">
                                                    <div className="text-slate-900">
                                                        {log.liters.toFixed(2)} L
                                                        {log.odometer && (
                                                            <span className="text-xs text-slate-400 ml-2 font-normal">
                                                                ({log.odometer} km)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-emerald-700">{formatCurrency(log.cost)}</div>
                                                </div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 uppercase tracking-wide font-bold">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(log.date), "dd/MM/yyyy")}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <Droplets className="w-10 h-10 mx-auto mb-3 opacity-10" />
                                    <p className="text-sm">Nenhum abastecimento registrado</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
