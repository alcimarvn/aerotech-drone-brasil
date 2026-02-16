"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Wind, Droplets, Sun, CloudRain, CloudLightning, CloudSnow, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeatherWidgetProps {
    data: {
        temp: number
        condition: string
        description: string
        windSpeed: number
        humidity: number
        feelsLike: number
        location: string
        icon: string
        isDay: boolean
    } | null
    loading?: boolean
}

export function WeatherWidget({ data, loading }: WeatherWidgetProps) {
    if (loading) {
        return (
            <Card className="border-slate-200/60 shadow-sm h-full animate-pulse">
                <CardHeader className="pb-2">
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-16 w-full bg-slate-100 rounded mb-4"></div>
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                </CardContent>
            </Card>
        )
    }

    if (!data) {
        return (
            <Card className="border-slate-200/60 shadow-sm h-full flex items-center justify-center p-6 text-center">
                <div className="text-slate-400 text-sm">
                    <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Informações de clima indisponíveis</p>
                </div>
            </Card>
        )
    }

    // Determine drone flyability based on wind speed (Safety threshold: ~35-40 km/h)
    const MAX_WIND_SPEED_KMH = 35
    const isWindHigh = data.windSpeed > MAX_WIND_SPEED_KMH

    // Choose icon based on OpenWeather condition code or description
    const getWeatherIcon = (condition: string, isDay: boolean) => {
        const iconProps = { className: "w-8 h-8" }
        // Simple mapping, can be expanded
        if (condition.includes("Rain") || condition.includes("Drizzle")) return <CloudRain {...iconProps} className="w-8 h-8 text-blue-400" />
        if (condition.includes("Thunder")) return <CloudLightning {...iconProps} className="w-8 h-8 text-amber-500" />
        if (condition.includes("Snow")) return <CloudSnow {...iconProps} className="w-8 h-8 text-sky-200" />
        if (condition.includes("Clear")) return <Sun {...iconProps} className="w-8 h-8 text-amber-500" />
        if (condition.includes("Cloud")) return <Cloud {...iconProps} className="w-8 h-8 text-slate-400" />
        return <Sun {...iconProps} className="w-8 h-8 text-amber-500" />
    }

    return (
        <Card className={cn(
            "border-slate-200/60 shadow-sm overflow-hidden h-full relative group transition-all duration-300 hover:shadow-md",
            isWindHigh ? "border-amber-200 bg-amber-50/30" : "bg-white"
        )}>
            {/* Background Gradient */}
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 opacity-20 pointer-events-none",
                data.isDay ? "bg-amber-400" : "bg-blue-600"
            )}></div>

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[150px]" title={data.location}>{data.location}</span>
                    </div>
                    {isWindHigh && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full animate-pulse border border-amber-200">
                            VENTO FORTE
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <div className="text-4xl font-bold font-heading text-slate-900 flex items-start">
                            {data.temp}°
                            <span className="text-sm font-normal text-slate-500 mt-1 ml-1">C</span>
                        </div>
                        <p className="text-sm text-slate-500 capitalize">{data.description}</p>
                    </div>
                    <div className="pb-1">
                        {getWeatherIcon(data.condition, data.isDay)}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-500">
                            <Wind className={cn("w-4 h-4", isWindHigh ? "text-amber-600" : "text-blue-500")} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Vento</span>
                            <span className={cn("text-xs font-semibold", isWindHigh ? "text-amber-700" : "text-slate-700")}>
                                {data.windSpeed} km/h
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-slate-50 text-slate-500">
                            <Droplets className="w-4 h-4 text-sky-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Umidade</span>
                            <span className="text-xs font-semibold text-slate-700">{data.humidity}%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
