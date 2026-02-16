"use client"

import React, { useState, useRef } from "react"
import { MoveHorizontal } from "lucide-react"

export function ComparisonSlider() {
    const [sliderValue, setSliderValue] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderValue(percentage);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderValue(percentage);
        }
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 cursor-ew-resize"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* BEFORE Image (Trator - Top Layer, clipped) */}
            <div
                className="absolute inset-0 bg-gray-900 border-r-2 border-white/30 overflow-hidden shadow-[5px_0_20px_rgba(0,0,0,0.5)] z-20"
                style={{ width: `${sliderValue}%` }}
            >
                {/* Image: Trator Amassamento */}
                <div className="absolute inset-0 w-[100vw] max-w-5xl h-full bg-[url('/assets/images/trator_amassamento.webp')] bg-cover bg-center"></div>

                <div className="absolute top-8 left-8 bg-red-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold shadow-lg whitespace-nowrap">
                    TRATOR (5% Perda)
                </div>
            </div>

            {/* AFTER Image (Drone - Bottom Layer) */}
            <div className="absolute inset-0 bg-[url('/assets/images/drone_preservacao.webp')] bg-cover bg-center">
                <span className="absolute top-8 right-8 bg-emerald-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg font-bold shadow-lg z-10">DRONE (0% Perda)</span>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-10 -ml-5 bg-transparent z-30 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderValue}%` }}
            >
                <div className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <MoveHorizontal className="w-6 h-6 text-[#047756]" />
                </div>
            </div>
        </div>
    )
}
