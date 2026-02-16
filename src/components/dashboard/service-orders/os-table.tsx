"use client"

import {
    MoreVertical,
    Eye,
    Pencil,
    Play,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    Calendar,
    DollarSign,
    CreditCard,
    User,
    Trash2
} from "lucide-react"
import { markInvoicePaid } from "@/app/actions/financial"
import { toast } from "sonner"
import { PaymentModal } from "@/components/dashboard/financial/payment-modal"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { serviceorder_status, serviceorder_serviceType } from "@prisma/client"

interface OS {
    id: string
    client: { name: string }
    pilot?: { user?: { name: string | null } | null } | null
    assistant?: { user?: { name: string | null } | null } | null
    serviceType: serviceorder_serviceType
    areaSize: number
    totalPrice: number
    status: serviceorder_status
    scheduledDate?: Date | null
    location?: string | null
    invoices?: {
        id: string
        status: string
        amount: number
        payment: {
            id: string
            amount: number
            date: Date
            method: string
        }[]
    }[]
}

interface OSTableProps {
    orders: OS[]
    onStatusChange: (id: string, status: serviceorder_status) => void
    onView: (os: OS) => void
    onEdit: (os: OS) => void
    onDelete: (id: string) => void
}

// Definimos as chaves manualmente para evitar dependência do objeto ServiceStatus do Prisma no runtime
const statusConfig: Record<string, { label: string, color: string }> = {
    "NEW": { label: "Nova", color: "bg-blue-50 text-blue-700 border-blue-200/50 shadow-sm" },
    "SCHEDULED": { label: "Agendada", color: "bg-indigo-50 text-indigo-700 border-indigo-200/50 shadow-sm" },
    "IN_PROGRESS": { label: "Em Execução", color: "bg-amber-50 text-amber-700 border-amber-200/50 animate-pulse shadow-sm" },
    "COMPLETED": { label: "Concluída", color: "bg-emerald-50 text-emerald-700 border-emerald-200/50 shadow-sm" },
    "BILLED": { label: "Faturada", color: "bg-slate-50 text-slate-700 border-slate-200/50 shadow-sm" },
    "CANCELLED": { label: "Cancelada", color: "bg-rose-50 text-rose-700 border-rose-200/50 shadow-sm" },
}

const serviceTypeLabel: Record<string, string> = {
    "PULVERIZATION": "Pulverização",
    "DISPERSION": "Dispersão",
}

export function OSTable({ orders, onStatusChange, onView, onEdit, onDelete }: OSTableProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [osToDelete, setOsToDelete] = useState<string | null>(null)

    const handleDeleteClick = (id: string) => {
        setOsToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (osToDelete) {
            onDelete(osToDelete)
            setIsDeleteDialogOpen(false)
            setOsToDelete(null)
        }
    }

    // handleMarkPaid removed

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">Nenhuma Ordem de Serviço encontrada.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
                    <TableRow>
                        <TableHead className="font-bold text-slate-700">ID / Status</TableHead>
                        <TableHead className="font-bold text-slate-700">Cliente / Local</TableHead>
                        <TableHead className="font-bold text-slate-700">Serviço</TableHead>
                        <TableHead className="font-bold text-right text-slate-700">Área</TableHead>
                        <TableHead className="font-bold text-right text-slate-700">Valor Total</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((os) => {
                        const invoice = os.invoices?.[0]
                        const paidAmount = invoice?.payment?.reduce((acc, p) => acc + p.amount, 0) || 0
                        // const isFullyPaid = invoice?.status === "PAID"
                        // const isPartiallyPaid = paidAmount > 0 && !isFullyPaid

                        let statusLabel = "Pendente"
                        let statusColor = "bg-amber-50 text-amber-600"

                        if (invoice?.status === "PAID") {
                            statusLabel = "Recebido"
                            statusColor = "bg-emerald-50 text-emerald-600"
                        } else if (invoice?.status === "PARTIALLY_PAID" || paidAmount > 0) {
                            statusLabel = "Parcial"
                            statusColor = "bg-blue-50 text-blue-600"
                        }

                        return (
                            <TableRow key={os.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-mono text-slate-400 uppercase">#{os.id.slice(-6)}</span>
                                        <Badge variant="outline" className={cn("px-2 py-0 h-5 text-[10px] font-bold", statusConfig[os.status].color)}>
                                            {statusConfig[os.status].label}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="font-medium text-slate-900">{os.client.name}</div>
                                        {os.location && (
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <MapPin className="w-3 h-3" /> {os.location}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm">{serviceTypeLabel[os.serviceType]}</div>
                                        {os.scheduledDate && (
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Calendar className="w-3 h-3" /> {new Date(os.scheduledDate).toLocaleDateString()}
                                            </div>
                                        )}
                                        {os.pilot?.user?.name && (
                                            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                                                <User className="w-3 h-3 text-blue-500" /> {os.pilot.user.name}
                                            </div>
                                        )}
                                        {os.assistant?.user?.name && (
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                <User className="w-3 h-3 text-amber-500" /> {os.assistant.user.name} <span className="text-[9px] opacity-70">(Aux)</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                    {os.areaSize.toLocaleString('pt-BR')} ha
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="font-bold text-slate-900">
                                            {os.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                        {invoice && (
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] px-1 h-4 border-none",
                                                statusColor
                                            )}>
                                                {statusLabel}
                                            </Badge>
                                        )}
                                        {invoice && paidAmount > 0 && invoice.status !== "PAID" && (
                                            <span className="text-[9px] text-slate-400">
                                                Pago: {paidAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onView(os)} className="gap-2">
                                                <Eye className="h-4 w-4" /> Detalhes
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(os)} className="gap-2">
                                                <Pencil className="h-4 w-4" /> Editar
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="text-[10px] text-slate-400">Mudar Status</DropdownMenuLabel>

                                            {os.status === "NEW" && (
                                                <DropdownMenuItem onClick={() => onStatusChange(os.id, "SCHEDULED" as any)} className="gap-2 text-purple-600">
                                                    <Clock className="h-4 w-4" /> Agendar
                                                </DropdownMenuItem>
                                            )}

                                            {(os.status === "SCHEDULED" || os.status === "NEW") && (
                                                <DropdownMenuItem onClick={() => onStatusChange(os.id, "IN_PROGRESS" as any)} className="gap-2 text-amber-600">
                                                    <Play className="h-4 w-4" /> Iniciar
                                                </DropdownMenuItem>
                                            )}

                                            {os.status === "IN_PROGRESS" && (
                                                <DropdownMenuItem onClick={() => onStatusChange(os.id, "COMPLETED" as any)} className="gap-2 text-emerald-600">
                                                    <CheckCircle2 className="h-4 w-4" /> Concluir
                                                </DropdownMenuItem>
                                            )}

                                            {os.status !== "CANCELLED" && os.status !== "COMPLETED" && (
                                                <DropdownMenuItem onClick={() => onStatusChange(os.id, "CANCELLED" as any)} className="gap-2 text-red-600">
                                                    <XCircle className="h-4 w-4" /> Cancelar
                                                </DropdownMenuItem>
                                            )}
                                            {(os.status === "COMPLETED" || os.status === "BILLED") && invoice && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onSelect={(e) => e.preventDefault()}
                                                        className="p-0 focus:bg-transparent"
                                                    >
                                                        <PaymentModal
                                                            invoice={{ ...invoice, paidAmount }}
                                                            osId={os.id}
                                                            onSuccess={() => window.location.reload()}
                                                            trigger={
                                                                <div className={cn(
                                                                    "flex items-center gap-2 w-full px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-accent-foreground cursor-pointer font-bold rounded-sm",
                                                                    invoice.status === "PAID"
                                                                        ? "text-slate-600 bg-slate-50/50"
                                                                        : "text-emerald-600 bg-emerald-50/50"
                                                                )}>
                                                                    <DollarSign className="h-4 w-4" />
                                                                    {invoice.status === "PAID"
                                                                        ? "Ver Pagamentos"
                                                                        : paidAmount > 0 ? "Registrar Restante" : "Registrar Pagamento"
                                                                    }
                                                                </div>
                                                            }
                                                        />
                                                    </DropdownMenuItem>
                                                </>
                                            )}

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteClick(os.id)}
                                                className="gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" /> Excluir OS
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente a Ordem de Serviço
                            e todos os registros financeiros associados (faturas, pagamentos e comissões).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700">
                            Excluir Permanentemente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )

}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
