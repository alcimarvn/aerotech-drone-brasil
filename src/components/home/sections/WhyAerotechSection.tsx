"use client"

import React, { useState } from "react"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { colors } from "@/lib/colors"

const carouselImages = [
    "/assets/images/Aplicação%20Taxa%20Variável.jpg",
    "/assets/images/Contagemdeplantas.jpg",
    "/assets/images/controle%20Biológico.png",
    "/assets/images/dessecacao-soja-em-pre-colheita-embrapa-1280x720.jpg",
    "/assets/images/drone_preservacao.webp",
    "/assets/images/semeadura.webp"
]

interface WhyAerotechSectionProps {
    whatsappLink: string;
}

export function WhyAerotechSection({ whatsappLink }: WhyAerotechSectionProps) {
    const [carouselIndex, setCarouselIndex] = useState(0)

    // Auto-play for Why Aerotech Carousel (6 seconds)
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="diferenciais" className="py-24 border-y border-white/5 bg-[#0f231d]" aria-label="Diferenciais">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-4xl font-bold text-white mb-8 leading-tight">Por que escolher a <span className="text-[#047756]">Aerotech</span>?</h2>
                        <p className="text-gray-400 mb-10 text-lg leading-relaxed">Não somos apenas "pilotos de drone". Somos uma consultoria agronômica que usa tecnologia para resolver problemas reais no campo.</p>

                        <div className="space-y-6">
                            {[
                                { title: "Economia Comprovada", desc: "Redução de até 30% em defensivos via taxa variável." },
                                { title: "Entrega Rápida", desc: "Capacidade de cobrir grandes áreas em janelas curtas de tempo." },
                                { title: "Zero Amassamento", desc: "Ganhe até 5% a mais de produtividade evitando o rastro do trator." },
                                { title: "Acesso Difícil", desc: "Operamos em áreas de baixada, morro e solo úmido onde máquinas não entram." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-[#047756]/20 flex items-center justify-center group-hover:bg-[#047756] transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-[#047756] group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <Link href={whatsappLink} className="text-[#047756] font-bold inline-flex items-center hover:text-white transition-colors">
                                Falar com Especialista <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                        {/* Carousel Images */}
                        {carouselImages.map((src, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === carouselIndex ? "opacity-100" : "opacity-0"}`}
                            >
                                <img
                                    src={src}
                                    alt={`Aerotech Operation ${index + 1}`}
                                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[10s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f231d] to-transparent opacity-80"></div>
                            </div>
                        ))}

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-6 left-6 flex gap-2 z-10">
                            {carouselImages.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === carouselIndex ? "w-8 bg-[#047756]" : "w-2 bg-white/30"}`}
                                ></div>
                            ))}
                        </div>

                        {/* Floating Stats Card in Image */}
                        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <div className="text-center">
                                <span className="block text-3xl font-black text-white">150+</span>
                                <span className="text-[10px] text-gray-300 uppercase tracking-wider font-bold">Clientes Atendidos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
