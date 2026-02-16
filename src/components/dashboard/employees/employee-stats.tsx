"use client"

import { Users, UserCheck, Briefcase, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface EmployeeStatsProps {
    employees: any[]
}

export function EmployeeStats({ employees }: EmployeeStatsProps) {
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        pilots: 0,
        badecos: 0
    })

    useEffect(() => {
        const active = employees.filter(e => e.active).length
        const pilots = employees.filter(e => e.position.toLowerCase().includes("piloto")).length
        const badecos = employees.filter(e =>
            e.position.toLowerCase().includes("badeco") ||
            e.position.toLowerCase().includes("auxiliar")
        ).length

        setStats({
            total: employees.length,
            active,
            pilots,
            badecos
        })
    }, [employees])

    const statCards = [
        {
            label: "Total de Funcionários",
            value: stats.total,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Funcionários Ativos",
            value: stats.active,
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Pilotos",
            value: stats.pilots,
            icon: Briefcase,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            label: "Badecos / Auxiliares",
            value: stats.badecos,
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-50"
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
