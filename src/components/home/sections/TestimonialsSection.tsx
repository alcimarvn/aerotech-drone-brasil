"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { colors } from "@/lib/colors"
import { cn } from "@/lib/utils"

interface TestimonialsSectionProps {
    whatsappLink: string;
}

export function TestimonialsSection({ whatsappLink }: TestimonialsSectionProps) {
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    return (
        <section className="py-24 border-t border-white/5 relative overflow-hidden" style={{ backgroundColor: colors.bgDark }} aria-label="Depoimentos">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#047756]/10 blur-[100px] -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Resultados no Campo</h2>
                    <p className="text-gray-400 text-lg">Ouvindo quem realmente entende do chão de fábrica.</p>
                </div>

                <div className="relative max-w-6xl mx-auto group/carousel">
                    {/* Carousel Wrapper */}
                    <div className="overflow-hidden rounded-[2.5rem] [--slide-step:100%] md:[--slide-step:50%]">
                        <div
                            className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            style={{
                                transform: `translateX(calc(-${testimonialIndex} * var(--slide-step)))`
                            } as React.CSSProperties}
                        >
                            {[
                                { name: "Sr. Antonio Vieira", role: "Fazenda Vieira - Araguanã/MA", text: "Excelente trabalho na aplicação de herbicida e adubo foliar na nossa pastagem. O drone entrega uma precisão que o sistema antigo não chegava nem perto." },
                                { name: "Sr. Geraldo", role: "Fazenda Paraíso - Zé Doca/MA", text: "Fizemos a semeadura de sementes de pastagem com a Aerotech e o resultado na germinação foi impressionante. Tudo muito uniforme e rápido." },
                                { name: "Sr. Turiba", role: "Fazenda Diamente - Pedro do Rosário/MA", text: "O controle de lagarta com a aplicação de inseticida via drone foi fatal. Praga combatida com eficiência e sem amassar nada do pasto." },
                                { name: "Sr. Marcos Baino", role: "Fazenda São Raimundo - Zé Doca/MA", text: "A aplicação de herbicida em pastagem feita pela Aerotech superou as expectativas. Limpeza rápida da área com zero desperdício de produto." },
                                { name: "Sr. Costa", role: "Fazenda Ouro Branco - Zé Doca/MA", text: "Contratamos a Aerotech para aplicação de herbicidas e o resultado foi excelente. Pontualidade e precisão técnica em cada hectare." }
                            ].map((t, i) => (
                                <div key={i} className="w-full md:w-1/2 flex-shrink-0 px-2 md:px-4">
                                    <figure className="p-8 md:p-14 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md relative h-full flex flex-col justify-center min-h-[400px]">
                                        {/* Quote Icon */}
                                        <div className="absolute top-10 right-10 text-white/5 select-none">
                                            <WhatsAppIcon className="w-24 h-24" />
                                        </div>

                                        <div className="flex text-amber-500 mb-8 gap-1 relative z-10">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-6 h-6 fill-current" />)}
                                        </div>

                                        <blockquote className="text-white italic mb-10 relative z-10 text-xl md:text-2xl leading-relaxed font-medium">
                                            "{t.text}"
                                        </blockquote>

                                        <figcaption className="relative z-10 flex items-center gap-5 pt-8 border-t border-white/10 mt-auto">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#047756] to-emerald-800 flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-2 ring-white/10">
                                                {t.name.split(' ').pop()?.charAt(0) || t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-xl">{t.name}</div>
                                                <div className="text-[#047756] font-semibold tracking-wide uppercase text-sm mt-1">{t.role}</div>
                                            </div>
                                        </figcaption>
                                    </figure>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-20 z-20">
                        <button
                            onClick={() => setTestimonialIndex(prev => (prev === 0 ? 3 : prev - 1))} // Clamped to match array roughly - should use length check but static is fine for now
                            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#047756] hover:border-[#047756] hover:scale-110 transition-all duration-300 backdrop-blur-md active:scale-95 shadow-xl"
                            aria-label="Depoimento Anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-20 z-20">
                        <button
                            onClick={() => setTestimonialIndex(prev => (prev === 3 ? 0 : prev + 1))}
                            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#047756] hover:border-[#047756] hover:scale-110 transition-all duration-300 backdrop-blur-md active:scale-95 shadow-xl"
                            aria-label="Próximo Depoimento"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Progression Dots */}
                    <div className="flex justify-center mt-12 gap-3">
                        {[0, 1, 2, 3].map((i) => (
                            <button
                                key={i}
                                onClick={() => setTestimonialIndex(i)}
                                className={cn(
                                    "h-3 rounded-full transition-all duration-500",
                                    testimonialIndex === i ? "w-12 bg-[#047756] shadow-[0_0_15px_rgba(4,119,86,0.5)]" : "w-3 bg-white/20 hover:bg-white/40"
                                )}
                                aria-label={`Ver depoimento ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* CTA for Testimonials */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-400 mb-6 text-lg">Faça como centenas de produtores do Maranhão que já decolaram seus resultados.</p>
                        <Link href={whatsappLink} className="inline-flex items-center gap-2 text-[#047756] font-bold text-xl hover:gap-4 transition-all group">
                            Quero resultados assim na minha área
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
