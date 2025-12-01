// src/app/components/SelectionMenu/SelectionHeader.tsx

"use client";
import React, { useState } from "react";
// Import the new icon
import { Coffee, ClipboardPen, PieChart, Boxes, Menu } from "lucide-react";
import DropdownItem from "./DropdownItem";
import { useRouter } from "next/navigation";

interface SelectionHeaderProps {
  formattedTime: string;
}

export default function SelectionHeader({
  formattedTime,
}: SelectionHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleOrderClick = () => router.push("/order");
  const handleAnalyticsClick = () => router.push("/analytics");
  const handleInventoryClick = () => router.push("/inventory");
  const handleMenuClick = () => router.push("/menu");

  return (
    <header className="flex w-full items-center justify-between px-8 py-6">
      {/* Logo and Dropdown */}
      <div
        className="relative z-50"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <div className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80 pb-1">
          <div className="drop-shadow-md">
            <Coffee size={72} className="text-gray-900" />
          </div>
          <span className="text-[64px] font-black leading-tight text-gray-900 drop-shadow-sm">
            Pres <span className="text-[#6290C3]">Kopee</span>
          </span>
        </div>

        <div
          className={`
                    absolute left-0 top-full w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out
                    ${isDropdownOpen ? "max-h-64 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"}
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
            <DropdownItem icon={Menu} label="Menu" onClick={handleMenuClick} />
          </div>
        </div>
      </div>

      {/* Time */}
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
