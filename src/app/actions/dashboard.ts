"use server"

import { db } from "@/lib/db"
import { serviceorder_status } from "@prisma/client"
import { startOfMonth, endOfMonth, subMonths } from "date-fns"
import { getWeather } from "@/lib/weather"

export async function getDashboardStats() {
    try {
        const now = new Date()
        const currentMonthStart = startOfMonth(now)
        const currentMonthEnd = endOfMonth(now)
        const lastMonthStart = startOfMonth(subMonths(now, 1))
        const lastMonthEnd = endOfMonth(subMonths(now, 1))

        // 1. Clientes Ativos
        const clientCount = await db.client.count()
        const lastMonthClientCount = await db.client.count({
            where: { createdAt: { lt: currentMonthStart } }
        })
        const clientTrend = lastMonthClientCount > 0
            ? ((clientCount - lastMonthClientCount) / lastMonthClientCount) * 100
            : 0

        // 2. Ordens de Serviço (Total e Pendentes)
        const osCount = await db.serviceorder.count()
        const pendingOsCount = await db.serviceorder.count({
            where: { status: { in: [serviceorder_status.NEW, serviceorder_status.SCHEDULED, serviceorder_status.IN_PROGRESS] } }
        })

        // 3. Área Total Pulverizada (Hectares)
        const areaResult = await db.serviceorder.aggregate({
            _sum: { areaSize: true },
            where: { status: serviceorder_status.COMPLETED }
        })
        const totalArea = areaResult._sum.areaSize || 0

        // 4. Faturamento Mensal (Baseado em notas emitidas no mês atual)
        const revenueResult = await db.invoice.aggregate({
            _sum: { amount: true },
            where: {
                issuedDate: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd
                }
            }
        })
        const currentMonthRevenue = revenueResult._sum.amount || 0

        const lastMonthRevenueResult = await db.invoice.aggregate({
            _sum: { amount: true },
            where: {
                issuedDate: {
                    gte: lastMonthStart,
                    lte: lastMonthEnd
                }
            }
        })
        const lastMonthRevenue = lastMonthRevenueResult._sum.amount || 0
        const revenueTrend = lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0

        return {
            clientCount,
            clientTrend: clientTrend.toFixed(1),
            osCount,
            pendingOsCount,
            totalArea: totalArea.toFixed(1),
            currentMonthRevenue,
            revenueTrend: revenueTrend.toFixed(1)
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return null
    }
}

export async function getRecentActivities() {
    try {
        // Fetch different types of activities and combine them
        const [orders, fuel, maintenance, payments] = await Promise.all([
            db.serviceorder.findMany({
                take: 5,
                orderBy: { updatedAt: "desc" },
                include: { client: true }
            }),
            db.fuellog.findMany({
                take: 5,
                orderBy: { date: "desc" },
                include: { asset: true }
            }),
            db.maintenance.findMany({
                take: 5,
                orderBy: { date: "desc" },
                include: { asset: true }
            }),
            db.payment.findMany({
                take: 5,
                orderBy: { date: "desc" },
            })
        ])

        const activities = [
            ...orders.map(o => ({
                id: `os-${o.id}`,
                type: "OS",
                title: `OS #${o.id.slice(-6).toUpperCase()} ${statusLabel(o.status)}`,
                description: `${o.client.name} - ${o.areaSize} ha`,
                date: o.updatedAt,
                status: o.status
            })),
            ...fuel.map(f => ({
                id: `fuel-${f.id}`,
                type: "FUEL",
                title: `Abastecimento: ${f.asset.name}`,
                description: `${f.liters}L - R$ ${f.cost.toFixed(2)}`,
                date: f.date
            })),
            ...maintenance.map(m => ({
                id: `maint-${m.id}`,
                type: "MAINT",
                title: `Manutenção: ${m.asset.name}`,
                description: m.description,
                date: m.date
            })),
            ...payments.map(p => ({
                id: `pay-${p.id}`,
                type: "PAY",
                title: `Pagamento ${p.type === 'INCOME' ? 'Recebido' : 'Realizado'}`,
                description: `Valor: R$ ${p.amount.toFixed(2)} - ${p.method}`,
                date: p.date
            }))
        ]

        return activities
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
    } catch (error) {
        console.error("Error fetching recent activities:", error)
        return []
    }
}

function statusLabel(status: serviceorder_status) {
    const labels = {
        [serviceorder_status.NEW]: "Criada",
        [serviceorder_status.SCHEDULED]: "Agendada",
        [serviceorder_status.IN_PROGRESS]: "Em Execução",
        [serviceorder_status.COMPLETED]: "Concluída",
        [serviceorder_status.BILLED]: "Faturada",
        [serviceorder_status.CANCELLED]: "Cancelada",
    }
    return labels[status]
}

export async function getNextServiceOrderWeather() {
    try {
        // Find next scheduled service order from today onwards
        const nextOs = await db.serviceorder.findFirst({
            where: {
                status: serviceorder_status.SCHEDULED,
                scheduledDate: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)) // From start of today
                }
            },
            orderBy: {
                scheduledDate: 'asc'
            },
            select: {
                location: true,
                scheduledDate: true,
                client: {
                    select: {
                        city: true,
                        state: true
                    }
                }
            }
        })

        let location = "Zé Doca, MA" // Default fallback

        if (nextOs) {
            if (nextOs.location) {
                location = nextOs.location
            } else if (nextOs.client.city) {
                location = `${nextOs.client.city}, ${nextOs.client.state || ''}`
            }
        }

        const weatherData = await getWeather(location)
        return weatherData

    } catch (error) {
        console.error("Error fetching next OS weather:", error)
        return null
    }
}
