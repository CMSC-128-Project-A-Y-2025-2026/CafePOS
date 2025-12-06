import React, { useState, useMemo } from "react";
import {
  allTopBestsellers,
  bestsellerCategories,
} from "../../app/analytics/mockData";
import {
  BestsellerFilterPill,
  BestsellerProductCard,
} from "../ui/HelperComponents";
import { TopSellerProduct } from "@/lib/types";

export default function BestsellerTab() {
  const [filter, setFilter] = useState("all");

  const rankedProducts = useMemo(() => {
    // Show all ranked products for the current filter (to ensure the scrollbar works)
    const filteredProducts = allTopBestsellers.filter(
      (p) => filter === "all" || p.category === filter,
    );

    return filteredProducts
      .sort((a, b) => b.itemsSold - a.itemsSold)
      .map((product, index) => ({
        ...product,
        rank: index + 1,
      })) as TopSellerProduct[];
  }, [filter]);

  // Note: We use rankedProducts in the map below to ensure the scrollbar appears if the list is long.

  return (
    <div className="flex h-full flex-col pt-1">
      {/* Filters (Shrink-0 is implied by flex-wrap, but explicitly adding for clarity) */}
      <div className="flex flex-wrap gap-2 mb-3 px-3 shrink-0">
        {bestsellerCategories.map((cat) => (
          <BestsellerFilterPill
            key={cat.id}
            label={cat.label}
            active={filter === cat.id}
            onClick={() => setFilter(cat.id)}
          />
        ))}
      </div>

      {/* Scrollable Content Container */}
      {/* FIX: Removed fixed 'maxHeight' and added 'flex-1'. 
          This forces the container to fill all remaining vertical space. */}
      <div className="px-3 pb-3 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {rankedProducts.length > 0 ? (
            rankedProducts.map((product) => (
              <BestsellerProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-4 text-center text-xl text-gray-500 py-10">
              No top sellers found for the &quot;
              {bestsellerCategories.find((c) => c.id === filter)?.label}&quot;
              category in this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
