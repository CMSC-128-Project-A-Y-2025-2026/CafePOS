import React from "react";
import { MenuItem } from "@/lib/types";
import { Trash2, Pencil } from "lucide-react";
import { inventoryCategories } from "@/lib/arrays";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { connect } from "http2";

interface MenuTableProps {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

function getUnitBySubcategory(subValue: string) {
  for (const cat of inventoryCategories) {
    const sub = cat.subcategories.find((s) => s.label === subValue);
    if (sub && "unit" in sub) return sub.unit;
  }
  return "";
}

export default function MenuTable({
  menuItems,
  onEdit,
  onDelete,
}: MenuTableProps) {
  return (
    <main className="h-full min-h-0 rounded-2xl bg-white p-8 shadow-lg flex flex-col overflow-hidden">
      <div className="rounded-md border flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-[#E5F1FB] sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-bold text-gray-700 w-1/4">
                Product Name
              </TableHead>
              <TableHead className="font-bold text-gray-700">
                Category
              </TableHead>
              {/* NEW COLUMN */}
              <TableHead className="font-bold text-gray-700">
                Ingredients
              </TableHead>
              <TableHead className="font-bold text-gray-700">Price</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {menuItems.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium text-gray-900">
                  {item.name}
                </TableCell>
                <TableCell className="text-gray-700">{item.category}</TableCell>

                <TableCell className="text-gray-600 max-w-[200px]">
                  {item.ingredients && item.ingredients.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.map((ing, idx) => {
                        const unit = getUnitBySubcategory(ing.category ?? "");

                        return (
                          <span
                            key={idx}
                            className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                          >
                            {ing.name} × {ing.quantity} {unit}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="italic text-gray-400">None listed</span>
                  )}
                </TableCell>

                <TableCell className="text-gray-700">
                  PHP {item.price.toFixed(2)}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-[#6290C3] p-1"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-500 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
