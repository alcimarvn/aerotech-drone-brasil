"use client"

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useState, useMemo } from "react"

// Component to handle layers only when the map instance is ready
function MapContent({ icons }: { icons: any }) {
    const map = useMap();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (map) {
            setIsReady(true);
        }
    }, [map]);

    const locations = [
        { name: "Zé Doca (Matriz)", coords: [-3.2706, -45.6553] as [number, number], type: "hq", description: "Sede Administrativa e Hangar Principal" },
        { name: "Buriticupu", coords: [-4.3464, -46.4069] as [number, number], type: "logistics", description: "Ponto de Apoio" },
    ]

    if (!isReady) return null;

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <Circle
                center={[-4.3464, -46.4069]}
                radius={350000}
                pathOptions={{ color: '#047756', fillColor: '#047756', fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }}
            />

            {locations.map((loc, idx) => (
                <Marker
                    key={idx}
                    position={loc.coords}
                    icon={loc.type === 'hq' ? icons.aerotech : icons.support}
                >
                    <Popup className="custom-popup">
                        <div className="p-1">
                            <h3 className="font-bold text-[#047756]">{loc.name}</h3>
                            <p className="text-xs text-gray-600 font-medium">{loc.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

export default function CoverageMap() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)

        // Fix for Leaflet default icon not showing in Next.js
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
            aerotech: L.icon({
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            support: L.icon({
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }
    }, [isMounted]);

    if (!isMounted || !icons) {
        return <div className="w-full h-full bg-[#162e26]/30 flex items-center justify-center text-[#047756]">Carregando interface do mapa...</div>
    }

    const center: [number, number] = [-4.5, -45.5]

    return (
        <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 relative z-10 shadow-2xl">
            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%", background: "#162e26" }}
                className="z-10"
            >
                <MapContent icons={icons} />
            </MapContainer>

            {/* Green Tint Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[#047756]/10 z-[300]"></div>

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#162e26]/50 via-transparent to-transparent z-[400]"></div>
        </div>
    )
}
