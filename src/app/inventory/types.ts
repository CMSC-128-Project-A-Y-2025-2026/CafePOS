// src/app/inventory/types.ts

export interface InventoryItem {
  id: string; // UUID from Supabase
  product: string; // maps to item_name
  category: string; // maps to item_category
  stock: number; // stock
  status: string; // stock_status
  cost: string; // maps to item_cost (stored as bigint, displayed as string with PHP)
}

export interface CreateInventoryInput {
  product: string;
  category: string;
  stock: number;
  cost: number;
  status?: string;
}

export interface UpdateInventoryInput {
  id: string;
  product?: string;
  category?: string;
  stock?: number;
  cost?: number;
  status?: string;
}
