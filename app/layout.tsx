import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Figtree } from "next/font/google"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { siteName } from "@/lib/site"
import { cn } from "@/lib/utils"

import "./globals.css"

const figtreeHeading = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
})

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://strattonoakmontrs.com"),
  title: {
    default: siteName,
    template: `${siteName} | %s`,
  },
  description:
    "Pomoć pri borbi za povoljnu kamatu na keš, stambeni i auto kredit u Srbiji. Besplatno posredovanje do filijale banke.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sr-Latn"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        figtreeHeading.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
