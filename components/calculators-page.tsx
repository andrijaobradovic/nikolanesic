"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

import { LoanCalculator } from "@/components/loan-calculator"
import { Label } from "@/components/ui/label"
import {
  loanProductTabLabel,
  parseLoanProductCode,
  productOrderIndex,
  resolveCalculatorValues,
} from "@/lib/calculator-url"
import {
  getLoanProduct,
  loanProducts,
  type LoanProductCode,
} from "@/lib/loans"
import { cn } from "@/lib/utils"

const productCodes: LoanProductCode[] = ["kes", "stambeni", "auto"]

type ProductTabProps = {
  code: LoanProductCode
  selected: boolean
  onSelect: (code: LoanProductCode) => void
}

function ProductTab({ code, selected, onSelect }: ProductTabProps) {
  const loan = getLoanProduct(code)
  const label = loanProductTabLabel(loan)

  return (
    <button
      type="button"
      role="tab"
      id={`calculator-tab-${code}`}
      aria-selected={selected}
      aria-controls="calculator-panel"
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(code)}
      className={cn(
        "relative w-full px-2 pb-2 text-center text-sm font-medium transition-colors sm:text-base",
        selected
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {selected ? (
        <span
          className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
          aria-hidden
        />
      ) : null}
    </button>
  )
}

export function CalculatorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tipParam = searchParams.get("tip")
  const iznosParam = searchParams.get("iznos")
  const rokParam = searchParams.get("rok")
  const product = parseLoanProductCode(tipParam)
  const { amount, term } = useMemo(
    () => resolveCalculatorValues(product, iznosParam, rokParam),
    [product, iznosParam, rokParam],
  )

  const [slideClass, setSlideClass] = useState<
    "calculator-enter-right" | "calculator-enter-left"
  >("calculator-enter-right")

  const selectProduct = useCallback(
    (code: LoanProductCode) => {
      if (code === product) return

      const nextIndex = productOrderIndex(code)
      const prevIndex = productOrderIndex(product)
      setSlideClass(
        nextIndex > prevIndex
          ? "calculator-enter-right"
          : "calculator-enter-left",
      )

      const params = new URLSearchParams()
      params.set("tip", code)
      router.replace(`/kreditni-kalkulatori?${params.toString()}`, {
        scroll: false,
      })
    },
    [product, router],
  )

  return (
    <div className="grid w-full gap-8">
      <div className="hidden w-full md:block">
        <div
          role="tablist"
          aria-label="Vrsta kredita"
          className="grid w-full grid-cols-3 gap-4 sm:gap-6"
        >
          {productCodes.map((code) => (
            <ProductTab
              key={code}
              code={code}
              selected={product === code}
              onSelect={selectProduct}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2 md:hidden">
        <Label htmlFor="calculator-product">Vrsta kredita</Label>
        <select
          id="calculator-product"
          value={product}
          onChange={(event) =>
            selectProduct(parseLoanProductCode(event.target.value))
          }
          className="h-11 w-full border border-input bg-background px-3 text-sm font-medium"
        >
          {productCodes.map((code) => (
            <option key={code} value={code}>
              {loanProductTabLabel(loanProducts[code])}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-hidden">
        <div
          key={`${product}-${amount}-${term}`}
          id="calculator-panel"
          role="tabpanel"
          aria-labelledby={`calculator-tab-${product}`}
          aria-label={loanProductTabLabel(getLoanProduct(product))}
          className={slideClass}
        >
          <LoanCalculator
            product={product}
            initialAmount={amount}
            initialTerm={term}
            inquirySource="kalkulatori"
          />
        </div>
      </div>
    </div>
  )
}
