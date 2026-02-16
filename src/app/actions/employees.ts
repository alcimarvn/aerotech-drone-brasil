"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcrypt"
import { user_role } from "@prisma/client"

const employeeSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    cpf: z.string().optional().or(z.literal("")),
    position: z.string().min(2, "Cargo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional().or(z.literal("")),
    active: z.boolean().default(true),
    remunerationType: z.string().default("PER_HECTARE"),
    baseSalary: z.number().optional().nullable(),
    commissionRate: z.number().optional().nullable(),
})

export async function getEmployees() {
    try {
        return await db.employee.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: { admissionDate: "desc" },
        })
    } catch (error) {
        console.error("Failed to fetch employees:", error)
        return []
    }
}

export async function createEmployee(data: z.infer<typeof employeeSchema>) {
    try {
        const validated = employeeSchema.parse(data)

        // Verificações de duplicidade
        const existingUser = await db.user.findUnique({
            where: { email: validated.email }
        })

        if (existingUser) {
            return { success: false, error: "Este e-mail já está em uso." }
        }

        if (validated.cpf) {
            const existingCpf = await db.employee.findUnique({
                where: { cpf: validated.cpf }
            })
            if (existingCpf) {
                return { success: false, error: "Este CPF já está cadastrado." }
            }
        }

        if (!validated.password) {
            return { success: false, error: "Senha é obrigatória para novos funcionários." }
        }

        // 1. Criar Usuário
        const hashedPassword = await bcrypt.hash(validated.password, 10)

        // Atribuir Role com base no cargo simplificado
        const userRole = validated.position.toLowerCase().includes("piloto") ? user_role.TECHNICAL : user_role.OPERATOR

        const user = await db.user.create({
            data: {
                id: crypto.randomUUID(),
                name: validated.name,
                email: validated.email,
                password: hashedPassword,
                role: userRole,
                updatedAt: new Date()
            }
        })

        // 2. Criar Funcionário
        const employee = await db.employee.create({
            data: {
                id: crypto.randomUUID(),
                userId: user.id,
                cpf: validated.cpf || null,
                position: validated.position,
                remunarationType: validated.remunerationType,
                baseSalary: validated.baseSalary || 0,
                commissionRate: validated.commissionRate || 0,
                active: validated.active
            }
        })

        revalidatePath("/dashboard/employees")
        return { success: true, data: employee }
    } catch (error: any) {
        console.error("Failed to create employee:", error)
        return { success: false, error: error?.message || "Erro ao criar funcionário" }
    }
}

export async function updateEmployee(id: string, data: z.infer<typeof employeeSchema>) {
    try {
        const validated = employeeSchema.parse(data)

        const employee = await db.employee.findUnique({
            where: { id },
            include: { user: true }
        })

        if (!employee) {
            return { success: false, error: "Funcionário não encontrado." }
        }

        // Atualizar Usuário
        const userUpdateData: any = {
            name: validated.name,
            email: validated.email,
        }

        if (validated.password && validated.password.length >= 6) {
            userUpdateData.password = await bcrypt.hash(validated.password, 10)
        }

        if (employee.userId) {
            await db.user.update({
                where: { id: employee.userId },
                data: userUpdateData
            })
        }

        // Atualizar Funcionário
        const updatedEmployee = await db.employee.update({
            where: { id },
            data: {
                cpf: validated.cpf || null,
                position: validated.position,
                remunarationType: validated.remunerationType,
                baseSalary: validated.baseSalary || 0,
                commissionRate: validated.commissionRate || 0,
                active: validated.active
            }
        })

        revalidatePath("/dashboard/employees")
        return { success: true, data: updatedEmployee }
    } catch (error: any) {
        console.error("Failed to update employee:", error)
        return { success: false, error: error?.message || "Erro ao atualizar funcionário" }
    }
}

export async function deleteEmployee(id: string) {
    try {
        const employee = await db.employee.findUnique({
            where: { id }
        })

        if (employee?.userId) {
            // Se deletar o funcionário, deletamos também o usuário (opcional, ou apenas inativar)
            // Para segurança de dados, vamos apenas inativar por padrão ou permitir deleção se não houver vínculos financeiros
            // Para este desafio, faremos a deleção total
            await db.employee.delete({ where: { id } })
            await db.user.delete({ where: { id: employee.userId } })
        } else {
            await db.employee.delete({ where: { id } })
        }

        revalidatePath("/dashboard/employees")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete employee:", error)
        return { success: false, error: "Erro ao excluir funcionário. Verifique se existem registros vinculados." }
    }
}

export async function getEmployeeById(id: string) {
    try {
        const employee = await db.employee.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true
                    }
                },
                expense: {
                    include: {
                        serviceorder: {
                            include: {
                                client: true
                            }
                        }
                    },
                    orderBy: { date: "desc" },
                    take: 100
                },
                payment: {
                    where: { type: "EXPENSE" },
                    orderBy: { date: "desc" },
                    take: 50
                },
                _count: {
                    select: { expense: true }
                }
            }
        })
        return employee
    } catch (error) {
        console.error("Failed to fetch employee details:", error)
        return null
    }
}
