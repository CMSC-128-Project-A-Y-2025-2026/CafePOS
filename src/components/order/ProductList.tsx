// src/app/order/components/ProductList.tsx
import React from "react";
import { Search } from "lucide-react";
import { Product } from "../../app/order/types";
import ProductCard from "./ProductCard";
import CategoryButton from "./CategoryButton";
import { newCategories } from "../../app/order/mockData"; // Import data

interface ProductListProps {
  filteredProducts: Product[];
  activeCategory: string;
  searchTerm: string;
  setActiveCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setProductToCustomize: (product: Product) => void;
}

export default function ProductList({
  filteredProducts,
  activeCategory,
  searchTerm,
  setActiveCategory,
  setSearchTerm,
  setProductToCustomize,
}: ProductListProps) {
  return (
    <>
      {/* Categories */}
      <nav className="shrink-0 w-48 rounded-3xl bg-white p-4 shadow-xl flex flex-col h-full">
        <div className="flex flex-1 flex-col justify-start gap-2">
          {newCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      </nav>

      {/* Products */}
      <main className="flex flex-1 flex-col">
        <div className="relative mb-4 shrink-0 drop-shadow-md z-10">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 pl-12 text-lg text-gray-900 placeholder-gray-500 focus:border-[#6290C3] focus:ring-[#6290C3] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={24}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 pt-3">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={() => setProductToCustomize(product)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
