// src/app/layout.tsx

import type { Metadata } from 'next'
// 1. Import Montserrat instead of Inter
import { Montserrat } from 'next/font/google'
import './globals.css'

// 2. Initialize the font with the weights you need
const montserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal', 'italic'], // Add this line
  weight: ['400', '700', '800', '900'], // Add '800' and '900'
})

export const metadata: Metadata = {
  title: 'CafePOS',
  description: 'Cafe Point of Sale System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* 3. Apply the font's class name to the body */}
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}