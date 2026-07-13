"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone, Send, ShieldCheck, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"

export function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-[#0a1a15] to-[#050c0a] text-slate-300 py-20 border-t border-white/5 overflow-hidden">
            {/* Visual Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">

                    {/* Column 1: Brand & Authority */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/assets/images/logo.png"
                                alt="Aerotech Drones Logo"
                                className="h-10 w-auto object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white tracking-tighter leading-none">
                                    AEROTECH<span className="text-emerald-500">DRONES</span>
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/80 font-bold mt-1">Brasil</span>
                            </div>
                        </Link>

                        <div className="space-y-3">
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                Líder em pulverização aérea e inteligência agronômica com drones de alta performance.
                            </p>
                            <div className="flex items-center gap-2 py-2 px-3 bg-white/5 border border-white/5 rounded-lg w-fit">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Resp. Técnica: Eng. Agrônomo Alcimar</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {[
                                { name: "Instagram", icon: Instagram, href: "https://instagram.com/aerotechdronesbrasil" },
                                { name: "LinkedIn", icon: Linkedin, href: "#" },
                                { name: "Facebook", icon: Facebook, href: "#" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    aria-label={`Visitar nosso perfil no ${social.name}`}
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 hover:-translate-y-1 group outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                >
                                    <social.icon aria-hidden="true" className="w-5 h-5 transition-transform group-hover:scale-110" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-emerald-500 rounded-full"></span>
                            Navegação
                        </h4>
                        <ul className="grid grid-cols-1 gap-4">
                            {[
                                { name: "Início", href: "#inicio" },
                                { name: "Serviços", href: "#servicos" },
                                { name: "Diferenciais", href: "#servicos" },
                                { name: "Contato", href: "#contato" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                                        <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-emerald-500 rounded-full"></span>
                            Sede & Contato
                        </h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start gap-4 group">
                                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                    <WhatsAppIcon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">WhatsApp</p>
                                    <Link href="https://wa.me/559888281228" className="text-white font-bold hover:text-emerald-400 transition-colors">(98) 8828-1228</Link>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">E-mail</p>
                                    <span className="text-white font-medium">contato@aerotechdrones.com.br</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Logística Maranhão</p>
                                    <span className="text-white font-medium">Zé Doca & Buriticupu</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-emerald-500 rounded-full"></span>
                            Informativo
                        </h4>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Receba atualizações sobre tecnologias de precisão e operações no campo.
                        </p>
                        <form className="relative group/form" onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="newsletter-email" className="sr-only">Seu e-mail</label>
                            <input
                                id="newsletter-email"
                                type="email"
                                placeholder="Seu e-mail..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                            />
                            <button aria-label="Inscrever-se no informativo" className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-lg transition-all flex items-center justify-center group/btn shadow-[0_0_15px_rgba(5,150,105,0.3)] outline-none focus-visible:ring-2 focus-visible:ring-white">
                                <Send aria-hidden="true" className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                            </button>
                        </form>

                        <div className="mt-8 flex flex-col gap-2">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold mb-1">Conformidade Técnica</p>
                            <div className="flex flex-wrap gap-2">
                                {['CAAR', 'MAPA', 'ANAC', 'DECEA'].map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-slate-500 font-medium">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p>&copy; {new Date().getFullYear()} Aerotech Drones Brasil. Todos os direitos reservados.</p>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Política de Privacidade</Link>
                            <Link href="/terms" className="hover:text-emerald-500 transition-colors">Termos de Uso</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Atuação Nacional</span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <p>Desenvolvido por <span className="text-emerald-600 font-bold">Aerotech Tech-Team</span></p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
