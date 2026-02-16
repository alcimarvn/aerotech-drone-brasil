"use client"

import { Tractor, Plane, Radar, UserCog } from "lucide-react"
import { colors } from "@/lib/colors"

export function ComplianceSection() {
    return (
        <section className="py-20" style={{ backgroundColor: colors.bgDark }} aria-label="Certificações e Parceiros">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Segurança Jurídica Total</h2>
                <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">Muitos "dronistas" operam na ilegalidade. A Aerotech possui todas as homologações para que você não tenha surpresas com fiscalização.</p>

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-500">
                    {[
                        { icon: Tractor, label: "MAPA (SIAPE)" },
                        { icon: Plane, label: "ANAC (SISANT)" },
                        { icon: Radar, label: "DECEA (SARPAS)" },
                        { icon: UserCog, label: "CREA (ART)" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-4 group cursor-default">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#047756]/50 group-hover:bg-[#047756]/10 transition-all duration-300 transform group-hover:scale-110">
                                <item.icon className="w-10 h-10 text-gray-400 group-hover:text-[#047756] transition-colors" />
                            </div>
                            <span className="font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
