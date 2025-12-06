// src/app/menu/page.tsx
import { Montserrat } from "next/font/google";
import MenuManagement from "../../components/menu/MenuManagement";
import UniversalHeader from "@/components/ui/UniversalHeader";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function MenuManagementPage() {
  const fontClassName = montserrat.className;

  return (
    <div className={`flex h-screen flex-col bg-[#F9F1E9] ${fontClassName}`}>
      <UniversalHeader pageName1="Menu" pageName2="Management" />
      <MenuManagement fontClassName={fontClassName} />
    </div>
  );
}
