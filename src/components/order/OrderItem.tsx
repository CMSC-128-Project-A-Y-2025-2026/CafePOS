// src/app/order/components/OrderItem.tsx
import React from "react";
import { Plus, Minus } from "lucide-react";
import { CartItem } from "@/lib/types";

interface OrderItemProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function OrderItem({
  item,
  onIncrement,
  onDecrement,
}: OrderItemProps) {
  // Logic to display options and discounts
  const optionsDisplay = item.options
    .map((o) => o.name)
    .filter((n) => !n.includes("Sugar:") || n !== "Sugar: 100%")
    .join(", ");
  const sugarDisplay =
    item.options.find((o) => o.name.includes("Sugar:"))?.name || "";
  const discountDisplay =
    item.discountPercent > 0 ? `(${item.discountPercent}% OFF)` : "";

  return (
    <div className="flex items-start justify-between border-b border-gray-100 pb-3">
      <div className="pr-2">
        <h4 className="text-lg font-bold text-gray-900 leading-snug">
          {item.name}
          <span className="text-xs text-red-600 font-semibold ml-1">
            {discountDisplay}
          </span>
        </h4>
        <div className="flex flex-col text-sm text-gray-600">
          {optionsDisplay && <p className="text-xs">• {optionsDisplay}</p>}
          {sugarDisplay && <p className="text-xs">• {sugarDisplay}</p>}
        </div>

        {item.notes && (
          <p className="text-xs text-gray-500 italic mt-1">
            Note: &quot;{item.notes}&quot;
          </p>
        )}
        <p className="text-base font-semibold text-gray-700 mt-1">
          PHP {(item.unitPrice * item.quantity).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 shrink-0 mt-1">
        <button
          onClick={onDecrement}
          className="text-gray-600 hover:bg-red-200 p-1 rounded-md transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-base font-bold text-gray-900">
          {item.quantity}
        </span>
        <button
          onClick={onIncrement}
          className="text-gray-600 hover:bg-green-200 p-1 rounded-md transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
