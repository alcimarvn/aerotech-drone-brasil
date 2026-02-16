"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Wrench, Calendar, Gauge, Clock, Repeat } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
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
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createMaintenance, updateMaintenance } from "@/app/actions/assets"

const maintenanceSchema = z.object({
    type: z.enum(["PREVENTIVE", "CORRECTIVE", "PREDICTIVE"]),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELED"]),
    description: z.string().min(1, "Descrição é obrigatória"),
    cost: z.coerce.number().min(0, "Custo não pode ser negativo"),
    date: z.string().min(1, "Data é obrigatória"),
    nextDue: z.string().optional(),
    currentOdometer: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().optional()),
    currentHours: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().optional()),
    frequencyDays: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number().int().optional()),
    frequencyKm: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().optional()),
    frequencyHours: z.preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().optional()),
})

type MaintenanceValues = z.infer<typeof maintenanceSchema>

interface MaintenanceModalProps {
    assetId: string
    assetName: string
    maintenance?: any
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export function MaintenanceModal({ assetId, assetName, maintenance, trigger, onSuccess }: MaintenanceModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const isEditing = !!maintenance

    const form = useForm<MaintenanceValues>({
        resolver: zodResolver(maintenanceSchema) as any,
        defaultValues: {
            type: maintenance?.type || "CORRECTIVE",
            status: maintenance?.status || "COMPLETED",
            description: maintenance?.description || "",
            cost: maintenance?.cost || 0,
            date: maintenance?.date ? format(new Date(maintenance.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
            nextDue: maintenance?.nextDue ? format(new Date(maintenance.nextDue), "yyyy-MM-dd") : "",
            currentOdometer: maintenance?.currentOdometer ?? undefined,
            currentHours: maintenance?.currentHours ?? undefined,
            frequencyDays: maintenance?.frequencyDays ?? undefined,
            frequencyKm: maintenance?.frequencyKm ?? undefined,
            frequencyHours: maintenance?.frequencyHours ?? undefined,
        },
    })

    // Debug errors
    useEffect(() => {
        if (Object.keys(form.formState.errors).length > 0) {
            console.log("Current Form Errors:", JSON.stringify(form.formState.errors, null, 2))
        }
    }, [form.formState.errors])

    const watchType = form.watch("type")
    const watchStatus = form.watch("status")

    // Efeito para limpar campos quando o tipo muda
    useEffect(() => {
        if (watchType !== "PREVENTIVE") {
            form.setValue("frequencyDays", undefined)
            form.setValue("frequencyKm", undefined)
            form.setValue("frequencyHours", undefined)
        }
    }, [watchType, form])

    async function onSubmit(values: MaintenanceValues) {
        console.log("onSubmit starting - Values received from React Hook Form:", JSON.stringify(values, null, 2))
        setIsLoading(true)
        try {
            let result
            // Convert strings to Date objects appropriately
            const payload = {
                ...values,
                date: new Date(values.date),
                nextDue: values.nextDue ? new Date(values.nextDue) : undefined,
                currentOdometer: values.currentOdometer ?? undefined,
                currentHours: values.currentHours ?? undefined,
                frequencyDays: values.frequencyDays ?? undefined,
                frequencyKm: values.frequencyKm ?? undefined,
                frequencyHours: values.frequencyHours ?? undefined,
            }

            if (isEditing) {
                result = await updateMaintenance(maintenance.id, assetId, payload as any)
            } else {
                result = await createMaintenance({
                    assetId,
                    ...payload,
                } as any)
            }

            if (result.success) {
                toast.success(isEditing ? "Manutenção atualizada com sucesso!" : "Manutenção registrada com sucesso!")
                setIsOpen(false)
                if (!isEditing) form.reset()
                router.refresh()
                if (onSuccess) onSuccess()
            } else {
                toast.error(result.error || "Erro ao salvar manutenção")
            }
        } catch (error) {
            console.error("Error in onSubmit:", error)
            toast.error("Ocorreu um erro inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    const onInvalid = (errors: any) => {
        console.error("onInvalid called - Validation Errors Object:", errors)
        console.error("onInvalid called - Error Keys:", Object.keys(errors))
        console.error("onInvalid called - Errors Stringified:", JSON.stringify(errors, null, 2))
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button variant="outline" className="gap-2 border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20">
                        <Wrench className="h-4 w-4" /> Registrar Manutenção
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Wrench className="w-5 h-5 text-amber-600" />
                        </div>
                        {isEditing ? "Editar Manutenção" : "Registrar Manutenção"}
                    </DialogTitle>
                    <DialogDescription>
                        {assetName}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Manutenção</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CORRECTIVE">Corretiva</SelectItem>
                                                <SelectItem value="PREVENTIVE">Preventiva</SelectItem>
                                                <SelectItem value="PREDICTIVE">Preditiva</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="SCHEDULED">Agendada</SelectItem>
                                                <SelectItem value="COMPLETED">Concluída</SelectItem>
                                                <SelectItem value="CANCELED">Cancelada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição do Serviço</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ex: Troca de hélices, revisão do motor..."
                                            className="resize-none h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Custo Total (R$)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
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
                                        <FormLabel>{watchStatus === "SCHEDULED" ? "Data Agendada" : "Data Realizada"}</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value ?? ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {watchStatus === "COMPLETED" && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="col-span-2">
                                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Registro de Uso do Equipamento</p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="currentOdometer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1.5">
                                                <Gauge className="w-3.5 h-3.5" /> Hodômetro (km)
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="currentHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" /> Horímetro (h)
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {watchType === "PREVENTIVE" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <FormItem className="col-span-full">
                                    <FormLabel className="text-blue-700 text-xs uppercase font-bold tracking-wider flex items-center gap-2">
                                        <Repeat className="w-3.5 h-3.5" /> Frequência / Recorrência
                                    </FormLabel>
                                    <FormDescription className="text-blue-600/80 text-xs">
                                        Preencha para calcular automaticamente a próxima revisão
                                    </FormDescription>
                                </FormItem>

                                <FormField
                                    control={form.control}
                                    name="frequencyDays"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-900">Dias</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ex: 30" className="bg-white" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="frequencyKm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-900">Km</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ex: 5000" className="bg-white" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="frequencyHours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-900">Horas</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ex: 100" className="bg-white" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="nextDue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Próxima Manutenção (Previsão)</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormDescription>
                                        {watchType === "PREVENTIVE" && (form.watch("frequencyDays") || form.watch("frequencyKm") || form.watch("frequencyHours"))
                                            ? "Será calculado automaticamente se deixado em branco, com base na frequência."
                                            : "Defina manualmente se necessário."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Salvar Alterações" : "Registrar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
