"use client"

import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { ServiceOrderPDF } from "./service-order-pdf"
import { useEffect, useState } from "react"

interface PDFDownloadButtonProps {
    order: any
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
}

export function PDFDownloadButton({ order, variant = "outline", size = "default", className }: PDFDownloadButtonProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return (
            <Button variant={variant} size={size} className={className} disabled>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando PDF...
            </Button>
        )
    }

    return (
        <PDFDownloadLink
            document={<ServiceOrderPDF order={order} />}
            fileName={`OS_${order.id.slice(-6).toUpperCase()}_${order.client.name.replace(/\s+/g, '_')}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button variant={variant} size={size} className={className} disabled={loading}>
                    {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <FileDown className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Gerando PDF...' : 'Baixar PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    )
}
