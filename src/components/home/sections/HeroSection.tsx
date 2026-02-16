"use client"

import Link from "next/link"
import { ArrowRight, UserCog, FileText, ShieldCheck, Star } from "lucide-react"
import { colors } from "@/lib/colors"

interface HeroSectionProps {
    whatsappLink: string;
}

export function HeroSection({ whatsappLink }: HeroSectionProps) {
    return (
        <section id="inicio" className="relative min-h-screen flex items-start justify-start overflow-hidden group">
            {/* Background Video (CRO: Instant Impact) */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[20s] ease-out"
                    poster="/assets/images/hero-bg.jpeg"
                >
                    <source src="/assets/videos/DJI_0560.MP4" type="video/mp4" />
                </video>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d] via-[#0f231d]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div> {/* Extra dimming for text readability */}
                <div className="absolute inset-0 mix-blend-multiply opacity-30" style={{ backgroundColor: colors.primary }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-48 pb-24 sm:pb-32">

                {/* Social Proof Badge (CRO: Trust) */}
                <div className="mb-6 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-full">
                        <div className="flex -space-x-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className="w-3 h-3 text-amber-500 fill-current" />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Líder no Maranhão</span>
                    </div>
                </div>

                {/* Badges - SEMANTIC: Nav/List for badges */}
                <nav aria-label="Certificações" className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/5 text-white backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/10 transition-colors cursor-default">
                        <UserCog className="w-4 h-4 mr-2" style={{ color: colors.primary }} /> Eng. Agrônomo Responsável
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/5 text-white backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/10 transition-colors cursor-default">
                        <FileText className="w-4 h-4 mr-2" style={{ color: colors.primary }} /> Emissão de Laudo e ART
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/5 text-white backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/10 transition-colors cursor-default">
                        <ShieldCheck className="w-4 h-4 mr-2" style={{ color: colors.primary }} /> Frota Segurada
                    </span>
                </nav>

                {/* TYPOGRAPHY: Improved hierarchy using golden ratio-ish scaling */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-6 drop-shadow-2xl leading-[0.9]">
                    Tecnologia Aérea para <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#047756] to-[#4ade80]">Alta Produtividade</span>
                </h1>

                <p className="mt-4 max-w-2xl text-lg sm:text-2xl text-gray-300 mb-10 font-light leading-relaxed">
                    Especialistas em Soja, Milho e Pastagem no Maranhão. <strong className="text-white font-semibold">Economize até 30% em defensivos</strong> com aplicação de precisão e zero amassamento.
                </p>

                {/* CTA Optimizations (CRO: Choice Architecture) */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={whatsappLink}
                        className="group w-full sm:w-auto text-white font-bold py-4 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:bg-[#036c4e]"
                        style={{ backgroundColor: colors.primary, boxShadow: `0 20px 40px -10px ${colors.primary}66` }}>
                        Solicitar Orçamento
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
