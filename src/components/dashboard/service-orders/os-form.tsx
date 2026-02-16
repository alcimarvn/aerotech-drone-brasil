"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Calculator, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { createServiceOrder, updateServiceOrder } from "@/app/actions/service-orders"
import { getClients } from "@/app/actions/clients"
import { getEmployees } from "@/app/actions/employees"

const osSchema = z.object({
    clientId: z.string().min(1, "Selecione um cliente"),
    serviceType: z.enum(["PULVERIZATION", "DISPERSION"]),
    areaSize: z.coerce.number().min(0.1, "A área deve ser maior que 0"),
    applicationRate: z.coerce.number().nullable().optional(),
    pricePerHa: z.coerce.number().min(0, "O preço deve ser positivo"),
    scheduledDate: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    status: z.enum(["NEW", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "BILLED", "CANCELLED"]).optional(),
    pilotId: z.string().optional(),
    assistantId: z.string().optional(),
})

interface OSValues {
    clientId: string
    serviceType: "PULVERIZATION" | "DISPERSION"
    areaSize: number
    pricePerHa: number
    applicationRate?: number | null
    scheduledDate?: string | null
    description?: string | null
    location?: string | null
    status?: "NEW" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "BILLED" | "CANCELLED"
    pilotId?: string | null
    assistantId?: string | null
}

interface OSFormProps {
    initialData?: any
    onSuccess: () => void
    onCancel: () => void
}

export function OSForm({ initialData, onSuccess, onCancel }: OSFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [openClientPopover, setOpenClientPopover] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [employees, setEmployees] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const [clientsData, employeesData] = await Promise.all([
                getClients(),
                getEmployees()
            ])
            setClients(clientsData)
            setEmployees(employeesData)
        }
        fetchData()
    }, [])

    const form = useForm<OSValues>({
        resolver: zodResolver(osSchema) as any,
        defaultValues: {
            clientId: initialData?.clientId || "",
            serviceType: initialData?.serviceType || "PULVERIZATION",
            areaSize: Number(initialData?.areaSize || 0),
            pricePerHa: Number(initialData?.pricePerHa || 0),
            applicationRate: initialData?.applicationRate ? Number(initialData.applicationRate) : null,
            description: initialData?.description || "",
            location: initialData?.location || "",
            scheduledDate: initialData?.scheduledDate
                ? new Date(initialData.scheduledDate).toISOString().split('T')[0] // Use UTC date part
                : "",
            status: initialData?.status || "NEW",
            pilotId: initialData?.pilotId || "",
            assistantId: initialData?.assistantId || "",
        },
    })

    const pilots = employees.filter(e => e.position === "Piloto" || e.position === "Gerente")
    const assistants = employees.filter(e => e.position === "Badeco" || e.position === "Auxiliar" || e.position === "Operador")

    // Watch for price/area changes to show total
    const area = form.watch("areaSize")
    const price = form.watch("pricePerHa")
    const totalEstimated = (Number(area) || 0) * (Number(price) || 0)

    async function onSubmit(values: OSValues) {
        setIsLoading(true)
        try {
            let result
            const formattedData = {
                ...values,
                // Create date at UTC midnight to avoid timezone shifts
                scheduledDate: values.scheduledDate ? new Date(values.scheduledDate) : null,
            }

            if (initialData?.id) {
                result = await updateServiceOrder(initialData.id, formattedData as any)
            } else {
                result = await createServiceOrder(formattedData as any)
            }

            if (result.success) {
                onSuccess()
            } else {
                console.error(result.error)
            }
        } catch (error) {
            console.error("Error submitting OS:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="flex flex-col max-h-[70vh]">
                <div className="flex-1 overflow-y-auto px-1 pr-6 space-y-4 py-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="clientId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Cliente</FormLabel>
                                    <Popover open={openClientPopover} onOpenChange={setOpenClientPopover}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openClientPopover}
                                                    className={cn(
                                                        "w-full justify-between font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? clients.find(
                                                            (client) => client.id === field.value
                                                        )?.name
                                                        : "Selecione o cliente"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Pesquisar cliente..." />
                                                <CommandList>
                                                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                                                    <CommandGroup>
                                                        {clients.map((client) => (
                                                            <CommandItem
                                                                value={client.name}
                                                                key={client.id}
                                                                onSelect={() => {
                                                                    field.onChange(client.id)
                                                                    setOpenClientPopover(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        client.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {client.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serviceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Serviço</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tipo de serviço" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PULVERIZATION">Pulverização</SelectItem>
                                            <SelectItem value="DISPERSION">Dispersão (Sólidos)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="areaSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tamanho da Área (Hectares)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="Ex: 50.5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pricePerHa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço por Hectare (R$)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="Ex: 180.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="applicationRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Taxa de Aplicação (L/ha ou Kg/ha)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="Ex: 10.0"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormDescription>Volume/Peso total por hectare.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data Agendada (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {initialData?.id && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status da OS</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="NEW">Nova</SelectItem>
                                                <SelectItem value="SCHEDULED">Agendada</SelectItem>
                                                <SelectItem value="IN_PROGRESS">Em Execução</SelectItem>
                                                <SelectItem value="COMPLETED">Concluída</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="pilotId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Piloto (Responsável)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o piloto" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {pilots.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id}>
                                                    {employee.user?.name || "Sem Nome"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="assistantId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Auxiliar / Badeco <span className="text-xs text-muted-foreground">(Opcional)</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o auxiliar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {assistants.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id}>
                                                    {employee.user?.name || "Sem Nome"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Localização / Fazenda</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nome da fazenda ou coordenadas"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instruções Adicionais</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Detalhes sobre o produto, obstáculos ou condições..."
                                        className="resize-none"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between border border-slate-200 mt-2 mx-1">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Calculator className="w-5 h-5 text-primary" />
                        <span className="font-medium">Total Estimado do Serviço:</span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                        {totalEstimated.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-4 bg-white">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData?.id ? "Salvar Alterações" : "Criar Ordem de Serviço"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
