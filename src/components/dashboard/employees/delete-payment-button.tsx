"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deletePayment } from "@/app/actions/financial"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeletePaymentButtonProps {
    paymentId: string
}

export function DeletePaymentButton({ paymentId }: DeletePaymentButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deletePayment(paymentId)
            if (result.success) {
                toast.success("Pagamento estornado com sucesso")
                router.refresh()
            } else {
                toast.error(result.error || "Erro ao estornar pagamento")
            }
        } catch (error) {
            toast.error("Erro ao processar estorno")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Estornar Pagamento?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja apagar este registro de pagamento? Esta ação não pode ser desfeita e afetará o saldo do funcionário.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isDeleting ? "Estornando..." : "Confirmar Estorno"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
