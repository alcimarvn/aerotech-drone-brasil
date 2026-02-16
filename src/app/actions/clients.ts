"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const clientSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    document: z.string().optional(),
    contactPerson: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    notes: z.string().optional(),
})

export async function getClients() {
    try {
        return await db.client.findMany({
            orderBy: { name: "asc" },
        })
    } catch (error) {
        console.error("Failed to fetch clients:", error)
        return []
    }
}

export async function createClient(data: z.infer<typeof clientSchema>) {
    try {
        const validated = clientSchema.parse(data)

        // Limpar campos opcionais: converter "" para null
        const cleanData = {
            ...validated,
            document: validated.document || null,
            email: validated.email || null,
            contactPerson: validated.contactPerson || null,
            phone: validated.phone || null,
            address: validated.address || null,
            city: validated.city || null,
            state: validated.state || null,
            notes: validated.notes || null,
        }

        const client = await db.client.create({
            data: {
                ...cleanData,
                id: crypto.randomUUID(),
                updatedAt: new Date()
            },
        })
        revalidatePath("/dashboard/clients")
        return { success: true, data: client }
    } catch (error: any) {
        console.error("Failed to create client:", error)
        return { success: false, error: error?.message || "Erro ao criar cliente" }
    }
}

export async function updateClient(id: string, data: z.infer<typeof clientSchema>) {
    try {
        const validated = clientSchema.parse(data)

        const cleanData = {
            ...validated,
            document: validated.document || null,
            email: validated.email || null,
            contactPerson: validated.contactPerson || null,
            phone: validated.phone || null,
            address: validated.address || null,
            city: validated.city || null,
            state: validated.state || null,
            notes: validated.notes || null,
        }

        const client = await db.client.update({
            where: { id },
            data: {
                ...cleanData,
                updatedAt: new Date()
            },
        })
        revalidatePath("/dashboard/clients")
        return { success: true, data: client }
    } catch (error: any) {
        console.error("Failed to update client:", error)
        return { success: false, error: error?.message || "Erro ao atualizar cliente" }
    }
}

export async function deleteClient(id: string) {
    try {
        await db.client.delete({
            where: { id },
        })
        revalidatePath("/dashboard/clients")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete client:", error)
        return { success: false, error: "Erro ao excluir cliente" }
    }
}

export async function getClientById(id: string) {
    try {
        const client = await db.client.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { serviceorder: true }
                },
                serviceorder: {
                    include: {
                        invoice: {
                            include: { payment: true }
                        }
                    },
                    orderBy: { createdAt: "desc" },
                    take: 50
                }
            }
        })
        return client
    } catch (error) {
        console.error("Failed to fetch client details:", error)
        return null
    }
}
