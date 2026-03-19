"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, Calendar as CalendarIcon, Upload, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { createExpense } from "@/app/actions/financial"

const expenseSchema = z.object({
    description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
    amount: z.coerce.number().positive("O valor deve ser maior que zero"),
    date: z.string().min(1, "Data é obrigatória"),
    categoryId: z.string().min(1, "Selecione uma categoria"),
    paymentCondition: z.enum(["CASH", "LATER", "INSTALLMENTS"]),
    installments: z.coerce.number().min(1, "Minimo 1 parcela").optional().default(1),
    paymentMethod: z.string().optional(),
})

type ExpenseValues = z.infer<typeof expenseSchema>

interface ExpenseModalProps {
    categories: any[]
    onSuccess: () => void
}

export function ExpenseModal({ categories, onSuccess }: ExpenseModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [receiptFile, setReceiptFile] = useState<File | null>(null)
    const router = useRouter()

    const form = useForm<any>({
        resolver: zodResolver(expenseSchema) as any,
        defaultValues: {
            description: "",
            amount: 0,
            date: format(new Date(), "yyyy-MM-dd"),
            categoryId: "",
            paymentCondition: "CASH",
            installments: 1,
            paymentMethod: "PIX",
        },
    })

    const paymentCondition = form.watch("paymentCondition")

    async function onSubmit(values: any) {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("description", values.description)
            formData.append("amount", values.amount.toString())
            formData.append("date", values.date)
            formData.append("categoryId", values.categoryId)
            formData.append("paymentCondition", values.paymentCondition)
            formData.append("installments", values.installments.toString())
            if (values.paymentMethod) formData.append("paymentMethod", values.paymentMethod)

            if (receiptFile) {
                formData.append("receipt", receiptFile)
            }

            const result = await createExpense(formData)

            if (result.success) {
                toast.success("Despesa cadastrada com sucesso!")
                setIsOpen(false)
                form.reset()
                setReceiptFile(null)
                onSuccess()
                router.refresh()
            } else {
                toast.error(result.error || "Erro ao cadastrar despesa")
            }
        } catch (error) {
            console.error(error)
            toast.error("Ocorreu um erro inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2">
                    <Plus className="w-5 h-5" /> Nova Despesa
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">Cadastrar Saída</DialogTitle>
                    <DialogDescription>
                        Insira os detalhes do gasto fixo ou variável.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Aluguel, Combustível, Luz..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor (R$)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0,00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                        </div>

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                            {categories.length === 0 && (
                                                <SelectItem value="none" disabled>Nenhuma categoria</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
                                <CreditCard className="w-4 h-4" /> Pagamento
                            </h4>

                            <FormField
                                control={form.control}
                                name="paymentCondition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condição</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CASH">À Vista (Pago)</SelectItem>
                                                <SelectItem value="LATER">À Prazo (Pendente)</SelectItem>
                                                <SelectItem value="INSTALLMENTS">Parcelado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {paymentCondition === "INSTALLMENTS" && (
                                <FormField
                                    control={form.control}
                                    name="installments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantidade de Parcelas</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {paymentCondition === "CASH" && (
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
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
                                                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                                                    <SelectItem value="BOLETO">Boleto</SelectItem>
                                                    <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                                                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Comprovante / Recibo</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full relative dashed border-slate-300 text-slate-500 hover:bg-slate-50 h-10"
                                >
                                    {receiptFile ? (
                                        <span className="text-emerald-600 font-medium truncate max-w-[200px]">
                                            {receiptFile.name}
                                        </span>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" /> Anexar Arquivo
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) setReceiptFile(file)
                                        }}
                                    />
                                </Button>
                                {receiptFile && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setReceiptFile(null)}
                                        className="text-slate-400 hover:text-red-500"
                                        aria-label="Remover arquivo"
                                        title="Remover arquivo"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white min-w-[120px]" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Gasto
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
