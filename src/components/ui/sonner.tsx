"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Using the style prop to force variable overrides
      style={{
        "--normal-bg": "#1A1B41",        // Your brand blue
        "--normal-text": "#FFFFFF",      // White text
        "--normal-border": "#6290C3",    // Slightly darker blue border
        "--success-bg": "#6290C3",       // Keeping success blue too
        "--success-text": "#FFFFFF",
        "--success-border": "#1A1B41",
      } as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-blue-50", // Light text for sub-header
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-[#6290C3]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }