import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const statusMap = {
  NEW: { label: "Nova", color: "bg-blue-100 text-blue-700 border-blue-200" },
  SCHEDULED: { label: "Agendada", color: "bg-purple-100 text-purple-700 border-purple-200" },
  IN_PROGRESS: { label: "Em Execução", color: "bg-amber-100 text-amber-700 border-amber-200" },
  COMPLETED: { label: "Concluída", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  BILLED: { label: "Faturada", color: "bg-slate-100 text-slate-700 border-slate-200" },
  CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700 border-red-200" },
} as const
