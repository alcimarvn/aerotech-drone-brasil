"use client"

import React, { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Coins, Zap, Target, Wheat, Sprout, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProfitCalculatorProps {
    whatsappLink: string;
}

type Commodity = 'soja' | 'milho';

export function ProfitCalculator({ whatsappLink }: ProfitCalculatorProps) {
    const [commodity, setCommodity] = useState<Commodity>('soja');
    const [hectares, setHectares] = useState(500);
    const [productivity, setProductivity] = useState(65);
    const [pricePerBag, setPricePerBag] = useState(130);
    const [lossPercent, setLossPercent] = useState(4.0);
    const [lossValue, setLossValue] = useState(0);

    // Update presets when commodity changes
    useEffect(() => {
        if (commodity === 'soja') {
            setProductivity(65);
            setPricePerBag(130);
            setLossPercent(4.0);
        } else {
            setProductivity(120);
            setPricePerBag(55);
            setLossPercent(5.0);
        }
    }, [commodity]);

    useEffect(() => {
        // Calculation: Hectares * Productivity * Price * (Loss% / 100)
        const calculatedLoss = hectares * productivity * pricePerBag * (lossPercent / 100);
        setLossValue(calculatedLoss);
    }, [hectares, productivity, pricePerBag, lossPercent]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="w-full bg-[#162e26]/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Side: Controls */}
                    <div className="flex-1 space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-white font-black text-2xl flex items-center gap-3 mb-2">
                                    <Target className="w-6 h-6 text-emerald-500" />
                                    Simulador Técnico
                                </h4>
                                <p className="text-slate-400 text-sm">Personalize os fatores para uma estimativa real.</p>
                            </div>

                            {/* Commodity Selector Tags */}
                            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 w-fit self-start md:self-center">
                                <button
                                    onClick={() => setCommodity('soja')}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-black transition-all",
                                        commodity === 'soja' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    <Sprout className="w-4 h-4" />
                                    SOJA
                                </button>
                                <button
                                    onClick={() => setCommodity('milho')}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-black transition-all",
                                        commodity === 'milho' ? "bg-amber-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                    )}
                                >
                                    <Wheat className="w-4 h-4" />
                                    MILHO
                                </button>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Area Slider */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Área da Lavoura</span>
                                    <div className="text-4xl font-black text-white tracking-tighter">
                                        {hectares} <span className="text-lg text-emerald-500 uppercase tracking-widest">ha</span>
                                    </div>
                                </div>
                                <Slider
                                    value={[hectares]}
                                    onValueChange={(vals: number[]) => setHectares(vals[0])}
                                    max={10000}
                                    step={50}
                                    className="py-4"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {/* Productivity Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Produtividade</span>
                                        <div className="text-xl font-bold text-white">
                                            {productivity} <span className="text-xs text-slate-500 uppercase tracking-widest">sc/ha</span>
                                        </div>
                                    </div>
                                    <Slider
                                        value={[productivity]}
                                        onValueChange={(vals: number[]) => setProductivity(vals[0])}
                                        max={commodity === 'soja' ? 120 : 250}
                                        step={1}
                                        className="py-2"
                                    />
                                </div>

                                {/* Price Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Preço da Saca</span>
                                        <div className="text-xl font-bold text-white">
                                            R$ {pricePerBag}
                                        </div>
                                    </div>
                                    <Slider
                                        value={[pricePerBag]}
                                        onValueChange={(vals: number[]) => setPricePerBag(vals[0])}
                                        max={commodity === 'soja' ? 250 : 150}
                                        step={1}
                                        className="py-2"
                                    />
                                </div>

                                {/* Loss Slider */}
                                <div className="space-y-4 col-span-1 md:col-span-2">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Amassamento (Máquina Terrestre)</span>
                                            <div className="group relative">
                                                <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                                                    Média brasileira varia entre 3% e 7% dependendo da barra do pulverizador.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-red-400">
                                            {lossPercent.toFixed(1)}%
                                        </div>
                                    </div>
                                    <Slider
                                        value={[lossPercent * 10]}
                                        onValueChange={(vals: number[]) => setLossPercent(vals[0] / 10)}
                                        max={100}
                                        step={1}
                                        className="py-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Results */}
                    <div className="w-full lg:w-[420px] bg-gradient-to-br from-[#047756] to-emerald-900 rounded-[2rem] p-8 shadow-inner relative overflow-hidden group">
                        {/* Visual Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="space-y-8">
                                <div className="bg-black/20 p-3 rounded-xl w-fit">
                                    <TrendingUp className="w-8 h-8 text-white animate-bounce" />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-emerald-100/70 text-xs font-black uppercase tracking-widest">Lucro Adicional Recuperado:</p>
                                    <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                                        {formatCurrency(lossValue)}
                                    </div>
                                    <div className="h-1 w-20 bg-amber-500 rounded-full my-4"></div>
                                    <p className="text-emerald-200/60 text-[10px] font-bold uppercase tracking-wider">
                                        * Estimativa baseada na eliminação do amassamento por drones.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 space-y-4">
                                <div className="bg-black/20 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                                    <p className="text-[12px] text-emerald-100 font-medium leading-relaxed">
                                        Este valor representa o que o seu trator deixa de colher hoje. Com a tecnologia Aerotech, este desperdício torna-se lucro líquido direto no seu bolso.
                                    </p>
                                </div>

                                <Link href={whatsappLink} className="block">
                                    <Button className="w-full bg-white text-[#047756] hover:bg-emerald-50 h-[72px] rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-95 group/btn">
                                        RESGATAR MEU LUCRO
                                        <Zap className="w-6 h-6 group-hover/btn:fill-emerald-500 transition-all" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Tip */}
            <div className="bg-black/40 py-5 px-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>Custo de aplicação não incluso na simulação</span>
                </div>
                <Link href="#contato" className="text-emerald-500 text-xs font-black hover:text-emerald-400 transition-colors flex items-center gap-2 group/link">
                    SOLICITAR ESTUDO DE VIABILIDADE TÉCNICA
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
