"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const FlightMap = dynamic(() => import("./FlightMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full bg-slate-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-slate-500">Carregando mapa...</span>
        </div>
    )
})

interface MapClientProps {
    orders: any[]
}

export default function MapClient({ orders }: MapClientProps) {
    return <FlightMap orders={orders} />
}
