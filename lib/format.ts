import type { Currency, TermUnit } from "@/lib/loans"

const amountFormat: Record<Currency, Intl.NumberFormat> = {
  RSD: new Intl.NumberFormat("sr-RS", { maximumFractionDigits: 0 }),
  EUR: new Intl.NumberFormat("sr-RS", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
}

export function formatMoney(amount: number, currency: Currency): string {
  return `${amountFormat[currency].format(amount)} ${currency}`
}

function plural(value: number, one: string, few: string, many: string): string {
  const mod10 = value % 10
  const mod100 = value % 100

  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function formatTerm(value: number, unit: TermUnit): string {
  if (unit === "year") {
    return `${value} ${plural(value, "godina", "godine", "godina")}`
  }

  return `${value} ${plural(value, "mesec", "meseca", "meseci")}`
}
