// src/app/order/components/ProductCard.tsx
import React from "react";
import { Plus, AlertTriangle, AlertCircle } from "lucide-react";
import { Product } from "@/lib/types";
// 1. Import toast from sonner
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onCustomize: () => void;
}

export default function ProductCard({
  product,
  onCustomize,
}: ProductCardProps) {
  // 2. Wrap the onCustomize call to include the toast
  const handleSelect = () => {
    if (product.hasOutOfStock) {
      const outOfStockItems = product.ingredients?.filter(
        (ing) => ing.stock_status === "out of stock"
      ) || [];
      
      toast.error(
        `⚠️ Cannot prepare ${product.name}\n\nOut of stock ingredients:\n${outOfStockItems.map((ing) => `• ${ing.item_name}`).join("\n")}`,
        {
          duration: 5000,
          style: {
            whiteSpace: "pre-line",
          },
        }
      );
      return;
    }

    if (product.hasLowStock) {
      const lowStockItems = product.ingredients?.filter(
        (ing) => ing.stock_status === "low stock"
      ) || [];
      
      toast.warning(
        `⚠️ Low stock alert for ${product.name}\n\n${lowStockItems.map((ing) => `• ${ing.item_name} (${ing.stock}/${ing.item_threshold})`).join("\n")}`,
        {
          duration: 4000,
          style: {
            whiteSpace: "pre-line",
          },
        }
      );
    } else {
      toast.success(`Opening options for ${product.name}`, {
        description: "Customize your selection below.",
        duration: 2000,
      });
    }
    
    onCustomize();
  };

  return (
    <div
      className={`
        group flex flex-col justify-between items-center rounded-2xl bg-white p-4
        shadow-md transition-all duration-200
        hover:shadow-xl hover:-translate-y-0.5 border border-gray-100
        cursor-pointer h-full min-h-[150px] relative
        ${product.hasOutOfStock ? 'opacity-60' : ''}
      `}
      // 3. Update the onClick to use handleSelect
      onClick={handleSelect}
    >
      {/* Alert Indicators */}
      {product.hasOutOfStock && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-10 h-10 rounded-full bg-red-500 shadow-lg z-10">
          <AlertCircle size={24} className="text-white" />
        </div>
      )}
      {product.hasLowStock && !product.hasOutOfStock && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 shadow-lg z-10">
          <AlertTriangle size={24} className="text-white" />
        </div>
      )}

      <div className="flex flex-col items-center justify-center grow text-center">
        <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-[#6290C3] mt-1">
          PHP {product.price.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 w-full shrink-0">
        <div className={`w-full flex items-center justify-center gap-2 rounded-lg p-2 font-semibold transition-all ${
          product.hasOutOfStock 
            ? 'bg-red-100 text-red-600 group-hover:bg-red-200' 
            : product.hasLowStock
            ? 'bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200'
            : 'bg-[#E5F1FB] text-[#6290C3] group-hover:bg-[#6290C3] group-hover:text-white'
        }`}>
          <Plus size={18} />
          <span>{product.hasOutOfStock ? 'Out of Stock' : 'Select'}</span>
        </div>
      </div>
    </div>
  );
}
