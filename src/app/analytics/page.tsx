import { Montserrat } from "next/font/google";
import Header from "#/src/components/ui/UniversalHeader";
import AnalyticsComponent from "#/src/components/analytics/analyticsComponent";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default async function AnalyticsPage() {
  
  return (
    <div
      className={`flex h-screen flex-col bg-[#F9F1E9] ${montserrat.className}`}
    >
      <Header pageName1="Sales Report" pageName2="Generation" />
      <AnalyticsComponent />
    </div>
  );
}
