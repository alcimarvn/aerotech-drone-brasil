"use client"

import React, { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import {
    Wifi,
    Signal,
    Battery,
    Timer,
    VolumeX,
    Volume2,
    Radar,
    Target,
    CheckCircle2,
    PlayCircle
} from "lucide-react"

export interface MissionCardProps {
    id: string;
    videoSrc: string;
    title: string;
    location: string;
    droneModel: string;
    description: string;
    stats: {
        alt: string;
        vel: string;
        flow: string;
        width: string;
        duration: string;
        battery: string;
    };
}

export function MissionCard({ id, videoSrc, title, location, droneModel, description, stats }: MissionCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);

    // Dynamic Stats State
    const [dynamicStats, setDynamicStats] = useState(stats);

    // Simulate Telemetry Fluctuation
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setDynamicStats(prev => ({
                    ...prev,
                    alt: (parseFloat(stats.alt) + (Math.random() * 0.4 - 0.2)).toFixed(1) + "m",
                    vel: (parseFloat(stats.vel.replace(/\D/g, '')) + (Math.random() * 2 - 1)).toFixed(0) + " km/h"
                }));
            }, 500); // Update every 500ms
        } else {
            setDynamicStats(stats); // Reset when paused
        }
        return () => clearInterval(interval);
    }, [isPlaying, stats]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    return (
        <article className="group relative rounded-[2.5rem] overflow-hidden border-8 border-[#3a3d40] bg-[#1a1c1e] shadow-2xl transition-all duration-500 hover:scale-[1.02] ring-1 ring-black/50">
            {/* Controller Frame Elements */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#2a2c2e] rounded-r-lg z-50 border-r border-white/5"></div>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-[#2a2c2e] rounded-l-lg z-50 border-l border-white/5"></div>

            {/* Screen Container */}
            <div className="relative aspect-[16/10] cursor-pointer bg-black overflow-hidden m-1 rounded-2xl" onClick={togglePlay}>
                {/* Main Video (The Camera Feed) */}
                <video
                    ref={videoRef}
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>

                {/* --- DJI TOP STATUS BAR --- */}
                <div className="absolute top-0 left-0 w-full z-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent pt-3 pb-8 px-4 flex justify-between items-start pointer-events-none font-mono">
                    <div className="flex flex-col gap-2">
                        {/* Mode Indicator */}
                        <div className="flex items-center bg-gradient-to-r from-[#047756] to-transparent pl-2 pr-12 py-1 border-l-4 border-white shadow-lg">
                            <div className="w-4 h-4 mr-2 bg-white flex items-center justify-center">
                                <span className="text-[10px] text-emerald-800 font-black">N</span>
                            </div>
                            <span className="text-[11px] text-white font-bold tracking-wider uppercase">Manual Route (GNSS)</span>
                        </div>

                        {/* Obstacle Alert - DJI Style */}
                        <div className={cn(
                            "flex items-center bg-red-600/90 text-white px-3 py-1.5 border border-red-500 shadow-xl transition-all duration-500 origin-left max-w-[220px]",
                            isPlaying ? "opacity-100 scale-100" : "opacity-0 scale-90"
                        )}>
                            <div className="mr-2 animate-pulse">⚠️</div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black leading-tight uppercase">Obstacle above aircraft</span>
                                <span className="text-[8px] opacity-80 leading-tight">Fly with caution</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-white pointer-events-auto">
                        {/* System Icons */}
                        <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                            <div className="flex items-center gap-1 group/wifi">
                                <Wifi className="w-3.5 h-3.5 text-white" />
                                <span className="text-[10px] font-bold">15</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Signal className="w-3.5 h-3.5 text-white" />
                                <span className="text-[10px] font-bold">RC</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-white/20 pl-3">
                                <Battery className="w-3.5 h-3.5 text-[#4ade80]" />
                                <span className="text-[10px] font-black tracking-tighter text-[#4ade80]">48%</span>
                            </div>
                            <div className="flex items-center gap-1 border-l border-white/20 pl-3">
                                <Timer className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] font-bold tabular-nums">0.00</span>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleMute(e); }} className="hover:text-emerald-400 transition-colors bg-black/40 p-2 rounded-full backdrop-blur-md border border-white/10">
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
                        </button>
                    </div>
                </div>

                {/* --- CENTRAL HUD --- */}
                {/* Distance Indicator (Red Arc) */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-24 border-t-4 border-red-500/40 rounded-t-full pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-red-500 font-black tracking-widest mt-4">3.1m</span>
                </div>

                {/* Main Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                    <div className="relative w-48 h-1 flex items-center justify-between opacity-50">
                        <div className="w-20 h-px bg-white border-y border-white/20"></div>
                        <div className="w-2 h-2 rounded-full border border-white flex items-center justify-center">
                            <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                        <div className="w-20 h-px bg-white border-y border-white/20"></div>
                    </div>
                    <div className="absolute w-1 h-32 flex flex-col justify-between opacity-50">
                        <div className="h-12 w-px bg-white border-x border-white/20"></div>
                        <div className="h-12 w-px bg-white border-x border-white/20"></div>
                    </div>
                    {/* Tick marks */}
                    <div className="absolute gap-1 flex opacity-30">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-[1px] h-1.5 bg-white"></div>)}
                    </div>
                </div>

                {/* --- BOTTOM TELEMETRY GRID (DJI STYLE) --- */}
                <div className="absolute bottom-3 left-0 w-full px-4 flex justify-between items-end z-40 pointer-events-none">
                    {/* Mini Map Inset */}
                    <div className="w-24 aspect-[4/3] bg-black border border-white/20 rounded-lg shadow-2xl overflow-hidden group/map pointer-events-auto">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=200')] bg-cover opacity-60"></div>
                        <div className="absolute top-1 left-1 bg-black/60 px-1 rounded text-[7px] text-white/70">SAT</div>
                    </div>

                    {/* Central Radar Circular */}
                    <div className="relative w-16 h-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center group/radar">
                        <div className="absolute inset-0 rounded-full border border-[#4ade80]/10 border-dashed animate-spin-slow"></div>
                        <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_red]"></div>
                        <div className="absolute top-0.5 text-[7px] font-black text-white/30">N</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Radar className="w-8 h-8 text-[#4ade80]/15" />
                        </div>
                    </div>

                    {/* Technical Stats Block */}
                    <div className="bg-black/40 backdrop-blur-md px-3 py-2 border border-white/5 rounded-xl flex gap-4 pointer-events-auto shadow-2xl">
                        <div className="grid grid-cols-3 gap-x-4 gap-y-1 font-mono">
                            <div className="flex flex-col">
                                <span className="text-[7px] text-white/60 font-black uppercase">Alt(m)</span>
                                <span className="text-sm text-white font-bold tabular-nums tracking-tighter">{dynamicStats.alt.replace('m', '')}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[7px] text-white/60 font-black uppercase">Spd(m/s)</span>
                                <span className="text-sm text-white font-bold tabular-nums tracking-tighter">{(parseFloat(dynamicStats.vel) / 3.6).toFixed(1)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[7px] text-white/60 font-black uppercase">Dist(m)</span>
                                <span className="text-sm text-white font-bold tabular-nums tracking-tighter">124.5</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[7px] text-white/60 font-black uppercase">Flow(L)</span>
                                <span className="text-sm text-white font-bold tabular-nums tracking-tighter text-emerald-400">{dynamicStats.flow.split(' ')[0]}</span>
                            </div>
                            <div className="flex flex-col col-span-2">
                                <span className="text-[7px] text-white/60 font-black uppercase">Comp(Ha)</span>
                                <span className="text-sm text-white font-bold tabular-nums tracking-tighter">0.0</span>
                            </div>
                        </div>

                        {/* Control Buttons Side */}
                        <div className="flex flex-col gap-1 border-l border-white/10 pl-4 items-center justify-center">
                            <div className="text-white/80 hover:text-white cursor-pointer transition-colors p-1 bg-white/5 rounded">
                                <div className="w-3 h-3 border border-white/20 rounded-sm flex items-center justify-center text-[7px] font-bold">+</div>
                            </div>
                            <Target className="w-3 h-3 text-white/20" />
                            <CheckCircle2 className="w-3 h-3 text-white/20" />
                        </div>
                    </div>
                </div>

                {/* --- VIDEO PROGRESS BAR (DJI STYLE) --- */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
                    <div
                        className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Center Play Button Overlay */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-50 transition-all duration-500 group-hover:bg-black/20">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl scale-125 group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-10 h-10 text-white opacity-80" />
                        </div>
                    </div>
                )}
            </div>

            {/* Mission Log Info */}
            <div className="p-6 bg-[#1a1c1e] text-white">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="text-xl font-black tracking-tight mb-1 text-emerald-50">{title}</h4>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-0.5 rounded-md bg-emerald-500/5">{location}</span>
                            <span className="text-[10px] font-bold text-white/40 font-mono uppercase tracking-widest">{droneModel}</span>
                        </div>
                    </div>
                </div>

                <p className="text-white/60 text-sm mb-6 leading-relaxed font-medium line-clamp-2 italic pr-8">{description}</p>
            </div>
        </article>
    );
}
