"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar as CalendarIcon, MapPin, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AgendaItem {
    id: string
    clientName: string
    date: Date
    status: string
    city: string
    serviceType: string
}

interface UpcomingAgendaProps {
    items: AgendaItem[]
}

export function UpcomingAgenda({ items }: UpcomingAgendaProps) {
    return (
        <Card className="border-slate-200/60 shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <CalendarIcon className="w-5 h-5 text-indigo-500" />
                            Agenda da Semana
                        </CardTitle>
                        <CardDescription>Próximos 7 dias</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-xs">
                        <Link href="/dashboard/agenda">
                            Ver tudo <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto max-h-[400px]">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
                        <CalendarIcon className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-sm">Nenhum agendamento próximo.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-3">
                                <div className="flex flex-col items-center bg-indigo-50 text-indigo-700 rounded-lg p-2 min-w-[50px]">
                                    <span className="text-xs font-bold uppercase">{format(new Date(item.date), "MMM", { locale: ptBR })}</span>
                                    <span className="text-lg font-black">{format(new Date(item.date), "dd")}</span>
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h4 className="font-semibold text-slate-800 truncate">{item.clientName}</h4>
                                    <div className="flex items-center text-xs text-slate-500 gap-2 mt-1">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {item.city}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span className={
                                            item.status === 'SCHEDULED' ? 'text-amber-600 font-medium' :
                                                item.status === 'IN_PROGRESS' ? 'text-blue-600 font-medium' :
                                                    item.status === 'COMPLETED' ? 'text-emerald-600 font-medium' :
                                                        'text-slate-500'
                                        }>
                                            {item.status === 'SCHEDULED' ? 'Agendado' :
                                                item.status === 'IN_PROGRESS' ? 'Em execução' :
                                                    item.status === 'COMPLETED' ? 'Concluído' : item.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide font-medium">
                                        {item.serviceType === 'PULVERIZATION' ? 'Pulverização' : 'Dispersão'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
