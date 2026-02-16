
import { db } from "@/lib/db"

async function main() {
    console.log("Cleaning up Orphan Fuel Expenses...")

    // 1. Get all Fuel Logs
    const fuelLogs = await db.fuellog.findMany()
    const fuelLogIds = new Set(fuelLogs.map(f => f.id))
    console.log(`Valid FuelLog IDs: ${fuelLogs.length}`)

    // 2. Get all "Combustível" Category
    const fuelCategory = await db.expensecategory.findUnique({
        where: { name: "Combustível" }
    })

    if (!fuelCategory) {
        console.log("Category 'Combustível' not found.")
        return
    }

    // 3. Get Candidates
    const fuelExpenses = await db.expense.findMany({
        where: {
            categoryId: fuelCategory.id,
            description: { contains: "Abastecimento:" }
        }
    })

    let deletedCount = 0

    for (const exp of fuelExpenses) {
        const expAny = exp as any
        const linkedFuelLogId = expAny.fuelLogId

        // Case 1: Has fuelLogId but it points to non-existent FuelLog
        // Case 2: Has NO fuelLogId (Legacy orphan)
        // Safety: Only delete if description looks like auto-generated

        const isLinkedToValidLog = linkedFuelLogId && fuelLogIds.has(linkedFuelLogId)

        if (!isLinkedToValidLog) {
            console.log(`Deleting Orphan Expense: ${exp.id} - ${exp.description} (${exp.date.toISOString()})`)

            await db.expense.delete({
                where: { id: exp.id }
            })
            deletedCount++
        }
    }

    console.log(`\nSuccessfully deleted ${deletedCount} orphan expenses.`)
    console.log("Linked payments should have been deleted automatically via Cascade.")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
