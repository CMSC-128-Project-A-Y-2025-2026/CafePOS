// src/app/analytics/types.ts

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