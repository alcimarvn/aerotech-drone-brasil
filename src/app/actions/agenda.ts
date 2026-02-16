"use server"

import { db } from "@/lib/db"
import { startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, startOfDay, endOfDay } from "date-fns"

export async function getUpcomingAgenda() {
    try {
        const startDate = startOfDay(new Date())
        const endDate = endOfDay(addDays(new Date(), 7))

        const serviceOrders = await db.serviceorder.findMany({
            where: {
                OR: [
                    { scheduledDate: { gte: startDate, lte: endDate } },
                    { startDate: { gte: startDate, lte: endDate } }
                ],
                status: {
                    not: "CANCELLED"
                }
            },
            include: {
                client: {
                    select: { name: true }
                },
                trip: true
            },
            orderBy: {
                scheduledDate: "asc"
            },
            take: 10
        })

        return serviceOrders.map(os => ({
            id: os.id,
            clientName: os.client.name,
            date: os.scheduledDate || os.startDate,
            status: os.status,
            city: os.location?.split(",")[0] || "Local não informado", // Simplistic location parsing
            serviceType: os.serviceType
        }))

    } catch (error) {
        console.error("Error fetching upcoming agenda:", error)
        return []
    }
}

export async function getMonthlyAgenda(year: number, month: number) {
    try {
        const startDate = startOfMonth(new Date(year, month))
        const endDate = endOfMonth(new Date(year, month))

        const serviceOrders = await db.serviceorder.findMany({
            where: {
                OR: [
                    { scheduledDate: { gte: startDate, lte: endDate } },
                    { startDate: { gte: startDate, lte: endDate } },
                    // Include ongoing orders that span across this month
                    {
                        AND: [
                            { startDate: { lte: endDate } },
                            { endDate: { gte: startDate } }
                        ]
                    }
                ],
                status: {
                    not: "CANCELLED"
                }
            },
            include: {
                client: { select: { name: true } },
                employee_serviceorder_pilotIdToemployee: {
                    include: { user: { select: { name: true } } }
                }
            },
            orderBy: { scheduledDate: "asc" }
        })

        return serviceOrders.map(os => ({
            id: os.id,
            title: `${os.client.name} - ${os.serviceType === 'PULVERIZATION' ? 'Pulverização' : 'Dispersão'}`,
            start: os.scheduledDate || os.startDate,
            end: os.endDate || os.scheduledDate || os.startDate,
            status: os.status,
            pilot: os.employee_serviceorder_pilotIdToemployee?.user?.name,
            area: os.areaSize
        }))

    } catch (error) {
        console.error("Error fetching monthly agenda:", error)
        return []
    }
}

export async function getYearlyAgenda(year: number) {
    try {
        const startDate = startOfYear(new Date(year, 0))
        const endDate = endOfYear(new Date(year, 0))

        const serviceOrders = await db.serviceorder.findMany({
            where: {
                OR: [
                    { scheduledDate: { gte: startDate, lte: endDate } },
                    { startDate: { gte: startDate, lte: endDate } }
                ],
                status: {
                    not: "CANCELLED"
                }
            },
            select: {
                id: true,
                scheduledDate: true,
                startDate: true,
                status: true
            }
        })

        // Group by day for heat map or simple dot indicators
        const eventsByDay: Record<string, number> = {}

        serviceOrders.forEach(os => {
            const date = os.scheduledDate || os.startDate
            if (date) {
                const dateStr = date.toISOString().split('T')[0]
                eventsByDay[dateStr] = (eventsByDay[dateStr] || 0) + 1
            }
        })

        return eventsByDay

    } catch (error) {
        console.error("Error fetching yearly agenda:", error)
        return {}
    }
}
