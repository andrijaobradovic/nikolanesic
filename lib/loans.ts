export type LoanProductCode = "kes" | "stambeni" | "auto"

export type Currency = "RSD" | "EUR"

export type TermUnit = "month" | "year"

export type LoanProduct = {
  code: LoanProductCode
  name: string
  currency: Currency
  minAmount: number
  maxAmount: number
  amountStep: number
  minTerm: number
  maxTerm: number
  termStep: number
  termUnit: TermUnit
  defaultAmount: number
  defaultTerm: number
  annualRatePercent: number
}

export const loanProducts = {
  kes: {
    code: "kes",
    name: "Keš krediti",
    currency: "RSD",
    minAmount: 10_000,
    maxAmount: 3_000_000,
    amountStep: 10_000,
    minTerm: 6,
    maxTerm: 71,
    termStep: 1,
    termUnit: "month",
    defaultAmount: 500_000,
    defaultTerm: 36,
    annualRatePercent: 8.5,
  },
  stambeni: {
    code: "stambeni",
    name: "Stambeni krediti",
    currency: "EUR",
    minAmount: 4_300,
    maxAmount: 256_000,
    amountStep: 100,
    minTerm: 5,
    maxTerm: 30,
    termStep: 1,
    termUnit: "year",
    defaultAmount: 130_100,
    defaultTerm: 18,
    annualRatePercent: 5,
  },
  auto: {
    code: "auto",
    name: "Auto krediti",
    currency: "RSD",
    minAmount: 100_000,
    maxAmount: 5_000_000,
    amountStep: 10_000,
    minTerm: 12,
    maxTerm: 84,
    termStep: 1,
    termUnit: "month",
    defaultAmount: 2_550_000,
    defaultTerm: 48,
    annualRatePercent: 5,
  },
} as const satisfies Record<LoanProductCode, LoanProduct>

export function getLoanProduct(code: LoanProductCode): LoanProduct {
  return loanProducts[code]
}

export type LoanQuote = {
  installment: number
  total: number
  months: number
}

function roundCurrency(value: number, currency: Currency): number {
  if (currency === "RSD") return Math.round(value)
  return Math.round(value * 100) / 100
}

export function quoteLoan(
  product: LoanProduct,
  amount: number,
  term: number,
): LoanQuote {
  const months = product.termUnit === "year" ? term * 12 : term
  const monthlyRate = product.annualRatePercent / 100 / 12
  const factor = (1 + monthlyRate) ** months
  const raw = (amount * monthlyRate * factor) / (factor - 1)
  const installment = roundCurrency(raw, product.currency)
  const total = roundCurrency(installment * months, product.currency)

  return { installment, total, months }
}
