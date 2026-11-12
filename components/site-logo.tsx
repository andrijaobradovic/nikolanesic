import Link from "next/link"

import { cn } from "@/lib/utils"
type SiteLogoProps = {
  className?: string
  onNavigate?: () => void
}

export function SiteLogo({ className, onNavigate }: SiteLogoProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "font-heading text-lg font-semibold tracking-tight sm:text-xl",
        className,
      )}
    >
      <span className="text-button-secondary-fill">Stratton </span>
      <span className="text-primary">Oak Mont</span>
    </Link>
  )
}
