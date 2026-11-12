import type { Metadata } from "next"

import { HomeFaq } from "@/components/home-faq"
import { HomeSteps } from "@/components/home-steps"
import { LoanCalculator } from "@/components/loan-calculator"
import { homeFaqItems } from "@/lib/home-faq"

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

export const metadata: Metadata = {
  title: {
    absolute: "Stratton Oak Mont",
  },
  description:
    "Izaberite iznos i rok keš kredita i odmah vidite mesečnu ratu. Stratton Oak Mont pomaže da dođete do povoljne kamate.",
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section
        className="flex min-h-[calc(100dvh-var(--header-height))] flex-col"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 md:py-6">
          <div className="grid items-center gap-10 min-[960px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] min-[960px]:gap-12 lg:gap-16">
            <div className="@container hero-rise">
              <h1
                id="hero-heading"
                className="hero-title font-heading font-semibold tracking-tight"
              >
                Do kredita uz{" "}
                <span className="mt-1 block text-balance">
                  <span className="text-primary">kamatu</span> koja vam ide u
                  prilog
                </span>
              </h1>
              <p className="hero-subtitle mt-5">
                Pomažemo vam da dođete do povoljne kamate!
              </p>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                Izaberite iznos i rok keš kredita i odmah vidite mesečnu ratu.
                Kako bismo obezbedili najbolju kamatu za Vas, kontaktirajte nas.
              </p>
            </div>

            <LoanCalculator product="kes" className="hero-rise hero-rise-delay" />
          </div>
        </div>

        <div className="flex justify-center px-[15%]" aria-hidden>
          <div className="h-px w-full bg-primary" />
        </div>
      </section>

      <HomeSteps />

      <HomeFaq />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
    </main>
  )
}
