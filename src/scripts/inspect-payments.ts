
import { db } from "@/lib/db"

async function main() {
    console.log("Inspecting Duplicate Payments...")

    // Find payments that look like Fuel Log payments
    const payments = await db.payment.findMany({
        where: {
            OR: [
                { reference: { contains: "Abastecimento" } },
                { expense: { description: { contains: "Abastecimento" } } }
            ]
        },
        include: {
            expense: true
        }
    })

    console.log(`Found ${payments.length} potential fuel payments.`)

    for (const p of payments) {
        console.log(`PAY ID: ${p.id}`)
        console.log(`  Date: ${p.date.toISOString()}`)
        console.log(`  Amount: ${p.amount}`)
        console.log(`  Reference: ${p.reference}`)
        console.log(`  Expense ID: ${p.expenseId}`)
        console.log(`  Expense Desc: ${p.expense?.description}`)
        console.log("---")
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
