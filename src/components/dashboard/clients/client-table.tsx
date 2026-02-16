"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Edit,
    Trash2,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    User,
    FileText,
    MessageSquare,
    ChevronRight,
    SearchX
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
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface Client {
    id: string
    name: string
    document?: string | null
    email?: string | null
    phone?: string | null
    city?: string | null
    state?: string | null
}

interface ClientTableProps {
    clients: Client[]
    onEdit: (client: Client) => void
    onDelete: (id: string) => void
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)

    if (clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300 gap-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-50 p-4 rounded-full">
                    <SearchX className="w-10 h-10 text-slate-300" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium text-slate-900">Nenhum cliente encontrado</p>
                    <p className="text-sm text-slate-500">Tente ajustar seus filtros ou cadastre um novo cliente.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-400" /> Nome
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-slate-400" /> Documento
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-slate-400" /> Contato
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" /> Localização
                                </div>
                            </TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id} className="group hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <Link
                                        href={`/dashboard/clients/${client.id}`}
                                        className="flex items-center gap-2 font-semibold text-slate-900 hover:text-primary transition-colors"
                                    >
                                        {client.name}
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <code className="text-[10px] sm:text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                                        {client.document || "---"}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {client.email && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                                                <Mail className="w-3 h-3 text-slate-400" /> {client.email}
                                            </div>
                                        )}
                                        {client.phone && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                                                <Phone className="w-3 h-3 text-slate-400" /> {client.phone}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        {client.city && client.state ? `${client.city}, ${client.state}` : "Local não informado"}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/clients/${client.id}`} className="flex items-center gap-2 cursor-pointer w-full">
                                                    <User className="h-4 w-4" /> Ver Detalhes
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(client)} className="gap-2 cursor-pointer">
                                                <Edit className="h-4 w-4" /> Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => setDeleteId(client.id)}
                                                className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
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
                        <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente
                            de nossa base de dados. O histórico de serviços será mantido como registro, mas não terá mais um vínculo ativo com este perfil.
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
        </>
    )
}
