import { notFound } from "next/navigation"
import { getServiceOrderById } from "@/app/actions/service-orders"
import { formatCurrency, formatNumber, statusMap } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Printer, MapPin, Calendar, User, FileText, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { serviceorder_serviceType } from "@prisma/client"

const serviceTypeLabel = {
    [serviceorder_serviceType.PULVERIZATION]: "Pulverização",
    [serviceorder_serviceType.DISPERSION]: "Dispersão",
}

export default async function PrintableOSPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const os = await getServiceOrderById(id)

    if (!os) {
        notFound()
    }

    const invoice = os.invoices?.[0]
    const paidAmount = invoice?.payment?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0
    const remainingAmount = os.totalPrice - paidAmount

    return (
        <div className="min-h-screen bg-white p-8 md:p-12 text-slate-900 print:p-0">
            {/* Print Button - Hidden on Print */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-end print:hidden">
                <Button
                    variant="outline"
                    className="gap-2 border-slate-300 hover:bg-slate-100 print-button"
                // Add onClick handler script or use client component wrapper if needed.
                // For now relying on browser shortcut or user knowledge.
                >
                    <Printer className="w-4 h-4" /> Imprimir (Ctrl + P)
                </Button>
            </div>

            <div className="max-w-4xl mx-auto border border-slate-200 p-8 md:p-12 print:border-none print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="shrink-0 mb-4 md:mb-0">
                            <Image
                                src="/assets/images/logo.png"
                                alt="Aerotech Drone Logo"
                                width={100}
                                height={100}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h1 className="text-xl font-bold text-slate-900">AEROTECH DRONES LTDA</h1>
                            <p className="text-xs text-slate-500">CNPJ: 28.169.289/0001-96</p>
                            <p className="text-xs text-slate-500">R Rio Branco, 35 - Centro</p>
                            <p className="text-xs text-slate-500">Zé Doca - MA, 65.365-000</p>
                            <p className="text-xs text-slate-500">alcimarvn@gmail.com | (98) 8421-3392</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-400">ORDEM DE SERVIÇO</h2>
                        <p className="font-mono font-bold text-lg mt-1 text-slate-700">#{os.id.slice(-6).toUpperCase()}</p>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold mt-2 border ${statusMap[os.status].color}`}>
                            {statusMap[os.status].label}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Client Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1 mb-3 flex items-center gap-2">
                            <User className="w-3 h-3" /> Cliente
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="block text-xs text-slate-500 uppercase">Nome</span>
                                <span className="font-medium">{os.client.name}</span>
                            </div>
                            {os.client.document && (
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Documento</span>
                                    <span>{os.client.document}</span>
                                </div>
                            )}
                            {os.client.phone && (
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Telefone</span>
                                    <span>{os.client.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1 mb-3 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Dados do Serviço
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Tipo</span>
                                    <span className="font-medium">{serviceTypeLabel[os.serviceType]}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Área Total</span>
                                    <span className="font-medium">{formatNumber(os.areaSize)} ha</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase">Data Agendada</span>
                                <span>{os.scheduledDate ? format(os.scheduledDate, "dd/MM/yyyy") : "Não agendada"}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 uppercase">Localização</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {os.location || "Não informada"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Team Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1 mb-3 flex items-center gap-2">
                            <User className="w-3 h-3" /> Equipe Técnica
                        </h3>
                        <div className="space-y-3 text-sm">
                            {os.pilot ? (
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Piloto</span>
                                    <span className="font-medium">{os.pilot.user?.name}</span>
                                </div>
                            ) : (
                                <p className="text-slate-400 italic">Piloto não atribuído</p>
                            )}
                            {os.assistant ? (
                                <div>
                                    <span className="block text-xs text-slate-500 uppercase">Auxiliar</span>
                                    <span className="font-medium">{os.assistant.user?.name}</span>
                                </div>
                            ) : (
                                <p className="text-slate-400 italic">Auxiliar não atribuído</p>
                            )}
                        </div>
                    </div>

                    {/* Financial Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1 mb-3 flex items-center gap-2">
                            <DollarSign className="w-3 h-3" /> Financeiro
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:border print:border-slate-200">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs text-slate-500 uppercase font-bold">Valor Total</span>
                                <span className="text-lg font-bold text-slate-900">{formatCurrency(os.totalPrice)}</span>
                            </div>
                            {paidAmount > 0 && (
                                <div className="space-y-1 border-t border-slate-200 pt-2 mt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Pago</span>
                                        <span className="text-emerald-700 font-medium">{formatCurrency(paidAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Restante</span>
                                        <span className="text-slate-900 font-medium">{formatCurrency(remainingAmount)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description/Obs */}
                {os.description && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1 mb-3">
                            Observações
                        </h3>
                        <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg italic print:bg-transparent print:border print:border-slate-200">
                            {os.description}
                        </p>
                    </div>
                )}

                {/* Payments History (if any) */}
                {invoice && invoice.payment.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-1 mb-3">
                            Histórico de Pagamentos
                        </h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-200">
                                    <th className="pb-2 font-medium">Data</th>
                                    <th className="pb-2 font-medium">Método</th>
                                    <th className="pb-2 font-medium text-right">Valor</th>
                                    <th className="pb-2 font-medium text-right print:hidden">Comprovante</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.payment.map((payment: any) => (
                                    <tr key={payment.id} className="border-b border-slate-100 last:border-0">
                                        <td className="py-2">{format(payment.date, "dd/MM/yyyy")}</td>
                                        <td className="py-2">
                                            {payment.method === "PIX" ? "PIX" :
                                                payment.method === "TRANSFER" ? "Transferência" :
                                                    payment.method === "CASH" ? "Dinheiro" :
                                                        payment.method === "BOLETO" ? "Boleto" :
                                                            payment.method === "CARD" ? "Cartão" : payment.method}
                                        </td>
                                        <td className="py-2 text-right font-medium text-slate-700">{formatCurrency(payment.amount)}</td>
                                        <td className="py-2 text-right print:hidden">
                                            {(payment as any).receiptUrl && (
                                                <a href={(payment as any).receiptUrl} target="_blank" className="text-blue-600 hover:underline hover:text-blue-800 text-xs inline-flex items-center gap-1 justify-end">
                                                    <FileText className="w-3 h-3" /> Ver
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Signatures */}
                <div className="mt-16 pt-8 grid grid-cols-2 gap-16">
                    <div className="text-center">
                        <div className="border-t border-slate-300 w-full mb-2"></div>
                        <p className="text-xs uppercase text-slate-500 font-bold mb-1">Aerotech Drones Ltda</p>
                        <p className="text-[10px] text-slate-400">Responsável Técnico</p>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-slate-300 w-full mb-2"></div>
                        <p className="text-xs uppercase text-slate-500 font-bold mb-1">{os.client.name}</p>
                        <p className="text-[10px] text-slate-400">Cliente / Responsável</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; }
                    body { margin: 1cm; -webkit-print-color-adjust: exact; }
                    .print-button { display: none !important; }
                }
            `}} />
        </div>
    )
}
