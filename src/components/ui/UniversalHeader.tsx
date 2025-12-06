// src/app/analytics/components/AnalyticsHeader.tsx
"use client";
import { useEffect, useState } from "react";
import { Coffee, ClipboardPen, PieChart, Boxes, Menu } from "lucide-react";
import { DropdownItem } from "#/src/components/ui/HelperComponents";
import { useRouter } from "next/navigation";

interface UniversalHeaderProps {
  pageName1: string;
  pageName2: string;
}

function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function UniversalHeader({
  pageName1,
  pageName2,
}: UniversalHeaderProps) {
  const router = useRouter();
  const formattedTime = useClock();

  const handleMenuClick = () => router.push("/menu");
  const handleLogoClick = () => router.push("/");
  const handleOrderClick = () => router.push("/order");
  const handleAnalyticsClick = () => router.push("/analytics");
  const handleInventoryClick = () => router.push("/inventory");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const page_name_1 = pageName1;
  const page_name_2 = pageName2;
  return (
    <header className={page_name_1 == "Menu" ? "flex w-full items-center justify-between relative z-30 shrink-0 p-6" : "flex w-full items-center justify-between relative z-30 shrink-0"}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');`}
      </style>
      <div
        className="relative z-50"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <div
          className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80 pb-1"
          onClick={handleLogoClick}
        >
          <div className="drop-shadow-md">
            <Coffee size={72} className="text-gray-900" />
          </div>
          <span
            className="text-[64px] font-black leading-tight text-gray-900 drop-shadow-sm"
            style={{ fontFamily: "'Shrikhand', cursive" }}
          >
            {page_name_1} <span className="text-[#6290C3]">{page_name_2}</span>
          </span>
        </div>

        <div
          className={`
            absolute left-0 top-full w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out
            ${isDropdownOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"} /* max-h adjusted */
          `}
        >
          <div className="py-2">
            <DropdownItem
              icon={ClipboardPen}
              label="Order"
              onClick={handleOrderClick}
            />
            <DropdownItem
              icon={PieChart}
              label="Analytics"
              onClick={handleAnalyticsClick}
            />
            <DropdownItem
              icon={Boxes}
              label="Inventory"
              onClick={handleInventoryClick}
            />
            <DropdownItem
              icon={Menu}
              label="Menu"
              onClick={handleMenuClick}
            />{" "}
          </div>
        </div>
      </div>

      {/* Time (Original large size maintained) */}
      <div className="flex items-baseline gap-3 font-black italic tracking-tight drop-shadow-sm">
        <span className="text-[64px] text-[#6290C3]">
          {formattedTime.split(" ")[0]}
        </span>
        <span className="text-gray-900 text-[48px]">
          {formattedTime.split(" ")[1]}
        </span>
      </div>
    </header>
  );
}
