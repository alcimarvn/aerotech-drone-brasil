
import { ContactForm } from "@/components/forms/contact-form"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container py-20 px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12">

                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                            Fale com a Aerotech
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Estamos prontos para atender sua demanda. Preencha o formulário ou utilize nossos canais diretos.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/30 border">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Telefone / WhatsApp</h3>
                                <p className="text-muted-foreground mb-2">Atendimento comercial e plantão operacional.</p>
                                <a href="https://wa.me/559888281228" className="text-xl font-bold text-primary hover:underline">
                                    (98) 8828-1228
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/30 border">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">E-mail</h3>
                                <p className="text-muted-foreground mb-2">Para envio de mapas, KMLs e documentos.</p>
                                <a href="mailto:contato@aerotechdrones.com.br" className="text-lg font-medium hover:text-primary">
                                    contato@aerotechdrones.com.br
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/30 border">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Base Operacional</h3>
                                <p className="text-muted-foreground">
                                    Zé Doca - MA<br />
                                    <span className="text-sm opacity-80">Logística facilitada para todo o estado e regiões vizinhas.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-card p-8 rounded-2xl shadow-lg border">
                    <h2 className="text-2xl font-bold mb-6">Solicitar Orçamento / Visita</h2>
                    <ContactForm />
                </div>
            </div>
        </div>
    )
}
