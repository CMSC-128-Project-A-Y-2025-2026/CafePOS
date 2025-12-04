// src/app/inventory/components/InventoryHeader.tsx
import React from "react";
// IMPORT FIXED: Added CoffeeTogo icon for Menu, and router dependency
import { Coffee, ClipboardPen, PieChart, Boxes, Menu } from "lucide-react";
import DropdownItem from "@/components/SelectionMenu/DropdownItem";
import { useRouter } from "next/navigation"; // Must import useRouter

interface InventoryHeaderProps {
  formattedTime: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  handleLogoClick: () => void;
  handleOrderClick: () => void;
  handleAnalyticsClick: () => void;
  handleInventoryClick: () => void;
}

export default function InventoryHeader({
  formattedTime,
  isDropdownOpen,
  setIsDropdownOpen,
  handleLogoClick,
  handleOrderClick,
  handleAnalyticsClick,
  handleInventoryClick,
}: InventoryHeaderProps) {
  const router = useRouter(); // Initialize router inside the component
  const handleMenuClick = () => router.push("/menu"); // New handler for Menu link

  return (
    <header className="flex w-full items-center justify-between relative z-30 shrink-0">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');`}
      </style>
      <div
        className="relative z-50"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        {/* Logo */}
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
            Inventory <span className="text-[#6290C3]">Management</span>
          </span>
        </div>

        {/* Dropdown Menu */}
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
            <DropdownItem icon={Menu} label="Menu" onClick={handleMenuClick} />{" "}
            {/* NEW LINK ADDED */}
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
