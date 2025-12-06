// src/lib/types.ts

export interface InventoryItem {
  id: string;
  product: string;
  category: string;
  stock: number;
  status: string;
  cost: string;
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

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface SalesItem {
  hour?: string;
  day?: string;
  sales: number;
  color?: string;
}

export interface TopSellerProduct {
  id: number;
  productName: string;
  price: number;
  category: string;
  itemsSold: number;
  rank?: number;
}

export interface Category {
  id: string;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Option {
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  cartEntryId?: string;
  productId: number;
  name: string;
  basePrice: number;
  unitPrice: number;
  baseSubtotal: number;
  quantity: number;
  options: Option[];
  notes: string;
  discountPercent: number;
  discountAmount: number;
}
