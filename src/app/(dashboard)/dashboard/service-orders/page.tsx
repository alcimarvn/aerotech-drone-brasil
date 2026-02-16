"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, Search, RefreshCw, Filter } from "lucide-react"

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
import {
    getServiceOrders,
    updateServiceOrderStatus,
    deleteServiceOrder
} from "@/app/actions/service-orders"
import { toast } from "sonner"

import { OSTable } from "@/components/dashboard/service-orders/os-table"
import { OSForm } from "@/components/dashboard/service-orders/os-form"
import { OSDetails } from "@/components/dashboard/service-orders/os-details"
import type { serviceorder_status } from "@prisma/client"

export default function ServiceOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [filteredOrders, setFilteredOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create')

    const searchParams = useSearchParams()
    const router = useRouter()

    const fetchOrders = async () => {
        setIsLoading(true)
        const data = await getServiceOrders()
        setOrders(data)
        setFilteredOrders(data)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        let filtered = orders.filter(os =>
            os.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (os.location && os.location.toLowerCase().includes(searchTerm.toLowerCase()))
        )

        if (statusFilter !== "ALL") {
            filtered = filtered.filter(os => os.status === statusFilter)
        }

        setFilteredOrders(filtered)
    }, [searchTerm, statusFilter, orders])

    // Handle deep linking via URL params
    useEffect(() => {
        const id = searchParams.get('id')
        const mode = searchParams.get('mode') as 'view' | 'edit' | null

        if (id && orders.length > 0) {
            const order = orders.find(o => o.id === id)
            if (order) {
                setSelectedOrder(order)
                setViewMode(mode || 'view')
                setIsDialogOpen(true)
            }
        }
    }, [searchParams, orders])

    // Update URL when dialog closes
    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setSelectedOrder(null)
            setViewMode('create')
            // Remove params from URL without refresh
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
        }
    }

    const handleStatusChange = async (id: string, status: serviceorder_status) => {
        const result = await updateServiceOrderStatus(id, status)
        if (result.success) {
            toast.success("Status atualizado com sucesso!")
            fetchOrders()
        } else {
            toast.error(result.error)
        }
    }

    const handleDelete = async (id: string) => {
        const result = await deleteServiceOrder(id)
        if (result.success) {
            toast.success("Ordem de Serviço excluída com sucesso!")
            fetchOrders()
        } else {
            toast.error(result.error)
        }
    }


    const handleView = (os: any) => {
        setSelectedOrder(os)
        setViewMode('view')
        setIsDialogOpen(true)
    }

    const handleEdit = (os: any) => {
        setSelectedOrder(os)
        setViewMode('edit')
        setIsDialogOpen(true)
    }

    const handleSuccess = () => {
        setIsDialogOpen(false)
        fetchOrders()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900">Ordens de Serviço</h1>
                    <p className="text-slate-500">Acompanhe e gerencie as aplicações em campo.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 self-start"
                            onClick={() => {
                                setSelectedOrder(null)
                                setViewMode('create')
                            }}
                        >
                            <Plus className="w-4 h-4" /> Nova OS
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {viewMode === 'view' ? "Detalhes da Ordem de Serviço" :
                                    viewMode === 'edit' ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
                            </DialogTitle>
                            <DialogDescription>
                                {viewMode === 'view'
                                    ? "Visualizando informações completas da OS."
                                    : viewMode === 'edit'
                                        ? "Atualize as informações da ordem de serviço existente."
                                        : "Registre uma nova demanda de pulverização ou dispersão."}
                            </DialogDescription>
                        </DialogHeader>

                        {viewMode === 'view' && selectedOrder ? (
                            <OSDetails order={selectedOrder} />
                        ) : (
                            <OSForm
                                initialData={selectedOrder}
                                onSuccess={handleSuccess}
                                onCancel={() => setIsDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por cliente ou localização..."
                        className="pl-10 h-10 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                    <select
                        className="h-10 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-full lg:w-48"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Todos os Status</option>
                        <option value="NEW">Novas</option>
                        <option value="SCHEDULED">Agendadas</option>
                        <option value="IN_PROGRESS">Em Execução</option>
                        <option value="COMPLETED">Concluídas</option>
                        <option value="CANCELLED">Canceladas</option>
                    </select>

                    <Button variant="outline" size="icon" onClick={fetchOrders} disabled={isLoading} className="shrink-0">
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                    <RefreshCw className="w-10 h-10 animate-spin" />
                    <p>Carregando ordens de serviço...</p>
                </div>
            ) : (
                <OSTable
                    orders={filteredOrders}
                    onStatusChange={handleStatusChange}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
