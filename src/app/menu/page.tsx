// src/app/menu/page.tsx
import { Montserrat } from "next/font/google";
import MenuHeader from "#/src/components/menu/MenuHeader";
import MenuManagement from "../../components/menu/MenuManagement";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function MenuManagementPage() {
  const fontClassName = montserrat.className;

  return (
    <div className={`flex h-screen flex-col bg-[#F9F1E9] ${fontClassName}`}>
      <MenuHeader pageName1="Menu" pageName2="Management" />
      <MenuManagement fontClassName={fontClassName} />
    </div>
  );
}
