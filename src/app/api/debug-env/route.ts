import { NextResponse } from "next/server"

export async function GET() {
    return NextResponse.json({
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL?.substring(0, 15) + "...",
        NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
        // Listar todas as chaves que começam com NEXT
        NEXT_VARS: Object.keys(process.env).filter(key => key.startsWith('NEXT'))
    })
}
