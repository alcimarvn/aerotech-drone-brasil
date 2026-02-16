"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, DollarSign, Wallet, Trash2, Calendar, CreditCard, FileText } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { registerInvoicePayment, deletePayment } from "@/app/actions/financial"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const paymentSchema = z.object({
    amount: z.coerce.number().positive("O valor deve ser maior que zero"),
    date: z.string().min(1, "Data é obrigatória"),
    method: z.string().min(1, "Selecione um método"),
    file: z.any().optional()
})

type PaymentValues = z.infer<typeof paymentSchema>

interface PaymentModalProps {
    invoice: {
        id: string
        amount: number
        paidAmount?: number
        status: string
        payment?: {
            id: string
            amount: number
            date: Date
            method: string
        }[]
    }
    osId: string
    onSuccess: () => void
    trigger?: React.ReactNode
}

export function PaymentModal({ invoice, osId, onSuccess, trigger }: PaymentModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Calcular valor restante sugerido
    const paidAmount = invoice.paidAmount || 0;
    const remainingAmount = invoice.amount - paidAmount;

    const form = useForm<PaymentValues>({
        resolver: zodResolver(paymentSchema) as any,
        defaultValues: {
            amount: remainingAmount > 0 ? remainingAmount : 0,
            date: format(new Date(), "yyyy-MM-dd"),
            method: "PIX",
        },
    })

    async function onSubmit(values: PaymentValues) {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("invoiceId", invoice.id)
            formData.append("amount", String(values.amount))
            formData.append("date", values.date)
            formData.append("method", values.method)

            if (values.file) {
                formData.append("file", values.file)
            }

            const result = await registerInvoicePayment(formData)

            if (result.success) {
                toast.success("Pagamento registrado com sucesso!")
                setIsOpen(false)
                form.reset()
                onSuccess()
            } else {
                toast.error(result.error || "Erro ao registrar pagamento")
            }
        } catch (error) {
            console.error(error)
            toast.error("Ocorreu um erro inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete(paymentId: string) {
        setIsDeleting(paymentId)
        try {
            const result = await deletePayment(paymentId)
            if (result.success) {
                toast.success("Pagamento estornado com sucesso!")
                setIsOpen(false) // Fechar para atualizar dados, ou onSuccess poderia só invalidar query se estivéssemos usando query
                onSuccess()
            } else {
                toast.error(result.error || "Erro ao estornar pagamento")
            }
        } catch (error) {
            toast.error("Erro ao excluir pagamento")
        } finally {
            setIsDeleting(null)
        }
    }

    const methodLabels: Record<string, string> = {
        "PIX": "PIX",
        "TRANSFER": "Transferência",
        "CASH": "Dinheiro",
        "BOLETO": "Boleto",
        "CARD": "Cartão"
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 text-emerald-600 font-bold hover:bg-emerald-50 hover:text-emerald-700"
                    >
                        <DollarSign className="h-4 w-4" /> Registrar Pagamento
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Wallet className="w-5 h-5 text-emerald-600" />
                        </div>
                        Gerenciar Pagamentos
                    </DialogTitle>
                    <DialogDescription>
                        OS #{osId.slice(-6).toUpperCase()}
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2 mb-2 border border-slate-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Valor Total OS:</span>
                        <span className="font-semibold">{formatCurrency(invoice.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Já Recebido:</span>
                        <span className="font-semibold text-emerald-600">{formatCurrency(paidAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                        <span className="font-bold text-slate-700">Restante:</span>
                        <span className="font-bold text-slate-900">{formatCurrency(remainingAmount)}</span>
                    </div>
                </div>

                {remainingAmount > 0.01 && (
                    <div className="space-y-4">
                        <div className="text-sm font-semibold text-slate-700 mt-2">Novo Pagamento</div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Valor (R$)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0,00"
                                                    {...field}
                                                    className="font-bold text-emerald-700"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="method"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Método</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="PIX">PIX</SelectItem>
                                                        <SelectItem value="TRANSFER">Transferência</SelectItem>
                                                        <SelectItem value="CASH">Dinheiro</SelectItem>
                                                        <SelectItem value="BOLETO">Boleto</SelectItem>
                                                        <SelectItem value="CARD">Cartão</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel>Comprovante (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...fieldProps}
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={(event) => {
                                                        onChange(event.target.files && event.target.files[0])
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Registrar Pagamento
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}

                {invoice.payment && invoice.payment.length > 0 && (
                    <>
                        <Separator className="my-2" />
                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-slate-700">Histórico de Pagamentos</div>
                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                {invoice.payment.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between text-sm p-2 bg-slate-50 border border-slate-100 rounded-md">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800">{formatCurrency(payment.amount)}</span>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(payment.date), "dd/MM/yyyy")}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="w-3 h-3" />
                                                    {methodLabels[payment.method] || payment.method}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <a
                                                href={`/receipts/${payment.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                title="Imprimir Recibo"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                                onClick={() => handleDelete(payment.id)}
                                                disabled={isDeleting === payment.id}
                                            >
                                                {isDeleting === payment.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
