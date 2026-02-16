import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 print:bg-white print:h-auto print:overflow-visible">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:h-auto print:block">
                <div className="print:hidden">
                    <DashboardHeader />
                </div>
                <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto print:block">
                    {children}
                </main>
            </div>
        </div>
    )
}
