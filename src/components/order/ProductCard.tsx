// src/app/order/components/ProductCard.tsx
import React from "react";
import { Plus } from "lucide-react";
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
    toast.success(`Opening options for ${product.name}`, {
      description: "Customize your selection below.",
      duration: 2000,
    });
    onCustomize();
  };

  return (
    <div
      className="
        group flex flex-col justify-between items-center rounded-2xl bg-white p-4
        shadow-md transition-all duration-200
        hover:shadow-xl hover:-translate-y-0.5 border border-gray-100
        cursor-pointer h-full min-h-[150px]
      "
      // 3. Update the onClick to use handleSelect
      onClick={handleSelect}
    >
      <div className="flex flex-col items-center justify-center grow text-center">
        <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-[#6290C3] mt-1">
          PHP {product.price.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 w-full shrink-0">
        <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#E5F1FB] p-2 text-[#6290C3] font-semibold transition-all group-hover:bg-[#6290C3] group-hover:text-white">
          <Plus size={18} />
          <span>Select</span>
        </div>
      </div>
    </div>
  );
}
