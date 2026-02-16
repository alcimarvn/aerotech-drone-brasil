"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useState, useMemo } from "react"
import type { serviceorder_status, serviceorder_serviceType } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, statusMap } from "@/lib/utils"
import Link from "next/link"
import { MapPin, User, Layers, Calendar, ExternalLink } from "lucide-react"

// Component to handle layers and view centering
function MapContent({ orders, icons }: { orders: any[], icons: any }) {
    const map = useMap();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (map && orders.length > 0) {
            // If there's only one order, center on it
            if (orders.length === 1 && orders[0].lat && orders[0].lng) {
                map.setView([orders[0].lat, orders[0].lng], 13);
            }
            // If there are multiple, maybe fit bounds? 
            // For now just mark as ready
            setIsReady(true);
        } else if (map) {
            setIsReady(true);
        }
    }, [map, orders]);

    if (!isReady) return null;

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            />

            {orders.map((order) => {
                if (!order.lat || !order.lng) return null;

                return (
                    <Marker
                        key={order.id}
                        position={[order.lat, order.lng]}
                        icon={icons.default}
                    >
                        <Popup className="min-w-[250px]">
                            <div className="p-1 space-y-3">
                                <div className="flex items-center justify-between gap-2 border-b pb-2">
                                    <h3 className="font-bold text-slate-900 truncate">#{order.id.slice(-6).toUpperCase()}</h3>
                                    <Badge className={`${(statusMap as any)[order.status]?.color} text-[10px]`}>
                                        {(statusMap as any)[order.status]?.label}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="font-medium truncate">{order.client.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{order.serviceType === "PULVERIZATION" ? "Pulverização" : "Dispersão"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="truncate">{order.areaSize} ha</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : "Não agendada"}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t flex items-center justify-between gap-4">
                                    <span className="font-bold text-emerald-700">{formatCurrency(order.totalPrice)}</span>
                                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" asChild>
                                        <Link href={`/dashboard/service-orders?id=${order.id}`}>
                                            Ver Detalhes <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </>
    );
}

interface FlightMapProps {
    orders: any[]
}

export default function FlightMap({ orders }: FlightMapProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)

        // Fix for Leaflet default icon issues in Next.js
        if (typeof L !== 'undefined' && L.Icon.Default) {
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            });
        }
    }, [])

    const icons = useMemo(() => {
        if (typeof window === 'undefined' || !isMounted) return null;

        return {
            default: L.icon({
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }
    }, [isMounted]);

    if (!isMounted || !icons) {
        return (
            <div className="w-full h-[600px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-dashed animate-pulse">
                Carregando mapa...
            </div>
        )
    }

    // Default center (Zé Doca) if no orders
    const center: [number, number] = orders.length > 0 && orders[0].lat && orders[0].lng
        ? [orders[0].lat, orders[0].lng]
        : [-3.2706, -45.6553]

    return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-10">
            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="z-10"
            >
                <MapContent orders={orders} icons={icons} />
            </MapContainer>
        </div>
    )
}
