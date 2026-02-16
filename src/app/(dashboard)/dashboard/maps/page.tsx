import { Metadata } from "next"
import { getServiceOrders } from "@/app/actions/service-orders"
import MapClient from "@/components/dashboard/maps/MapClient"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map as MapIcon, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata: Metadata = {
    title: "Mapas de Voo | Aerotech",
    description: "Visualização geográfica das ordens de serviço"
}

export default async function MapsPage() {
    const allOrders = await getServiceOrders()

    // Pass and parse coordinates from location string
    // Expected format: "latitude, longitude" or "-3.27, -45.65"
    const ordersWithCoords = allOrders.map((order: any) => {
        if (!order.location) return { ...order, lat: null, lng: null }

        const parts = order.location.split(",")
        if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim())
            const lng = parseFloat(parts[1].trim())

            if (!isNaN(lat) && !isNaN(lng)) {
                return { ...order, lat, lng }
            }
        }
        return { ...order, lat: null, lng: null }
    }).filter((order: any) => order.lat !== null && order.lng !== null)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <MapIcon className="w-8 h-8 text-primary" />
                        Mapas de Voo
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Visualize a distribuição geográfica de suas operações.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600">
                    <MapIcon className="w-3.5 h-3.5" />
                    {ordersWithCoords.length} Localizações encontradas
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Mapa Operacional</CardTitle>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Mostrando apenas OS com coordenadas válidas
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <MapClient orders={ordersWithCoords} />
                    </CardContent>
                </Card>

                {ordersWithCoords.length === 0 && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            Nenhuma Ordem de Serviço possui coordenadas geográficas válidas para exibição no mapa.
                            Use o formato "latitude, longitude" no campo de localização da OS.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}
