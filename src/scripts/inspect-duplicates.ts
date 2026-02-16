
import { db } from "@/lib/db"

async function main() {
    console.log("Analyzing Duplicate Fuel/Financial Records (Manual Join)...")

    // 1. Get all Fuel Logs (NO INCLUDES)
    const fuelLogs = await db.fuellog.findMany()
    console.log(`Found ${fuelLogs.length} FuelLogs.`)

    // 2. Get all "Combustível" Category Expenses
    const fuelCategory = await db.expensecategory.findUnique({
        where: { name: "Combustível" }
    })

    if (!fuelCategory) {
        console.log("Category 'Combustível' not found.")
        return
    }

    // Fetch expenses with only payment include
    const fuelExpenses = await db.expense.findMany({
        where: { categoryId: fuelCategory.id },
        include: { payment: true }
    })
    console.log(`Found ${fuelExpenses.length} 'Combustível' Expenses.`)

    // 3. Analyze Orphans (Manual Join)
    console.log("\n--- ANALYSIS ---")
    let orphans = 0

    // Map FuelLogs by ID
    const fuelLogIds = new Set(fuelLogs.map(f => f.id))

    for (const exp of fuelExpenses) {
        // Check if this expense has a fuelLogId field (it might not be in the type if client is stale, so cast to any)
        const expAny = exp as any
        const linkedFuelLogId = expAny.fuelLogId

        // Heuristic: If it has "Abastecimento" in description
        if (exp.description.includes("Abastecimento")) {
            const isLinked = linkedFuelLogId && fuelLogIds.has(linkedFuelLogId)
            const hasPayment = exp.payment.length > 0

            console.log(`Expense ID: ${exp.id}`)
            console.log(`  Desc: ${exp.description}`)
            console.log(`  Amt: ${exp.amount}`)
            console.log(`  Linked ID: ${linkedFuelLogId || "NULL"}`)
            console.log(`  Is Linked Valid? ${isLinked ? "YES" : "NO"}`)
            console.log(`  Has Payment? ${hasPayment ? "YES" : "NO"}`)

            if (!isLinked) {
                orphans++
                console.log("  [POTENTIAL ORPHAN] - No valid link to existing FuelLog")
            }
        }
    }

    console.log(`\nTotal potential orphans: ${orphans}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
