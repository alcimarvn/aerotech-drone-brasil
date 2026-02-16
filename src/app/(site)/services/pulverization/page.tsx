
import Image from "next/image"
import Link from "next/link"
import { Check, Droplets, ArrowRight, Timer, ShieldCheck, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PulverizationPage() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero */}
            <section className="relative py-20 bg-green-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="container relative z-10 px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-white/20 text-sm uppercase tracking-wider font-bold">
                                Tecnologia Avançada
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                                Pulverização Aérea de Precisão
                            </h1>
                            <p className="text-lg text-green-100/90 leading-relaxed font-light">
                                Aplicação de defensivos com <strong>zero amassamento</strong> e controle total de deriva.
                                Tecnologia eletrostática que garante a cobertura ideal, mesmo nas partes baixas da planta.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Button size="lg" className="bg-white text-green-900 hover:bg-green-50 font-bold shadow-xl">
                                    <Link href="/contact">Solicitar Orçamento</Link>
                                </Button>
                            </div>
                        </div>
                        {/* Image Placeholder */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-2xl backdrop-blur-sm">
                            <div className="w-full h-full flex items-center justify-center text-white/50 bg-gradient-to-br from-green-800 to-black font-medium">
                                [Imagem: Drone Agrícola em Operação]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid - The "Why" */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Elimine as perdas do trator</h2>
                        <p className="text-slate-600 leading-relaxed">
                            O método convencional (tratorizado) causa compactação do solo e amassa até 5% da produção.
                            Com o drone, você preserva 100% da sua lavoura.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="pt-8 pb-8 px-6 space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 mb-2">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Zero Amassamento</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Não perca sacas de soja ou milho no rastro do pulverizador. O drone voa sobre a cultura, garantindo rendimento máximo por hectare.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="pt-8 pb-8 px-6 space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 mb-2">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Aplicação em Áreas Úmidas</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Seu trator atola após a chuva? O drone não. Realize aplicações de fungicida no momento crítico, sem depender da secagem do solo.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="pt-8 pb-8 px-6 space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700 mb-2">
                                    <Timer className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Rapidez Operacional</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Alta capacidade de cobertura diária. Ideal para controle de lagartas e percevejos que exigem ação imediata.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Technical Specs */}
            <section className="py-20 border-t border-slate-200">
                <div className="container px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                [Foto: Bico Rotativo em Ação]
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-6 rounded-xl border shadow-sm">
                                <p className="font-heading font-bold text-slate-900 mb-1">Tecnologia de Aplicação</p>
                                <p className="text-xs text-slate-500">
                                    Utilizamos bicos rotativos centrifugos que geram gotas uniformes (VC, M, F) conforme a necessidade agronômica.
                                </p>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 space-y-8">
                            <div>
                                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Especificações Técnicas</h2>
                                <p className="text-slate-600">
                                    Operamos com frota de Drones Agrícolas de última geração, monitorados por engenheiros agrônomos para garantir a eficácia biológica.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-lg h-fit">
                                        <Check className="w-5 h-5 text-green-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Radar de Terreno 360º</h4>
                                        <p className="text-sm text-slate-600">Copia o relevo automaticamente, mantendo a altura exata de voo (ex: 3m sobre o alvo) para uniformidade da faixa.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-lg h-fit">
                                        <Check className="w-5 h-5 text-green-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Vazão Variável (L/ha)</h4>
                                        <p className="text-sm text-slate-600">Sistema inteligente que ajusta a vazão conforme a velocidade do drone. Dose exata em cada metro quadrado.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 bg-green-100 p-2 rounded-lg h-fit">
                                        <Check className="w-5 h-5 text-green-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Faixa de Aplicação Otimizada</h4>
                                        <p className="text-sm text-slate-600">Faixas de 9 a 11 metros (dependendo da cultura/altura), garantindo alto rendimento operacional.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-3">Culturas Atendidas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["Soja", "Milho", "Arroz", "Pastagem", "Cana", "Eucalipto", "Hortifruti"].map((c) => (
                                        <Badge key={c} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">{c}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="container px-4">
                    <h2 className="text-3xl font-heading font-bold mb-6">Sua lavoura não pode esperar</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
                        Pragas e doenças agem rápido. Nossa equipe está pronta para mobilização imediata.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-xl text-lg">
                            <Link href="/contact">Agendar Aplicação</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 h-14 px-10 rounded-xl text-lg bg-transparent">
                            <Link href="https://wa.me/559888281228">WhatsApp Direto</Link>
                        </Button>
                    </div>
                </div>
            </section>

        </div>
    )
}
