import { cn } from "../../lib/utils";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

type CardTitleProps = HTMLAttributes<HTMLParagraphElement>;

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("mb-4 space-y-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <p
      className={cn(
        "text-lg font-semibold tracking-wide text-white drop-shadow",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("text-sm text-slate-100/80", className)} {...props} />;
}
