import React from "react";
import { X } from "lucide-react";
import { InventoryItem } from "@/lib/types";

interface WeeklyReportModalProps {
  inventory: InventoryItem[];
  onClose: () => void;
}

export default function WeeklyReportModal({
  inventory,
  onClose,
}: WeeklyReportModalProps) {
  const outOfStock = inventory.filter((item) => item.status === "out of stock");
  const lowStock = inventory.filter((item) => item.status === "low stock");

  return (
    /** * MODIFIED: Added backdrop-blur-md and changed overlay to bg-black/20
     * for consistent design across all modals.
     */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all">
      {/* Clickable overlay to close the report */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Weekly Restock Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Report Content */}
        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
          {/* Out of Stock (High Priority) */}
          <div>
            <h3 className="text-xl font-bold text-red-600 border-b border-red-100 pb-1">
              Immediate Priority (Out of Stock)
            </h3>
            {outOfStock.length > 0 ? (
              <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                {outOfStock.map((item) => (
                  <li key={item.id}>
                    <span className="font-semibold text-gray-900">
                      {item.product}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      (Category: {item.category})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500 p-2 bg-green-50 rounded-lg">
                ✅ No items are out of stock. Great job!
              </p>
            )}
          </div>

          {/* Low Stock (Medium Priority) */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-yellow-600 border-b border-yellow-100 pb-1">
              Low Stock (Restock Soon)
            </h3>
            {lowStock.length > 0 ? (
              <ul className="mt-3 list-disc pl-5 space-y-2 text-gray-700">
                {lowStock.map((item) => (
                  <li key={item.id}>
                    <span className="font-semibold text-gray-900">
                      {item.product}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      (Current Stock: {item.stock})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500 p-2 bg-green-50 rounded-lg">
                🎉 No items are low in stock.
              </p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
