"use client"

import { Phone } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { homeFaqItems } from "@/lib/home-faq"
import { phoneTel } from "@/lib/site"
import { cn } from "@/lib/utils"

const faqIntro =
  "Ovde su odgovori na ono što klijenti najčešće pitaju pre nego što ostave upit. Ako Vam treba pojašnjenje, a ovde nema odgovara, poovite nas ili nam pošaljite poruku. Odgovaramo u najkraćem mogućem roku."

export function HomeFaq() {
  const firstId = homeFaqItems[0]?.id

  return (
    <section
      className="bg-background py-16 sm:px-6 md:py-20 lg:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid items-start gap-10 md:gap-12 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,22rem)_minmax(0,1.2fr)] xl:gap-16">
          <header className="hero-rise max-w-md text-left lg:max-w-none">
            <h2
              id="faq-heading"
              className="font-heading text-2xl font-semibold tracking-tight text-button-secondary-fill sm:text-3xl"
            >
              Česta pitanja
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {faqIntro}
            </p>
            <a
              href={`tel:${phoneTel}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 h-11 w-full gap-2 px-5 text-base",
              )}
            >
              <Phone className="size-5" aria-hidden />
              Poziv
            </a>
          </header>

          <Accordion
            className={cn("hero-rise hero-rise-delay min-w-0")}
            defaultValue={firstId ? [firstId] : undefined}
          >
            {homeFaqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-border/80"
              >
                <AccordionTrigger
                  className={cn(
                    "items-center gap-4 py-5 hover:no-underline",
                    "font-heading text-base font-semibold text-foreground sm:text-lg",
                    "[&_[data-slot=accordion-trigger-icon]]:text-primary",
                  )}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
