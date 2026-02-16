
import { db } from "@/lib/db"
import { subDays } from "date-fns"

async function main() {
    console.log("Listing Recent Financial Records (Last 60 Days)...")

    const startDate = subDays(new Date(), 60)

    // 1. Get Expenses
    const expenses = await db.expense.findMany({
        where: { date: { gte: startDate } },
        include: { expensecategory: true, payment: true }
    })

    // 2. Get Payments
    const payments = await db.payment.findMany({
        where: { date: { gte: startDate } },
        include: { expense: true }
    })

    console.log(`\n--- EXPENSES (${expenses.length}) ---`)
    for (const exp of expenses) {
        if (exp.description.includes("Abastecimento")) {
            console.log(`[EXP] ${exp.date.toISOString().split('T')[0]} | ${exp.amount} | ${exp.description} | Status: ${exp.status} | HasPayment: ${exp.payment.length}`)
        }
    }

    console.log(`\n--- PAYMENTS (${payments.length}) ---`)
    for (const pay of payments) {
        const desc = pay.reference || (pay.expense?.description) || "N/A"
        if (desc.includes("Abastecimento") || (pay.expense?.description || "").includes("Abastecimento")) {
            console.log(`[PAY] ${pay.date.toISOString().split('T')[0]} | ${pay.amount} | ${desc} | Type: ${pay.type} | LinkedExpense: ${pay.expenseId}`)
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
