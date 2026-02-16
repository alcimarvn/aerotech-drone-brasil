"use client"

import { Map, FlaskConical, Target, ClipboardCheck } from "lucide-react"
import { colors } from "@/lib/colors"

export function MethodologySection() {
    return (
        <section id="metodologia" className="py-24 border-t border-white/5" style={{ backgroundColor: colors.bgDark }} aria-label="Nossa Metodologia">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3" style={{ color: colors.primary }}>Processo Profissional</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white">Metodologia Aerotech</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Visual Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#047756]/30 to-transparent z-0"></div>

                    {[
                        { title: "Planejamento Agronômico", icon: Map, desc: "Mapeamento digital da área e prescrição técnica baseada no alvo biológico (praga/doença) e estádio da cultura." },
                        { title: "Preparo Certificado", icon: FlaskConical, desc: "Controle rigoroso de pH, ordem de mistura e adjuvantes para garantir a 100% de eficiência da molécula." },
                        { title: "Aplicação de Precisão", icon: Target, desc: "Voos RTK com Drones T50 garantindo faixa de deposição uniforme, sem falhas e sem sobreposição." },
                        { title: "Relatório Técnico", icon: ClipboardCheck, desc: "Entrega de mapas 'As-Applied' comprovando área coberta, horário, meteorologia e vazão real." }
                    ].map((step, idx) => (
                        <article key={idx} className="relative p-8 rounded-3xl border border-white/5 bg-[#162e26]/50 backdrop-blur-sm hover:bg-[#162e26] transition-all duration-300 group z-10 hover:-translate-y-2">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-xl ring-4 ring-[#0f231d] transition-transform group-hover:scale-110"
                                style={{ backgroundColor: colors.primary }}>
                                {idx + 1}
                            </div>
                            <div className="mt-8 text-center">
                                <step.icon className="w-12 h-12 mx-auto mb-6 text-gray-500 group-hover:text-[#047756] transition-colors duration-300" />
                                <h4 className="text-2xl font-bold text-white mb-3">{step.title}</h4>
                                <p className="text-base text-gray-400 leading-relaxed">{step.desc}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
