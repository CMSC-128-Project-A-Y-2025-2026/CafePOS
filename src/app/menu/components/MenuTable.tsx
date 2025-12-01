// src/app/menu/components/MenuTable.tsx

import React from 'react';
import { MenuItem } from '../types';
import { Trash2, Pencil } from 'lucide-react';

interface MenuTableProps {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export default function MenuTable({ menuItems, onEdit, onDelete }: MenuTableProps) {
  return (
    // Outer container maintains flex-1 for layout
    <div className="flex-1 rounded-2xl bg-white p-8 shadow-lg flex flex-col overflow-hidden">
      
      {/* Table Header (Fixed Position) */}
      <div className="grid grid-cols-5 gap-4 rounded-lg bg-[#E5F1FB] px-6 py-4 flex-shrink-0">
        <div className="font-bold text-gray-700 col-span-2">Product Name</div>
        <div className="font-bold text-gray-700">Category</div>
        <div className="font-bold text-gray-700">Price</div>
        <div className="font-bold text-gray-700">Actions</div>
      </div>

      {/* Table Body (Scrollable Area) */}
      {/* Set an explicit height constraint (e.g., max-h-[70vh]) or use flex-1 and overflow-y-auto */}
      <div className="mt-4 flex flex-col gap-1 flex-1 overflow-y-auto" style={{ maxHeight: '185px' }}>
        {menuItems.map((item) => (
          <div key={item.id} className="grid grid-cols-5 items-center gap-4 border-b border-gray-100 px-6 py-3 hover:bg-gray-50 transition-colors">
            <div className="font-medium text-gray-900 col-span-2">{item.name}</div>
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