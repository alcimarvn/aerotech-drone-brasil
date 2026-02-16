"use client"

import { useState, useEffect } from "react"
import { Plus, Search, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { getClients, deleteClient } from "@/app/actions/clients"
import { ClientTable } from "@/components/dashboard/clients/client-table"
import { ClientForm } from "@/components/dashboard/clients/client-form"
import { ClientStats } from "@/components/dashboard/clients/client-stats"
import { cn } from "@/lib/utils"

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([])
    const [filteredClients, setFilteredClients] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<any | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const fetchClients = async () => {
        setIsLoading(true)
        try {
            const data = await getClients()
            setClients(data)
            setFilteredClients(data)
        } catch (error) {
            toast.error("Erro ao carregar clientes.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    useEffect(() => {
        const filtered = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.document && client.document.includes(searchTerm)) ||
            (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        setFilteredClients(filtered)
    }, [searchTerm, clients])

    const handleEdit = (client: any) => {
        setSelectedClient(client)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        setIsLoading(true)
        try {
            const result = await deleteClient(id)
            if (result.success) {
                toast.success("Cliente excluído com sucesso.")
                fetchClients()
            } else {
                toast.error(result.error || "Erro ao excluir cliente.")
            }
        } catch (error) {
            toast.error("Erro na comunicação com o servidor.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuccess = () => {
        setIsDialogOpen(false)
        setSelectedClient(null)
        toast.success(selectedClient ? "Cliente atualizado!" : "Cliente cadastrado!")
        fetchClients()
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Clientes</h1>
                    <p className="text-slate-500">Gerencie sua base de produtores e parceiros estratégicos.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) setSelectedClient(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 self-start shadow-sm transition-all hover:scale-105">
                            <Plus className="w-4 h-4" /> Novo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>{selectedClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                            <DialogDescription>
                                {selectedClient ? "Atualize as informações do cliente selecionado." : "Cadastre um novo produtor rural ou parceiro no sistema."}
                            </DialogDescription>
                        </DialogHeader>
                        <ClientForm
                            initialData={selectedClient}
                            onSuccess={handleSuccess}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <ClientStats clients={clients} />

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nome, documento ou e-mail..."
                        className="pl-10 h-10 border-slate-200 focus:ring-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchClients}
                    disabled={isLoading}
                    className="hover:bg-slate-50"
                >
                    <RefreshCw className={cn("w-4 h-4 text-slate-500", isLoading && "animate-spin")} />
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            ) : (
                <ClientTable
                    clients={filteredClients}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}
