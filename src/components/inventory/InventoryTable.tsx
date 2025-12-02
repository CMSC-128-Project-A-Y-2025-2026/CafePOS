// src/app/inventory/components/InventoryTable.tsx
import React from "react";
import { InventoryItem } from "@/app/inventory/types";
import { TableActionButton } from "./Buttons";

interface InventoryTableProps {
  filteredInventory: InventoryItem[];
  setProductToEdit: (item: InventoryItem) => void;
  setProductToDelete: (item: InventoryItem) => void;
}

export default function InventoryTable({
  filteredInventory,
  setProductToEdit,
  setProductToDelete,
}: InventoryTableProps) {
  return (
    <main className="flex-1 rounded-2xl bg-white p-8 shadow-lg flex flex-col overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 rounded-lg bg-[#E5F1FB] px-6 py-4 shrink-0">
        <div className="font-bold text-gray-700">Product</div>
        <div className="font-bold text-gray-700">Category</div>
        <div className="font-bold text-gray-700">Stock</div>
        <div className="font-bold text-gray-700">Status</div>
        <div className="font-bold text-gray-700">Cost</div>
        <div className="font-bold text-gray-700">Actions</div>
      </div>

      {/* Table Body */}
      <div className="mt-4 flex flex-col gap-4 flex-1 overflow-y-auto">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-6 items-center gap-4 border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-gray-900">{item.product}</div>
            <div className="text-gray-700">{item.category}</div>
            <div className="text-gray-700">{item.stock}</div>
            <div className="text-gray-700">{item.status}</div>
            <div className="text-gray-700">{item.cost}</div>
            <div className="flex gap-2">
              <TableActionButton
                className="bg-[#D7EFE0] text-[#34A853] hover:bg-[#BDECD5]"
                onClick={() => setProductToEdit(item)}
              >
                edit
              </TableActionButton>
              <TableActionButton
                className="bg-[#FADADD] text-[#E53935] hover:bg-[#F8C6D2]"
                onClick={() => setProductToDelete(item)}
              >
                del
              </TableActionButton>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
