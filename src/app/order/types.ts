// src/app/order/types.ts

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
