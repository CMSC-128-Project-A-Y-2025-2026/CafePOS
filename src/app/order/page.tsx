// src/app/order/page.tsx
import { Montserrat } from "next/font/google";
import OrderTerminal from "#/src/components/order/OrderTerminal";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function OrderPage() {
  const fontClassName = montserrat.className;

  return (
    <div className={`flex h-screen flex-col bg-[#F9F1E9] ${fontClassName}`}>
      <OrderTerminal fontClassName={fontClassName} />
    </div>
  );
}
