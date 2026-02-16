"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { hash, compare } from "bcrypt"

export async function updateProfile(data: { name: string, email: string }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return { success: false, error: "Não autorizado" }
        }

        // Check if email is already taken by another user
        if (data.email !== session.user.email) {
            const existingUser = await db.user.findUnique({
                where: { email: data.email }
            })

            if (existingUser) {
                return { success: false, error: "Email já está em uso" }
            }
        }

        await db.user.update({
            where: { email: session.user.email },
            data: {
                name: data.name,
                email: data.email
            }
        })

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error: any) {
        console.error("Error updating profile:", error)
        return { success: false, error: "Erro ao atualizar perfil" }
    }
}

export async function changePassword(data: { current: string, new: string }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return { success: false, error: "Não autorizado" }
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return { success: false, error: "Usuário não encontrado" }
        }

        const isValid = await compare(data.current, user.password)

        if (!isValid) {
            return { success: false, error: "Senha atual incorreta" }
        }

        const hashedPassword = await hash(data.new, 10)

        await db.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword }
        })

        return { success: true }
    } catch (error: any) {
        console.error("Error changing password:", error)
        return { success: false, error: "Erro ao alterar senha" }
    }
}

export async function getExpenseCategories() {
    try {
        const categories = await db.expensecategory.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { expense: true }
                }
            }
        })
        return categories
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function createExpenseCategory(name: string, description?: string) {
    try {
        await db.expensecategory.create({
            data: {
                id: crypto.randomUUID(),
                name,
                description
            }
        })
        revalidatePath("/dashboard/settings")
        return { success: true }
    } catch (error: any) {
        console.error("Error creating category:", error)
        if (error.code === 'P2002') {
            return { success: false, error: "Categoria já existe" }
        }
        return { success: false, error: "Erro ao criar categoria" }
    }
}

export async function deleteExpenseCategory(id: string) {
    try {
        // Check if category is used
        const category = await db.expensecategory.findUnique({
            where: { id },
            include: { _count: { select: { expense: true } } }
        })

        if (category?._count.expense && category._count.expense > 0) {
            return { success: false, error: "Categoria em uso não pode ser excluída" }
        }

        await db.expensecategory.delete({
            where: { id }
        })

        revalidatePath("/dashboard/settings")
        return { success: true }
    } catch (error: any) {
        console.error("Error deleting category:", error)
        return { success: false, error: "Erro ao excluir categoria" }
    }
}

export async function getCompanySettings() {
    try {
        const settings = await db.companysettings.findFirst()
        return settings
    } catch (error) {
        console.error("Error getting company settings:", error)
        return null
    }
}

export async function updateCompanySettings(data: { companyName: string, cnpj: string, theme: string }) {
    try {
        const settings = await db.companysettings.findFirst()

        if (settings) {
            await db.companysettings.update({
                where: { id: settings.id },
                data: {
                    companyName: data.companyName,
                    cnpj: data.cnpj,
                    theme: data.theme
                }
            })
        } else {
            await db.companysettings.create({
                data: {
                    companyName: data.companyName,
                    cnpj: data.cnpj,
                    theme: data.theme
                }
            })
        }

        revalidatePath("/dashboard/settings")
        return { success: true }
    } catch (error) {
        console.error("Error updating company settings:", error)
        return { success: false, error: "Erro ao atualizar configurações" }
    }
}
