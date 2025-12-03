import React from "react";
import { TopSellerProduct } from "../../app/analytics/types";
import { montserrat } from "../../app/page";
// import { Coffee } from 'lucide-react';

// --- Stat Card ---

interface StatCardProps {
  label: string;
  value: string | number;
  color: "green" | "teal" | "blue" | "dark";
  smallText?: boolean;
}

export function StatCard({
  label,
  value,
  color,
  smallText = false,
}: StatCardProps) {
  const colorClasses = {
    green: "bg-[#D7EFE0] text-gray-900",
    teal: "bg-[#C2E7DA] text-gray-900",
    blue: "bg-[#6290C3] text-white",
    dark: "bg-[#1A1B41] text-white",
  };

  return (
    // FIX 1: Added 'flex flex-col h-full' to ensure the card occupies the full height
    // provided by its flex-1 wrapper in PerformanceTab.
    // FIX 2: Changed 'p-4' to 'p-3' to reduce internal padding and save vertical space.
    <div
      className={`flex flex-col h-full rounded-2xl p-3 ${colorClasses[color]} drop-shadow-md`}
    >
      <span className="block text-base font-semibold">{label}</span>

      {/* FIX 3: Removed mt-1 to reduce margin between label and value. */}
      {/* FINAL SIZING: text-2xl/text-lg */}
      <span
        className={`block ${smallText ? "text-lg" : "text-2xl"} font-bold leading-none`}
      >
        {value}
      </span>
    </div>
  );
}

// --- Dropdown Item ---

interface DropdownItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

export function DropdownItem({
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

// --- Tab Button ---

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex-1 rounded-full px-3 py-1.5 text-center text-sm font-bold /* Reduced px-4/py-2 -> px-3/py-1.5 */
        transition-colors z-10
        ${active ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}
      `}
    >
      {label}
      {active && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full bg-[#6290C3]" />
      )}
    </button>
  );
}

// --- Time Filter Button ---

interface TimeFilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function TimeFilterButton({
  label,
  active,
  onClick,
}: TimeFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-3 py-1.5 text-xs font-bold capitalize transition-all /* Reduced px-5/py-2 -> px-3/py-1.5 */
        ${
          active
            ? "bg-[#1A1B41] text-white shadow-md"
            : "bg-transparent text-gray-600 hover:bg-gray-200"
        }
      `}
    >
      {label}
    </button>
  );
}

// --- Bestseller Filter Pill ---

interface BestsellerFilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function BestsellerFilterPill({
  label,
  active,
  onClick,
}: BestsellerFilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-5 py-2 text-sm font-bold capitalize
        drop-shadow-md 
        ${active ? "bg-[#1A1B41] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
      `}
    >
      {label}
    </button>
  );
}

// --- Bestseller Product Card ---

interface BestsellerProductCardProps {
  product: TopSellerProduct;
}

export function BestsellerProductCard({ product }: BestsellerProductCardProps) {
  const getCategoryLabel = (id: string) => {
    switch (id) {
      case "signature":
        return "Signature";
      case "coffee-based":
        return "Coffee Based";
      case "frappe-based":
        return "Frappe Based";
      case "non-coffee":
        return "Non-Coffee";
      case "matcha-based":
        return "Matcha Based";
      case "soda-based":
        return "Soda Based";
      case "waffles":
        return "Waffles";
      case "pasta-sandwich":
        return "Pasta & Sandwich";
      case "pika-pika":
        return "Pika-Pika";
      default:
        return "All";
    }
  };

  const badgeColor =
    product.rank === 1
      ? "bg-[#FFD700] text-[#333]"
      : product.rank === 2
        ? "bg-[#C0C0C0] text-[#333]"
        : product.rank === 3
          ? "bg-[#CD7F32] text-white"
          : "bg-gray-200 text-gray-700";

  return (
    <div
      className="
        flex flex-col items-center justify-between text-center
        rounded-2xl bg-white p-5 shadow-sm border border-gray-100
        transition-all duration-300 hover:shadow-md hover:border-[#6290C3]
    "
    >
      <div
        className={`
          w-16 h-16 rounded-full flex items-center justify-center
          text-3xl font-black mb-3 shrink-0 ${badgeColor} shadow-md
      `}
      >
        {product.rank}
      </div>

      <div className="grow flex flex-col justify-center">
        <h3 className="text-xl font-extrabold text-gray-900 leading-snug mt-2">
          {product.productName}
        </h3>
        <p className="text-sm font-semibold text-gray-500 capitalize">
          {getCategoryLabel(product.category)}
        </p>
      </div>

      <p className="text-xl font-bold text-[#6290C3] mt-3">
        PHP {product.price.toFixed(2)}
      </p>
      <p className="text-xs text-gray-600 mt-1">({product.itemsSold} sold)</p>
    </div>
  );
}
