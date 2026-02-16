"use client"

import Image from "next/image"
import { CheckCircle2, Award, Users } from "lucide-react"
import { colors } from "@/lib/colors"

export function AboutSection() {
    return (
        <section id="sobre" className="py-20 relative overflow-hidden" style={{ backgroundColor: colors.bgDark }} aria-label="Quem Somos">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[0.85fr,1.15fr] gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative group">
                        <div className="relative h-[540px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-xl">
                            <Image
                                src="/assets/images/agronomoalcimar.jpg"
                                alt="Engenheiro Alcimar - Fundador Aerotech"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d] via-transparent to-transparent"></div>
                        </div>

                        <div className="absolute bottom-6 left-6 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl max-w-xs transform group-hover:-translate-y-1 transition-transform duration-500">
                            <p className="text-amber-500 font-bold uppercase tracking-widest text-[9px] mb-1">Fundador</p>
                            <h4 className="text-white font-bold text-sm mb-0.5">Alcimar Viana</h4>
                            <p className="text-gray-400 text-[9px]">Eng. Agrônomo • CREA/MA</p>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 text-[#10b981]">Quem Somos</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Tecnologia a Favor do <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Produtor Maranhense</span>
                            </h3>
                        </div>

                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl">
                            A Aerotech redefine a agricultura de precisão no Maranhão ao unir o rigor técnico da Engenharia Agronômica com a altíssima eficiência operacional dos Drones de última geração. Diferente de uma simples prestação de serviço de voo, nós entregamos uma consultoria completa: entendemos a fundo a fisiologia da sua lavoura, as particularidades do solo maranhense e os desafios climáticos da nossa região, garantindo que cada gota de insumo seja aplicada no alvo certo, com desperdício zero e retorno máximo sobre o investimento.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-sm">Excelência Técnica</h5>
                                    <p className="text-xs text-gray-500">Protocolos validados.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-sm">Suporte Local</h5>
                                    <p className="text-xs text-gray-500">Zé Doca e Buriticupu.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row flex-wrap gap-4 pt-2">
                            <div className="px-5 py-4 rounded-2xl bg-[#065f46]/80 border border-[#059669]/30 backdrop-blur-md hover:bg-[#065f46] transition-colors shadow-lg group cursor-default flex-1 max-w-[180px]">
                                <p className="text-3xl font-black text-white mb-0.5 group-hover:scale-105 transition-transform duration-300">10k+</p>
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider group-hover:text-emerald-300 transition-colors">Hectares Voados</p>
                            </div>
                            <div className="px-5 py-4 rounded-2xl bg-[#059669]/80 border border-[#10b981]/30 backdrop-blur-md shadow-lg group cursor-default flex-1 max-w-[180px]">
                                <p className="text-3xl font-black text-white mb-0.5 group-hover:scale-105 transition-transform duration-300">100%</p>
                                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Aprovação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
