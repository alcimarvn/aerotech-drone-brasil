"use client"

import { colors } from "@/lib/colors"
import { MissionCard } from "../MissionCard"

export function MissionGallerySection() {
    return (
        <section id="galeria" className="py-24 border-t border-white/5 relative overflow-hidden" style={{ backgroundColor: colors.surfaceDark }} aria-label="Galeria de Operações">
            {/* Background Tech Texture */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `linear-gradient(0deg, transparent 24%, ${colors.primary} 25%, ${colors.primary} 26%, transparent 27%, transparent 74%, ${colors.primary} 75%, ${colors.primary} 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${colors.primary} 25%, ${colors.primary} 26%, transparent 27%, transparent 74%, ${colors.primary} 75%, ${colors.primary} 76%, transparent 77%, transparent)`,
                backgroundSize: '50px 50px'
            }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-emerald-500 font-mono text-sm tracking-widest uppercase mb-2 block">Diário de Bordo</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Missões Recentes</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">Acompanhe a precisão cirúrgica das nossas operações em campo com dados reais de telemetria.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <MissionCard
                        id="mission-042"
                        videoSrc="/assets/videos/DJI_0560.MP4"
                        title="Missão #042: Controle de plantas daninhas em pastagem"
                        location="Fazenda Vieira • Aragunã/MA"
                        droneModel="T50"
                        description="Aplicação de herbicidas com alta tecnologia de gotas para atingir o alvo."
                        stats={{
                            alt: "3.5m",
                            vel: "22 km/h",
                            flow: "10L/ha",
                            width: "9m",
                            duration: "00:14:23",
                            battery: "98%"
                        }}
                    />

                    <MissionCard
                        id="mission-089"
                        videoSrc="/assets/videos/DJI_0568.mp4"
                        title="Missão #089: Controle de plantas daninhas em pastagem"
                        location="Fazenda Vieira • Aragunã/MA"
                        droneModel="T50"
                        description="Controle total de plantas daninhas resistentes em área de difícil acesso com trator."
                        stats={{
                            alt: "4.0m",
                            vel: "20 km/h",
                            flow: "8L/ha",
                            width: "9m",
                            duration: "00:08:45",
                            battery: "82%"
                        }}
                    />

                </div>
            </div>
        </section>
    )
}
