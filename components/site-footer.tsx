import Link from "next/link"
import { Mail, Phone } from "lucide-react"

import { InstagramPlaceholderLink } from "@/components/instagram-placeholder-link"
import { cn } from "@/lib/utils"
import {
  contactEmail,
  navItems,
  phoneDisplay,
  phoneTel,
  siteName,
} from "@/lib/site"

const legalLinks = [
  { href: "#privatnost", label: "Politika privatnosti" },
  { href: "#uslovi", label: "Uslovi korišćenja" },
] as const

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-button-secondary-fill text-white/90">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div
          className={cn(
            "grid w-full grid-cols-1 items-start gap-y-12",
            "md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-8",
          )}
        >
          <div className="flex w-full max-w-xs flex-col items-start gap-4 justify-self-start text-left">
            <p className="font-heading text-lg font-semibold text-white">
              {siteName}
            </p>
            <p className="text-sm leading-relaxed text-white/80">
              {siteName} pomaže klijentima u Srbiji da dođu do povoljne kamate.
              Firma posreduje između klijenta i banke, a zahtev se realizuje u
              filijali.
            </p>
            <p className="text-sm text-white/70">
              PIB, matični broj i adresa sedišta biće uneti naknadno.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 justify-self-start text-left md:justify-self-center">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Stranice
            </p>
            <ul className="flex flex-col items-start gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/85 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex w-full max-w-xs flex-col items-start gap-4 justify-self-start text-left md:justify-self-end">
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Kontakt
            </p>
            <ul className="flex flex-col items-start gap-3 text-sm">
              <li>
                <Link
                  href={`tel:${phoneTel}`}
                  className="inline-flex items-center gap-2 text-white/85 transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {phoneDisplay}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 break-all text-white/85 transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {contactEmail}
                </Link>
              </li>
              <li className="text-white/80">Radno vreme: 00–24</li>
            </ul>
            <InstagramPlaceholderLink />
          </div>
        </div>

        <nav
          aria-label="Pravne informacije"
          className="mt-12 flex flex-col items-center gap-6 border-t border-white/15 pt-8"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/85 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-center text-xs text-white/60">
            © {new Date().getFullYear()} {siteName}. Sva prava zadržana.
          </p>
        </nav>

        <section id="privatnost" className="sr-only" tabIndex={-1}>
          <p>
            Kada ostavite upit, prikupljamo ime, prezime, email, broj telefona,
            opcionu poruku i, ako ste koristili kalkulator, rezime izabranog
            kredita. Te podatke koristimo isključivo da bismo Vas kontaktirali
            u vezi sa upitom i predložili sledeći korak. Ne prodajemo podatke
            trećim stranama. Podatke čuvamo onoliko koliko je potrebno za
            obradu upita i komunikaciju sa Vama.
          </p>
        </section>

        <section id="uslovi" className="sr-only" tabIndex={-1}>
          <p>
            Korišćenjem sajta {siteName} saglasni ste da su informacije sa
            kalkulatora informativne, da ne predstavljaju ponudu banke i da
            prijava putem kontakt forme ne garantuje odobrenje kredita. Sadržaj
            sajta može se menjati bez prethodne najave.
          </p>
        </section>
      </div>
    </footer>
  )
}
