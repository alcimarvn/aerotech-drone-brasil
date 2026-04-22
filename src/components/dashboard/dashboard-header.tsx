"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Bell, Search, User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function DashboardHeader() {
    const { data: session } = useSession()

    return (
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-30">
            <div>
                <h2 className="text-sm font-medium text-slate-500">Painel Operacional</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-slate-200 transition-all outline-none w-64"
                    />
                </div>

                <Button variant="ghost" size="icon" className="relative text-slate-500 focus-visible:ring-2 focus-visible:ring-offset-2" aria-label="Notificações">
                    <Bell className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" aria-hidden="true" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 pl-2 focus-visible:ring-2 focus-visible:ring-offset-2" aria-label={`Menu do usuário ${session?.user?.name || "Usuário"}`}>
                            <Avatar className="w-8 h-8" aria-hidden="true">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {session?.user?.name?.charAt(0) || <User className="w-4 h-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden lg:block" aria-hidden="true">
                                <p className="text-sm font-medium leading-none">{session?.user?.name || "Usuário"}</p>
                                <p className="text-xs text-slate-500">{session?.user?.role || "Operador"}</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings?tab=profile" className="cursor-pointer">Perfil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="cursor-pointer">Configurações</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
