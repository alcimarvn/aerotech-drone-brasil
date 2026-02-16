"use server"

import { db } from "@/lib/db"
import { asset, asset_type, Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getAssets() {
    try {
        const assets = await db.asset.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { maintenance: true }
                }
            }
        })
        return assets
    } catch (error) {
        console.error("Error fetching assets:", error)
        return []
    }
}

export async function getAssetById(id: string) {
    try {
        const asset = await db.asset.findUnique({
            where: { id },
            include: {
                maintenance: {
                    orderBy: { date: "desc" },
                    take: 5
                },
                fuellog: {
                    orderBy: { date: "desc" },
                    take: 5
                },
                assetimage: true,
                assetdocument: true
            }
        })
        return asset
    } catch (error) {
        console.error("Error fetching asset:", error)
        return null
    }
}

export async function createAsset(data: {
    name: string
    type: asset_type
    model?: string
    serialNumber?: string
    purchaseDate?: Date
    purchasePrice?: number
    status: string
    imageUrl?: string
    notes?: string
}) {
    try {
        const asset = await db.asset.create({
            data: {
                id: crypto.randomUUID(),
                name: data.name,
                type: data.type,
                model: data.model,
                serialNumber: data.serialNumber || null,
                purchaseDate: data.purchaseDate || null,
                purchasePrice: data.purchasePrice || null,
                status: data.status,
                imageUrl: data.imageUrl || null,
                notes: data.notes || null
            }
        })
        revalidatePath("/dashboard/assets")
        return { success: true, data: asset }
    } catch (error) {
        console.error("Error creating asset:", error)
        return { success: false, error: "Erro ao criar equipamento" }
    }
}

export async function updateAsset(id: string, data: {
    name?: string
    type?: asset_type
    model?: string
    serialNumber?: string
    purchaseDate?: Date
    purchasePrice?: number
    status?: string
    imageUrl?: string
    notes?: string
    images?: { url: string; caption?: string }[]
    documents?: { name: string; url: string; type: string }[]
}) {
    try {
        const asset = await db.asset.update({
            where: { id },
            data: {
                name: data.name,
                type: data.type,
                model: data.model,
                serialNumber: data.serialNumber || null,
                purchaseDate: data.purchaseDate || null,
                purchasePrice: data.purchasePrice || null,
                status: data.status,
                imageUrl: data.imageUrl || null,
                notes: data.notes || null,
                assetimage: data.images ? {
                    createMany: {
                        data: data.images.map(img => ({ ...img, id: crypto.randomUUID() }))
                    }
                } : undefined,
                assetdocument: data.documents ? {
                    createMany: {
                        data: data.documents.map(doc => ({ ...doc, id: crypto.randomUUID() }))
                    }
                } : undefined
            }
        })
        revalidatePath("/dashboard/assets")
        revalidatePath(`/dashboard/assets/${id}`)
        return { success: true, data: asset }
    } catch (error) {
        console.error("Error updating asset:", error)
        return { success: false, error: "Erro ao atualizar equipamento" }
    }
}

export async function deleteAssetImage(id: string, assetId: string) {
    try {
        await db.assetimage.delete({ where: { id } })
        revalidatePath(`/dashboard/assets/${assetId}`)
        return { success: true }
    } catch (error) {
        console.error("Error deleting asset image:", error)
        return { success: false, error: "Erro ao remover imagem" }
    }
}

export async function deleteAssetDocument(id: string, assetId: string) {
    try {
        await db.assetdocument.delete({ where: { id } })
        revalidatePath(`/dashboard/assets/${assetId}`)
        return { success: true }
    } catch (error) {
        console.error("Error deleting asset document:", error)
        return { success: false, error: "Erro ao remover documento" }
    }
}

export async function deleteAsset(id: string) {
    try {
        await db.asset.delete({ where: { id } })
        revalidatePath("/dashboard/assets")
        return { success: true }
    } catch (error) {
        console.error("Error deleting asset:", error)
        return { success: false, error: "Erro ao excluir equipamento" }
    }
}

async function calculateNextDueDate(
    assetId: string,
    baseDate: Date,
    frequencies: { days?: number, km?: number, hours?: number }
): Promise<Date | null> {
    let nextDueDates: Date[] = []

    // 1. Prediction by Days (Simplest)
    if (frequencies.days) {
        const dateByDays = new Date(baseDate)
        dateByDays.setDate(dateByDays.getDate() + frequencies.days)
        nextDueDates.push(dateByDays)
    }

    // 2. Prediction by KM
    if (frequencies.km) {
        // Fetch recent usage history (FuelLogs and Maintenance)
        const [recentFuelLogs, recentMaintenances] = await Promise.all([
            db.fuellog.findMany({
                where: { assetId, odometer: { not: null } },
                orderBy: { date: 'desc' },
                take: 5,
                select: { date: true, odometer: true }
            }),
            db.maintenance.findMany({
                where: { assetId, currentOdometer: { not: null } },
                orderBy: { date: 'desc' },
                take: 5,
                select: { date: true, currentOdometer: true }
            })
        ])

        // Combine and sort
        const usagePoints = [
            ...recentFuelLogs.map(l => ({ date: new Date(l.date), value: l.odometer! })),
            ...recentMaintenances.map(m => ({ date: new Date(m.date), value: m.currentOdometer! }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime()) as { date: Date, value: number }[]

        if (usagePoints.length >= 2) {
            const newest = usagePoints[0]
            const oldest = usagePoints[usagePoints.length - 1]

            const daysDiff = (newest.date.getTime() - oldest.date.getTime()) / (1000 * 60 * 60 * 24)
            const valDiff = newest.value - oldest.value

            if (daysDiff > 0 && valDiff > 0) {
                const avgKmPerDay = valDiff / daysDiff
                const daysToNext = frequencies.km / avgKmPerDay
                const dateByKm = new Date(baseDate)
                dateByKm.setDate(dateByKm.getDate() + Math.floor(daysToNext))
                nextDueDates.push(dateByKm)
            }
        }
    }

    // 3. Prediction by Hours
    if (frequencies.hours) {
        const recentMaintenances = await db.maintenance.findMany({
            where: { assetId, currentHours: { not: null } },
            orderBy: { date: 'desc' },
            take: 10,
            select: { date: true, currentHours: true }
        })

        if (recentMaintenances.length >= 2) {
            const newest = recentMaintenances[0]
            const oldest = recentMaintenances[recentMaintenances.length - 1]

            const daysDiff = (new Date(newest.date).getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24)
            const valDiff = newest.currentHours! - oldest.currentHours!

            if (daysDiff > 0 && valDiff > 0) {
                const avgHoursPerDay = valDiff / daysDiff
                const daysToNext = frequencies.hours / avgHoursPerDay
                const dateByHours = new Date(baseDate)
                dateByHours.setDate(dateByHours.getDate() + Math.floor(daysToNext))
                nextDueDates.push(dateByHours)
            }
        }
    }

    if (nextDueDates.length === 0) return null

    // Return the earliest date
    return new Date(Math.min(...nextDueDates.map(d => d.getTime())))
}

export async function createMaintenance(data: {
    assetId: string
    type: "PREVENTIVE" | "CORRECTIVE" | "PREDICTIVE"
    status: "SCHEDULED" | "COMPLETED" | "CANCELED"
    description: string
    cost: number
    date: Date
    completionDate?: Date
    currentOdometer?: number
    currentHours?: number
    frequencyKm?: number
    frequencyHours?: number
    frequencyDays?: number
}) {
    console.log("createMaintenance - Server Action Triggered - Payload:", data)
    try {
        const id = crypto.randomUUID()
        let nextDue = null

        // Se for preventiva e tiver frequência configurada, calcular próxima
        // Se for preventiva e tiver frequência configurada, calcular próxima
        if (data.type === "PREVENTIVE" && (data.frequencyDays || data.frequencyKm || data.frequencyHours)) {
            const baseDate = data.completionDate || data.date

            // Calculate next due date using provided frequencies and usage history
            try {
                const calculatedDate = await calculateNextDueDate(data.assetId, new Date(baseDate), {
                    days: data.frequencyDays,
                    km: data.frequencyKm,
                    hours: data.frequencyHours
                })

                if (calculatedDate) {
                    nextDue = calculatedDate
                }
            } catch (err) {
                console.error("Error calculating next due date:", err)
                // Fallback to simple days additions if calculation fails
                if (data.frequencyDays) {
                    const fallbackDate = new Date(baseDate)
                    fallbackDate.setDate(fallbackDate.getDate() + data.frequencyDays)
                    nextDue = fallbackDate
                }
            }
        }

        const maintenance = await db.maintenance.create({
            data: {
                id: id,
                assetId: data.assetId,
                type: data.type,
                status: data.status,
                description: data.description,
                cost: data.cost,
                date: data.date,
                completionDate: data.completionDate || (data.status === "COMPLETED" ? new Date() : null),
                currentOdometer: data.currentOdometer,
                currentHours: data.currentHours,
                frequencyKm: data.frequencyKm,
                frequencyHours: data.frequencyHours,
                frequencyDays: data.frequencyDays,
                nextDue: nextDue
            }
        })

        // RECURRENCE LOGIC: If Preventive and Completed, and NextDue is set, create the next Scheduled maintenance
        if (data.type === "PREVENTIVE" && data.status === "COMPLETED" && nextDue) {
            await db.maintenance.create({
                data: {
                    id: crypto.randomUUID(),
                    assetId: data.assetId,
                    type: "PREVENTIVE",
                    status: "SCHEDULED",
                    description: data.description + " (Agendada)",
                    cost: 0,
                    date: nextDue,
                    frequencyKm: data.frequencyKm,
                    frequencyHours: data.frequencyHours,
                    frequencyDays: data.frequencyDays
                }
            })
        }

        revalidatePath(`/dashboard/assets/${data.assetId}`)
        return { success: true, data: maintenance }
    } catch (error) {
        console.error("Error creating maintenance:", error)
        return { success: false, error: "Erro ao registrar manutenção" }
    }
}

export async function updateMaintenance(id: string, assetId: string, data: {
    type?: "PREVENTIVE" | "CORRECTIVE" | "PREDICTIVE"
    status?: "SCHEDULED" | "COMPLETED" | "CANCELED"
    description?: string
    cost?: number
    date?: Date
    completionDate?: Date
    currentOdometer?: number
    currentHours?: number
    nextDue?: Date
}) {
    try {
        // Fetch current maintenance to check status change
        const currentMaintenance = await db.maintenance.findUnique({ where: { id } })

        const maintenance = await db.maintenance.update({
            where: { id },
            data: {
                type: data.type,
                status: data.status,
                description: data.description,
                cost: data.cost,
                date: data.date,
                completionDate: data.completionDate || (data.status === "COMPLETED" && currentMaintenance?.status !== "COMPLETED" ? new Date() : undefined),
                currentOdometer: data.currentOdometer,
                currentHours: data.currentHours,
                nextDue: data.nextDue
            }
        })

        // RECURRENCE: If changing to COMPLETED, and it's Preventive
        if (maintenance.type === "PREVENTIVE" && maintenance.status === "COMPLETED" && currentMaintenance?.status !== "COMPLETED") {
            // Check if we need to schedule next
            const nextDueDate = maintenance.nextDue

            if (nextDueDate) {
                await db.maintenance.create({
                    data: {
                        id: crypto.randomUUID(),
                        assetId: maintenance.assetId,
                        type: "PREVENTIVE",
                        status: "SCHEDULED",
                        description: maintenance.description + " (Agendada)",
                        cost: 0,
                        date: nextDueDate,
                        frequencyKm: maintenance.frequencyKm,
                        frequencyHours: maintenance.frequencyHours,
                        frequencyDays: maintenance.frequencyDays
                    }
                })
            }
        }

        revalidatePath(`/dashboard/assets/${assetId}`)
        return { success: true, data: maintenance }
    } catch (error) {
        console.error("Error updating maintenance:", error)
        return { success: false, error: "Erro ao atualizar manutenção" }
    }
}

export async function deleteMaintenance(id: string, assetId: string) {
    try {
        await db.maintenance.delete({
            where: { id }
        })
        revalidatePath(`/dashboard/assets/${assetId}`)
        return { success: true }
    } catch (error) {
        console.error("Error deleting maintenance:", error)
        return { success: false, error: "Erro ao excluir manutenção" }
    }
}
