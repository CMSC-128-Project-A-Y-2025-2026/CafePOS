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
      className={`flex h-screen flex-col bg-[#F9F1E9] p-6 ${montserrat.className}`}
    >
<<<<<<< HEAD
      <Header pageName1="Sales Report" pageName2="Generation" />
      <AnalyticsComponent />
=======
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
      <div className="flex flex-col flex-1 p-6 overflow-hidden">
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
>>>>>>> 9f2380a (hotfix: adjusted analytics page screen size)
    </div>
  );
}
