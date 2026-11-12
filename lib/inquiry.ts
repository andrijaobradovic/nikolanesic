import type { Currency, LoanProductCode } from "@/lib/loans"

export const loanSelectionKey = "som-inquiry-loan"
export const inquirySourceKey = "som-inquiry-source"

export type InquirySource = "pocetna" | "kalkulatori" | "kontakt"

export type LoanSelection = {
  product: LoanProductCode
  amount: number
  term: number
  installment: number
  currency: Currency
}

function isLoanSelection(value: unknown): value is LoanSelection {
  if (typeof value !== "object" || value === null) return false

  const selection = value as Partial<LoanSelection>

  return (
    (selection.product === "kes" ||
      selection.product === "stambeni" ||
      selection.product === "auto") &&
    typeof selection.amount === "number" &&
    typeof selection.term === "number" &&
    typeof selection.installment === "number" &&
    (selection.currency === "RSD" || selection.currency === "EUR")
  )
}

export function saveLoanSelection(
  selection: LoanSelection,
  source?: InquirySource,
) {
  if (typeof window === "undefined") return

  try {
    sessionStorage.setItem(loanSelectionKey, JSON.stringify(selection))
    if (source) {
      sessionStorage.setItem(inquirySourceKey, source)
    }
  } catch {
    return
  }
}

export function readLoanSelection(): LoanSelection | null {
  if (typeof window === "undefined") return null

  try {
    const raw = sessionStorage.getItem(loanSelectionKey)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    return isLoanSelection(parsed) ? parsed : null
  } catch {
    return null
  }
}
