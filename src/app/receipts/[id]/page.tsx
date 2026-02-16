import { notFound } from "next/navigation"
import { getPaymentById } from "@/app/actions/financial"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const payment = await getPaymentById(id)

    if (!payment) {
        notFound()
    }

    const isIncome = payment.type === "INCOME"
    const title = isIncome ? "RECIBO DE PAGAMENTO" : "COMPROVANTE DE PAGAMENTO"

    return (
        <div className="min-h-screen bg-white p-8 md:p-12 text-slate-900 print:p-0">
            {/* Print Button - Hidden on Print */}
            <div className="max-w-3xl mx-auto mb-8 flex justify-end print:hidden">
                <Button
                    variant="outline"
                    className="gap-2 border-slate-300 hover:bg-slate-100 print-button"
                // We need a client component for click handler or use simple script
                // For simplicity in server component, we can use a script or a client wrapper.
                // Let's use a simple script immediately below or assume user knows to Ctrl+P
                >
                    <Printer className="w-4 h-4" /> Imprimir (Ctrl + P)
                </Button>
            </div>

            <div className="max-w-3xl mx-auto border border-slate-200 p-8 md:p-12 print:border-none print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="shrink-0 mb-4 md:mb-0">
                            <Image
                                src="/assets/images/logo.png"
                                alt="Aerotech Drone Logo"
                                width={120}
                                height={120}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl font-bold text-slate-900">AEROTECH DRONES LTDA</h1>
                            <p className="text-sm text-slate-500">CNPJ: 28.169.289/0001-96</p>
                            <p className="text-sm text-slate-500">R Rio Branco, 35 - Centro</p>
                            <p className="text-sm text-slate-500">Zé Doca - MA, 65.365-000</p>
                            <p className="text-sm text-slate-500">alcimarvn@gmail.com | (98) 8421-3392</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-400">{title}</h2>
                        <p className="text-emerald-700 font-mono font-bold text-lg mt-2">
                            {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-slate-400">#{payment.id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-8">
                    <div className="text-lg leading-relaxed">
                        {isIncome ? (
                            <>
                                <p>
                                    Recebemos de <strong className="uppercase">{payment.invoice?.serviceOrder?.client?.name || "CLIENTE NÃO IDENTIFICADO"}</strong>
                                </p>
                                <p>
                                    a importância de <strong>{formatCurrency(payment.amount)}</strong>
                                </p>
                                <p>
                                    referente ao serviço de <strong>{payment.invoice?.serviceOrder?.serviceType === "PULVERIZATION" ? "PULVERIZAÇÃO" : "DISPERSÃO"}</strong>
                                    {payment.invoice?.serviceOrder?.areaSize && ` (${payment.invoice.serviceOrder.areaSize} hectares)`}.
                                </p>
                            </>
                        ) : (
                            <>
                                <p>
                                    Pagamos a <strong className="uppercase">{payment.employee?.user?.name || "BENEFICIÁRIO"}</strong>
                                </p>
                                <p>
                                    a importância de <strong>{formatCurrency(payment.amount)}</strong>
                                </p>
                                <p>
                                    referente a <strong>{payment.reference || "Serviços Prestados"}</strong>.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-sm text-slate-600 bg-slate-50 p-6 rounded-lg print:bg-transparent print:p-0 print:border print:border-slate-100">
                        <div>
                            <span className="block font-semibold text-slate-400 text-xs uppercase mb-1">Data do Pagamento</span>
                            {format(payment.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        <div>
                            <span className="block font-semibold text-slate-400 text-xs uppercase mb-1">Método</span>
                            {payment.method === "PIX" ? "PIX" :
                                payment.method === "TRANSFER" ? "Transferência bancária" :
                                    payment.method === "CASH" ? "Dinheiro" : payment.method}
                        </div>
                        {payment.reference && (
                            <div className="col-span-2">
                                <span className="block font-semibold text-slate-400 text-xs uppercase mb-1">Observações</span>
                                {payment.reference}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer / Signatures */}
                <div className="mt-24 grid grid-cols-2 gap-12 pt-8">
                    <div className="text-center">
                        <div className="border-t border-slate-300 w-full mb-2"></div>
                        <p className="text-xs uppercase text-slate-500 font-semibold">Aerotech Drones Ltda</p>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-slate-300 w-full mb-2"></div>
                        <p className="text-xs uppercase text-slate-500 font-semibold">
                            {isIncome ? (payment.invoice?.serviceOrder?.client?.name || "Cliente") : (payment.employee?.user?.name || "Beneficiário")}
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; }
                    body { margin: 1.6cm; -webkit-print-color-adjust: exact; }
                }
            `}} />
        </div>
    )
}
