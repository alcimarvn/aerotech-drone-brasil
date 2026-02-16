"use client"

import { Users, UserPlus, MapPin, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Client {
    id: string
    createdAt: Date
    city?: string | null
}

interface ClientStatsProps {
    clients: any[]
}

export function ClientStats({ clients }: ClientStatsProps) {
    const [stats, setStats] = useState({
        total: 0,
        newThisMonth: 0,
        mainCity: "---",
        activeCount: 0
    })

    useEffect(() => {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const newThisMonth = clients.filter(c => new Date(c.createdAt) >= firstDayOfMonth).length

        // Contagem de cidades para ver a principal
        const cities: Record<string, number> = {}
        clients.forEach(c => {
            if (c.city) {
                cities[c.city] = (cities[c.city] || 0) + 1
            }
        })

        let mainCity = "---"
        let maxCount = 0
        Object.entries(cities).forEach(([city, count]) => {
            if (count > maxCount) {
                maxCount = count
                mainCity = city
            }
        })

        setStats({
            total: clients.length,
            newThisMonth,
            mainCity,
            activeCount: clients.filter(c => (c._count?.serviceorder || 0) > 0).length
        })
    }, [clients])

    const statCards = [
        {
            label: "Total de Clientes",
            value: stats.total,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Novos (Este Mês)",
            value: stats.newThisMonth,
            icon: UserPlus,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Com Pedidos",
            value: stats.activeCount,
            icon: Activity,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            label: "Cidade Principal",
            value: stats.mainCity,
            icon: MapPin,
            color: "text-slate-600",
            bg: "bg-slate-50"
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 leading-none">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
