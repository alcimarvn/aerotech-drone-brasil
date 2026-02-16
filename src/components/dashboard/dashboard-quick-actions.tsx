import Link from "next/link"
import {
    Plus,
    FileText,
    Users,
    Map,
    Droplets
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardQuickActions() {
    const actions = [
        {
            label: "Nova Ordem de Serviço",
            href: "/dashboard/service-orders/new",
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50 hover:bg-blue-100",
            border: "border-blue-100"
        },
        {
            label: "Novo Cliente",
            href: "/dashboard/clients", // Idealmente abriria modal ou pág nova
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50 hover:bg-emerald-100",
            border: "border-emerald-100"
        },
        {
            label: "Mapa de Voo",
            href: "/dashboard/maps",
            icon: Map,
            color: "text-indigo-600",
            bg: "bg-indigo-50 hover:bg-indigo-100",
            border: "border-indigo-100"
        },
        {
            label: "Registrar Abastecimento",
            href: "/dashboard/fuel-logs",
            icon: Droplets,
            color: "text-amber-600",
            bg: "bg-amber-50 hover:bg-amber-100",
            border: "border-amber-100"
        }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action) => (
                <Link key={action.label} href={action.href} className="group">
                    <div className={`
                        h-full p-4 rounded-xl border transition-all duration-200
                        flex flex-col items-center justify-center gap-3 text-center
                        ${action.bg} ${action.border}
                        group-hover:shadow-md group-hover:-translate-y-0.5
                    `}>
                        <div className={`p-2 rounded-full bg-white shadow-sm ${action.color}`}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-sm text-slate-700 group-hover:text-slate-900">
                            {action.label}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    )
}
