import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function uploadFile(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadDir = join(process.cwd(), "public", "uploads")
        await mkdir(uploadDir, { recursive: true })

        // Generate unique filename
        const extension = file.name.split(".").pop() || "bin"
        const filename = `${uuidv4()}.${extension}`
        const filepath = join(uploadDir, filename)

        // Write file to disk
        await writeFile(filepath, buffer)

        // Return relative path for public access
        return `/uploads/${filename}`
    } catch (error) {
        console.error("Error uploading file:", error)
        throw new Error("Falha ao fazer upload do arquivo")
    }
}
