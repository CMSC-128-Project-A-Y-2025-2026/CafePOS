// src/app/order/page.tsx

import { Montserrat } from "next/font/google";
// We don't need to import any other components here, just the main wrapper

// Import the new Client Component
import OrderTerminal from "#/src/components/order/OrderTerminal";

// Load Montserrat font on the server
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

// --- Main Order Page Component (Server Component) ---

export default function OrderPage() {
  const fontClassName = montserrat.className;

  return (
    // The main container and font loading is done here in the Server Component
    <div className={`flex h-screen flex-col bg-[#F9F1E9] ${fontClassName}`}>
      {/* We rely on the OrderTerminal component to handle the full rendering, 
        including the OrderHeader (which is now imported by OrderTerminal) 
      */}
      <OrderTerminal fontClassName={fontClassName} />
    </div>
  );
}
