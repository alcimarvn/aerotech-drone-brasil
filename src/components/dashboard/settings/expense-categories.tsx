"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { createExpenseCategory, deleteExpenseCategory } from "@/app/actions/settings"
import { Loader2, Plus, Trash2, Tag } from "lucide-react"

interface Category {
    id: string
    name: string
    description: string | null
    _count: {
        expense: number
    }
}

interface ExpenseCategoriesProps {
    categories: Category[]
}

const categorySchema = z.object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    description: z.string().optional()
})

export function ExpenseCategories({ categories: initialCategories }: ExpenseCategoriesProps) {
    const [categories, setCategories] = useState(initialCategories)
    const [isCreating, setIsCreating] = useState(false)

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })

    async function onSubmit(values: z.infer<typeof categorySchema>) {
        setIsCreating(true)
        try {
            const result = await createExpenseCategory(values.name, values.description)
            if (result.success) {
                toast.success("Categoria criada com sucesso!")
                form.reset()
                // Optimistic update would require re-fetching or knowing the ID, 
                // so we rely on revalidatePath in the action + router refresh logic in parent 
                // but since this is a client component prop, we'd need to refresh.
                // For simplicity, we can let Next.js refresh handle existing props, 
                // OR we could trigger a refresh via router.refresh() 
                // However, since we are inside a client component receiving props from a server component page,
                // revalidatePath in the server action is the best way, but we need to see the update.
                // Ideally we'd call router.refresh() here.
                window.location.reload() // Force reload to fetch new data for now or use router.refresh
            } else {
                toast.error(result.error || "Erro ao criar categoria")
            }
        } catch (error) {
            toast.error("Erro inesperado")
        } finally {
            setIsCreating(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir esta categoria?")) return

        try {
            const result = await deleteExpenseCategory(id)
            if (result.success) {
                toast.success("Categoria excluída com sucesso!")
                window.location.reload()
            } else {
                toast.error(result.error || "Erro ao excluir categoria")
            }
        } catch (error) {
            toast.error("Erro inesperado")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Tag className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-lg">Categorias de Despesas</h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Nova Categoria</h4>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3 items-start">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input placeholder="Nome da Categoria (ex: Manutenção)" className="bg-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="flex-[2]">
                                    <FormControl>
                                        <Input placeholder="Descrição (opcional)" className="bg-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isCreating}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 outline-none"
                            aria-label="Adicionar categoria"
                            title="Adicionar categoria"
                        >
                            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                        </Button>
                    </form>
                </Form>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead>Nome</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-center w-[100px]">Uso</TableHead>
                            <TableHead className="text-right w-[80px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="text-slate-500">{category.description || "-"}</TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                        {category._count.expense}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(category.id)}
                                        disabled={category._count.expense > 0}
                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 outline-none"
                                        title={category._count.expense > 0 ? "Em uso, não pode excluir" : "Excluir"}
                                        aria-label={category._count.expense > 0 ? "Em uso, não pode excluir" : `Excluir categoria ${category.name}`}
                                    >
                                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                    Nenhuma categoria cadastrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
