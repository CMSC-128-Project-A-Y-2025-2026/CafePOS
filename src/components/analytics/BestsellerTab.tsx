"use client";
import React, { useState, useEffect, useMemo } from "react";
import { bestsellerCategories } from "@/lib/arrays";
import {
  BestsellerFilterPill,
  BestsellerProductCard,
} from "../ui/HelperComponents";
import { TopSellerProduct } from "@/lib/types";

const PRODUCT_CACHE_KEY = "cached_products";
const ANALYTICS_CACHE_KEY = "cached_analytics";
const CACHE_EXP_MINUTES = 10;

const now = () => Date.now();
const isExpired = (t: number) => now() - t > CACHE_EXP_MINUTES * 60 * 1000;

export default function BestsellerTab() {
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState<TopSellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!cached) return;

    try {
      const parsed = JSON.parse(cached);

      if (parsed?.value) {
        queueMicrotask(() => {
          setProducts(parsed.value);
          setLoading(false);
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    let mounted = true;

    async function silentRefresh() {
      try {
        const resp = await fetch("/api/products/getProduct");
        if (!resp.ok) return;
        const raw = await resp.json();
        const cleaned = raw?.data ?? [];

        const rawAnalytics = localStorage.getItem(ANALYTICS_CACHE_KEY);
        const analyticsCache = rawAnalytics ? JSON.parse(rawAnalytics) : {};

        const freshProducts: TopSellerProduct[] = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cleaned.map(async (item: any) => {
            const id = String(item.id);

            if (
              analyticsCache[id] &&
              !isExpired(analyticsCache[id].timestamp)
            ) {
              return {
                id,
                productName: item.product_name,
                price: item.product_cost,
                category: item.product_category,
                itemsSold: analyticsCache[id].value,
              };
            }

            const res = await fetch(`/api/analytics/${id}/getSaleData`);
            const data = await res.json();
            const sales = data?.[0]?.total_sold ?? 0;

            analyticsCache[id] = { value: sales, timestamp: now() };

            return {
              id,
              productName: item.product_name,
              price: item.product_cost,
              category: item.product_category,
              itemsSold: sales,
            };
          }),
        );

        localStorage.setItem(
          PRODUCT_CACHE_KEY,
          JSON.stringify({ value: freshProducts, timestamp: now() }),
        );
        localStorage.setItem(
          ANALYTICS_CACHE_KEY,
          JSON.stringify(analyticsCache),
        );

        if (mounted) {
          setProducts(freshProducts);
          setLoading(false);
        }
      } catch {}
    }

    silentRefresh();
    return () => {
      mounted = false;
    };
  }, []);

  const rankedProducts = useMemo(() => {
    const filtered =
      filter === "all"
        ? products
        : products.filter((p) => p.category === filter);

    return filtered
      .slice()
      .sort((a, b) => b.itemsSold - a.itemsSold)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [filter, products]);

  const selectedCategoryLabel = useMemo(
    () => bestsellerCategories.find((c) => c.id === filter)?.label ?? "",
    [filter],
  );

  return (
    <div className="flex h-full flex-col pt-1">
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

      <div className="px-3 pb-3 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <p className="col-span-4 text-center text-gray-400 text-lg py-10">
              Loading top sellers...
            </p>
          ) : rankedProducts.length > 0 ? (
            rankedProducts.map((product) => (
              <BestsellerProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-4 text-center text-xl text-gray-500 py-10">
              No top sellers found for &quot;{selectedCategoryLabel}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
