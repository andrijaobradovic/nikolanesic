import {
  ArrowRight,
  Building2,
  ClipboardPen,
  Handshake,
  Phone,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const steps: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: "Online prijava",
    description:
      "Popunite kalkulator i ostavite podatke kako bismo vas pozvali.",
    icon: ClipboardPen,
  },
  {
    title: "Razgovor sa agentom",
    description: "Agent prolazi iznos, rok i vašu situaciju.",
    icon: Phone,
  },
  {
    title: "Odabir ponude",
    description:
      "Agent predlaže ponudu banke koja odgovara tome što ste izabrali.",
    icon: Handshake,
  },
  {
    title: "Realizacija u filijali",
    description:
      "Sa spremnim koracima odlazite u filijalu banke i podnosite zahtev.",
    icon: Building2,
  },
]

export function HomeSteps() {
  return (
    <section
      className="home-steps-section py-16 text-white sm:px-6 md:py-20 lg:py-24"
      aria-labelledby="steps-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <header className="hero-rise mx-auto max-w-2xl text-center">
          <div
            className="mx-auto mb-5 h-px w-32 bg-primary sm:mb-4"
            aria-hidden
          />
          <h2
            id="steps-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Kako izgleda proces
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
            Od online prijave do podnošenja zahteva u filijali.
          </p>
        </header>

        <div className="steps-grid mt-12 grid items-stretch gap-10 md:mt-14 md:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className={cn(
                  "steps-grid-item relative hero-rise",
                  index === 1 && "hero-rise-delay",
                  index === 2 && "steps-rise-delay-2",
                  index === 3 && "steps-rise-delay-3",
                )}
              >
                <Card className="step-card flex h-full flex-col border border-primary/80 bg-white/10 text-center shadow-lg shadow-black/20 ring-0 backdrop-blur-md">
                  <CardContent className="flex flex-col items-center gap-4 text-center">
                    <Icon
                      className="size-6 shrink-0 text-primary"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <CardTitle className="text-base font-semibold text-primary sm:text-lg">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-pretty text-white/75">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                {index < steps.length - 1 ? (
                  <ArrowRight
                    className="pointer-events-none absolute top-1/2 left-[calc(100%+1.25rem)] z-10 hidden size-6 -translate-x-1/2 -translate-y-1/2 text-primary lg:block"
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="hero-rise steps-rise-delay-3 mt-12 flex justify-center md:mt-14">
          <Link
            href="/kontakt"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "h-11 min-w-44 text-base [--button-wipe:var(--home-steps-gradient-end)]",
            )}
          >
            Kontaktirajte nas
          </Link>
        </div>
      </div>
    </section>
  )
}
