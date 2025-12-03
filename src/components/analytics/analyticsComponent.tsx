"use client";

import { useState } from "react";
import { Montserrat } from "next/font/google";

// Import components
import TabNavigation from "#/src/components/analytics/TabNavigation";
import PerformanceTab from "#/src/components/analytics/PerformanceTab";
import BestsellerTab from "#/src/components/analytics/BestsellerTab";
import TrendTab from "#/src/components/analytics/TrendTab";

// Load Montserrat font
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function AnalyticsComponent() {
  const [activeMainTab, setActiveMainTab] = useState("performance");
  const [activeTimeFilter, setActiveTimeFilter] = useState("week");
  return (
    <div className="flex flex-col flex-1 p-5 overflow-hidden">
      <div className="shrink-0 mb-5">
        <TabNavigation
          activeMainTab={activeMainTab}
          setActiveMainTab={setActiveMainTab}
          activeTimeFilter={activeTimeFilter}
          setActiveTimeFilter={setActiveTimeFilter}
        />
      </div>

      <main className="flex-1 rounded-2xl bg-white p-6 shadow-lg overflow-hidden drop-shadow-md">
        {activeMainTab === "performance" && (
          <PerformanceTab activeTimeFilter={activeTimeFilter} />
        )}
        {activeMainTab === "bestseller" && <BestsellerTab />}
        {activeMainTab === "trend" && <TrendTab />}
      </main>
    </div>
  );
}
