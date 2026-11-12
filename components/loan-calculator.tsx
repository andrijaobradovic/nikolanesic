"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useId, useState, type CSSProperties } from "react"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatMoney, formatTerm } from "@/lib/format"
import { saveLoanSelection } from "@/lib/inquiry"
import {
  getLoanProduct,
  quoteLoan,
  type LoanProductCode,
} from "@/lib/loans"
import { cn } from "@/lib/utils"

type LoanCalculatorProps = {
  product: LoanProductCode
  className?: string
}

type SliderFieldProps = {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  valueText: string
  minText: string
  maxText: string
  onChange: (value: number) => void
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  valueText,
  minText,
  maxText,
  onChange,
}: SliderFieldProps) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-sm font-medium tabular-nums">{valueText}</span>
      </div>
      <input
        id={id}
        className="loan-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
        style={{ "--range-percent": `${percent}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="flex justify-between gap-4 text-xs text-muted-foreground tabular-nums">
        <span>{minText}</span>
        <span>{maxText}</span>
      </div>
    </div>
  )
}

export function LoanCalculator({ product, className }: LoanCalculatorProps) {
  const loan = getLoanProduct(product)
  const fieldId = useId()
  const [amount, setAmount] = useState(loan.defaultAmount)
  const [term, setTerm] = useState(loan.defaultTerm)
  const quote = quoteLoan(loan, amount, term)

  return (
    <Card
      className={cn(
        "overflow-visible rounded-none shadow-[0_18px_40px_-12px_oklch(0.25_0.05_250/0.35)] ring-0 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]",
        className,
      )}
    >
      <CardContent className="grid gap-7">
        <div className="grid gap-6">
          <SliderField
            id={`${fieldId}-amount`}
            label="Iznos"
            value={amount}
            min={loan.minAmount}
            max={loan.maxAmount}
            step={loan.amountStep}
            valueText={formatMoney(amount, loan.currency)}
            minText={formatMoney(loan.minAmount, loan.currency)}
            maxText={formatMoney(loan.maxAmount, loan.currency)}
            onChange={setAmount}
          />
          <SliderField
            id={`${fieldId}-term`}
            label="Rok otplate"
            value={term}
            min={loan.minTerm}
            max={loan.maxTerm}
            step={loan.termStep}
            valueText={formatTerm(term, loan.termUnit)}
            minText={formatTerm(loan.minTerm, loan.termUnit)}
            maxText={formatTerm(loan.maxTerm, loan.termUnit)}
            onChange={setTerm}
          />
        </div>

        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">Mesečna rata</p>
          <p className="font-heading text-4xl font-semibold tracking-tight tabular-nums">
            {formatMoney(quote.installment, loan.currency)}
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            Ukupno za otplatu{" "}
            <span className="font-medium text-foreground tabular-nums">
              {formatMoney(quote.total, loan.currency)}
            </span>
          </p>
        </div>

        <Link
          href="/kontakt"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 w-full text-base",
          )}
          onClick={() =>
            saveLoanSelection({
              product: loan.code,
              amount,
              term,
              installment: quote.installment,
              currency: loan.currency,
            })
          }
        >
          Zatraži kredit
          <ArrowRight data-icon="inline-end" />
        </Link>
      </CardContent>
    </Card>
  )
}
