// src/lib/types.ts

export interface InventoryItem {
  id: string;
  product: string;
  category: string;
  stock: number;
  item_threshold: number;
  status: string;
  cost: string;
}

export interface CreateInventoryInput {
  product: string;
  category: string;
  stock: number;
  item_threshold: number;
  cost: number;
  status?: string;
}

export interface UpdateInventoryInput {
  id: string;
  product?: string;
  category?: string;
  stock?: number;
  item_threshold?: number;
  cost?: number;
  status?: string;
}

export interface MenuItemIngredient {
  inventory_id: string;
  name: string;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  ingredients?: MenuItemIngredient[];
}

export interface SalesItem {
  hour?: string;
  day?: string;
  sales: number;
  color?: string;
}

export interface SalesAnalytics {
  id: number,
  product_id: string,
  total_sold: number
}

export interface TopSellerProduct {
  id: number;
  productName: string;
  price: number;
  category: string;
  itemsSold: number;
  rank?: number,
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
  hasLowStock?: boolean;
  hasOutOfStock?: boolean;
  ingredients?: Array<{
    item_id: string;
    item_name: string;
    stock: number;
    stock_status: string;
    item_threshold: number;
    quantity_needed: number;
  }>;
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

export interface OrderItem {
  productId: string | number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: Option[];
  notes: string;
}

export interface OrderPayload {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

export interface ItemProductConnector {
  id: number;
  product_id: string;
  item_id: string;
  quantity_needed: number;
}
