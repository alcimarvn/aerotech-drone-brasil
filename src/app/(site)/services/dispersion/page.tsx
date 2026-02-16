
import Link from "next/link"
import { Check, Leaf, ArrowRight, Sprout, Wind, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DispersionPage() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero */}
            <section className="relative py-20 bg-yellow-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="container relative z-10 px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Badge className="bg-yellow-800 text-white border-white/20 text-sm uppercase tracking-wider font-bold">
                                Sistema Spreader 3.0
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
                                Dispersão de Sólidos e Semeadura Aérea
                            </h1>
                            <p className="text-lg text-yellow-50 leading-relaxed font-light">
                                Reforma de pastagens, plantio de cobertura e adubação a lanço com <strong>uniformidade superior</strong>.
                                Chegue onde o trator não alcança.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <Button size="lg" className="bg-white text-yellow-900 hover:bg-yellow-50 font-bold shadow-xl">
                                    <Link href="/contact">Orçamento para Dispersão</Link>
                                </Button>
                            </div>
                        </div>
                        {/* Image Placeholder */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-2xl backdrop-blur-sm">
                            <div className="w-full h-full flex items-center justify-center text-white/50 bg-gradient-to-br from-yellow-700 to-black font-medium">
                                [Imagem: Drone Espalhando Sementes]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Soluções para Sólidos</h2>
                        <p className="text-slate-600 leading-relaxed">
                            O sistema de dispersão aérea permite a aplicação rápida de sementes e fertilizantes,
                            aproveitando janelas climáticas curtas e terrenos acidentados.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="pt-8 pb-8 px-6 space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 mb-2">
                                    <Sprout className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Reforma de Pastagens</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Semeadura de Brachiaria, Panicum e outras gramíneas, inclusive em áreas de morro ou toco, onde máquinas não entram.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="pt-8 pb-8 px-6 space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-700 mb-2">
                                    <Layers className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Mix de Cobertura</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Sobressemeadura (overseeding) de Milheto ou Crotalária sobre a soja em fase de maturação, antecipando o plantio da cobertura.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardContent className="pt-8 pb-8 px-6 space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 mb-2">
                                    <Leaf className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Adubação de Cobertura</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Aplicação de Ureia e NPK granulado com precisão, ideal para milho alto onde o autopropelido causaria danos mecânicos.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Capability Specs */}
            <section className="py-20 border-t border-slate-200">
                <div className="container px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Capacidade Operacional</h2>
                                <p className="text-slate-600">
                                    Tanques de alta capacidade e sistema de pesagem em tempo real garantem a aplicação da dose correta (Kg/ha).
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-yellow-100 p-2 rounded-lg h-fit">
                                        <Check className="w-5 h-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Tanque de 50 Kg</h4>
                                        <p className="text-sm text-slate-600">Alta autonomia de voo. Reduz a quantidade de paradas para reabastecimento (RTH).</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 bg-yellow-100 p-2 rounded-lg h-fit">
                                        <Check className="w-5 h-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Uniformidade de Faixa</h4>
                                        <p className="text-sm text-slate-600">Disco centrifugo de alta rotação garante faixas de aplicação de 5 a 7 metros, sem "falhas" ou "excesso".</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 bg-yellow-100 p-2 rounded-lg h-fit">
                                        <Check className="w-5 h-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Sensor de Esvaziamento</h4>
                                        <p className="text-sm text-slate-600">O drone avisa quando o tanque zera e retorna automaticamente para recarga, retomando do ponto exato.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-inner order-2">
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                [Foto: Spreader Lançando Sementes]
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-6 rounded-xl border shadow-sm">
                                <p className="font-heading font-bold text-slate-900 mb-1">Rendimento Agrícola</p>
                                <p className="text-xs text-slate-500">
                                    Capacidade de aplicar até 1.5 toneladas de sólidos por hora, dependendo da dose e distância de operação.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="container px-4">
                    <h2 className="text-3xl font-heading font-bold mb-6">Precisa reformar seu pasto?</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
                        Soluções eficientes para pecuaristas e agricultores. Aproveite as chuvas para semear.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold h-14 px-10 rounded-xl text-lg">
                            <Link href="/contact">Cotar Semeadura</Link>
                        </Button>
                    </div>
                </div>
            </section>

        </div>
    )
}
