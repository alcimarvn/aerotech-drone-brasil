import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const orders = await prisma.serviceOrder.findMany({
        include: {
            client: true,
            invoices: true
        },
        orderBy: { createdAt: 'desc' }
    })

    console.log("Total Orders:", orders.length)
    orders.forEach(os => {
        console.log(`OS #${os.id.slice(-6)} | Status: ${os.status}`)
        console.log(`   Client: ${os.client.name}`)
        console.log(`   Invoices: ${os.invoices.length}`)
        os.invoices.forEach(inv => {
            console.log(`      Inv #${inv.id.slice(-6)} | Status: ${inv.status} | Amount: ${inv.amount}`)
        })
        console.log("---")
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
