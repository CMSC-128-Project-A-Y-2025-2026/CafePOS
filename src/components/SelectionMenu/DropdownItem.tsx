// src/app/components/SelectionMenu/DropdownItem.tsx
import React from "react";
import { montserrat } from "@/app/inventory/page"; // Import font from main page

interface DropdownItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

export default function DropdownItem({
  icon: IconComponent,
  label,
  onClick,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-3 px-4 py-3 
        text-left text-lg font-medium text-gray-800 
        transition-colors hover:bg-[#6290C3]/10 hover:text-[#6290C3]
        ${montserrat.className}
      `}
    >
      <IconComponent size={20} className="text-gray-500" />
      <span>{label}</span>
    </button>
  );
}
