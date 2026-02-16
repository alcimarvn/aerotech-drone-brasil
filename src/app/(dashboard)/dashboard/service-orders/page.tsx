"use client"

import { Suspense } from "react"
import ServiceOrdersContent from "./service-orders-content"

export default function ServiceOrdersPage() {
    return (
        <Suspense fallback={<div className="p-8">Carregando...</div>}>
            <ServiceOrdersContent />
        </Suspense>
    )
}
