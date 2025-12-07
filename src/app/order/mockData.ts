// src/app/order/mockData.ts
import { Category, Product, Option, CartItem } from "@/lib/types"

// Categories List
export const newCategories: Category[] = [
  { id: "all", label: "All" },
  { id: "signature", label: "Signature" },
  { id: "coffee-based", label: "Coffee Based" },
  { id: "frappe-based", label: "Frappe Based" },
  { id: "non-coffee", label: "Non-Coffee" },
  { id: "matcha-based", label: "Matcha Based" },
  { id: "soda-based", label: "Soda Based" },
  { id: "waffles", label: "Waffles" },
  { id: "pasta-sandwich", label: "Pasta & Sandwich" },
  { id: "pika-pika", label: "Pika-Pika" },
]

// Products List - Now fetched from API instead
export const products: Product[] = []

// Constants for ADD-ONS
export const ADD_ONS: Option[] = [
  { name: "Nata de Coco", price: 20 },
  { name: "Popping Boba", price: 25 },
  { name: "Milk", price: 20 },
  { name: "Oat Milk", price: 35 },
  { name: "Ice Cream", price: 20 },
  { name: "Sweet", price: 15 },
  { name: "Caramel", price: 15 },
  { name: "Chocolate", price: 20 },
  { name: "Espresso", price: 35 },
]

// Initial Cart Data - empty by default, will be populated by user
export const initialCart: CartItem[] = []
