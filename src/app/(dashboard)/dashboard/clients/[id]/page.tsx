import { notFound } from "next/navigation"
import Link from "next/link"
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    FileText,
    TrendingUp,
    Layers,
    Clock,
    User,
    ExternalLink,
    DollarSign,
    CreditCard,
    MapPinIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getClientById } from "@/app/actions/clients"
import { formatCurrency, formatNumber, statusMap, cn } from "@/lib/utils"
import { CreateOSButton } from "@/components/dashboard/clients/create-os-button"
import { PaymentModal } from "@/components/dashboard/financial/payment-modal"

interface ClientDetailsPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ClientDetailsPage({ params }: ClientDetailsPageProps) {
    const { id } = await params
    const client = await getClientById(id)

    if (!client) {
        notFound()
    }

    const totalHe = (client.serviceorder || []).reduce((acc, so) => acc + so.areaSize, 0)
    const totalValue = (client.serviceorder || []).reduce((acc, so) => acc + so.totalPrice, 0)
    const serviceCount = client._count?.serviceorder || 0

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="gap-2 -ml-2 text-slate-500 hover:text-primary transition-all">
                    <Link href="/dashboard/clients">
                        <ChevronLeft className="w-4 h-4" /> Voltar para Clientes
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white px-3 py-1 text-slate-500 border-slate-200 hidden sm:flex">
                        ID: {client.id}
                    </Badge>
                    <CreateOSButton clientId={client.id} clientName={client.name} />
                </div>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                    <div className="h-2 bg-primary w-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-slate-900">{client.name}</CardTitle>
                                <p className="text-slate-500 flex items-center gap-2 mt-1">
                                    <FileText className="w-3.5 h-3.5" /> {client.document || "CPF/CNPJ não informado"}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 pt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" /> Informações de Contato
                            </h4>
                            <div className="space-y-2">
                                <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    {client.email || "E-mail não informado"}
                                </p>
                                <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {client.phone || "Telefone não informado"}
                                </p>
                                {client.contactPerson && (
                                    <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium">Responsável:</span> {client.contactPerson}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Endereço e Localização
                            </h4>
                            <div className="space-y-2">
                                <p className="text-sm text-slate-600 flex items-start gap-3 bg-slate-50 p-3 rounded-lg min-h-[4.5rem]">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                    <span>
                                        {client.address || "Endereço não cadastrado"}<br />
                                        <span className="font-medium">{client.city || "---"} - {client.state || "---"}</span>
                                    </span>
                                </p>
                                <p className="text-xs text-slate-400 flex items-center gap-2 mt-2">
                                    <Calendar className="w-3 h-3" /> Cliente desde {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    {client.notes && (
                        <CardContent className="border-t border-slate-100 mt-4 bg-slate-50/50">
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Observações Internas</p>
                            <p className="text-sm text-slate-600 italic whitespace-pre-wrap">{client.notes}</p>
                        </CardContent>
                    )}
                </Card>

                {/* Quick Stats Column */}
                <div className="flex flex-col gap-6">
                    <Card className="border-none shadow-sm bg-primary text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4 opacity-80 uppercase text-[10px] font-bold tracking-[0.1em]">
                                <TrendingUp className="w-4 h-4" /> Volume de Negócios
                            </div>
                            <h3 className="text-4xl font-black mb-1 leading-none">{formatCurrency(totalValue)}</h3>
                            <p className="text-white/60 text-sm">Faturamento total histórico</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Área Total</p>
                                <h3 className="text-2xl font-bold text-slate-900">{formatNumber(totalHe)} <span className="text-base font-normal text-slate-400">ha</span></h3>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Layers className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total de Serviços</p>
                                <h3 className="text-2xl font-bold text-slate-900">{serviceCount} <span className="text-base font-normal text-slate-400">OS</span></h3>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Clock className="w-5 h-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Service History Section */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-900">Histórico de Ordens de Serviço</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="py-4">OS</TableHead>
                                <TableHead className="py-4">Status</TableHead>
                                <TableHead className="py-4">Serviço</TableHead>
                                <TableHead className="py-4 text-right">Área (ha)</TableHead>
                                <TableHead className="py-4 text-right">Valor Total</TableHead>
                                <TableHead className="w-[80px] text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {client.serviceorder.length > 0 ? (
                                client.serviceorder.map((so: any) => {
                                    const invoice = so.invoice?.[0]
                                    const paidAmount = invoice?.payment?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0

                                    return (
                                        <TableRow key={so.id} className="group hover:bg-slate-50/50">
                                            <TableCell className="font-mono text-xs text-slate-400">
                                                #{so.id.slice(-6).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-bold", (statusMap as any)[so.status]?.color)}>
                                                    {(statusMap as any)[so.status]?.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex flex-col">
                                                    <span>{so.serviceType === 'PULVERIZATION' ? 'Pulverização' : 'Dispersão'}</span>
                                                    {so.location && (
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {so.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm">{formatNumber(so.areaSize)} ha</TableCell>
                                            <TableCell className="text-right font-bold text-slate-900">{formatCurrency(so.totalPrice)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    {(so.status === 'COMPLETED' || so.status === 'BILLED') && invoice && (
                                                        <PaymentModal
                                                            invoice={{ ...invoice, paidAmount }}
                                                            osId={so.id}
                                                            onSuccess={() => window.location.reload()}
                                                            trigger={
                                                                <Button variant="ghost" size="icon" className={cn(
                                                                    "h-8 w-8 transition-all",
                                                                    invoice.status === 'PAID' ? "text-slate-400" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                                                )}>
                                                                    <DollarSign className="w-4 h-4" />
                                                                </Button>
                                                            }
                                                        />
                                                    )}
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-primary transition-all">
                                                        <Link href={`/dashboard/service-orders?id=${so.id}`}>
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                                        Nenhuma ordem de serviço encontrada para este cliente.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
