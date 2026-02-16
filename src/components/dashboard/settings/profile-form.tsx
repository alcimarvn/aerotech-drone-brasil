"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { updateProfile, changePassword } from "@/app/actions/settings"
import { Loader2, User, Lock, Save } from "lucide-react"

const profileSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido")
})

const passwordSchema = z.object({
    current: z.string().min(1, "Senha atual é obrigatória"),
    new: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
    confirm: z.string().min(1, "Confirmação é obrigatória")
}).refine(data => data.new === data.confirm, {
    message: "Senhas não conferem",
    path: ["confirm"]
})

interface ProfileFormProps {
    user: {
        name: string | null
        email: string | null
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoadingProfile, setIsLoadingProfile] = useState(false)
    const [isLoadingPassword, setIsLoadingPassword] = useState(false)

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || ""
        }
    })

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current: "",
            new: "",
            confirm: ""
        }
    })

    async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
        setIsLoadingProfile(true)
        try {
            const result = await updateProfile(values)
            if (result.success) {
                toast.success("Perfil atualizado com sucesso!")
            } else {
                toast.error(result.error || "Erro ao atualizar perfil")
            }
        } catch (error) {
            toast.error("Erro inesperado")
        } finally {
            setIsLoadingProfile(false)
        }
    }

    async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
        setIsLoadingPassword(true)
        try {
            const result = await changePassword({
                current: values.current,
                new: values.new
            })
            if (result.success) {
                toast.success("Senha alterada com sucesso!")
                passwordForm.reset()
            } else {
                toast.error(result.error || "Erro ao alterar senha")
            }
        } catch (error) {
            toast.error("Erro inesperado")
        } finally {
            setIsLoadingPassword(false)
        }
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <User className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-lg">Informações Pessoais</h3>
                </div>

                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoadingProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {isLoadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                        </Button>
                    </form>
                </Form>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <Lock className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-lg">Segurança</h3>
                </div>

                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                            control={passwordForm.control}
                            name="current"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha Atual</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={passwordForm.control}
                            name="new"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nova Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={passwordForm.control}
                            name="confirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Nova Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant="outline" disabled={isLoadingPassword}>
                            {isLoadingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Alterar Senha
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
