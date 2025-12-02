"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";

// Import components
import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import TabNavigation from "../../components/analytics/TabNavigation";
import PerformanceTab from "../../components/analytics/PerformanceTab";
import BestsellerTab from "../../components/analytics/BestsellerTab";
import TrendTab from "../../components/analytics/TrendTab";

// Load Montserrat font
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

// --- Main Component ---

export default function AnalyticsPage() {
  const router = useRouter();

  // --- State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMainTab, setActiveMainTab] = useState("performance");
  const [activeTimeFilter, setActiveTimeFilter] = useState("week");

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // --- Handlers ---
  const handleLogoClick = () => router.push("/");
  const handleOrderClick = () => router.push("/order");
  const handleAnalyticsClick = () => setIsDropdownOpen(false);
  const handleInventoryClick = () => router.push("/inventory");

  return (
    // FIX 1: Changed 'min-h-screen' to 'h-screen' to enforce full height, and removed 'p-5'
    <div
      className={`flex h-screen flex-col bg-[#F9F1E9] ${montserrat.className}`}
    >
      <AnalyticsHeader
        formattedTime={formattedTime}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        handleLogoClick={handleLogoClick}
        handleOrderClick={handleOrderClick}
        handleAnalyticsClick={handleAnalyticsClick}
        handleInventoryClick={handleInventoryClick}
      />

      {/* NEW WRAPPER: This container takes the space below the header ('flex-1') 
          and applies the page padding ('p-5'). */}
      <div className="flex flex-col flex-1 p-5 overflow-hidden">
        {/* Tab Navigation (Shrink-0 to keep fixed height) */}
        <div className="shrink-0 mb-5">
          <TabNavigation
            activeMainTab={activeMainTab}
            setActiveMainTab={setActiveMainTab}
            activeTimeFilter={activeTimeFilter}
            setActiveTimeFilter={setActiveTimeFilter}
          />
        </div>

        {/* Tab Content: The 'main' tag now uses 'flex-1' and has 'h-full' implicitly 
            from its parent, forcing it to fill the remaining height 
            below the TabNavigation component. */}
        <main className="flex-1 rounded-2xl bg-white p-6 shadow-lg overflow-hidden drop-shadow-md">
          {activeMainTab === "performance" && <PerformanceTab />}
          {activeMainTab === "bestseller" && <BestsellerTab />}
          {activeMainTab === "trend" && <TrendTab />}
        </main>
      </div>
    </div>
  );
}
