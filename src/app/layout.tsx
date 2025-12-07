import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Pres Kopee Café POS",
  description: "Pres Kopee Cafe Point of Sale System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        {/* Updated position to top-center to match shadcn demo */}
        <Toaster position="top-center" richColors={false} />
      </body>
    </html>
  );
}
