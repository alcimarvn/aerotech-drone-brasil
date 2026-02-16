import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
    const id = "cmlnr1hqk0000g9dhvnaaf0s8"
    try {
        console.log("Checking asset ID:", id)
        const asset = await db.asset.findUnique({
            where: { id }
        })
        console.log("Asset found:", asset ? "YES" : "NO")
        if (asset) console.log("Asset name:", asset.name)

        // Try with relations
        console.log("Checking with relations...")
        const assetWithRelations = await db.asset.findUnique({
            where: { id },
            include: {
                maintenance: true,
                fuellog: true,
                assetimage: true,
                assetdocument: true
            }
        })
        console.log("Asset with relations found:", !!assetWithRelations)
    } catch (error) {
        console.error("ERROR:", error)
    } finally {
        await db.$disconnect()
    }
}

main()
