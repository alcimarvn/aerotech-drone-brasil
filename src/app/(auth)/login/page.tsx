import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px]" />
            </div>

            <div className="container relative z-10 flex flex-col items-center px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Aerotech Drone Brasil</h1>
                    <p className="text-slate-500">Gestão de Pulverização de Precisão</p>
                </div>

                <LoginForm />

                <p className="mt-8 text-sm text-slate-400">
                    © {new Date().getFullYear()} Aerotech Drone Brasil. Todos os direitos reservados.
                </p>
            </div>
        </div>
    )
}
