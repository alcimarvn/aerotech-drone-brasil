"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState("inicio")
    const whatsappLink = "https://wa.me/559888281228"

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        // Scroll Spy Logic
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the upper part of viewport
            threshold: 0
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        // Sections to observe
        const sections = ['inicio', 'servicos', 'sobre', 'galeria', 'diferenciais', 'prova-real', 'metodologia', 'faq', 'contato']
        sections.forEach(id => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
            observer.disconnect()
        }
    }, [])

    const navLinks = [
        { name: "Início", href: "#inicio", id: "inicio" },
        { name: "Quem Somos", href: "#sobre", id: "sobre" },
        { name: "Serviços", href: "#servicos", id: "servicos" },
        { name: "Resultados", href: "#galeria", id: "galeria" },
        { name: "Contato", href: "#contato", id: "contato" },
    ]

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full",
            scrolled
                ? "bg-white/60 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-2"
                : "bg-white/[0.04] backdrop-blur-md border-transparent py-4"
        )}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Area */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center group">
                            <img
                                src="/assets/images/logo.png"
                                alt="Aerotech Drones Logo"
                                className={cn(
                                    "h-10 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105",
                                    !scrolled && "brightness-0 invert"
                                )}
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        <ul className="flex items-center gap-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "relative text-[11px] uppercase tracking-[0.15em] font-bold transition-all duration-300 px-5 py-2.5 rounded-full group/nav flex items-center justify-center",
                                            activeSection === link.id
                                                ? (scrolled ? "text-emerald-600 bg-emerald-50/80" : "text-white bg-white/20")
                                                : (scrolled ? "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50" : "text-white/80 hover:text-white hover:bg-white/10")
                                        )}
                                    >
                                        <span className="relative z-10">{link.name}</span>

                                        {/* Refined Indicator */}
                                        <span className={cn(
                                            "absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-emerald-600 transition-all duration-300 group-hover/nav:w-4",
                                            activeSection === link.id ? "w-4 opacity-100" : "w-0 opacity-0 group-hover/nav:opacity-100",
                                            !scrolled && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                        )}></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className={cn(
                            "h-5 w-px mx-2 transition-colors duration-500",
                            scrolled ? "bg-slate-200" : "bg-white/10"
                        )}></div>

                        {/* CTA Button with Shimmer */}
                        <Button asChild className={cn(
                            "relative overflow-hidden font-black text-[11px] uppercase tracking-[0.15em] rounded-xl px-8 h-12 transition-all duration-500 active:scale-95 group/cta shadow-xl",
                            scrolled
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/10"
                                : "bg-white text-emerald-950 hover:bg-emerald-50 shadow-white/5"
                        )}>
                            <Link href={whatsappLink}>
                                {/* Shimmer Effect Layer */}
                                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cta:animate-shimmer pointer-events-none"></div>

                                <WhatsAppIcon className="mr-2 h-4 w-4 transition-all duration-500 group-hover/cta:-rotate-12 group-hover/cta:scale-110" />
                                <span className="relative z-10">Orçamento</span>
                            </Link>
                        </Button>
                    </nav>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação" className={cn(
                                    "rounded-xl transition-all active:scale-90",
                                    scrolled ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"
                                )}>
                                    <Menu className="h-7 w-7" aria-hidden="true" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[#0f231d]/98 backdrop-blur-2xl p-0 w-[300px] border-l border-white/10 overflow-hidden">
                                <div className="p-8 h-full flex flex-col relative">
                                    {/* Logo in drawer */}
                                    <div className="mb-12 flex justify-center border-b border-white/5 pb-8">
                                        <img src="/assets/images/logo.png" alt="Logo" className="h-10 w-auto brightness-0 invert" />
                                    </div>

                                    <nav className="flex flex-col gap-4">
                                        {navLinks.map((link, index) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className={cn(
                                                    "group flex items-center justify-between p-4 rounded-2xl transition-all text-sm uppercase tracking-widest font-black",
                                                    activeSection === link.id
                                                        ? "bg-white/10 text-white"
                                                        : "text-white/70 hover:text-white hover:bg-white/5"
                                                )}
                                                style={{ transitionDelay: `${index * 50}ms` }}
                                            >
                                                <span>{link.name}</span>
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                                                    activeSection === link.id ? "scale-100" : "scale-0 group-hover:scale-100"
                                                )}></div>
                                            </Link>
                                        ))}
                                    </nav>

                                    <div className="mt-auto pt-8 border-t border-white/5">
                                        <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black h-16 text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-950/20 active:scale-95 transition-all">
                                            <Link href={whatsappLink}>
                                                <WhatsAppIcon className="mr-3 h-5 w-5" />
                                                Falar Agora
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </div>
            </div>
        </header>
    )
}
