import React from "react";
import { MenuItem } from "@/lib/types";
import { Trash2, Pencil } from "lucide-react";
// 1. Import Shadcn UI table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <main className="h-full min-h-0 rounded-2xl bg-white p-8 shadow-lg flex flex-col overflow-hidden">
      
      {/* 2. Scrollable container wrapper */}
      <div className="rounded-md border flex-1 overflow-auto">
        <Table>
          
          {/* 3. Sticky header pinned to the top */}
          <TableHeader className="bg-[#E5F1FB] sticky top-0 z-10">
            <TableRow>
              <TableHead className="font-bold text-gray-700 w-1/3">Product Name</TableHead>
              <TableHead className="font-bold text-gray-700">Category</TableHead>
              <TableHead className="font-bold text-gray-700">Price</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium text-gray-900">
                  {item.name}
                </TableCell>
                <TableCell className="text-gray-700">{item.category}</TableCell>
                <TableCell className="text-gray-700">
                  PHP {item.price.toFixed(2)}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-3 justify-end">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}