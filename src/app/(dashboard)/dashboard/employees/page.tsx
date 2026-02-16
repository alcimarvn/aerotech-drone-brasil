"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Plus,
    Search,
    RefreshCw,
    Users,
    Filter,
    ArrowUpDown
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

import { EmployeeStats } from "@/components/dashboard/employees/employee-stats"
import { EmployeeTable } from "@/components/dashboard/employees/employee-table"
import { EmployeeForm } from "@/components/dashboard/employees/employee-form"
import { getEmployees, deleteEmployee } from "@/app/actions/employees"
import { cn } from "@/lib/utils"

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<any>(null)

    const fetchEmployees = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await getEmployees()
            setEmployees(data)
        } catch (error) {
            toast.error("Erro ao carregar funcionários")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteEmployee(id)
            if (result.success) {
                toast.success("Funcionário excluído com sucesso")
                fetchEmployees()
            } else {
                toast.error(result.error || "Erro ao excluir funcionário")
            }
        } catch (error) {
            toast.error("Erro inesperado")
        }
    }

    const handleEdit = (employee: any) => {
        setEditingEmployee(employee)
        setIsDialogOpen(true)
    }

    const handleSuccess = () => {
        setIsDialogOpen(false)
        setEditingEmployee(null)
        fetchEmployees()
    }

    const filteredEmployees = employees.filter(emp =>
        emp.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.cpf?.includes(search) ||
        emp.position?.toLowerCase().includes(search.toLowerCase()) ||
        emp.user?.email?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-xl">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        Gestão de Equipe
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium"> Gerencie acessos, cargos e remunerações dos seus colaboradores. </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) setEditingEmployee(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2">
                            <Plus className="w-5 h-5" /> Novo Funcionário
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-slate-900">
                                {editingEmployee ? "Editar Funcionário" : "Cadastrar Novo Funcionário"}
                            </DialogTitle>
                            <DialogDescription>
                                Preencha as informações do colaborador. Um usuário de login será {editingEmployee ? "atualizado" : "criado"} automaticamente.
                            </DialogDescription>
                        </DialogHeader>
                        <EmployeeForm
                            initialData={editingEmployee}
                            onSuccess={handleSuccess}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Dashboard Stats */}
            <EmployeeStats employees={employees} />

            {/* Search and Refresh */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Buscar por nome, CPF, cargo ou e-mail..."
                        className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-primary/10 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchEmployees}
                        disabled={isLoading}
                        className="h-11 w-11 rounded-xl bg-white border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-primary transition-all"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-5 duration-500">
                    <EmployeeTable
                        employees={filteredEmployees}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    )
}
