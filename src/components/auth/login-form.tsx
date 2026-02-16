"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const loginSchema = z.object({
    email: z.string().email({ message: "Insira um e-mail válido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginValues) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (result?.error) {
                setError("E-mail ou senha incorretos. Tente novamente.")
                return
            }

            router.push("/dashboard")
            router.refresh()
        } catch (err) {
            setError("Ocorreu um erro inesperado. Tente novamente mais tarde.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-slate-200/60 shadow-2xl backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        {/* Simple logo placeholder icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-8 h-8"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="m2 12 10 5 10-5" />
                        </svg>
                    </div>
                </div>
                <CardTitle className="text-2xl text-center font-heading">Bem-vindo</CardTitle>
                <CardDescription className="text-center text-slate-500">
                    Acesse o painel administrativo da Aerotech
                </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="email"
                                placeholder="nome@exemplo.com"
                                className="pl-10"
                                autoComplete="email"
                                disabled={isLoading}
                                {...form.register("email")}
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <Button variant="link" size="sm" className="px-0 font-normal text-slate-500">
                                Esqueceu a senha?
                            </Button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="password"
                                type="password"
                                className="pl-10"
                                disabled={isLoading}
                                {...form.register("password")}
                            />
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Acessando...
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
