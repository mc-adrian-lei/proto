import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export function Slider({ className, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/10">
        <SliderPrimitive.Range className="absolute h-full bg-indigo-400" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-200 bg-white shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200" />
    </SliderPrimitive.Root>
  );
}
