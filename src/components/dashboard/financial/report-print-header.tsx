import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ReportPrintHeaderProps {
    title: string
    period: string
    filterDescription?: string
}

export function ReportPrintHeader({ title, period, filterDescription }: ReportPrintHeaderProps) {
    return (
        <div className="hidden print:block mb-8 border-b border-slate-200 pb-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    {/* Logo - Ajuste o caminho se necessário */}
                    <div className="relative w-16 h-16">
                        <img
                            src="/icon.png"
                            alt="Logo Aerotech"
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 leading-tight">Aerotech Drone Brasil</h1>
                        <p className="text-sm text-slate-500">Relatório Gerencial Administrativo</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Gerado em</p>
                    <p className="font-medium text-slate-700">
                        {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-emerald-800">{title}</h2>
                    <p className="text-slate-600 mt-1">
                        <span className="font-semibold">Período:</span> {period}
                    </p>
                    {filterDescription && (
                        <p className="text-sm text-slate-500 mt-0.5">
                            Filtro: {filterDescription}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
