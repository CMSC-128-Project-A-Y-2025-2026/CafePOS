// src/app/analytics/components/BestsellerTab.tsx

import React, { useState, useMemo } from 'react';
import { allTopBestsellers, bestsellerCategories } from '../mockData';
import { BestsellerFilterPill, BestsellerProductCard } from './HelperComponents';
import { TopSellerProduct } from '../types';

export default function BestsellerTab() {
  const [filter, setFilter] = useState('all');

  const rankedProducts = useMemo(() => {
    // Show all ranked products for the current filter (to ensure the scrollbar works)
    const filteredProducts = allTopBestsellers.filter(p => filter === 'all' || p.category === filter);

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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3 px-3 flex-shrink-0">
        {bestsellerCategories.map(cat => (
          <BestsellerFilterPill
            key={cat.id}
            label={cat.label}
            active={filter === cat.id}
            onClick={() => setFilter(cat.id)}
          />
        ))}
      </div>

      {/* Scrollable Content Container (Fixed Height) */}
      <div className="px-3 pb-3 overflow-y-auto" style={{ maxHeight: '380px' }}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {rankedProducts.length > 0 ? (
            rankedProducts.map(product => (
              <BestsellerProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-4 text-center text-xl text-gray-500 py-10">
              No top sellers found for the "{bestsellerCategories.find(c => c.id === filter)?.label}" category in this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}