"use client"

import dynamic from "next/dynamic"
import { Map } from "lucide-react"
import { colors } from "@/lib/colors"

// Dynamic Import for Leaflet Map (SSR False)
const CoverageMap = dynamic(() => import("../CoverageMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#162e26]/30 flex items-center justify-center text-[#047756] animate-pulse">
            Carregando Mapa de Satélite...
        </div>
    )
})

export function CoverageSection() {
    return (
        <section className="h-[600px] relative border-y border-white/5">
            <div className="absolute inset-0 z-0">
                <CoverageMap />
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0f231d] via-transparent to-transparent"></div>

            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pointer-events-none">
                <div className="max-w-md bg-[#0f231d]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
                    <div className="w-12 h-12 rounded-xl bg-[#047756]/20 flex items-center justify-center text-[#047756] mb-6">
                        <Map className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Atuação no Maranhão</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        Bases estratégicas em <strong className="text-white">Zé Doca</strong> e <strong className="text-white">Buriticupu</strong>. Atendimento rápido em toda a região do Vale do Pindaré e Alto Turi.
                    </p>
                    <ul className="space-y-3">
                        {['Logística Própria (Trailer + Gerador)', 'Raio de ação de 200km/dia', 'Disponibilidade Imediata'].map((item, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-[#047756] mr-3"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
