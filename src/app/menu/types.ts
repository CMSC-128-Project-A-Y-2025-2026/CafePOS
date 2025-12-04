// src/app/menu/types.ts

// Using the same structure as the POS product model
export interface MenuItem {
  id: string; // UUID from database
  name: string;
  price: number;
  category: string;
  image: string; // Placeholder for future use
}
