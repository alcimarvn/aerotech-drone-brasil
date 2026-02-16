import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Get or create a client
    const client = await prisma.client.findFirst() || await prisma.client.create({
        data: {
            name: "Cliente Teste Debug",
            email: "teste@debug.com",
            phone: "11999999999"
        }
    })

    // 2. Create Service Order
    const os = await prisma.serviceOrder.create({
        data: {
            clientId: client.id,
            serviceType: "PULVERIZATION",
            areaSize: 100,
            totalPrice: 5000,
            status: "COMPLETED", // IMPORTANT
            scheduledDate: new Date(),
            location: "Área de Teste"
        }
    })

    // 3. Create Invoice
    await prisma.invoice.create({
        data: {
            serviceOrderId: os.id,
            amount: 5000,
            status: "PENDING", // IMPORTANT
            dueDate: new Date()
        }
    })

    console.log("Created OS:", os.id)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
