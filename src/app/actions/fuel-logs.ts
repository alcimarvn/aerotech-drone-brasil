"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { uploadFile } from "@/lib/upload"

export async function getFuelLogs() {
    try {
        return await db.fuellog.findMany({
            include: {
                asset: true
            },
            orderBy: { date: "desc" }
        })
    } catch (error) {
        console.error("Error fetching fuel logs:", error)
        return []
    }
}

export async function createFuelLog(formData: FormData) {
    console.log("Server Action createFuelLog called");
    try {
        const assetId = formData.get("assetId") as string
        const liters = parseFloat(formData.get("liters") as string)
        const cost = parseFloat(formData.get("cost") as string)
        const date = new Date(formData.get("date") as string)
        const odometer = formData.get("odometer") ? parseFloat(formData.get("odometer") as string) : null
        const paymentCondition = formData.get("paymentCondition") as "CASH" | "LATER"
        const paymentMethod = formData.get("paymentMethod") as string || "PIX"
        const receiptFile = formData.get("receipt") as File | null

        if (!assetId || !liters || !cost || !date) {
            return { success: false, error: "Dados inválidos" }
        }

        let receiptUrl = null
        if (receiptFile && receiptFile.size > 0) {
            receiptUrl = await uploadFile(receiptFile)
        }

        // 1. Create Fuel Log
        const fuelLog = await db.fuellog.create({
            data: {
                id: crypto.randomUUID(),
                assetId,
                liters,
                cost,
                date,
                odometer,
                receiptUrl
            },
            include: {
                asset: true
            }
        })

        // 2. Financial Automation
        await createFuelFinancials(fuelLog, paymentCondition, paymentMethod)

        revalidatePath("/dashboard/fuel-logs")
        revalidatePath(`/dashboard/assets/${assetId}`)
        revalidatePath("/dashboard/financial")
        return { success: true, data: fuelLog }
    } catch (error: any) {
        console.error("Error creating fuel log:", error)
        return { success: false, error: error.message || "Erro ao criar log de combustível" }
    }
}

async function createFuelFinancials(fuelLog: any, condition: "CASH" | "LATER", method: string) {
    try {
        // 1. Get/Create Category
        let fuelCategory = await db.expensecategory.findUnique({
            where: { name: "Combustível" }
        })

        if (!fuelCategory) {
            fuelCategory = await db.expensecategory.create({
                data: {
                    id: crypto.randomUUID(),
                    name: "Combustível",
                    description: "Gastos com gasolina, diesel e outros combustíveis"
                }
            })
        }

        const expenseId = crypto.randomUUID()
        const isPaid = condition === "CASH"

        // 2. Create Expense
        await db.expense.create({
            data: {
                id: expenseId,
                description: `Abastecimento: ${fuelLog.asset.name} (${fuelLog.liters}L)`,
                amount: fuelLog.cost,
                date: fuelLog.date, // Date of the expense
                categoryId: fuelCategory.id,
                status: isPaid ? "PAID" : "PENDING",
                dueDate: isPaid ? null : fuelLog.date, // If later, due today? Or maybe we should ask user. Defaulting to same date for now.
                receiptUrl: fuelLog.receiptUrl,
                fuelLogId: fuelLog.id
            }
        })

        // 3. If Cash, Create Payment
        if (isPaid) {
            await db.payment.create({
                data: {
                    id: crypto.randomUUID(),
                    amount: fuelLog.cost,
                    date: fuelLog.date,
                    method: method,
                    type: "EXPENSE",
                    reference: `Abastecimento: ${fuelLog.asset.name}`,
                    expenseId: expenseId,
                    receiptUrl: fuelLog.receiptUrl
                }
            })
        }

    } catch (error) {
        console.error("Error creating fuel financials:", error)
    }
}

export async function deleteFuelLog(id: string) {
    try {
        /* 
           Idealmente deveríamos deletar a despesa vinculada também.
           Mas como não salvamos a expenseId no fuelLog (apenas o contrário se quiséssemos), 
           teríamos que buscar por descrição/data.
           Por simplificação, deixaremos a despesa orfã ou deletamos manualmente.
           Para melhorar, adicionaríamos fuelLogId na tabela expense.
        */
        await db.fuellog.delete({ where: { id } })
        revalidatePath("/dashboard/fuel-logs")
        return { success: true }
    } catch (error) {
        console.error("Error deleting fuel log:", error)
        return { success: false, error: "Erro ao excluir registro" }
    }
}
