import {
  getLoanProduct,
  type LoanProduct,
  type LoanProductCode,
} from "@/lib/loans"

const productOrder: LoanProductCode[] = ["kes", "stambeni", "auto"]

export function parseLoanProductCode(
  tip: string | null | undefined,
): LoanProductCode {
  if (tip === "kes" || tip === "stambeni" || tip === "auto") {
    return tip
  }
  return "kes"
}

export function productOrderIndex(code: LoanProductCode): number {
  return productOrder.indexOf(code)
}

function snapToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number | null {
  if (value < min || value > max) return null

  const stepped = min + Math.round((value - min) / step) * step
  if (stepped < min || stepped > max) return null

  return stepped
}

export function resolveCalculatorValues(
  product: LoanProductCode,
  iznos: string | null | undefined,
  rok: string | null | undefined,
): { amount: number; term: number } {
  const loan = getLoanProduct(product)

  let amount = loan.defaultAmount
  let term = loan.defaultTerm

  if (iznos) {
    const parsed = Number(iznos)
    if (Number.isFinite(parsed)) {
      const snapped = snapToStep(
        parsed,
        loan.minAmount,
        loan.maxAmount,
        loan.amountStep,
      )
      if (snapped !== null) amount = snapped
    }
  }

  if (rok) {
    const parsed = Number(rok)
    if (Number.isFinite(parsed)) {
      const snapped = snapToStep(
        parsed,
        loan.minTerm,
        loan.maxTerm,
        loan.termStep,
      )
      if (snapped !== null) term = snapped
    }
  }

  return { amount, term }
}

export function loanProductTabLabel(loan: LoanProduct): string {
  return loan.name
}
