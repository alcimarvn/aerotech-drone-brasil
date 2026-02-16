import { notFound } from "next/navigation"
import Link from "next/link"
import {
    ChevronLeft,
    Mail,
    User,
    Shield,
    FileText,
    Calendar,
    TrendingUp,
    Briefcase,
    DollarSign,
    Clock,
    ExternalLink,
    Wallet,
    CreditCard
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getEmployeeById } from "@/app/actions/employees"
import { formatCurrency, formatNumber, statusMap } from "@/lib/utils"
import { EmployeePaymentModal } from "@/components/dashboard/employees/employee-payment-modal"
import { DeletePaymentButton } from "@/components/dashboard/employees/delete-payment-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EmployeeDetailsPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EmployeeDetailsPage({ params }: EmployeeDetailsPageProps) {
    const { id } = await params
    const employee = await getEmployeeById(id)

    if (!employee) {
        notFound()
    }

    // Calcular estatísticas
    const totalHectares = employee.expense.reduce((acc, exp) => acc + (exp.serviceorder?.areaSize || 0), 0)
    const workCount = employee.expense.filter(exp => exp.serviceorderId).length

    // Total de comissões/ganhos
    const totalEarnings = employee.expense.reduce((acc, exp) => acc + exp.amount, 0)

    // Total pago ao funcionário (registrado na tabela Payment com type="EXPENSE")
    const totalPaid = employee.payment ? employee.payment.reduce((acc, pay) => acc + pay.amount, 0) : 0

    // Saldo a Pagar
    const balanceToPay = totalEarnings - totalPaid

    const methodLabels: Record<string, string> = {
        "PIX": "PIX",
        "TRANSFER": "Transferência",
        "CASH": "Dinheiro",
        "BOLETO": "Boleto",
        "CARD": "Cartão"
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="gap-2 -ml-2 text-slate-500 hover:text-primary transition-all">
                    <Link href="/dashboard/employees">
                        <ChevronLeft className="w-4 h-4" /> Voltar para Equipe
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-white px-3 py-1 text-slate-500 border-slate-200 uppercase text-[10px] font-bold">
                        ID: {employee.id.slice(-8)}
                    </Badge>
                </div>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                    <div className="h-2 bg-primary w-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-slate-900">{employee.user?.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0 uppercase">
                                        {employee.position}
                                    </Badge>
                                    {employee.active ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] h-5 py-0">Ativo</Badge>
                                    ) : (
                                        <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] h-5 py-0">Inativo</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" /> Informações de Registro
                            </h4>
                            <div className="space-y-2">
                                <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">CPF:</span> {employee.cpf || "Não informado"}
                                </p>
                                <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">E-mail:</span> {employee.user?.email}
                                </p>
                                <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Admissão:</span> {new Date(employee.admissionDate).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary" /> Configuração Salarial
                            </h4>
                            <div className="space-y-2">
                                <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                    <TrendingUp className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Taxa/ha:</span> {formatCurrency(employee.commissionRate || 0)}
                                </p>
                                <p className="text-sm text-slate-600 flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Salário Fixo:</span> {formatCurrency(employee.baseSalary || 0)}
                                </p>
                                <p className="text-xs text-slate-400 flex items-center gap-2 mt-2 italic px-1">
                                    A remuneração variável é calculada automaticamente por hectare voado.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats Column */}
                <div className="flex flex-col gap-6">
                    <Card className="border-none shadow-sm bg-primary text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4 opacity-80 uppercase text-[10px] font-bold tracking-[0.1em]">
                                <TrendingUp className="w-4 h-4" /> Produtividade Acumulada
                            </div>
                            <h3 className="text-4xl font-black mb-1 leading-none">{formatNumber(totalHectares)} <span className="text-lg font-normal opacity-60">ha</span></h3>
                            <p className="text-white/60 text-sm">Total voado em {workCount} trabalhos</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Saldo a Pagar</p>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Wallet className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">{formatCurrency(balanceToPay)}</h3>

                            <EmployeePaymentModal
                                employee={{
                                    id: employee.id,
                                    name: employee.user?.name || "",
                                    balance: balanceToPay
                                }}
                                trigger={
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 shadow-sm shadow-emerald-200">
                                        <DollarSign className="w-4 h-4 mr-2" /> Registrar Pagamento
                                    </Button>
                                }
                            />
                            <div className="mt-4 flex justify-between text-xs text-slate-400 border-t pt-2">
                                <span>Total Acumulado:</span>
                                <span>{formatCurrency(totalEarnings)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Work History & Payments Tabs */}
            <Tabs defaultValue="work" className="w-full">
                <TabsList className="bg-white border p-1 rounded-xl h-auto w-full justify-start md:w-auto">
                    <TabsTrigger value="work" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg px-4 py-2">
                        Histórico de Trabalhos
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-lg px-4 py-2">
                        Histórico de Pagamentos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="work" className="mt-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <Briefcase className="w-5 h-5 text-slate-600" />
                                </div>
                                <CardTitle className="text-lg font-bold text-slate-900">Trabalhos Realizados (Comissões)</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="py-4">Data</TableHead>
                                        <TableHead className="py-4">Cliente / Serviço</TableHead>
                                        <TableHead className="py-4">Área (ha)</TableHead>
                                        <TableHead className="py-4">Remuneração</TableHead>
                                        <TableHead className="py-4">Status OS</TableHead>
                                        <TableHead className="w-[80px] text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employee.expense && employee.expense.length > 0 ? (
                                        employee.expense.filter((exp: any) => exp.serviceorderId || exp.description).map((exp: any) => (
                                            <TableRow key={exp.id} className="hover:bg-slate-50/40 transition-colors">
                                                <TableCell className="text-xs text-slate-500 font-medium">
                                                    {new Date(exp.date).toLocaleDateString("pt-BR")}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900">{exp.serviceorder?.client?.name || "N/A"}</span>
                                                        <span className="text-[10px] text-slate-400 capitalize">{exp.serviceorder?.serviceType.toLowerCase() || exp.description || "Despesa Avulsa"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600 font-medium">
                                                    {exp.serviceorder ? `${formatNumber(exp.serviceorder.areaSize)} ha` : "---"}
                                                </TableCell>
                                                <TableCell className="text-emerald-700 font-bold">
                                                    {formatCurrency(exp.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    {exp.serviceorder ? (
                                                        <Badge
                                                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${statusMap[exp.serviceorder.status as keyof typeof statusMap]?.color || ""}`}
                                                        >
                                                            {statusMap[exp.serviceorder.status as keyof typeof statusMap]?.label || exp.serviceorder.status}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-slate-300">---</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-4">
                                                    {exp.serviceorderId && (
                                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-primary transition-all">
                                                            <Link href={`/dashboard/service-orders?id=${exp.serviceorderId}`}>
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic">
                                                Nenhum registro de trabalho ou comissão encontrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between py-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Wallet className="w-5 h-5 text-emerald-600" />
                                </div>
                                <CardTitle className="text-lg font-bold text-slate-900">Pagamentos Realizados</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="py-4">Data</TableHead>
                                        <TableHead className="py-4">Método</TableHead>
                                        <TableHead className="py-4">Observação</TableHead>
                                        <TableHead className="py-4 text-right">Valor Pago</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employee.payment && employee.payment.length > 0 ? (
                                        employee.payment.map((pay: any) => (
                                            <TableRow key={pay.id} className="hover:bg-slate-50/40 transition-colors">
                                                <TableCell className="text-xs text-slate-500 font-medium">
                                                    {new Date(pay.date).toLocaleDateString("pt-BR")}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <CreditCard className="w-3 h-3 text-slate-400" />
                                                        {methodLabels[pay.method] || pay.method}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600 text-sm">
                                                    {pay.reference || "---"}
                                                </TableCell>
                                                <TableCell className="text-emerald-700 font-bold text-right">
                                                    {formatCurrency(pay.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-2">
                                                        {pay.receiptUrl && (
                                                            <a
                                                                href={pay.receiptUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                                title="Ver Comprovante Anexado"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                        <a
                                                            href={`/receipts/${pay.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                            title="Imprimir Recibo"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </a>
                                                        <DeletePaymentButton paymentId={pay.id} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">
                                                Nenhum pagamento registrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    )
}
