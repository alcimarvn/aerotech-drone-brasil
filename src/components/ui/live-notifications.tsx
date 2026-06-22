"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, Plane, CheckCircle2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const NOTIFICATIONS = [
    { text: "Drone T50 decolando para missão em Zé Doca/MA", icon: Plane, city: "Zé Doca" },
    { text: "Laudo Técnico (ART) emitido para Fazenda em Buriticupu/MA", icon: ShieldCheck, city: "Buriticupu" },
    { text: "Aplicação Taxa Variável finalizada com economia de 32%", icon: CheckCircle2, city: "Araguanã" },
    { text: "Nova consultoria iniciada em Santa Luzia do Paruá", icon: MapPin, city: "Santa Luzia" },
    { text: "Drone T40 em operação: Controle de Pragas em área de pastagem", icon: Plane, city: "Balsas" },
    { text: "Eng. Agrônomo Alcimar finalizou diagnóstico de área em Grajaú", icon: ShieldCheck, city: "Grajaú" }
];

export function LiveNotifications() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Initial delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
                setIsVisible(true);
            }, 1000); // Time to hide before showing next

        }, 15000); // Show every 15 seconds

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const current = NOTIFICATIONS[currentIndex];

    return (
        <div
            className={cn(
                "fixed bottom-24 left-4 md:left-8 z-[90] transition-all duration-1000 transform",
                isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-90 pointer-events-none"
            )}
        >
            <div className="relative group">
                <Link
                    href="#contato"
                    className="bg-[#162e26]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[320px] hover:bg-[#1c3a30] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 relative">
                        <current.icon className="w-6 h-6 text-emerald-500" />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#162e26] animate-pulse"></div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live: Aerotech em Campo</span>
                        </div>
                        <p className="text-white text-[11px] font-medium leading-normal tracking-tight">
                            {current.text}
                        </p>
                    </div>
                </Link>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsVisible(false);
                    }}
                    className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                    aria-label="Fechar notificação"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-emerald-500/10 blur-xl -z-10 rounded-full"></div>
        </div>
    )
}
