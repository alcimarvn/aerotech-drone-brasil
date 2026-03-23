"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown } from "lucide-react"
import { colors } from "@/lib/colors"
import { cn } from "@/lib/utils"

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24" style={{ backgroundColor: colors.surfaceDark }} aria-label="Perguntas Frequentes">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold text-white mb-4">Dúvidas Técnicas</h2>
                    <p className="text-gray-400 text-lg">Respostas diretas para quem entende do campo.</p>
                </div>

                <div className="grid gap-6">
                    {[
                        { q: "Dá para jogar adubo e semente de pastagem também?", a: "Com certeza. O Drone T50 tem um sistema de dispersão de sólidos de alta precisão. Aplicamos soja, milho, braquiária e diversos tipos de adubo granulado com uniformidade total, sem as falhas do sistema manual." },
                        { q: "O custo por hectare compensa? É mais barato que o trator?", a: "A conta fecha rápido. Além de economizar diesel e manutenção do trator, você elimina o gasto com operador e ganha no tempo. Mas o lucro real vem da parte da lavoura que você deixa de esmagar." },
                        { q: "A Aerotech é independente ou eu que tenho que dar água e gerador?", a: "Nós chegamos com a estrutura completa. Nossa unidade móvel tem gerador próprio, reserva de água e equipe de apoio. Você só aponta o talhão e a gente cuida do resto, sem dar trabalho para a fazenda." },
                        { q: "Vocês fazem a aplicação em área total ou só em mancha?", a: "Atendemos os dois casos. Cobrimos talhões inteiros com rapidez ou fazemos a aplicação localizada (cata-cata) em reboleiras de plantas daninhas ou focos de pragas, economizando produto onde não precisa." },
                        { q: "Quanto eu ganho de verdade parando de amassar minha soja com o trator?", a: "O amassamento rouba de 3% a 5% da sua produção. Em uma área de 1.000 hectares, isso são 50 hectares que você joga no lixo todo ano. Com o drone, esse valor volta direto para o seu bolso logo na primeira safra." }
                    ].map((item, idx) => {
                        const isOpen = activeIndex === idx;
                        return (
                            <article
                                key={idx}
                                className={cn(
                                    "rounded-[2rem] bg-white/5 border transition-all duration-500 overflow-hidden",
                                    isOpen ? "border-emerald-500/50 bg-white/10" : "border-white/5 hover:border-emerald-500/30 hover:bg-white/10"
                                )}
                            >
                                <button
                                    onClick={() => setActiveIndex(isOpen ? null : idx)}
                                    className="w-full p-8 flex items-center justify-between text-left group"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${idx}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                                            isOpen ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500"
                                        )}>
                                            <HelpCircle className="w-6 h-6" />
                                        </div>
                                        <h4 id={`faq-question-${idx}`} className={cn(
                                            "text-xl font-bold transition-colors",
                                            isOpen ? "text-emerald-500" : "text-white"
                                        )}>{item.q}</h4>
                                    </div>
                                    <ChevronDown className={cn(
                                        "w-6 h-6 text-gray-500 transition-transform duration-500",
                                        isOpen ? "rotate-180 text-emerald-500" : "group-hover:text-white"
                                    )} />
                                </button>

                                <div
                                    id={`faq-answer-${idx}`}
                                    role="region"
                                    aria-labelledby={`faq-question-${idx}`}
                                    className={cn(
                                        "transition-all duration-500 ease-in-out",
                                        isOpen ? "max-h-[500px] opacity-100 mb-8 px-8 ml-12" : "max-h-0 opacity-0 pointer-events-none"
                                    )}
                                >
                                    <div className="pl-6 border-l-2 border-emerald-500/30">
                                        <p className="text-gray-400 leading-relaxed text-lg">{item.a}</p>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
