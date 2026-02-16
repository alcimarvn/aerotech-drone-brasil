import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Testing Prisma connection...")
        await prisma.$connect()
        console.log("Connection successful!")

        console.log("Listing tables (count check)...")
        const clientCount = await prisma.client.count()
        console.log(`Current clients: ${clientCount}`)

        // Try a dummy create to see the error
        console.log("Attempting dummy client creation...")
        const dummy = await prisma.client.create({
            data: {
                name: "Debug Test",
                email: "debug@test.com"
            }
        })
        console.log("Dummy creation successful:", dummy.id)

        // Clean up
        await prisma.client.delete({ where: { id: dummy.id } })
        console.log("Cleaned up dummy client.")

    } catch (error: any) {
        console.error("DEBUG ERROR DETAILS:")
        console.error(error.message)
        if (error.code) console.error("Error Code:", error.code)
        if (error.meta) console.error("Error Meta:", JSON.stringify(error.meta))
    } finally {
        await prisma.$disconnect()
    }
}

main()
