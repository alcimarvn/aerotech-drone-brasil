import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/dashboard/settings/profile-form"
import { ExpenseCategories } from "@/components/dashboard/settings/expense-categories"
import { SystemSettings } from "@/components/dashboard/settings/system-settings"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getExpenseCategories, getCompanySettings } from "@/app/actions/settings"
import { Settings, User, CreditCard, Monitor } from "lucide-react"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)
    const categories = await getExpenseCategories()
    const settings = await getCompanySettings()

    if (!session?.user) return null

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-xl">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    Configurações
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                    Gerencie seu perfil e preferências do sistema.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="bg-white border border-slate-200 p-1 h-auto">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 px-4 py-2">
                        <User className="w-4 h-4 mr-2" /> Meu Perfil
                    </TabsTrigger>
                    <TabsTrigger value="financial" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 px-4 py-2">
                        <CreditCard className="w-4 h-4 mr-2" /> Financeiro
                    </TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 px-4 py-2">
                        <Monitor className="w-4 h-4 mr-2" /> Sistema
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Perfil e Segurança</CardTitle>
                            <CardDescription>
                                Atualize suas informações pessoais e credenciais de acesso.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm user={{
                                name: session.user.name || "",
                                email: session.user.email || ""
                            }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="financial">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações Financeiras</CardTitle>
                            <CardDescription>
                                Gerencie categorias de receitas e despesas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ExpenseCategories categories={categories} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferências do Sistema</CardTitle>
                            <CardDescription>
                                Personalize a aparência e comportamento da aplicação.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SystemSettings initialSettings={settings} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs >
        </div >
    )
}
