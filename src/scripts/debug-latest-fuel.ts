
import { db } from "@/lib/db"

async function main() {
    console.log("Inspecting Latest Fuel Log & Financials...")

    /* 
  We are seeing persistent Prisma Client Validation Errors on the relation.
  Let's try to fetch WITHOUT the relation to see if the FuelLog exists at all, 
  and then manually fetch the expense.
  */
    /* 
  List ALL logs to see if we missed any by date sorting
  */
    const allLogs = await db.fuellog.findMany({
        where: { date: { gte: new Date("2026-01-01") } },
        orderBy: { date: "desc" }
    })

    console.log(`Found ${allLogs.length} logs in 2026:`)
    allLogs.forEach(l => console.log(` - ${l.date.toISOString()} | ${l.cost} | ${l.id}`))

    const latestFuelLog = allLogs[0]

    if (!latestFuelLog) {
        console.log("No Fuel Logs found.")
        return
    }

    console.log("--- LATEST FUEL LOG ---")
    console.log(`ID: ${latestFuelLog.id}`)
    console.log(`Asset: ${latestFuelLog.assetId}`)
    console.log(`Liters: ${latestFuelLog.liters}`)
    console.log(`Cost: ${latestFuelLog.cost}`)
    console.log(`Date: ${latestFuelLog.date.toISOString()}`)
    console.log(`Has Expense Linked? ${latestFuelLog.expense && latestFuelLog.expense.length > 0 ? "YES" : "NO"}`)

    /* 
   FALLBACK TO RAW SQL 
   To prove if the column exists in the DB and if the DATA is there.
  */
    try {
        const expensesRaw: any = await db.$queryRaw`SELECT * FROM expense WHERE description LIKE '%Abastecimento%' ORDER BY date DESC LIMIT 1`
        console.log("\n--- RAW SQL EXPENSE ---")
        console.log(expensesRaw)

        if (expensesRaw.length > 0) {
            const e = expensesRaw[0]
            console.log(`FuelLogId column value: ${e.fuelLogId}`)
        }
    } catch (e) {
        console.log("Raw Query Failed:", e)
    }

    // Check Expense manually if not linked via relation
    // UNCOMMENTED - HOPING FOR SUCCESS
    const linkedExpense = await db.expense.findFirst({
        where: { fuelLogId: latestFuelLog.id },
        include: { payment: true, expensecategory: true }
    })

    if (linkedExpense) {
        console.log("\n--- LINKED EXPENSE ---")
        console.log(`ID: ${linkedExpense.id}`)
        console.log(`Desc: ${linkedExpense.description}`)
        console.log(`Amount: ${linkedExpense.amount}`)
        console.log(`Category: ${linkedExpense.expensecategory?.name}`)
        console.log(`Status: ${linkedExpense.status}`)
        console.log(`FuelLogId: ${linkedExpense.fuelLogId}`)

        if (linkedExpense.payment.length > 0) {
            console.log("\n--- LINKED PAYMENT ---")
            linkedExpense.payment.forEach(p => {
                console.log(`ID: ${p.id}`)
                console.log(`Amount: ${p.amount}`)
                console.log(`ExpenseId: ${p.expenseId}`)
                console.log(`Date: ${p.date.toISOString()}`)
            })
        } else {
            console.log("\n[WARNING] No Payment linked to this Expense (If it was 'À vista', this is a bug).")
        }
    } else {
        console.log("\n[CRITICAL] No Expense found with fuelLogId = " + latestFuelLog.id)
    }
   */

}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
