"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 border border-gray-200">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        {/* Add a second thumb if the value array has more than 1 item, or standard way is usually to just render children, but Radix Slider renders thumbs based on defaultValue/value length if NO children are provided, or we can explicitly render them.
        However, the standard shadcn implementation usually looks like this.
        To support multiple thumbs (range), we need to render multiple thumbs.
        Radix primitives automatically render thumbs if we don't provide them as children? No, we MUST provide Thumb components.
        If we want dynamic thumbs based on value, we should map them.
        But for simplicity in shadcn pattern, we often see just one Thumb being rendered in the basic example.
        To support Range (2 values), we need two Thumbs.
    */}
        {/* We will render two thumbs to be safe for range sliders. Radix handles it if only one value is passed (it just uses the first one?).
         Actually, if we pass `value={[10]}` and render 2 thumbs, the second might be unused or default to 0?
         Let's check Radix docs mechanism.
         "You can render multiple thumbs to create a range slider."
         If I render 2 Thumbs, and only provide 1 value, it might be weird.
         
         Better approach: Use the standard shadcn slider which assumes 1 thumb, OR modify it to map over `props.value` or `props.defaultValue` to render thumbs.
    */}
        {(props.value || props.defaultValue)?.length && (props.value || props.defaultValue)!.length > 1 ? (
            <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        ) : null}
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
