"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { createClient, updateClient } from "@/app/actions/clients"

const clientSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    document: z.string().optional(),
    contactPerson: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    notes: z.string().optional(),
})

type ClientValues = z.infer<typeof clientSchema>

interface ClientFormProps {
    initialData?: any
    onSuccess: () => void
    onCancel: () => void
}

export function ClientForm({ initialData, onSuccess, onCancel }: ClientFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ClientValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: initialData?.name || "",
            document: initialData?.document || "",
            contactPerson: initialData?.contactPerson || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            state: initialData?.state || "",
            notes: initialData?.notes || "",
        },
    })

    async function onSubmit(values: ClientValues) {
        setIsLoading(true)
        try {
            let result
            if (initialData?.id) {
                result = await updateClient(initialData.id, values)
            } else {
                result = await createClient(values)
            }

            if (result.success) {
                onSuccess()
            } else {
                // Handle error (could use a toast)
                console.error(result.error)
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome/Razão Social</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="document"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF/CNPJ</FormLabel>
                                <FormControl>
                                    <Input placeholder="000.000.000-00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pessoa de Contato</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do contato" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="(00) 00000-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cidade" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Input placeholder="UF" maxLength={2} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Endereço Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Rua, número, bairro..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Informações adicionais sobre o cliente..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Atualizar Cliente" : "Salvar Cliente"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
