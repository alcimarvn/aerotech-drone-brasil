"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Map } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { Button } from "@/components/ui/button"
import { colors } from "@/lib/colors"

interface ContactSectionProps {
    whatsappLink: string;
}

export function ContactSection({ whatsappLink }: ContactSectionProps) {
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        property: '',
        city: '',
        culture: 'Soja',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const message = `*Nova Solicitação via Site Aerotech*%0A%0A*Nome:* ${formData.name}%0A*WhatsApp:* ${formData.whatsapp}%0A*Propriedade:* ${formData.property}%0A*Cidade:* ${formData.city}%0A*Cultura:* ${formData.culture}%0A*Mensagem:* ${formData.message}`;
            window.open(`https://wa.me/559888281228?text=${message}`, '_blank');
            setIsSubmitting(false);
        }, 1000);
    }

    return (
        <section id="contato" className="py-24 relative overflow-hidden" style={{ backgroundColor: colors.bgDark }} aria-label="Fale Conosco">
            {/* Visual Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#047756]/5 skew-x-12 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-amber-500/5 -skew-x-12 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Information Side */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: colors.accent }}>Decole sua Safra</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Pronto para a <span className="text-[#047756]">Transformação</span>?</h3>
                        <p className="text-gray-400 text-lg mb-12 max-w-lg leading-relaxed">
                            Solicite uma consultoria gratuita com nossos especialistas e descubra como a Aerotech pode reduzir seus custos e maximizar sua colheita.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: WhatsAppIcon, title: "WhatsApp Direct", info: "(98) 8828-1228", sub: "Atendimento imediato" },
                                { icon: FileText, title: "E-mail Técnico", info: "contato@aerotech.com.br", sub: "Projetos e Parcerias" },
                                { icon: Map, title: "Nossa Base", info: "Zé Doca / Balsas - MA", sub: "Atendimento em todo MATOPIBA" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#047756]/30 transition-all group cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-[#047756]/10 flex items-center justify-center group-hover:bg-[#047756]/20 transition-colors">
                                        <item.icon className="w-6 h-6 text-[#047756]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.title}</p>
                                        <p className="text-white font-bold text-lg">{item.info}</p>
                                        <p className="text-xs text-gray-400">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#047756]/20 to-amber-500/10 blur-3xl opacity-30"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 ml-1">Nome Completo</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#047756] transition-colors"
                                            placeholder="Sua identificação"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 ml-1">WhatsApp</label>
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            required
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#047756] transition-colors"
                                            placeholder="(99) 99999-9999"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 ml-1">Nome da Propriedade</label>
                                        <input
                                            type="text"
                                            name="property"
                                            value={formData.property}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#047756] transition-colors"
                                            placeholder="Ex: Fazenda Santa Fé"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 ml-1">Cidade / Estado</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#047756] transition-colors"
                                            placeholder="Ex: Balsas - MA"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">Cultura Principal</label>
                                    <div className="relative">
                                        <select
                                            name="culture"
                                            value={formData.culture}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#047756] transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="Soja" className="bg-[#0f231d]">Soja</option>
                                            <option value="Milho" className="bg-[#0f231d]">Milho</option>
                                            <option value="Pastagem" className="bg-[#0f231d]">Pastagem</option>
                                            <option value="Arroz" className="bg-[#0f231d]">Arroz</option>
                                            <option value="Outros" className="bg-[#0f231d]">Outros</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <ArrowRight className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 ml-1">Mensagem (Opcional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#047756] transition-colors h-32 resize-none"
                                        placeholder="Conte-nos sobre sua necessidade..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-amber-500 hover:bg-amber-400 text-[#0f231d] font-black py-8 rounded-2xl text-lg shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? "ENVIANDO..." : "SOLICITAR CONSULTORIA GRATUITA"}
                                    <ArrowRight className="w-6 h-6" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <aside className="fixed bottom-8 left-0 right-0 p-4 md:hidden z-50 flex justify-center pointer-events-none">
                <Link href={whatsappLink} className="pointer-events-auto bg-amber-500 text-[#0f231d] font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 w-full max-w-sm justify-center transform active:scale-95 transition-all animate-bounce hover:bg-amber-400 hover:scale-105">
                    <WhatsAppIcon className="w-6 h-6" />
                    <span className="text-lg">Falar com Engenheiro</span>
                </Link>
            </aside>
        </section>
    )
}
