"use client"

import { InstagramIcon } from "@/components/icons/instagram"
import { cn } from "@/lib/utils"
import { siteName } from "@/lib/site"

type InstagramPlaceholderLinkProps = {
  className?: string
}

export function InstagramPlaceholderLink({
  className,
}: InstagramPlaceholderLinkProps) {
  return (
    <a
      href="#"
      className={cn(
        "inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-primary",
        className,
      )}
      onClick={(event) => event.preventDefault()}
    >
      <InstagramIcon />
      <span>{siteName}</span>
    </a>
  )
}
