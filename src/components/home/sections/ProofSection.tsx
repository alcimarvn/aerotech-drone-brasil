"use client"

import { colors } from "@/lib/colors"
import { ComparisonSlider } from "@/components/ui/comparison-slider"
import { ProfitCalculator } from "../ProfitCalculator"

interface ProofSectionProps {
    whatsappLink: string;
}

export function ProofSection({ whatsappLink }: ProofSectionProps) {
    return (
        <section id="prova-real" className="py-24 relative overflow-hidden" style={{ backgroundColor: colors.surfaceDark }} aria-label="Comparativo de Resultados">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-3 text-amber-500">Prova Real</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Zero Amassamento = Lucro</h3>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Compare a aplicação tradicional com trator vs. drone e veja quanto você está deixando de ganhar.</p>
                </div>

                <div className="flex flex-col gap-12 lg:gap-16">
                    {/* Visual Comparison */}
                    <div className="relative h-[400px] sm:h-[500px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#3a3d40]">
                        <div className="absolute inset-0 bg-gray-800">
                            <div className="absolute inset-0 bg-[url('/assets/images/drone_amassamento_zero.webp')] bg-cover bg-center">
                                <span className="absolute top-8 right-8 bg-emerald-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold shadow-lg z-10">DRONE (0% Perda)</span>
                            </div>
                        </div>
                        <ComparisonSlider />
                    </div>

                    {/* Profit Calculator Component */}
                    <div className="w-full max-w-4xl mx-auto">
                        <ProfitCalculator whatsappLink={whatsappLink} />
                    </div>
                </div>
            </div>
        </section>
    )
}
