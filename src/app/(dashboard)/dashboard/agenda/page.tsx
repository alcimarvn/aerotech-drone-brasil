"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarView } from "@/components/dashboard/agenda/calendar-view"
import { YearlyView } from "@/components/dashboard/agenda/yearly-view"
import { getMonthlyAgenda, getYearlyAgenda } from "@/app/actions/agenda"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, LayoutGrid, Loader2 } from "lucide-react"

export default function AgendaPage() {
    const [view, setView] = useState<"MONTH" | "YEAR">("MONTH")
    const [currentDate, setCurrentDate] = useState(new Date())
    const [monthlyEvents, setMonthlyEvents] = useState<any[]>([])
    const [yearlyEvents, setYearlyEvents] = useState<Record<string, number>>({})
    const [isLoading, setIsLoading] = useState(false)

    // Load data based on view
    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            if (view === "MONTH") {
                const year = currentDate.getFullYear()
                const month = currentDate.getMonth()
                const data = await getMonthlyAgenda(year, month)
                setMonthlyEvents(data
                    .filter(event => event.start) // Filter out events without start date
                    .map(event => ({
                        ...event,
                        start: new Date(event.start!),
                        end: event.end ? new Date(event.end) : new Date(event.start!)
                    })))
            } else {
                const year = currentDate.getFullYear()
                const data = await getYearlyAgenda(year)
                setYearlyEvents(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [view, currentDate])

    useEffect(() => {
        loadData()
    }, [loadData])

    return (
        <div className="space-y-6 pb-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        Agenda de Serviços
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Visualize e gerencie os agendamentos da operação.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <Button
                        variant={view === "MONTH" ? "white" : "ghost"}
                        size="sm"
                        onClick={() => setView("MONTH")}
                        className={view === "MONTH" ? "text-indigo-600 shadow-sm font-semibold" : "text-slate-500"}
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" /> Mensal
                    </Button>
                    <Button
                        variant={view === "YEAR" ? "white" : "ghost"}
                        size="sm"
                        onClick={() => setView("YEAR")}
                        className={view === "YEAR" ? "text-indigo-600 shadow-sm font-semibold" : "text-slate-500"}
                    >
                        <Calendar className="w-4 h-4 mr-2" /> Anual
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            )}

            {!isLoading && view === "MONTH" && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <CalendarView
                        date={currentDate}
                        events={monthlyEvents}
                        onDateChange={setCurrentDate}
                    />
                </div>
            )}

            {!isLoading && view === "YEAR" && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <YearlyView
                        year={currentDate.getFullYear()}
                        eventsByDay={yearlyEvents}
                        onYearChange={(year) => setCurrentDate(new Date(year, 0))}
                    />
                </div>
            )}
        </div>
    )
}
