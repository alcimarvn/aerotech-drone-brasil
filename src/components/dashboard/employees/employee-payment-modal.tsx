"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, DollarSign, Wallet, Calendar, FileText } from "lucide-react"
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
import { registerEmployeePayment } from "@/app/actions/financial"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"

const paymentSchema = z.object({
    amount: z.coerce.number().positive("O valor deve ser maior que zero"),
    date: z.string().min(1, "Data é obrigatória"),
    method: z.string().min(1, "Selecione um método"),
    notes: z.string().optional(),
    file: z.any().optional()
})

type PaymentValues = z.infer<typeof paymentSchema>

import { useRouter } from "next/navigation"

// ... (other imports)

interface EmployeePaymentModalProps {
    employee: {
        id: string
        name: string
        balance: number
    }
    onSuccess?: () => void
    trigger?: React.ReactNode
}

export function EmployeePaymentModal({ employee, onSuccess, trigger }: EmployeePaymentModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<any>({
        // ... (existing form config)
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            amount: 0,
            date: format(new Date(), "yyyy-MM-dd"),
            method: "PIX",
            notes: ""
        },
    })

    async function onSubmit(values: any) {
        const validatedValues: PaymentValues = values
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("employeeId", employee.id)
            formData.append("amount", String(values.amount))
            formData.append("date", values.date)
            formData.append("method", values.method)
            formData.append("notes", values.notes || "")

            if (values.file) {
                formData.append("file", values.file)
            }

            const result = await registerEmployeePayment(formData)

            if (result.success) {
                toast.success("Pagamento registrado com sucesso!")
                setIsOpen(false)
                form.reset()
                router.refresh()
                if (onSuccess) onSuccess()
            } else {
                toast.error(result.error || "Erro ao registrar pagamento")
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                        <DollarSign className="h-4 w-4" /> Pagar Funcionário
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Wallet className="w-5 h-5 text-emerald-600" />
                        </div>
                        Registrar Pagamento
                    </DialogTitle>
                    <DialogDescription>
                        Funcionário: {employee.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2 mb-2 border border-slate-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Saldo Atual (A Pagar):</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(employee.balance)}</span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor do Pagamento (R$)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0,00"
                                            {...field}
                                            className="text-lg font-bold text-emerald-700"
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
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observação (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ex: Adiantamento de comissão..."
                                            {...field}
                                            className="resize-none h-20"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirmar Pagamento
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
