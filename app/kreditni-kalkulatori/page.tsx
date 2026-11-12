import type { Metadata } from "next"
import { Suspense } from "react"

import { CalculatorsPage } from "@/components/calculators-page"

export const metadata: Metadata = {
  title: {
    absolute: "Kalkulatori | Stratton Oak Mont",
  },
  description:
    "Izaberite keš, stambeni ili auto kredit i odmah vidite mesečnu ratu pre nego što zatražite poziv agenta.",
}

export default function KreditniKalkulatoriPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section
        className="flex min-h-[calc(100dvh-var(--header-height))] flex-col"
        aria-label="Kreditni kalkulatori"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 md:py-6">
          <Suspense
            fallback={
              <div className="h-96 w-full animate-pulse bg-muted/30" />
            }
          >
            <CalculatorsPage />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
