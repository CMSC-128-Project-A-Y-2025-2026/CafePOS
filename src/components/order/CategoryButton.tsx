// src/app/order/components/CategoryButton.tsx
import React from "react";
import { Category } from "@/lib/types";

interface CategoryButtonProps {
  category: Category;
  active: boolean;
  onClick: () => void;
}

export default function CategoryButton({
  category,
  active,
  onClick,
}: CategoryButtonProps) {
  const words = category.label.split(" ");
  const firstLine = words[0];
  const secondLine = words.slice(1).join(" ");

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center h-10 px-1 py-1 text-sm font-extrabold capitalize w-full
        transition-all duration-200 rounded-xl hover:scale-[1.02]
        shadow-md text-center flex-1 
        ${
          active
            ? "bg-[#1A1B41] text-white shadow-lg ring-2 ring-white transform scale-[1.05] border-2 border-[#6290C3]"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
      `}
    >
      <span className="text-xs leading-none">{firstLine}</span>
      {secondLine && (
        <span className="text-[10px] leading-none">{secondLine}</span>
      )}
    </button>
  );
}
