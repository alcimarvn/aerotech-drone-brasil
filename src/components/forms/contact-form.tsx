"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
    phone: z.string().min(10, "Telefone inválido."),
    email: z.string().email("E-mail inválido."),
    city: z.string().min(2, "Cidade é obrigatória."),
    serviceType: z.string().min(1, "Selecione um serviço."),
    areaSize: z.string().optional(),
    message: z.string().optional(),
})

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            city: "",
            serviceType: "",
            areaSize: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        // Format WhatsApp message
        const text = `Olá Aerotech! Gostaria de solicitar um orçamento.%0A%0A` +
            `*Nome:* ${values.name}%0A` +
            `*Telefone:* ${values.phone}%0A` +
            `*E-mail:* ${values.email}%0A` +
            `*Cidade:* ${values.city}%0A` +
            `*Serviço:* ${values.serviceType}%0A` +
            `*Área:* ${values.areaSize || "Não informada"} ha%0A` +
            `*Mensagem:* ${values.message || "Sem mensagem adicional."}`

        const whatsappUrl = `https://wa.me/559888281228?text=${text}`

        // Open WhatsApp
        window.open(whatsappUrl, '_blank')

        // Simulate a small delay for better UX before showing success
        await new Promise(resolve => setTimeout(resolve, 800))

        setIsSubmitting(false)
        setIsSuccess(true)
        form.reset()
    }

    if (isSuccess) {
        return (
            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Mensagem Enviada!</h3>
                <p>Recebemos sua solicitação. Em breve um de nossos especialistas entrará em contato.</p>
                <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
                    Enviar Nova Mensagem
                </Button>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu nome ou da fazenda" {...field} />
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
                                <FormLabel>WhatsApp / Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="(99) 99999-9999" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="seu@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade / Município</FormLabel>
                                <FormControl>
                                    <Input placeholder="Onde será o serviço?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Serviço</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="pulverizacao">Pulverização (Líquidos)</SelectItem>
                                        <SelectItem value="dispersao">Dispersão (Sólidos/Sementes)</SelectItem>
                                        <SelectItem value="mapeamento">Mapeamento Aéreo</SelectItem>
                                        <SelectItem value="outro">Outro / Dúvida</SelectItem>
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
                                <FormLabel>Área Estimada (Hectares)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 50" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mensagem (Opcional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Conte mais sobre sua necessidade (cultura, estágio, produtos...)"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" size="lg" className="w-full font-bold bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Solicitar Orçamento Gratuito"}
                </Button>
            </form>
        </Form>
    )
}
