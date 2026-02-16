"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OSForm } from "@/components/dashboard/service-orders/os-form"
import { useRouter } from "next/navigation"

interface CreateOSButtonProps {
    clientId: string
    clientName: string
}

export function CreateOSButton({ clientId, clientName }: CreateOSButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleSuccess = () => {
        setIsOpen(false)
        router.refresh()
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2">
                    <Plus className="w-4 h-4" /> Nova OS
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                    <DialogDescription>
                        Gerando uma nova OS para o cliente <strong>{clientName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <OSForm
                    initialData={{ clientId }}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
