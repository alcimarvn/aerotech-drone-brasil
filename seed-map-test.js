const { PrismaClient, ServiceType, ServiceStatus } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Get or create a client
    let client = await prisma.client.findFirst()
    if (!client) {
        client = await prisma.client.create({
            data: {
                name: "Cliente Teste Mapa",
                document: "123.456.789-00",
                email: "teste@mapa.com",
                phone: "(99) 99999-9999"
            }
        })
    }

    // 2. Create a Service Order with coordinates in Zé Doca
    const os = await prisma.serviceOrder.create({
        data: {
            clientId: client.id,
            serviceType: ServiceType.PULVERIZATION,
            areaSize: 50.5,
            pricePerHa: 100,
            totalPrice: 5050,
            status: ServiceStatus.NEW,
            location: "-3.2706, -45.6553", // Maranhão, proximidades de Zé Doca
            description: "OS de teste para verificar o mapa",
            scheduledDate: new Date()
        }
    })

    console.log("OS de teste criada com sucesso!")
    console.log(`ID: ${os.id}`)
    console.log(`Localização: ${os.location}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
