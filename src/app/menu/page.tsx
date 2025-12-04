// src/app/menu/page.tsx

import { Montserrat } from "next/font/google";

import Header from "#/src/components/ui/UniversalHeader";
import MenuManagement from "../../components/menu/MenuManagement";

// Load Montserrat font (Server Component loads the font, minimizing client bundle)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function MenuManagementPage() {
  // Pass the font class down to the Client Component for styling
  const fontClassName = montserrat.className;

  return (
    <div
      className={`flex h-screen flex-col bg-[#F9F1E9] ${fontClassName}`}
    >
      <Header pageName1="Menu" pageName2="Management" />
      
      {/* Renders the client-side interactivity */}
      <MenuManagement fontClassName={fontClassName} />
    </div>
  );
}