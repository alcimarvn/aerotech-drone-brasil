"use client"

import { useState } from "react"
import Link from "next/link"
import {
    MoreVertical,
    Edit,
    Trash2,
    User,
    Mail,
    Shield,
    CheckCircle2,
    XCircle,
    SearchX,
    Filter,
    ChevronRight
} from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { formatCurrency } from "@/lib/utils"

interface EmployeeTableProps {
    employees: any[]
    onEdit: (employee: any) => void
    onDelete: (id: string) => void
}

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [posFilter, setPosFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const filteredEmployees = employees.filter(emp => {
        const matchesPos = posFilter === "all" || emp.position === posFilter
        const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? emp.active : !emp.active)
        return matchesPos && matchesStatus
    })

    if (employees.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <SearchX className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Nenhum funcionário encontrado</h3>
                <p className="text-slate-500 max-w-xs text-center mt-1">
                    Comece cadastrando sua equipe para gerenciar acessos e remunerações.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 border-r border-slate-100 mr-2">
                    <Filter className="w-3.5 h-3.5" /> Filtros
                </div>

                <Select value={posFilter} onValueChange={setPosFilter}>
                    <SelectTrigger className="w-[140px] h-9 bg-slate-50/50 border-none text-xs font-medium focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder="Cargo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Cargos</SelectItem>
                        <SelectItem value="Piloto">Pilotos</SelectItem>
                        <SelectItem value="Badeco">Badecos / Auxiliares</SelectItem>
                        <SelectItem value="Gerente">Gerentes</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-9 bg-slate-50/50 border-none text-xs font-medium focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                </Select>

                <div className="ml-auto text-xs text-slate-400 font-medium">
                    Exibindo {filteredEmployees.length} funcionários
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-slate-700">
                                <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Funcionário</div>
                            </TableHead>
                            <TableHead className="font-bold text-slate-700">Cargo / CPF</TableHead>
                            <TableHead className="font-bold text-slate-700">Acesso (Login)</TableHead>
                            <TableHead className="font-bold text-slate-700">Remuneração</TableHead>
                            <TableHead className="font-bold text-slate-700">Status</TableHead>
                            <TableHead className="w-[80px] text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEmployees.map((emp) => (
                            <TableRow key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <Link
                                        href={`/dashboard/employees/${emp.id}`}
                                        className="flex flex-col group/link"
                                    >
                                        <span className="font-semibold text-slate-900 group-hover/link:text-primary transition-colors flex items-center gap-2">
                                            {emp.user?.name || "Sem Nome"}
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-all -translate-x-1 group-hover/link:translate-x-0" />
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {emp.id.slice(-6)}</span>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="secondary" className="w-fit text-[10px] font-bold h-5 px-1.5 uppercase">
                                            {emp.position}
                                        </Badge>
                                        <span className="text-xs text-slate-500 font-medium">{emp.cpf || "---"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        {emp.user?.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">{formatCurrency(emp.commissionRate)}/ha</span>
                                        {emp.baseSalary > 0 && <span className="text-[10px] text-emerald-600 font-medium">+ {formatCurrency(emp.baseSalary)} fixo</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {emp.active ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 px-2 py-0 h-6">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100 px-2 py-0 h-6">
                                            <XCircle className="w-3 h-3 mr-1" /> Inativo
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/employees/${emp.id}`} className="flex items-center gap-2 cursor-pointer w-full font-medium">
                                                    <User className="h-4 w-4" /> Ver Detalhes
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(emp)} className="gap-2 cursor-pointer font-medium">
                                                <Edit className="h-4 w-4" /> Editar Perfil
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => setDeleteId(emp.id)}
                                                className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                                            >
                                                <Trash2 className="h-4 w-4" /> Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir funcionário?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação removerá o acesso do funcionário ao sistema e excluirá seu registro. Dados históricos de serviços não serão afetados, mas o vínculo com este perfil será removido.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) onDelete(deleteId)
                                setDeleteId(null)
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// Sub-componente Select para os filtros (simplificado para usar o do UI se já existir ou nativo)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
