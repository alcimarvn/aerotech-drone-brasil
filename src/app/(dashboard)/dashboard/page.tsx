import {
    Users,
    FileText,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats, getRecentActivities } from "@/app/actions/dashboard"
import { getMonthlyPerformance } from "@/app/actions/financial"
import { formatCurrency } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { getUpcomingAgenda } from "@/app/actions/agenda"
import { UpcomingAgenda } from "@/components/dashboard/agenda/upcoming-agenda"
import { getNextServiceOrderWeather } from "@/app/actions/dashboard"
import { WeatherWidget } from "@/components/dashboard/weather-widget"

export default async function DashboardPage() {
    const statsData = await getDashboardStats()
    const activities = await getRecentActivities()
    const performanceData = await getMonthlyPerformance()
    const upcomingAgendaData = await getUpcomingAgenda()

    // Fix type mismatch: ensure date is Date object
    const upcomingAgenda = upcomingAgendaData.map(item => ({
        ...item,
        date: item.date ? new Date(item.date) : new Date(), // Fallback for null dates
        // Maps backend enums to string for frontend interface compatibility
        status: item.status as string,
        serviceType: item.serviceType as string
    }))

    const weatherData = await getNextServiceOrderWeather()


    if (!statsData) {
        return <div className="p-8 text-center text-slate-500">Erro ao carregar dados do dashboard.</div>
    }

    const stats = [
        {
            title: "Clientes Ativos",
            value: statsData.clientCount.toString(),
            description: `${statsData.clientTrend}% este mês`,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            trend: parseFloat(statsData.clientTrend) >= 0 ? "up" : "down",
            trendValue: `${Math.abs(parseFloat(statsData.clientTrend))}%`
        },
        {
            title: "Ordens de Serviço",
            value: statsData.osCount.toString(),
            description: `${statsData.pendingOsCount} aguardando`,
            icon: FileText,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            trend: "up",
            trendValue: "Total"
        },
        {
            title: "Área Pulverizada",
            value: `${statsData.totalArea} ha`,
            description: "Acumulado total",
            icon: TrendingUp,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
            trend: "up",
            trendValue: "100%"
        },
        {
            title: "Faturamento Mensal",
            value: formatCurrency(statsData.currentMonthRevenue),
            description: "Mês atual",
            icon: Calendar,
            color: "text-amber-600",
            bg: "bg-amber-100",
            trend: parseFloat(statsData.revenueTrend) >= 0 ? "up" : "down",
            trendValue: `${Math.abs(parseFloat(statsData.revenueTrend))}%`
        },
    ]

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Painel de Controle</h1>
                    <p className="text-slate-500 mt-1">Visão geral da operação e indicadores chave.</p>
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Quick Actions Row */}
            <DashboardQuickActions />

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} transition-colors opacity-80 group-hover:opacity-100`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-heading text-slate-900 group-hover:text-primary transition-colors">{stat.value}</div>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                {stat.trend === "up" ? (
                                    <span className="text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stat.trendValue}
                                    </span>
                                ) : (
                                    <span className="text-rose-600 flex items-center bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">
                                        <ArrowDownRight className="w-3 h-3 mr-0.5" /> {stat.trendValue}
                                    </span>
                                )}
                                <span className="ml-1">{stat.description}</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid: 2/3 Main + 1/3 Sidebar */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column (Main Data) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Charts Section */}
                    <DashboardCharts data={performanceData} />

                    {/* Recent Activities */}
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    Atividades Recentes
                                </CardTitle>
                                <Clock className="w-4 h-4 text-slate-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto max-h-[400px]">
                            <div className="divide-y divide-slate-100">
                                {activities.length === 0 ? (
                                    <p className="text-center text-slate-400 py-10 text-sm">Nenhuma atividade recente.</p>
                                ) : (
                                    activities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50/80 transition-colors">
                                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${activity.type === 'OS' ? 'bg-blue-500' :
                                                activity.type === 'FUEL' ? 'bg-amber-500' :
                                                    activity.type === 'MAINT' ? 'bg-rose-500' : 'bg-emerald-500'
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-slate-700 truncate">{activity.title}</p>
                                                <p className="text-slate-500 text-xs truncate mt-0.5">{activity.description}</p>
                                            </div>
                                            <div className="text-[10px] text-slate-400 whitespace-nowrap pt-1 font-medium">
                                                {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: ptBR })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="space-y-6">
                    {/* Weather Widget (Fixed Height) */}
                    <div className="h-[210px]">
                        <WeatherWidget data={weatherData} />
                    </div>

                    {/* Agenda Widget */}
                    <div className="h-[calc(100%-234px)] min-h-[400px]">
                        <UpcomingAgenda items={upcomingAgenda} />
                    </div>
                </div>
            </div>
        </div>
    )
}
