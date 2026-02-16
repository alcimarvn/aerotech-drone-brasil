"use client"

import { useState } from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Clock, MapPin, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    status: string
    pilot?: string
    area?: number
}

interface CalendarViewProps {
    date: Date
    events: CalendarEvent[]
    onDateChange: (date: Date) => void
}

export function CalendarView({ date, events, onDateChange }: CalendarViewProps) {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const startDate = startOfWeek(monthStart, { locale: ptBR })
    const endDate = endOfWeek(monthEnd, { locale: ptBR })

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"]

    function getEventsForDay(day: Date) {
        return events.filter(event => isSameDay(new Date(event.start), day))
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'SCHEDULED': return "bg-amber-500"
            case 'IN_PROGRESS': return "bg-blue-500"
            case 'COMPLETED': return "bg-emerald-500"
            case 'CANCELLED': return "bg-rose-500"
            default: return "bg-slate-400"
        }
    }

    function getStatusLabel(status: string) {
        switch (status) {
            case 'SCHEDULED': return "Agendado"
            case 'IN_PROGRESS': return "Em Execução"
            case 'COMPLETED': return "Concluído"
            case 'CANCELLED': return "Cancelado"
            default: return status
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-800 capitalize">
                        {format(date, "MMMM yyyy", { locale: ptBR })}
                    </h2>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDateChange(subMonths(date, 1))}
                        className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDateChange(new Date())}
                        className="text-xs px-2 h-8"
                    >
                        Hoje
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDateChange(addMonths(date, 1))}
                        className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {weekDays.map((day, i) => (
                    <div key={i} className="py-2 text-center text-xs font-semibold text-slate-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px border-b border-slate-200">
                {calendarDays.map((day, dayIdx) => {
                    const dayEvents = getEventsForDay(day)
                    const isCurrentMonth = isSameMonth(day, date)

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[100px] bg-white p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50 relative group",
                                !isCurrentMonth && "bg-slate-50/50 text-slate-400"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-colors",
                                isToday(day) ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-700",
                                !isCurrentMonth && "text-slate-400"
                            )}>
                                {format(day, "d")}
                            </span>

                            <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                {dayEvents.map(event => (
                                    <HoverCard key={event.id}>
                                        <HoverCardTrigger>
                                            <div className={cn(
                                                "text-[10px] px-1.5 py-1 rounded border-l-2 truncate cursor-pointer transition-all hover:scale-[1.02]",
                                                "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:shadow-sm"
                                            )}>
                                                <div className="flex items-center gap-1">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", getStatusColor(event.status))} />
                                                    <span className="truncate">{event.title}</span>
                                                </div>
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80 p-0 overflow-hidden shadow-xl border-slate-200/60">
                                            <div className={cn("h-1.5 w-full", getStatusColor(event.status))} />
                                            <div className="p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                                                    <span className={cn(
                                                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                                        getStatusColor(event.status).replace("bg-", "text-") + " bg-opacity-10"
                                                    )}>
                                                        {getStatusLabel(event.status)}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-xs text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>
                                                            {format(new Date(event.start), "dd 'de' MMMM", { locale: ptBR })}
                                                        </span>
                                                    </div>
                                                    {event.pilot && (
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>Piloto: <span className="text-slate-700 font-medium">{event.pilot}</span></span>
                                                        </div>
                                                    )}
                                                    {event.area && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>Área: <span className="text-slate-700 font-medium">{event.area} ha</span></span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-2 text-center border-t border-slate-100">
                                                <Link href={`/dashboard/service-orders?id=${event.id}&mode=view`} className="block w-full">
                                                    <Button variant="ghost" size="sm" className="w-full h-7 text-xs text-indigo-600">
                                                        Ver Detalhes <FileText className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
