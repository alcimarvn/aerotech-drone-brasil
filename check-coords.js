const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const orders = await prisma.serviceOrder.findMany({
        select: {
            id: true,
            location: true
        }
    })

    console.log(`Encontradas ${orders.length} Ordens de Serviço.`)
    orders.forEach(o => {
        console.log(`ID: ${o.id}, Localização: ${o.location}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
