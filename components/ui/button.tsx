import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const fillHover =
  "relative isolate overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:content-[''] hover:before:scale-x-100"

const buttonVariants = cva(
  `group/button inline-flex shrink-0 items-center justify-center rounded-none border-2 bg-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[color,box-shadow,transform] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  {
    variants: {
      variant: {
        default: cn(
          fillHover,
          "border-primary text-primary before:bg-primary hover:text-white aria-expanded:before:scale-x-100 aria-expanded:text-white"
        ),
        outline: cn(
          fillHover,
          "border-border text-foreground before:bg-muted hover:text-foreground aria-expanded:before:scale-x-100 aria-expanded:text-foreground dark:border-input"
        ),
        secondary: cn(
          fillHover,
          "border-button-secondary-fill text-button-secondary-fill before:bg-button-secondary-fill hover:text-white aria-expanded:before:scale-x-100 aria-expanded:text-white"
        ),
        ghost:
          "border-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: cn(
          fillHover,
          "border-destructive text-destructive before:bg-destructive hover:text-white focus-visible:border-destructive focus-visible:ring-destructive/20 aria-expanded:before:scale-x-100 aria-expanded:text-white dark:focus-visible:ring-destructive/40"
        ),
        link: "border-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
