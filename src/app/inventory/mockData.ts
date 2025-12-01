// src/app/inventory/mockData.ts

import { InventoryItem } from './types';

export const initialInventoryData: InventoryItem[] = [
  { id: 1, product: 'oatmilk', category: 'dairy', stock: 12, status: 'in stock', cost: 'PHP 95' },
  { id: 2, product: 'oatmilk', category: 'dairy', stock: 12, status: 'in stock', cost: 'PHP 95' },
  { id: 3, product: 'whole milk', category: 'dairy', stock: 24, status: 'in stock', cost: 'PHP 80' },
  { id: 4, product: 'espresso beans', category: 'coffee', stock: 5, status: 'low stock', cost: 'PHP 500' },
  { id: 5, product: 'caramel syrup', category: 'syrups', stock: 10, status: 'in stock', cost: 'PHP 250' },
  { id: 6, product: 'croissants', category: 'pastry', stock: 0, status: 'out of stock', cost: 'PHP 45' },
  { id: 7, product: 'banana bread', category: 'pastry', stock: 8, status: 'in stock', cost: 'PHP 55' },
  { id: 8, product: 'green tea', category: 'tea', stock: 15, status: 'in stock', cost: 'PHP 120' },
  { id: 9, product: 'hazelnut syrup', category: 'syrups', stock: 3, status: 'low stock', cost: 'PHP 250' },
  { id: 10, product: 'dark roast beans', category: 'coffee', stock: 20, status: 'in stock', cost: 'PHP 450' },
  { id: 11, product: 'vanilla syrup', category: 'syrups', stock: 30, status: 'in stock', cost: 'PHP 250' },
  { id: 12, product: 'muffins', category: 'pastry', stock: 10, status: 'in stock', cost: 'PHP 60' },
];