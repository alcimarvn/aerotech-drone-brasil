"use server"

import { db } from "@/lib/db"
import { startOfMonth, endOfMonth, subMonths, format, startOfYear } from "date-fns"
import { ptBR } from "date-fns/locale"
import { revalidatePath } from "next/cache"

export async function getFinancialSummary() {
    try {
        // 1. Receitas (O que já foi recebido dos clientes)
        const totalRevenue = await db.payment.aggregate({
            where: { type: "INCOME" },
            _sum: { amount: true }
        })

        // 2. Despesas (O que já foi pago)
        const totalExpenses = await db.payment.aggregate({
            where: { type: "EXPENSE" },
            _sum: { amount: true }
        })

        // 3. A Receber (O que falta receber dos clientes)
        const invoices = await db.invoice.findMany({
            where: {
                status: { notIn: ["PAID", "CANCELLED"] }
            },
            include: {
                payment: { where: { type: "INCOME" } }
            }
        })

        let receivableAmount = 0
        invoices.forEach(inv => {
            const paidSoFar = inv.payment.reduce((acc, p) => acc + p.amount, 0)
            const remaining = inv.amount - paidSoFar
            if (remaining > 0) receivableAmount += remaining
        })

        // 4. A Pagar (Despesas/Comissões que ainda não foram pagas)
        // Total de obrigações registradas - Total pago como despesa
        const totalObligations = await db.expense.aggregate({
            _sum: { amount: true }
        })

        const payableAmount = (totalObligations._sum.amount || 0) - (totalExpenses._sum.amount || 0)

        return {
            totalRevenue: totalRevenue._sum.amount || 0,
            monthlyExpenses: totalExpenses._sum.amount || 0, // Agora reflete o TOTAL PAGO conforme solicitado
            accountsReceivable: receivableAmount,
            accountsPayable: payableAmount > 0 ? payableAmount : 0,
            netProfit: (totalRevenue._sum.amount || 0) - (totalExpenses._sum.amount || 0)
        }
    } catch (error) {
        console.error("Error fetching financial summary:", error)
        return { totalRevenue: 0, monthlyExpenses: 0, accountsReceivable: 0, accountsPayable: 0, netProfit: 0 }
    }
}

export async function getCashFlow(type: "INPUT" | "OUTPUT") {
    try {
        if (type === "INPUT") {
            // Entradas vêm de Payments com type="INCOME"
            const inputs = await db.payment.findMany({
                where: { type: "INCOME" },
                include: {
                    invoice: {
                        include: {
                            serviceorder: {
                                include: { client: true }
                            }
                        }
                    }
                },
                orderBy: { date: "desc" },
                take: 50
            })
            return inputs.map((p: any) => ({
                id: p.id,
                date: p.date,
                description: `Recebimento: ${p.invoice?.serviceorder?.client?.name || "Cliente Final"}`,
                amount: p.amount,
                category: p.invoice?.serviceorder?.serviceType || "Serviço",
                referenceId: p.invoice?.serviceOrderId,
                method: p.method,
                receiptUrl: p.receiptUrl
            }))
        } else {
            // Saídas vêm EXCLUSIVAMENTE de Payments(type="EXPENSE") para refletir o regime de caixa
            const outputs = await db.payment.findMany({
                where: { type: "EXPENSE" },
                include: {
                    employee: { include: { user: true } },
                    expense: { include: { expensecategory: true } }
                },
                orderBy: { date: "desc" },
                take: 50
            })
            return outputs.map(p => {
                let description = p.reference || (p.employee ? `Pagmto: ${p.employee.user?.name}` : "Saída Geral")
                let category = "Saída Realizada"

                if (p.expense) {
                    description = p.expense.description
                    category = p.expense.expensecategory?.name || "Despesa"
                }

                return {
                    id: p.id,
                    date: p.date,
                    description,
                    amount: p.amount,
                    category,
                    method: p.method,
                    receiptUrl: p.receiptUrl
                }
            })
        }
    } catch (error) {
        console.error("Error fetching cash flow:", error)
        return []
    }
}

export async function getMonthlyPerformance() {
    try {
        const last6Months = Array.from({ length: 6 }).map((_, i) => {
            const date = subMonths(new Date(), i)
            return {
                start: startOfMonth(date),
                end: endOfMonth(date),
                label: format(date, "MMM", { locale: ptBR })
            }
        }).reverse()

        const performanceData = await Promise.all(last6Months.map(async (month) => {
            const revenue = await db.payment.aggregate({
                where: {
                    type: "INCOME",
                    date: { gte: month.start, lte: month.end }
                },
                _sum: { amount: true }
            })

            const expenses = await db.payment.aggregate({
                where: {
                    type: "EXPENSE",
                    date: { gte: month.start, lte: month.end }
                },
                _sum: { amount: true }
            })

            return {
                name: month.label,
                receita: revenue._sum.amount || 0,
                despesas: expenses._sum.amount || 0,
                lucro: (revenue._sum.amount || 0) - (expenses._sum.amount || 0)
            }
        }))

        return performanceData
    } catch (error) {
        console.error("Error fetching monthly performance:", error)
        return []
    }
}

export async function createExpense(formData: FormData) {
    try {
        const description = formData.get("description") as string
        const amount = parseFloat(formData.get("amount") as string)
        const date = new Date(formData.get("date") as string)
        const categoryId = formData.get("categoryId") as string
        const paymentCondition = formData.get("paymentCondition") as "CASH" | "LATER" | "INSTALLMENTS"
        const installments = parseInt(formData.get("installments") as string || "1")
        const paymentMethod = formData.get("paymentMethod") as string || "PIX"
        const receiptFile = formData.get("receipt") as File | null

        if (!description || isNaN(amount) || !date || !categoryId) {
            return { success: false, error: "Dados inválidos" }
        }

        let receiptUrl = null
        if (receiptFile && receiptFile.size > 0) {
            receiptUrl = await uploadFile(receiptFile)
        }

        if (paymentCondition === "INSTALLMENTS" && installments > 1) {
            const installmentAmount = amount / installments
            const expenses = []

            for (let i = 0; i < installments; i++) {
                const installmentDate = new Date(date)
                installmentDate.setMonth(installmentDate.getMonth() + i)

                const expense = await db.expense.create({
                    data: {
                        id: crypto.randomUUID(),
                        description: `${description} (${i + 1}/${installments})`,
                        amount: installmentAmount,
                        date: installmentDate,
                        categoryId,
                        status: "PENDING",
                        receiptUrl: i === 0 ? receiptUrl : null // Only link receipt to first installment for now
                    }
                })
                expenses.push(expense)
            }

            revalidatePath("/dashboard/financial")
            return { success: true, data: expenses[0] }
        } else {
            const isPaid = paymentCondition === "CASH"
            const expenseId = crypto.randomUUID()

            const expense = await db.expense.create({
                data: {
                    id: expenseId,
                    description,
                    amount,
                    date,
                    categoryId,
                    status: isPaid ? "PAID" : "PENDING",
                    receiptUrl
                }
            })

            if (isPaid) {
                await db.payment.create({
                    data: {
                        id: crypto.randomUUID(),
                        expenseId: expenseId,
                        amount,
                        date,
                        method: paymentMethod,
                        type: "EXPENSE",
                        reference: description,
                        receiptUrl
                    } as any
                })
            }

            revalidatePath("/dashboard/financial")
            return { success: true, data: expense }
        }
    } catch (error: any) {
        console.error("Error creating expense:", error)
        return { success: false, error: error.message || "Erro ao cadastrar despesa" }
    }
}

export async function getExpenseCategories() {
    try {
        return await db.expensecategory.findMany({
            orderBy: { name: "asc" }
        })
    } catch (error) {
        console.error("Error fetching expense categories:", error)
        return []
    }
}

import { uploadFile } from "@/lib/upload"

export async function registerInvoicePayment(formData: FormData) {
    try {
        const invoiceId = formData.get("invoiceId") as string
        const amount = Number(formData.get("amount"))
        const dateString = formData.get("date") as string
        const method = formData.get("method") as string
        const file = formData.get("file") as File | null

        const date = new Date(dateString)

        // 1. Verificar fatura
        const invoice = await db.invoice.findUnique({
            where: { id: invoiceId },
            include: { payment: true }
        })

        if (!invoice) return { success: false, error: "Fatura não encontrada" }

        const totalPaid = invoice.payment.reduce((acc, p) => acc + p.amount, 0)
        const remaining = invoice.amount - totalPaid

        if (amount > remaining + 0.1) { // margem de erro float
            return { success: false, error: `Valor excede o restante (R$ ${remaining.toFixed(2)})` }
        }

        let receiptUrl = null
        if (file && file.size > 0) {
            receiptUrl = await uploadFile(file)
        }

        // 2. Criar Pagamento
        await db.payment.create({
            data: {
                id: crypto.randomUUID(),
                invoiceId,
                amount,
                date,
                method,
                type: "INCOME",
                receiptUrl
            } as any
        })

        // 3. Atualizar Status da Fatura
        const newTotalPaid = totalPaid + amount
        let newStatus = "PARTIALLY_PAID"

        if (newTotalPaid >= invoice.amount - 0.1) {
            newStatus = "PAID"
        }

        await db.invoice.update({
            where: { id: invoiceId },
            data: {
                status: newStatus,
                paidDate: newStatus === "PAID" ? new Date() : null
            }
        })

        revalidatePath("/dashboard/financial")
        revalidatePath("/dashboard/service-orders")
        return { success: true }

    } catch (error) {
        console.error("Error registering payment:", error)
        return { success: false, error: "Erro ao registrar pagamento" }
    }
}

export async function markInvoicePaid(invoiceId: string) {
    // Mantendo para compatibilidade, mas idealmente deve ser removido ou redirecionado para registerInvoicePayment com valor total
    try {
        const invoice = await db.invoice.findUnique({ where: { id: invoiceId } })
        if (!invoice) return { success: false, error: "Fatura não encontrada" }

        const formData = new FormData()
        formData.append("invoiceId", invoiceId)
        formData.append("amount", invoice.amount.toString())
        formData.append("date", new Date().toISOString())
        formData.append("method", "PIX")

        return await registerInvoicePayment(formData)
    } catch (error) {
        console.error("Error marking invoice as paid:", error)
        return { success: false, error: "Erro ao registrar pagamento" }
    }
}

export async function deletePayment(paymentId: string) {
    try {
        // 1. Buscar pagamento e fatura ANTES de deletar para ter referência
        const payment = await db.payment.findUnique({
            where: { id: paymentId },
            include: { invoice: true }
        })

        if (!payment) {
            return { success: false, error: "Pagamento não encontrado" }
        }

        // 2. Deletar Pagamento
        await db.payment.delete({
            where: { id: paymentId }
        })

        // 3. Recalcular Status da Fatura (se existir)
        if (payment.invoiceId) {
            const invoice = await db.invoice.findUnique({
                where: { id: payment.invoiceId },
                include: { payment: true }
            })

            if (invoice) {
                const totalPaid = invoice.payment.reduce((acc, p) => acc + p.amount, 0)
                let newStatus = "PENDING"

                if (totalPaid >= invoice.amount - 0.1) {
                    newStatus = "PAID"
                } else if (totalPaid > 0) {
                    newStatus = "PARTIALLY_PAID"
                }

                await db.invoice.update({
                    where: { id: invoice.id },
                    data: {
                        status: newStatus,
                        paidDate: newStatus === "PAID" ? new Date() : null
                    }
                })
            }
        }

        revalidatePath("/dashboard/financial")
        revalidatePath("/dashboard/service-orders")
        return { success: true }

    } catch (error) {
        console.error("Error deleting payment:", error)
        return { success: false, error: "Erro ao estornar pagamento" }
    }
}

export async function registerEmployeePayment(formData: FormData) {
    try {
        const employeeId = formData.get("employeeId") as string
        const amount = Number(formData.get("amount"))
        const dateString = formData.get("date") as string
        const method = formData.get("method") as string
        const notes = formData.get("notes") as string
        const file = formData.get("file") as File | null

        const date = new Date(dateString)

        let receiptUrl = null
        if (file && file.size > 0) {
            receiptUrl = await uploadFile(file)
        }

        // Generate ID manually since schema might lack @default(uuid())
        const paymentId = crypto.randomUUID()

        console.log("Registering payment:", { paymentId, employeeId, amount, date, method })

        await db.payment.create({
            data: {
                id: paymentId,
                employeeId,
                amount,
                date,
                method,
                type: "EXPENSE",
                reference: notes,
                receiptUrl
            } as any
        })

        revalidatePath("/dashboard/employees")
        revalidatePath("/dashboard/financial")

        return { success: true }
    } catch (error) {
        console.error("Error registering employee payment:", error)
        return { success: false, error: "Erro ao registrar pagamento: " + (error as Error).message }
    }
}

export async function getFinancialReport(type: "CASH_FLOW" | "BY_CLIENT" | "BY_CATEGORY", startDate: Date, endDate: Date) {
    try {
        if (type === "CASH_FLOW") {
            const [payments, expenses] = await Promise.all([
                db.payment.findMany({
                    where: { date: { gte: startDate, lte: endDate } },
                    include: {
                        invoice: { include: { serviceorder: { include: { client: true } } } },
                        employee: { include: { user: true } },
                        expense: { include: { expensecategory: true } } // Include linked expense info
                    },
                    orderBy: { date: "asc" }
                }),
                db.expense.findMany({
                    where: {
                        date: { gte: startDate, lte: endDate },
                        status: "PAID", // Only actual paid expenses
                        payment: { none: {} }, // Exclude expenses that already have a corresponding payment record (avoids double counting)
                        employeeId: null // Exclude commissions/salaries (they are obligations/accruals, not cash flow until paid)
                    },
                    include: { expensecategory: true, employee: { include: { user: true } } },
                    orderBy: { date: "asc" }
                })
            ])

            const report = [
                ...payments.map(p => {
                    const isIncome = p.type === "INCOME"
                    // If it's an expense payment linked to an Expense record, use that metadata
                    const linkedExpense = p.expense

                    let description = ""
                    let category = ""

                    if (isIncome) {
                        description = `Recebimento: ${p.invoice?.serviceorder?.client?.name || "Cliente"}`
                        category = "Faturamento"
                    } else {
                        // Expense Payment
                        if (linkedExpense) {
                            description = linkedExpense.description
                            category = linkedExpense.expensecategory?.name || "Despesa"
                        } else {
                            description = `Pagamento: ${p.employee?.user?.name || p.reference || "Funcionário"}`
                            category = "Comissão/Salário"
                        }
                    }

                    return {
                        id: p.id,
                        date: p.date,
                        type: isIncome ? "ENTRADA" : "SAÍDA",
                        description,
                        amount: p.amount,
                        category,
                        receiptUrl: p.receiptUrl
                    }
                }),
                ...expenses.map(e => ({
                    id: e.id,
                    date: e.date,
                    type: "SAÍDA",
                    description: e.description,
                    amount: e.amount,
                    category: e.expensecategory?.name || "Outros",
                    receiptUrl: e.receiptUrl
                }))
            ].sort((a, b) => a.date.getTime() - b.date.getTime())

            return report
        }

        if (type === "BY_CLIENT") {
            const clients = await db.client.findMany({
                include: {
                    serviceorder: {
                        where: {
                            invoice: {
                                some: {
                                    payment: {
                                        some: {
                                            date: { gte: startDate, lte: endDate },
                                            type: "INCOME"
                                        }
                                    }
                                }
                            }
                        },
                        include: {
                            invoice: {
                                include: {
                                    payment: {
                                        where: { date: { gte: startDate, lte: endDate }, type: "INCOME" }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            const report = clients.map((client: any) => {
                const totalPaid = (client.serviceorder || []).reduce((sum: number, so: any) => {
                    return sum + (so.invoice || []).reduce((invSum: number, inv: any) => {
                        return invSum + (inv.payment || []).reduce((paySum: number, pay: any) => paySum + pay.amount, 0)
                    }, 0)
                }, 0)

                return {
                    id: client.id,
                    name: client.name,
                    document: client.document,
                    total: totalPaid,
                    osCount: (client.serviceorder || []).length
                }
            }).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

            return report
        }

        if (type === "BY_CATEGORY") {
            const categories = await db.expensecategory.findMany({
                include: {
                    expense: {
                        where: { date: { gte: startDate, lte: endDate } }
                    }
                }
            })

            // Also include payments of type EXPENSE as a "Salários/Comissões" category
            // BUT exclude those that are already linked to an expense (to avoid double counting)
            const payrollPayments = await db.payment.aggregate({
                where: {
                    type: "EXPENSE",
                    date: { gte: startDate, lte: endDate },
                    expenseId: null // Only independent payments
                },
                _sum: { amount: true }
            })

            const report = [
                ...categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    total: cat.expense.reduce((sum, e) => sum + e.amount, 0),
                    count: cat.expense.length
                })),
                {
                    id: "payroll",
                    name: "Salários & Comissões",
                    total: payrollPayments._sum.amount || 0,
                    count: 0 // We don't have a count of expenses here, but it's fine for the report
                }
            ].filter(r => r.total > 0).sort((a, b) => b.total - a.total)

            return report
        }

        return []
    } catch (error) {
        console.error("Error generating financial report:", error)
        return []
    }
}

export async function getPaymentById(id: string) {
    try {
        const payment = await db.payment.findUnique({
            where: { id },
            include: {
                invoice: {
                    include: {
                        serviceorder: {
                            include: {
                                client: true
                            }
                        }
                    }
                },
                employee: {
                    include: {
                        user: true
                    }
                },
                expense: {
                    include: {
                        expensecategory: true
                    }
                }
            }
        })
        return payment
    } catch (error) {
        console.error("Error fetching payment:", error)
        return null
    }
}
