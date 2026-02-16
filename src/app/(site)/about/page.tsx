
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Award, Target, Users, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Minimal */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Tecnologia a serviço do <span className="text-primary">Produtor Maranhense</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Muito mais que pilotos de drone. Somos parceiros técnicos focados em agronomia de precisão e resultado no campo.
                    </p>
                </div>
            </section>

            {/* Mission/Vision */}
            <section className="py-20 container px-4 md:px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl border border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-700">
                            <Target className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Nossa Missão</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Levar tecnologia aeroagrícola de ponta para Zé Doca e região, democratizando o acesso à agricultura de precisão para produtores de todos os portes.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl border border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-700">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Segurança & Técnica</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Operações seguindo rigorosamente as normativas da ANAC e MAPA. Engenheiro Agrônomo responsável técnico em todas as aplicações.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl border border-slate-100 bg-white shadow-lg hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-700">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Equipe Qualificada</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Pilotos certificados com curso CAAR (Curso de Aplicação Aeroagrícola Remota). Treinamento constante em novas tecnologias.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-heading font-bold text-slate-900">Por que a Aerotech?</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    A Aerotech Drones nasceu da necessidade de modernizar o campo no Maranhão. Observamos que muitos produtores perdiam produtividade por falta de maquinário adequado ou por dependerem de métodos manuais ineficientes.
                                </p>
                                <p>
                                    Decidimos investir não apenas nos melhores drones do mercado (Linha DJI Agras), mas principalmente em <strong>conhecimento agronômico</strong>. Entendemos de pragas, de doenças e de fisiologia vegetal. O drone é apenas a ferramenta; nosso produto é a solução do seu problema.
                                </p>
                                <p>
                                    Sediados em Zé Doca, conhecemos a realidade local, o clima e os desafios da nossa região. Estamos ao lado do produtor, safra após safra.
                                </p>
                            </div>
                            <div className="pt-4">
                                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-lg">
                                    <Link href="/contact">Fale com nossa equipe</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative h-[400px] bg-slate-200 rounded-3xl overflow-hidden shadow-xl">
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                [Foto: Equipe Aerotech em Campo]
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Map Placeholder */}
            <section className="py-20 container text-center">
                <div className="flex flex-col items-center">
                    <MapPin className="w-12 h-12 text-primary mb-6" />
                    <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">Onde Estamos</h2>
                    <p className="text-slate-600 mb-8">Base Operacional em Zé Doca - MA, atendendo todo o estado.</p>
                    <div className="w-full max-w-4xl h-[300px] bg-slate-100 rounded-2xl border flex items-center justify-center text-slate-400">
                        [Mapa do Google: Zé Doca, Maranhão]
                    </div>
                </div>
            </section>
        </div>
    )
}
