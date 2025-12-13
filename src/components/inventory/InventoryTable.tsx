import React from "react";
import { InventoryItem } from "@/lib/types";
import { inventoryCategories } from "@/lib/arrays";
import { Trash2, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getUnitByCategory(category: string) {
  for (const main of inventoryCategories) {
    const sub = main.subcategories.find(
      (s) => s.value === category || s.label === category,
    );
    if (sub && "unit" in sub) return sub.unit;
  }
  return "";
}

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
      <div className="rounded-md border flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-[#E5F1FB] sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-bold text-gray-700">Product</TableHead>
              <TableHead className="font-bold text-gray-700">
                Category
              </TableHead>
              <TableHead className="font-bold text-gray-700">Stock</TableHead>
              <TableHead className="font-bold text-gray-700">Status</TableHead>
              <TableHead className="font-bold text-gray-700">Cost</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInventory.map((item) => {
              const unit = getUnitByCategory(item.category);

              return (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">
                    {item.product}
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {item.category}
                  </TableCell>

                  {/* ---------- Stock + unit ---------- */}
                  <TableCell className="text-gray-700">
                    {item.stock}
                    {unit && <span className="text-gray-400 ml-1">{unit}</span>}
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {item.status.replace(
                      /\b(in|low|out|stock)\b/g,
                      (m) => m[0].toUpperCase() + m.slice(1),
                    )}
                  </TableCell>

                  <TableCell className="text-gray-700">{item.cost}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setProductToEdit(item)}
                        className="text-[#6290C3] hover:text-[#1A1B41] p-1 rounded-md"
                        title="Edit Item"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(item)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md"
                        title="Delete Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
