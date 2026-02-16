"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createEmployee, updateEmployee } from "@/app/actions/employees"

const employeeSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: z.string().optional().or(z.literal("")),
    position: z.string().min(1, "Cargo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().optional().or(z.literal("")),
    active: z.boolean().default(true),
    remunerationType: z.string().default("PER_HECTARE"),
    baseSalary: z.coerce.number().optional().nullable(),
    commissionRate: z.coerce.number().optional().nullable(),
})

type EmployeeValues = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
    initialData?: any
    onSuccess: () => void
    onCancel: () => void
}

export function EmployeeForm({ initialData, onSuccess, onCancel }: EmployeeFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<EmployeeValues>({
        resolver: zodResolver(employeeSchema) as any,
        defaultValues: {
            name: initialData?.user?.name || initialData?.name || "",
            cpf: initialData?.cpf || "",
            position: initialData?.position || "",
            email: initialData?.user?.email || "",
            password: "",
            active: initialData?.active ?? true,
            remunerationType: initialData?.remunerationType || "PER_HECTARE",
            baseSalary: initialData?.baseSalary || 0,
            commissionRate: initialData?.commissionRate || 0,
        },
    })

    // Lógica de preenchimento automático das taxas por hectare
    const watchedPosition = form.watch("position")
    useEffect(() => {
        if (!initialData) { // Só preenche automático se for novo
            if (watchedPosition === "Piloto") {
                form.setValue("commissionRate", 10)
            } else if (watchedPosition === "Badeco" || watchedPosition === "Auxiliar") {
                form.setValue("commissionRate", 5)
            }
        }
    }, [watchedPosition, form, initialData])

    async function onSubmit(values: EmployeeValues) {
        setIsLoading(true)
        try {
            let result
            if (initialData?.id) {
                result = await updateEmployee(initialData.id, values)
            } else {
                if (!values.password || values.password.length < 6) {
                    form.setError("password", { message: "Senha é obrigatória para novos funcionários (mín. 6 caracteres)" })
                    setIsLoading(false)
                    return
                }
                result = await createEmployee(values)
            }

            if (result.success) {
                toast.success(initialData ? "Funcionário atualizado!" : "Funcionário cadastrado!")
                onSuccess()
            } else {
                toast.error(result.error || "Erro ao salvar funcionário")
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            toast.error("Ocorreu um erro inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do funcionário" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input placeholder="000.000.000-00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cargo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o cargo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Piloto">Piloto</SelectItem>
                                        <SelectItem value="Badeco">Badeco / Auxiliar</SelectItem>
                                        <SelectItem value="Gerente">Gerente</SelectItem>
                                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-slate-50/50">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Funcionário Ativo</FormLabel>
                                    <FormDescription className="text-xs">
                                        Pode ser vinculado a novas Ordens de Serviço.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="md:col-span-2 border-t border-slate-100 my-2 pt-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Credenciais de Acesso (Login)
                        </h4>
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail de Login</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@empresa.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{initialData ? "Nova Senha (opcional)" : "Senha Inicial"}</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder={initialData ? "Deixe em branco para manter" : "Mínimo 6 caracteres"}
                                            type={showPassword ? "text" : "password"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="md:col-span-2 border-t border-slate-100 my-2 pt-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Configurações de Remuneração
                        </h4>
                    </div>

                    <FormField
                        control={form.control}
                        name="commissionRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor por Hectare (R$)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Ex: 10.00"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormDescription className="text-[10px]">
                                    Remuneração paga por hectare voado/trabalhado.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="baseSalary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Salário Base (R$) - Opcional</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormDescription className="text-[10px]">
                                    Valor fixo adicional mensal, se houver.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white min-w-[140px]" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Salvar Alterações" : "Cadastrar Funcionário"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
