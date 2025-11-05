import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  asChild?: boolean;
  variant?: "primary" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  asChild,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const variants: Record<typeof variant, string> = {
    primary:
      "bg-indigo-500/80 hover:bg-indigo-400 text-white border border-white/10 backdrop-blur-sm",
    ghost: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
  };

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
