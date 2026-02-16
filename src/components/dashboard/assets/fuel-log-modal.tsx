"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Fuel, Plus, Calendar, Gauge, Upload, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createFuelLog } from "@/app/actions/fuel-logs"

// We can't use zod schema for FormData validation directly in the same way for files on client-side easily with simple z.object
// But we can keep using it for partial validation or manual validation.
// For simplicity, we'll validate manually or strictly type the form values.

const fuelLogSchema = z.object({
    assetId: z.string().min(1, "Selecione um equipamento"),
    liters: z.coerce.number().min(0.1, "Quantidade deve ser maior que zero"),
    cost: z.coerce.number().min(0.1, "Custo deve ser maior que zero"),
    date: z.string().min(1, "Data é obrigatória"),
    odometer: z.coerce.number().optional().nullable(),
    paymentCondition: z.enum(["CASH", "LATER"]),
    paymentMethod: z.string().optional(),
})

type FuelLogValues = z.infer<typeof fuelLogSchema>

interface FuelLogModalProps {
    assets: any[]
    trigger?: React.ReactNode
}

export function FuelLogModal({ assets, trigger }: FuelLogModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [receiptFile, setReceiptFile] = useState<File | null>(null)
    const router = useRouter()

    const form = useForm<any>({
        resolver: zodResolver(fuelLogSchema),
        defaultValues: {
            assetId: "",
            liters: 0,
            cost: 0,
            date: format(new Date(), "yyyy-MM-dd"),
            odometer: null,
            paymentCondition: "CASH",
            paymentMethod: "PIX"
        },
    })

    const paymentCondition = form.watch("paymentCondition")

    async function onSubmit(values: any) {
        console.log("Submitting values:", values)
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("assetId", values.assetId)
            formData.append("liters", values.liters.toString())
            formData.append("cost", values.cost.toString())
            formData.append("date", values.date)
            if (values.odometer) formData.append("odometer", values.odometer.toString())
            formData.append("paymentCondition", values.paymentCondition)
            if (values.paymentMethod) formData.append("paymentMethod", values.paymentMethod)

            if (receiptFile) {
                formData.append("receipt", receiptFile)
            }

            const result = await createFuelLog(formData)

            if (result.success) {
                toast.success("Abastecimento registrado com sucesso!")
                setIsOpen(false)
                form.reset()
                setReceiptFile(null)
                router.refresh()
            } else {
                toast.error(result.error || "Erro ao registrar abastecimento")
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
                {trigger || (
                    <Button className="gap-2" suppressHydrationWarning>
                        <Plus className="w-4 h-4" /> Registrar Abastecimento
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Fuel className="w-5 h-5 text-emerald-600" />
                        Novo Abastecimento
                    </DialogTitle>
                    <DialogDescription>
                        Registre o abastecimento, anexe a nota e controle o pagamento.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log("Validation Errors:", errors)
                        toast.error("Verifique os erros no formulário.")
                    })} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="assetId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Equipamento / Veículo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o equipamento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {assets.map((asset) => (
                                                <SelectItem key={asset.id} value={asset.id}>
                                                    {asset.name} {asset.model ? `(${asset.model})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="liters"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Litros</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0,00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Custo Total (R$)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0,00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input type="date" className="pl-9" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="odometer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Odômetro (km)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Gauge className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    type="number"
                                                    className="pl-9"
                                                    placeholder="Opcional"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                            <h4 className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
                                <CreditCard className="w-4 h-4" /> Dados de Pagamento
                            </h4>

                            <FormField
                                control={form.control}
                                name="paymentCondition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condição de Pagamento</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CASH">À Vista (Pago agora)</SelectItem>
                                                <SelectItem value="LATER">A Prazo (Contas a Pagar)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {paymentCondition === "CASH" && (
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Método de Pagamento</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o método" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PIX">PIX</SelectItem>
                                                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                                                    <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                                                    <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                                                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                                                    <SelectItem value="BOLETO">Boleto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label>Comprovante / Nota Fiscal</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full relative dashed border-slate-300 text-slate-500 hover:bg-slate-50"
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
                                    >
                                        <span className="sr-only">Remover</span>
                                        &times;
                                    </Button>
                                )}
                            </div>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Opcional. Fotos ou PDFs até 5MB.
                            </p>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    "Registrar Abastecimento"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
