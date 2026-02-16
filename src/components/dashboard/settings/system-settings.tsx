"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Moon, Sun, Monitor } from "lucide-react"

import { updateCompanySettings } from "@/app/actions/settings"
import { toast } from "sonner"

interface SystemSettingsProps {
    initialSettings?: {
        companyName: string
        cnpj: string
        theme: string
    } | null
}

export function SystemSettings({ initialSettings }: SystemSettingsProps) {
    const { theme, setTheme } = useTheme()
    const [companyName, setCompanyName] = useState(initialSettings?.companyName || "Aerotech Drone Brasil")
    const [cnpj, setCnpj] = useState(initialSettings?.cnpj || "00.000.000/0001-00")
    const [isSaving, setIsSaving] = useState(false)

    // Effect to force mount on client to avoid hydration mismatch with themes
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="p-4">Carregando configurações...</div>
    }

    const handleSaveCompany = async () => {
        setIsSaving(true)
        try {
            const result = await updateCompanySettings({
                companyName,
                cnpj,
                theme: theme || 'system'
            })

            if (result.success) {
                toast.success("Dados da empresa salvos com sucesso")
            } else {
                toast.error(result.error || "Erro ao salvar dados")
            }
        } catch (error) {
            toast.error("Ocorreu um erro ao salvar os dados")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-heading font-semibold text-lg text-slate-800">Tema da Interface</h4>
                    <p className="text-sm text-slate-500">Escolha como o sistema deve ser exibido.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-lg">
                    <button
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light'
                            ? 'border-indigo-600 bg-indigo-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100">
                            <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'light' ? 'text-indigo-700' : 'text-slate-600'}`}>Claro</span>
                    </button>

                    <button
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark'
                            ? 'border-indigo-600 bg-slate-900'
                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        <div className="p-2 bg-slate-800 rounded-full shadow-sm border border-slate-700">
                            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>Escuro</span>
                    </button>

                    <button
                        onClick={() => setTheme("system")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system'
                            ? 'border-indigo-600 bg-indigo-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100">
                            <Monitor className={`w-5 h-5 ${theme === 'system' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'system' ? 'text-indigo-700' : 'text-slate-600'}`}>Sistema</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-heading font-semibold text-lg text-slate-800">Dados da Empresa</h4>
                    <p className="text-sm text-slate-500">Informações utilizadas em relatórios e impressões.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Nome da Empresa</Label>
                        <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                            id="cnpj"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-start">
                    <Button onClick={handleSaveCompany} disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Dados da Empresa"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
