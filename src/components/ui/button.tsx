import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-[hsl(43_74%_49%)] to-[hsl(43_74%_60%)] text-[hsl(200_85%_12%)] font-semibold shadow-[0_8px_24px_-4px_hsla(43,74%,49%,0.3)] hover:shadow-[0_12px_40px_-8px_hsla(200,80%,20%,0.15)] hover:scale-[1.02] active:scale-[0.98]",
        ocean: "bg-gradient-to-r from-[hsl(200_80%_20%)] to-[hsl(200_60%_35%)] text-[hsl(40_33%_98%)] font-semibold shadow-[0_4px_20px_-4px_hsla(200,80%,20%,0.1)] hover:shadow-[0_12px_40px_-8px_hsla(200,80%,20%,0.15)] hover:scale-[1.02] active:scale-[0.98]",
        "outline-gold": "border-2 border-[hsl(43_74%_49%)] bg-transparent text-[hsl(43_74%_49%)] hover:bg-[hsl(43_74%_49%)] hover:text-[hsl(200_85%_12%)] font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
