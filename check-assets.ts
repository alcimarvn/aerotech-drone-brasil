import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
    try {
        console.log("Fetching assets with _count select...")
        const assets = await db.asset.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { maintenance: true }
                }
            }
        })
        console.log(`Found ${assets.length} assets:`)
        assets.forEach((a: any) => console.log(`- ${a.name} (Maintenances: ${a._count?.maintenance})`))

        const t40 = assets.find((a: any) => a.name.includes("T40"))
        if (t40) {
            console.log("SUCCESS: T40 found!")
        } else {
            console.error("FAILURE: T40 NOT found!")
        }

    } catch (error) {
        console.error("ERROR:", error)
    } finally {
        await db.$disconnect()
    }
}

main()
