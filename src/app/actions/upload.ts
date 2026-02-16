"use server"

import { uploadFile } from "@/lib/upload"

export async function uploadFileAction(formData: FormData) {
    try {
        const file = formData.get("file") as File
        if (!file) {
            return { success: false, error: "Nenhum arquivo enviado" }
        }

        const url = await uploadFile(file)
        if (!url) {
            return { success: false, error: "Falha ao salvar arquivo" }
        }

        return { success: true, url }
    } catch (error) {
        console.error("Error uploading file:", error)
        return { success: false, error: "Erro ao fazer upload do arquivo" }
    }
}
