import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Get or create a client
    const client = await prisma.client.findFirst() || await prisma.client.create({
        data: {
            id: crypto.randomUUID(),
            name: "Cliente Teste Debug",
            email: "teste@debug.com",
            phone: "11999999999",
            updatedAt: new Date()
        }
    })

    // 2. Create Service Order
    const os = await prisma.serviceorder.create({
        data: {
            id: crypto.randomUUID(),
            clientId: client.id,
            serviceType: "PULVERIZATION",
            areaSize: 100,
            pricePerHa: 50,
            totalPrice: 5000,
            status: "COMPLETED",
            scheduledDate: new Date(),
            updatedAt: new Date(),
            location: "Área de Teste"
        }
    })

    // 3. Create Invoice
    await prisma.invoice.create({
        data: {
            id: crypto.randomUUID(),
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
