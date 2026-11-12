"use client"

import { Menu, Phone, X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useId, useRef, useState } from "react"

import { SiteLogo } from "@/components/site-logo"
import { SiteNavLink } from "@/components/site-nav-link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { navItems, phoneDisplay, phoneTel } from "@/lib/site"

const HEADER_HEIGHT_CLASS = "h-[4.25rem]"

export function SiteHeader() {
  const panelTitleId = useId()
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const y = window.scrollY
        if (!media.matches) {
          setHeaderVisible(true)
        } else if (y < 16) {
          setHeaderVisible(true)
        } else if (y > lastScrollY.current + 4) {
          setHeaderVisible(false)
        } else if (y < lastScrollY.current - 4) {
          setHeaderVisible(true)
        }
        lastScrollY.current = y
        ticking = false
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen, closeMenu])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-background transition-transform duration-300 ease-out",
          HEADER_HEIGHT_CLASS,
          !headerVisible && "-translate-y-full md:duration-300",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6",
          )}
        >
          <SiteLogo onNavigate={menuOpen ? closeMenu : undefined} />

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Glavna navigacija"
          >
            {navItems.map((item) => (
              <SiteNavLink
                key={item.href}
                href={item.href}
                label={item.label}
              />
            ))}
          </nav>

          <Link
            href={`tel:${phoneTel}`}
            className="hidden items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary md:flex"
          >
            <Phone className="size-4 shrink-0 text-primary" aria-hidden />
            <span>{phoneDisplay}</span>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={menuOpen}
            aria-controls={panelTitleId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Zatvori meni" : "Otvori meni"}</span>
            {menuOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </Button>
        </div>

        {headerVisible ? (
          <div className="absolute inset-x-0 bottom-0 flex justify-center px-[15%]" aria-hidden>
            <div className="h-px w-full bg-primary" />
          </div>
        ) : null}
      </header>

      <div
        className={cn(HEADER_HEIGHT_CLASS, "shrink-0")}
        aria-hidden
      />

      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[1px]"
            aria-label="Zatvori meni"
            onClick={closeMenu}
          />
          <aside
            id={panelTitleId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${panelTitleId}-label`}
            className="absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col gap-6 border-l border-border bg-background p-6 shadow-lg"
          >
            <p id={`${panelTitleId}-label`} className="sr-only">
              Navigacija
            </p>
            <nav className="flex flex-col gap-5 pt-2" aria-label="Mobilna navigacija">
              {navItems.map((item) => (
                <SiteNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  onNavigate={closeMenu}
                  className="text-base"
                />
              ))}
            </nav>
            <Link
              href={`tel:${phoneTel}`}
              onClick={closeMenu}
              className="mt-auto inline-flex items-center gap-2 border-t border-border pt-6 text-base font-medium text-foreground transition-colors hover:text-primary"
            >
              <Phone className="size-5 shrink-0 text-primary" aria-hidden />
              <span>{phoneDisplay}</span>
            </Link>
          </aside>
        </div>
      ) : null}
    </>
  )
}
