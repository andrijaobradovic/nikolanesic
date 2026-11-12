"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type SiteNavLinkProps = {
  href: string
  label: string
  onNavigate?: () => void
  className?: string
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNavLink({
  href,
  label,
  onNavigate,
  className,
}: SiteNavLinkProps) {
  const pathname = usePathname()
  const active = isActivePath(pathname, href)

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative pb-1 text-sm font-medium text-foreground transition-colors hover:text-primary",
        active && "text-foreground",
        className,
      )}
    >
      {label}
      {active ? (
        <span
          className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
          aria-hidden
        />
      ) : null}
    </Link>
  )
}
