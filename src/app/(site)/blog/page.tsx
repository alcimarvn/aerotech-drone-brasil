
import { Construction } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-slate-100 p-6 rounded-full mb-6">
                <Construction className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">Blog Aerotech</h1>
            <p className="text-lg text-slate-600 max-w-md mb-8">
                Estamos preparando conteúdos técnicos exclusivos sobre agricultura de precisão, dicas de manejo e novidades do setor.
            </p>
            <Button asChild className="bg-primary text-white font-bold">
                <Link href="/">Voltar para o Início</Link>
            </Button>
        </div>
    )
}
