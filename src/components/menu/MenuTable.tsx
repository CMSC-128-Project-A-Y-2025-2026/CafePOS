// src/app/menu/components/MenuTable.tsx

import React from "react";
import { MenuItem } from "@/lib/types";
import { Trash2, Pencil } from "lucide-react";

interface MenuTableProps {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export default function MenuTable({
  menuItems,
  onEdit,
  onDelete,
}: MenuTableProps) {
  return (
    <div className="h-full min-h-0 rounded-2xl bg-white p-8 shadow-lg flex flex-col overflow-hidden">
      <div className="grid grid-cols-5 gap-4 rounded-lg bg-[#E5F1FB] px-6 py-4 shrink-0">
        <div className="font-bold text-gray-700 col-span-2">Product Name</div>
        <div className="font-bold text-gray-700">Category</div>
        <div className="font-bold text-gray-700">Price</div>
        <div className="font-bold text-gray-700">Actions</div>
      </div>

      <div className="mt-4 flex flex-col gap-1 flex-1 h-full overflow-y-auto">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-5 items-center gap-6 border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900 col-span-2">
              {item.name}
            </div>
            <div className="text-gray-700">{item.category}</div>
            <div className="text-gray-700">PHP {item.price.toFixed(2)}</div>

            <div className="flex gap-3">
              <button
                onClick={() => onEdit(item)}
                className="text-[#6290C3] hover:text-[#1A1B41] transition-colors p-1 rounded-md"
                title="Edit Product"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(item)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md"
                title="Delete Product"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
