import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@aerotech.com.br' },
        update: {},
        create: {
            id: crypto.randomUUID(),
            email: 'admin@aerotech.com.br',
            name: 'Administrador Aerotech',
            password,
            role: 'ADMIN',
            updatedAt: new Date()
        },
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
