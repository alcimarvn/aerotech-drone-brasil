"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    FileText,
    Box,
    DollarSign,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    HardHat,
    Fuel,
    Map,
    Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { signOut } from "next-auth/react"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Agenda", href: "/dashboard/agenda" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: FileText, label: "Ordens de Serviço", href: "/dashboard/service-orders" },
    { icon: HardHat, label: "Colaboradores", href: "/dashboard/employees" },
    { icon: Box, label: "Ativos & Drones", href: "/dashboard/assets" },
    { icon: DollarSign, label: "Financeiro", href: "/dashboard/financial" },
    { icon: Map, label: "Mapas de Voo", href: "/dashboard/maps" },
    { icon: Fuel, label: "Log de Combustível", href: "/dashboard/fuel-logs" },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 relative",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <span className="font-heading font-bold text-xl tracking-tight text-white">
                        AEROTECH<span className="text-primary">.</span>
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                    aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
                    title={isCollapsed ? "Expandir menu" : "Recolher menu"}
                >
                    {isCollapsed ? <Menu className="w-5 h-5" aria-hidden="true" /> : <ChevronLeft className="w-5 h-5" aria-hidden="true" />}
                </Button>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-primary")} aria-hidden="true" />
                            <span className={cn("font-medium", isCollapsed && "sr-only")}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mb-2",
                        pathname === "/dashboard/settings" && "bg-slate-800 text-white"
                    )}
                    title={isCollapsed ? "Configurações" : undefined}
                >
                    <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span className={cn("font-medium", isCollapsed && "sr-only")}>Configurações</span>
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title={isCollapsed ? "Sair" : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span className={cn("font-medium", isCollapsed && "sr-only")}>Sair</span>
                </button>
            </div>
        </aside>
    )
}
