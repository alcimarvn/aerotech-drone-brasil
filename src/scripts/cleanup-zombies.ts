
import { db } from "@/lib/db"

async function main() {
    console.log("Cleaning up Zombie Fuel/Financial Records...")

    // 1. Delete Unlinked Expenses (Orphans)
    // These are expenses that look like Fuel Logs but aren't linked to a FuelLog
    // Valid ones NOW have fuelLogId. Old ones don't.
    const deletedExpenses = await db.expense.deleteMany({
        where: {
            description: { contains: "Abastecimento" },
            fuelLogId: null
        }
    })
    console.log(`Deleted ${deletedExpenses.count} orphan expenses (No FuelLog link).`)

    // 2. Delete Unlinked Payments (Orphans)
    // These are payments that look like Fuel Logs but aren't linked to an Expense
    // Valid ones NOW have expenseId. Old ones don't.
    // Note: We check 'reference' for the description pattern
    const deletedPayments = await db.payment.deleteMany({
        where: {
            OR: [
                { reference: { contains: "Abastecimento" } },
                { reference: { contains: "Pagamento: Abastecimento" } }
            ],
            expenseId: null
        }
    })
    console.log(`Deleted ${deletedPayments.count} orphan payments (No Expense link).`)

}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
