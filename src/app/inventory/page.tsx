import { montserrat } from "@/lib/fonts";
import type { InventoryItem } from "./types";
import InventoryClient from "@/components/inventory/InventoryClient";

async function getInventory(): Promise<InventoryItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/inventory/getItem`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch inventory");
    }

    const data = await response.json();

    // Transform Supabase data to frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed = data.map((item: any) => ({
      id: item.item_id,
      product: item.item_name,
      category: item.item_category,
      stock: item.stock,
      status: item.stock_status,
      cost: `PHP ${item.item_cost}`,
    }));

    return transformed;
  } catch (err) {
    console.error("[Inventory Fetch Error]", err);
    return [];
  }
}

export default async function InventoryPage() {
  const initialInventory = await getInventory();

  return (
    <div className={montserrat.className}>
      <div className="flex h-screen flex-col bg-[#F9F1E9] p-6">
        <InventoryClient initialInventory={initialInventory} />
      </div>
    </div>
  );
}
