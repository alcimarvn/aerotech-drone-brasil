"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getMaintenances(assetId?: string) {
    try {
        const where = assetId ? { assetId } : {}
        const maintenances = await db.maintenance.findMany({
            where,
            orderBy: { date: "desc" },
            include: {
                asset: {
                    select: { name: true, type: true }
                }
            }
        })
        return maintenances
    } catch (error) {
        console.error("Error fetching maintenances:", error)
        return []
    }
}

export async function createMaintenance(data: {
    assetId: string
    description: string
    cost: number
    date: Date
    nextDue?: Date
}) {
    try {
        const maintenance = await db.maintenance.create({
            data: {
                id: crypto.randomUUID(),
                assetId: data.assetId,
                description: data.description,
                cost: data.cost,
                date: data.date,
                nextDue: data.nextDue || null
            }
        })

        // Optionally update asset status to MAINTENANCE if needed, 
        // but user might want to log past maintenance without changing status.
        // For now, we just create the log.

        revalidatePath("/dashboard/assets")
        revalidatePath(`/dashboard/assets/${data.assetId}`)
        return { success: true, data: maintenance }
    } catch (error) {
        console.error("Error creating maintenance:", error)
        return { success: false, error: "Erro ao registrar manutenção" }
    }
}

export async function updateMaintenance(id: string, data: {
    description?: string
    cost?: number
    date?: Date
    nextDue?: Date
}) {
    try {
        const maintenance = await db.maintenance.update({
            where: { id },
            data: {
                description: data.description,
                cost: data.cost,
                date: data.date,
                nextDue: data.nextDue || null
            }
        })
        revalidatePath("/dashboard/assets")
        if (maintenance.assetId) {
            revalidatePath(`/dashboard/assets/${maintenance.assetId}`)
        }
        return { success: true, data: maintenance }
    } catch (error) {
        console.error("Error updating maintenance:", error)
        return { success: false, error: "Erro ao atualizar manutenção" }
    }
}

export async function deleteMaintenance(id: string) {
    try {
        // Get assetId before deleting for revalidation
        const maintenance = await db.maintenance.findUnique({ where: { id }, select: { assetId: true } })

        await db.maintenance.delete({
            where: { id }
        })

        revalidatePath("/dashboard/assets")
        if (maintenance?.assetId) {
            revalidatePath(`/dashboard/assets/${maintenance.assetId}`)
        }
        return { success: true }
    } catch (error) {
        console.error("Error deleting maintenance:", error)
        return { success: false, error: "Erro ao excluir manutenção" }
    }
}
