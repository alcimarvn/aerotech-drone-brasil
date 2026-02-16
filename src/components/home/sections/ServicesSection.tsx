"use client"

import Link from "next/link"
import { ArrowRight, Gauge, Droplets, Wheat, Map, Bug, Scan, Target, Timer } from "lucide-react"
import { colors } from "@/lib/colors"

interface ServicesSectionProps {
    whatsappLink: string;
}

export function ServicesSection({ whatsappLink }: ServicesSectionProps) {
    return (
        <section id="servicos" className="py-24 px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: colors.bgDark }} aria-label="Nossos Serviços">
            {/* Mesh Gradient Effect simulation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(at 0% 0%, ${colors.primary}40 0px, transparent 50%), radial-gradient(at 100% 100%, ${colors.accent}20 0px, transparent 50%)`
                    }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3 opacity-80" style={{ color: colors.accent }}>Soluções Agronômicas</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Menos Custo, Mais Safra</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[350px]">

                    {/* 1. PULVERIZAÇÃO (Destaque) */}
                    <article className="relative group overflow-hidden rounded-3xl col-span-1 lg:col-span-2 border border-white/5 transition-all duration-500 hover:border-[#047756]/50 hover:shadow-2xl"
                        style={{ backgroundColor: colors.surfaceDark }}>
                        <div className="absolute inset-0">
                            <div className="w-full h-full bg-[url('/assets/images/hero-bg.jpeg')] bg-cover bg-center opacity-60 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d] via-[#0f231d]/60 to-transparent"></div>
                        </div>

                        {/* Badge Técnico */}
                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/60 text-[#4ade80] border border-[#4ade80]/30 backdrop-blur-md">
                                <Gauge className="w-3 h-3 mr-1" /> Rendimento: 120 ha/dia
                            </span>
                        </div>

                        <div className="absolute bottom-0 p-8 w-full z-10">
                            <div className="inline-flex items-center justify-center p-3 rounded-2xl backdrop-blur-md mb-4 transition-transform group-hover:-translate-y-2 duration-300" style={{ backgroundColor: `${colors.primary}33` }}>
                                <Droplets className="w-8 h-8" style={{ color: colors.primary }} />
                            </div>
                            <h4 className="text-3xl font-bold text-white mb-2">Pulverização de Defensivos</h4>
                            <p className="text-gray-300 max-w-xl text-lg leading-relaxed opacity-90 mb-4">Aplicação de Fungicidas, Herbicidas e Inseticidas com tecnologia UBV. Ideal para controle de lagarta e ferrugem em estágios avançados.</p>

                            {/* Tags */}
                            <div className="flex gap-2">
                                <span className="text-xs font-semibold bg-[#047756]/20 text-[#047756] border border-[#047756]/30 px-3 py-1 rounded-full">Sistêmicos</span>
                                <span className="text-xs font-semibold bg-[#047756]/20 text-[#047756] border border-[#047756]/30 px-3 py-1 rounded-full">De Contato</span>
                            </div>
                        </div>
                    </article>

                    <article className="relative group overflow-hidden rounded-3xl border border-white/5 transition-all duration-300 hover:border-[#047756]/50 hover:-translate-y-1 hover:shadow-xl"
                        style={{ backgroundColor: colors.surfaceDark }}>
                        <div className="absolute inset-0">
                            <div className="w-full h-full bg-[url('/assets/images/semeadura.webp')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d]/90 to-transparent"></div>
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/5 text-amber-400 border border-amber-400/30">
                                Reforma de Pasto
                            </span>
                        </div>

                        <div className="relative p-8 h-full flex flex-col justify-end z-10">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner mb-4" style={{ backgroundColor: `${colors.accent}1A`, color: colors.accent }}>
                                <Wheat className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Manejo de Pastagem</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">Semeadura de capim, controle de invasoras e adubação foliar para recuperar a capacidade produtiva do seu pasto.</p>
                        </div>
                    </article>

                    {/* 3. MAPEAMENTO */}
                    <article className="relative group overflow-hidden rounded-3xl border border-white/5 transition-all duration-300 hover:border-[#047756]/50 hover:-translate-y-1 hover:shadow-xl"
                        style={{ backgroundColor: colors.surfaceDark }}>
                        <div className="absolute inset-0">
                            <div className="w-full h-full bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtsN6u1Vf43HDFRF6H3SPiUBM3_6SaRLzXHcRSg1JwqEGHiqEckUoPNi8wiOFsgY543399gIUPNlCEKcRQ3j5-iQky7rJRA6zXEsKcJsi3pOTvQnzopsPZ-BgvEERjivjet6Wfs0FbVQaiAjseiYZcAYCAFEcvk6TWCVvsloI4huFnXRGp5t0m0VtfrbCyXlrvh6tMsZLtesfwuxR3ykHMC1jEoyCd9lpolV6QawzkNnYGBrcsbURFU0j5P6ZMKUlHxrcw0vKF2JM')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d]/90 to-transparent"></div>
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/60 text-blue-400 border border-blue-400/30 backdrop-blur-md">
                                Precisão RTK
                            </span>
                        </div>

                        <div className="relative p-8 h-full flex flex-col justify-end z-10">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner mb-4">
                                <Map className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Laudos e Mapeamento</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">Mapeamento para CAR, análise de falhas de plantio e volumetria de biomassa com precisão centimétrica.</p>
                        </div>
                    </article>

                    <article className="relative group overflow-hidden rounded-3xl border border-white/5 transition-all duration-300 hover:border-[#047756]/50 hover:-translate-y-1 hover:shadow-xl"
                        style={{ backgroundColor: colors.surfaceDark }}>
                        <div className="absolute inset-0">
                            <div className="w-full h-full bg-[url('/assets/images/controle%20Biológico.png')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d]/90 to-transparent"></div>
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/5 text-emerald-400 border border-emerald-400/30">
                                Sustentável
                            </span>
                        </div>

                        <div className="relative p-8 h-full flex flex-col justify-end z-10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner mb-4">
                                <Bug className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Controle Biológico</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">Dispersão de agentes biológicos (Cotesia, Trichogramma) para controle efetivo de pragas com zero resíduo.</p>
                        </div>
                    </article>

                    <article className="relative group overflow-hidden rounded-3xl border border-white/5 transition-all duration-300 hover:border-[#047756]/50 hover:-translate-y-1 hover:shadow-xl"
                        style={{ backgroundColor: colors.surfaceDark }}>
                        <div className="absolute inset-0">
                            <div className="w-full h-full bg-[url('/assets/images/Contagemdeplantas.jpg')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d]/90 to-transparent"></div>
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/5 text-purple-400 border border-purple-400/30">
                                IA + Drone
                            </span>
                        </div>

                        <div className="relative p-8 h-full flex flex-col justify-end z-10">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner mb-4">
                                <Scan className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Contagem de Estande</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">Relatórios rápidos de população de plantas por metro quadrado para decisão de replantio em até 24h.</p>
                        </div>
                    </article>

                    <article className="relative group overflow-hidden rounded-3xl border border-white/5 transition-all duration-300 hover:border-[#047756]/50 hover:-translate-y-1 hover:shadow-xl"
                        style={{ backgroundColor: colors.surfaceDark }}>
                        <div className="absolute inset-0">
                            <div className="w-full h-full bg-[url('/assets/images/Aplicação%20Taxa%20Variável.jpg')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d]/90 to-transparent"></div>
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/5 text-red-400 border border-red-400/30">
                                Economia
                            </span>
                        </div>

                        <div className="relative p-8 h-full flex flex-col justify-end z-10">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shadow-inner mb-4">
                                <Target className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Aplicação Taxa Variável</h4>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">Aplicação localizada apenas onde existe a planta daninha ou a necessidade, economizando até 40% de insumo.</p>
                        </div>
                    </article>

                    {/* 7. DESSECAÇÃO (NEW - Option 3) */}
                    <article className="relative group overflow-hidden rounded-3xl md:col-span-2 border border-white/5 transition-all duration-500 hover:border-[#047756]/50 hover:shadow-2xl"
                        style={{ backgroundColor: colors.surfaceDark }}>
                        <div className="absolute inset-0">
                            <div className="w-full h-full bg-[url('/assets/images/dessecacao-soja-em-pre-colheita-embrapa-1280x720.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d]/90 via-[#0f231d]/40 to-transparent"></div>
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/60 text-amber-500 border border-amber-500/30 backdrop-blur-md">
                                Colheita Limpa
                            </span>
                        </div>

                        <div className="relative p-8 h-full flex flex-col justify-end z-10">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner mb-4">
                                <Timer className="w-6 h-6" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Dessecação Pré-Colheita</h4>
                            <p className="text-sm text-gray-300 leading-relaxed mb-4 max-w-2xl">Uniformização da lavoura para garantir que a máquina entre no tempo certo. Evita "buchas", perda de grãos e umidade excessiva na entrega.</p>
                        </div>
                    </article>

                </div>

                {/* CTA for Services */}
                <div className="mt-16 text-center animate-fade-in">
                    <Link href={whatsappLink}
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#047756] text-white font-bold text-lg hover:bg-[#036c4e] transition-all hover:scale-105 shadow-[0_20px_40px_-10px_rgba(4,119,86,0.4)] group">
                        Solicitar Orçamento Personalizado
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-4 text-gray-500 text-sm font-medium">Resposta rápida via WhatsApp • Sem compromisso</p>
                </div>
            </div>
        </section>
    )
}
