// src/app/order/components/PaymentButton.tsx
"use client"
import type React from "react"

interface PaymentButtonProps {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}

export default function PaymentButton({ children, active, onClick }: PaymentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold capitalize transition-all duration-200 hover:scale-[1.02] shadow-md ${
        active
          ? "bg-[#1A1B41] text-white shadow-lg ring-2 ring-[#6290C3]"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  )
}
