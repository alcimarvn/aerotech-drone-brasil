"use client"

import {
    format,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addYears,
    subYears,
    getYear
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface YearlyViewProps {
    year: number
    eventsByDay: Record<string, number>
    onYearChange: (year: number) => void
}

export function YearlyView({ year, eventsByDay, onYearChange }: YearlyViewProps) {
    const yearStart = startOfYear(new Date(year, 0))
    const months = eachMonthOfInterval({
        start: yearStart,
        end: endOfYear(yearStart)
    })

    function getIntensityColor(count: number) {
        if (count === 0) return "bg-slate-100"
        if (count === 1) return "bg-indigo-200"
        if (count <= 3) return "bg-indigo-400"
        return "bg-indigo-600"
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Ano de {year}</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onYearChange(year - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="font-mono font-bold text-lg min-w-[60px] text-center">{year}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onYearChange(year + 1)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {months.map((month) => {
                    const monthStart = startOfMonth(month)
                    const days = eachDayOfInterval({
                        start: monthStart,
                        end: endOfMonth(monthStart)
                    })

                    // Add empty placeholders for days before the 1st of the month
                    const startDayOfWeek = monthStart.getDay() // 0 = Sunday
                    const placeholders = Array.from({ length: startDayOfWeek })

                    return (
                        <div key={month.toString()} className="space-y-2">
                            <h3 className="font-bold text-slate-700 capitalize text-sm border-b border-slate-100 pb-1">
                                {format(month, "MMMM", { locale: ptBR })}
                            </h3>
                            <div className="grid grid-cols-7 gap-1 text-[10px]">
                                {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                                    <span key={i} className="text-center text-slate-400 font-medium">{d}</span>
                                ))}

                                {placeholders.map((_, i) => (
                                    <div key={`p-${i}`} />
                                ))}

                                <TooltipProvider>
                                    {days.map((day) => {
                                        const dateStr = format(day, "yyyy-MM-dd")
                                        const count = eventsByDay[dateStr] || 0

                                        return (
                                            <Tooltip key={day.toString()}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "aspect-square rounded-sm flex items-center justify-center cursor-default transition-colors",
                                                            getIntensityColor(count),
                                                            count > 0 && "cursor-pointer hover:ring-2 ring-indigo-200 ring-offset-1"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            count > 0 ? "text-white" : "text-slate-400",
                                                            "font-medium"
                                                        )}>
                                                            {format(day, "d")}
                                                        </span>
                                                    </div>
                                                </TooltipTrigger>
                                                {count > 0 && (
                                                    <TooltipContent>
                                                        <p className="text-xs">
                                                            <span className="font-bold">{count}</span> agendamento(s) em {format(day, "dd/MM")}
                                                        </p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        )
                                    })}
                                </TooltipProvider>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs text-slate-500 justify-end">
                <span>Intensidade:</span>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-slate-100" />
                    <span>0</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-indigo-200" />
                    <span>1</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                    <span>2-3</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                    <span>4+</span>
                </div>
            </div>
        </div>
    )
}
