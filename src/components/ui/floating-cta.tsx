"use client"

import React, { useState, useEffect } from "react"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FloatingCTAProps {
    whatsappLink: string;
}

export function FloatingCTA({ whatsappLink }: FloatingCTAProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show card after 500px of scrolling
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // If not visible at all (scrolled up), return null
    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-8 right-8 z-[100] transition-all duration-700 transform",
                isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-90 pointer-events-none"
            )}
        >
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                {isMinimized ? (
                    // MINIMIZED STATE: Small Floating Circle
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="relative bg-[#0f231d] border border-white/10 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-pulse-slow group/min focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f231d]"
                        aria-label="Expandir consultoria gratuita"
                        aria-expanded={!isMinimized}
                    >
                        <WhatsAppIcon className="w-7 h-7" />

                        {/* Persistent Notification Badge */}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] font-bold text-white items-center justify-center">1</span>
                        </span>

                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-bold whitespace-nowrap opacity-0 group-hover/min:opacity-100 transition-opacity pointer-events-none border border-white/10 uppercase tracking-widest">
                            Consultoria Disponível
                        </div>
                    </button>
                ) : (
                    // FULL STATE: Premium Card
                    <div className="relative bg-[#0f231d]/95 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col gap-4 max-w-[280px] animate-pulse-slow">
                        {/* Close/Minimize Button */}
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
                            title="Recolher"
                            aria-label="Recolher consultoria gratuita"
                            aria-expanded={!isMinimized}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold tracking-tight">Consultoria Gratuita</p>
                                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Disponível Agora</p>
                            </div>
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed pr-6">
                            Fale com um engenheiro e receba um orçamento personalizado para sua área.
                        </p>

                        <Link
                            href={whatsappLink}
                            className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-5px_rgba(5,150,105,0.4)] group/btn relative"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            FALAR NO WHATSAPP
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />

                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-[8px] font-bold text-white items-center justify-center">1</span>
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
