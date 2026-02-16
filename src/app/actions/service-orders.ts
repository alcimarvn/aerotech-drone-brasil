"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { serviceorder_status, serviceorder_serviceType } from "@prisma/client"

const serviceOrderSchema = z.object({
    clientId: z.string().min(1, "Selecione um cliente"),
    serviceType: z.nativeEnum(serviceorder_serviceType),
    areaSize: z.number().min(0.1, "A área deve ser maior que 0"),
    applicationRate: z.number().optional().nullable(),
    pricePerHa: z.number().min(0, "O preço deve ser positivo"),
    scheduledDate: z.date().optional().nullable(),
    description: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    status: z.nativeEnum(serviceorder_status).optional(),
    pilotId: z.string().optional().nullable(),
    assistantId: z.string().optional().nullable(),
})

export async function getServiceOrders() {
    try {
        const orders = await db.serviceorder.findMany({
            include: {
                client: {
                    select: { name: true, document: true, phone: true }
                },
                employee_serviceorder_pilotIdToemployee: {
                    include: { user: { select: { name: true } } }
                },
                employee_serviceorder_assistantIdToemployee: {
                    include: { user: { select: { name: true } } }
                },
                invoice: {
                    include: { payment: true }
                }
            },
            orderBy: { createdAt: "desc" },
        })

        // Map relation names back to UI expected names
        return orders.map(order => ({
            ...order,
            pilot: order.employee_serviceorder_pilotIdToemployee,
            assistant: order.employee_serviceorder_assistantIdToemployee,
            invoices: order.invoice
        }))
    } catch (error) {
        console.error("Failed to fetch service orders:", error)
        return []
    }
}

export async function getServiceOrderById(id: string) {
    try {
        const os = await db.serviceorder.findUnique({
            where: { id },
            include: {
                client: true,
                employee_serviceorder_pilotIdToemployee: {
                    include: { user: true }
                },
                employee_serviceorder_assistantIdToemployee: {
                    include: { user: true }
                },
                invoice: {
                    include: {
                        payment: {
                            orderBy: { date: 'desc' }
                        }
                    }
                }
            }
        })

        if (!os) return null

        // Map relation names back to UI expected names
        return {
            ...os,
            pilot: os.employee_serviceorder_pilotIdToemployee,
            assistant: os.employee_serviceorder_assistantIdToemployee,
            invoices: os.invoice
        }
    } catch (error) {
        console.error("Failed to fetch service order:", error)
        return null
    }
}

export async function createServiceOrder(data: z.infer<typeof serviceOrderSchema>) {
    try {
        const validated = serviceOrderSchema.parse(data)

        // Auto-calculate total price
        const totalPrice = validated.areaSize * validated.pricePerHa

        // Sanitize pilotId and assistantId
        if (validated.pilotId === "") validated.pilotId = null
        if (validated.assistantId === "") validated.assistantId = null

        const os = await db.serviceorder.create({
            data: {
                ...validated,
                id: crypto.randomUUID(),
                totalPrice,
                status: serviceorder_status.NEW,
                updatedAt: new Date()
            },
        })

        revalidatePath("/dashboard/service-orders")
        return { success: true, data: os }
    } catch (error: any) {
        console.error("Failed to create OS:", error)
        return { success: false, error: error.message || "Erro ao criar Ordem de Serviço" }
    }
}

export async function updateServiceOrderStatus(id: string, status: serviceorder_status) {
    try {
        const updateData: any = { status }

        // Set appropriate dates based on status change
        if (status === serviceorder_status.IN_PROGRESS) {
            updateData.startDate = new Date()
        } else if (status === serviceorder_status.COMPLETED) {
            updateData.endDate = new Date()
        }

        const os = await db.serviceorder.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
            },
        })

        // Automação Financeira: Criar fatura se concluído
        if (status === serviceorder_status.COMPLETED) {
            const existingInvoice = await db.invoice.findFirst({
                where: { serviceOrderId: id }
            })

            if (!existingInvoice) {
                await db.invoice.create({
                    data: {
                        id: crypto.randomUUID(),
                        serviceOrderId: id,
                        amount: os.totalPrice,
                        dueDate: new Date(),
                        status: "PENDING",
                        issuedDate: new Date()
                    }
                })
            }

            // Automação Financeira: Comissões (Piloto e Auxiliar)

            // 1. Comissão do Piloto
            if (os.pilotId) {
                const pilot = await db.employee.findUnique({
                    where: { id: os.pilotId },
                    include: { user: true }
                })

                if (pilot && pilot.commissionRate && pilot.commissionRate > 0) {
                    // Cálculo por Hectare: Area * Rate
                    const commissionAmount = os.areaSize * pilot.commissionRate

                    await createCommissionExpense(id, os.pilotId, commissionAmount, `Comissão Piloto OS #${os.id.slice(-6)} - ${pilot.user?.name || "Piloto"}`)
                }
            }

            // 2. Comissão do Auxiliar
            if (os.assistantId) {
                const assistant = await db.employee.findUnique({
                    where: { id: os.assistantId },
                    include: { user: true }
                })

                if (assistant && assistant.commissionRate && assistant.commissionRate > 0) {
                    // Cálculo por Hectare: Area * Rate
                    const commissionAmount = os.areaSize * assistant.commissionRate

                    await createCommissionExpense(id, os.assistantId, commissionAmount, `Comissão Auxiliar OS #${os.id.slice(-6)} - ${assistant.user?.name || "Auxiliar"}`)
                }
            }
        }

        revalidatePath("/dashboard/service-orders")
        return { success: true, data: os }
    } catch (error) {
        console.error("Failed to update OS status:", error)
        return { success: false, error: "Erro ao atualizar status da OS" }
    }
}

export async function updateServiceOrder(id: string, data: z.infer<typeof serviceOrderSchema>) {
    try {
        const validated = serviceOrderSchema.parse(data)

        // Recalculate total price
        const totalPrice = validated.areaSize * validated.pricePerHa

        // Sanitize pilotId and assistantId
        if (validated.pilotId === "") validated.pilotId = null
        if (validated.assistantId === "") validated.assistantId = null

        const updateData: any = {
            ...validated,
            totalPrice,
        }

        // Handle status-specific dates if status is being updated
        if (validated.status) {
            if (validated.status === serviceorder_status.IN_PROGRESS) {
                updateData.startDate = new Date()
            } else if (validated.status === serviceorder_status.COMPLETED) {
                updateData.endDate = new Date()
            }
        }

        const os = await db.serviceorder.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
            },
        })

        revalidatePath("/dashboard/service-orders")
        return { success: true, data: os }
    } catch (error: any) {
        console.error("Failed to update OS:", error)
        return { success: false, error: error.message || "Erro ao atualizar Ordem de Serviço" }
    }
}

export async function deleteServiceOrder(id: string) {
    try {
        await db.$transaction(async (tx) => {
            // 1. Delete related payments through invoices
            const invoices = await tx.invoice.findMany({
                where: { serviceOrderId: id },
                select: { id: true }
            })

            const invoiceIds = invoices.map(inv => inv.id)
            if (invoiceIds.length > 0) {
                await tx.payment.deleteMany({
                    where: { invoiceId: { in: invoiceIds } }
                })
            }

            // 2. Delete related invoices
            await tx.invoice.deleteMany({
                where: { serviceOrderId: id }
            })

            // 3. Delete related expenses (commissions, etc)
            await tx.expense.deleteMany({
                where: { serviceOrderId: id }
            })

            // 4. Delete related trips
            await tx.trip.deleteMany({
                where: { serviceOrderId: id }
            })

            // 5. Finally delete the OS
            await tx.serviceorder.delete({
                where: { id }
            })
        })

        revalidatePath("/dashboard/service-orders")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete OS:", error)
        return { success: false, error: "Erro ao excluir OS: Verifique se existem dependências" }
    }
}

async function createCommissionExpense(serviceOrderId: string, employeeId: string, amount: number, description: string) {
    try {
        // Buscar ou criar categoria de Comissões
        let commissionCategory = await db.expensecategory.findUnique({
            where: { name: "Comissões" }
        })

        if (!commissionCategory) {
            commissionCategory = await db.expensecategory.create({
                data: {
                    id: crypto.randomUUID(),
                    name: "Comissões",
                    description: "Pagamento de comissões por serviço"
                }
            })
        }

        // Verificar se já existe despesa para esta OS e Funcionário
        const existingExpense = await db.expense.findFirst({
            where: {
                serviceOrderId,
                employeeId
            }
        })

        if (!existingExpense) {
            await db.expense.create({
                data: {
                    id: crypto.randomUUID(),
                    description,
                    amount,
                    date: new Date(),
                    categoryId: commissionCategory.id,
                    serviceOrderId,
                    employeeId
                }
            })
        }
    } catch (error) {
        console.error("Error creating commission expense:", error)
    }
}
