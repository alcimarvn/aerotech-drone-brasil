import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { serviceorder_status, serviceorder_serviceType } from "@prisma/client"
import { formatCurrency, formatNumber, statusMap } from "@/lib/utils"
import {
    Calendar,
    MapPin,
    User,
    DollarSign,
    Layers,
    FileText,
    Clock,
    CheckCircle2,
    Printer
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PDFDownloadButton } from "@/components/reports/pdf-download-button"

interface OSDetailsProps {
    order: {
        id: string
        client: { name: string; document?: string | null; phone?: string | null }
        pilot?: { user?: { name: string | null } | null } | null
        assistant?: { user?: { name: string | null } | null } | null
        serviceType: serviceorder_serviceType
        areaSize: number
        totalPrice: number
        status: serviceorder_status
        scheduledDate?: Date | null
        location?: string | null
        description?: string | null
        invoices?: {
            status: string
            amount: number
            payment: { amount: number }[]
        }[]
    }
}

const serviceTypeLabel: Record<string, string> = {
    "PULVERIZATION": "Pulverização",
    "DISPERSION": "Dispersão",
}

export function OSDetails({ order }: OSDetailsProps) {
    const invoice = order.invoices?.[0]
    const paidAmount = invoice?.payment?.reduce((acc, p) => acc + p.amount, 0) || 0

    return (
        <div className="space-y-6">
            {/* Header Status */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Atual</span>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge className={`px-3 py-1 text-sm font-bold ${statusMap[order.status]?.color}`}>
                            {statusMap[order.status]?.label}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ID da OS</span>
                        <p className="font-mono font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</p>
                    </div>
                    <Link href={`/print/service-orders/${order.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Printer className="w-4 h-4" />
                            Imprimir
                        </Button>
                    </Link>
                    <PDFDownloadButton order={order} size="sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" /> Cliente
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Nome</p>
                            <p className="font-medium text-slate-900">{order.client.name}</p>
                        </div>
                        {order.client.document && (
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Documento</p>
                                <p className="text-sm text-slate-700">{order.client.document}</p>
                            </div>
                        )}
                        {order.client.phone && (
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Telefone</p>
                                <p className="text-sm text-slate-700">{order.client.phone}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Service Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" /> Serviço
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Tipo</p>
                                <p className="font-medium text-slate-900">{serviceTypeLabel[order.serviceType]}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Data</p>
                                <p className="font-medium text-slate-900">
                                    {order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : "Não agendada"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Localização</p>
                            <div className="flex items-start gap-2 mt-1">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                <p className="text-sm text-slate-700">{order.location || "Não informada"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial & Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" /> Financeiro
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Valor Total</p>
                                <p className="text-xl font-bold text-emerald-700">{formatCurrency(order.totalPrice)}</p>
                            </div>
                            {invoice && (
                                <Badge variant="outline" className={
                                    invoice.status === 'PAID'
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : paidAmount > 0
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                }>
                                    {invoice.status === 'PAID' ? 'Pago' : paidAmount > 0 ? 'Parcial' : 'Pendente'}
                                </Badge>
                            )}
                        </div>
                        {invoice && paidAmount > 0 && (
                            <div className="space-y-3 pt-3 border-t border-slate-100">
                                <div className="text-xs text-slate-500">
                                    Já pago: <span className="font-bold text-emerald-600">{formatCurrency(paidAmount)}</span>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Pagamentos</p>
                                    {invoice.payment?.map((payment: any) => (
                                        <div key={payment.id} className="text-sm border-l-2 border-emerald-500 pl-3 py-1 flex justify-between items-start bg-slate-50 rounded-r-md">
                                            <div>
                                                <p className="font-medium text-slate-900">{formatCurrency(payment.amount)}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(payment.date).toLocaleDateString()} - {payment.method}
                                                </p>
                                            </div>
                                            {payment.receiptUrl && (
                                                <Link href={payment.receiptUrl} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> Ver Comprovante
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" /> Detalhes Técnicos
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div>
                            <p className="text-xs text-slate-500 uppercase">Área Total</p>
                            <p className="text-xl font-bold text-slate-900">{formatNumber(order.areaSize)} <span className="text-sm font-normal text-slate-500">hectares</span></p>
                        </div>
                        {order.description && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <p className="text-xs text-slate-500 uppercase mb-1">Observações</p>
                                <p className="text-sm text-slate-700 italic">{order.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Team */}
            {(order.pilot || order.assistant) && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" /> Equipe Responsável
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.pilot && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    PL
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase">Piloto</p>
                                    <p className="text-sm font-medium text-slate-900">{order.pilot.user?.name}</p>
                                </div>
                            </div>
                        )}
                        {order.assistant && (
                            <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">
                                    AX
                                </div>
                                <div>
                                    <p className="text-xs text-amber-600 font-bold uppercase">Auxiliar</p>
                                    <p className="text-sm font-medium text-slate-900">{order.assistant.user?.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
