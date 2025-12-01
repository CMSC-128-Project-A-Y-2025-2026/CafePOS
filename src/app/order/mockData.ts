// src/app/order/mockData.ts

import { Category, Product, Option, CartItem } from './types';

// Categories List 
export const newCategories: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'signature', label: 'Signature' },
  { id: 'coffee-based', label: 'Coffee Based' },
  { id: 'frappe-based', label: 'Frappe Based' },
  { id: 'non-coffee', label: 'Non-Coffee' },
  { id: 'matcha-based', label: 'Matcha Based' },
  { id: 'soda-based', label: 'Soda Based' },
  { id: 'waffles', label: 'Waffles' },
  { id: 'pasta-sandwich', label: 'Pasta & Sandwich' },
  { id: 'pika-pika', label: 'Pika-Pika' },
];

// Products List
export const products: Product[] = [
  // --- SIGNATURE (All Hot/Iced prices used) ---
  { id: 1, name: 'Americano', price: 99, image: 'https://placehold.co/150x150/F9F1E9/333?text=Americano', category: 'signature' },
  { id: 2, name: 'Biscoff Latte', price: 189, image: 'https://placehold.co/150x150/F9F1E9/333?text=Biscoff+Latte', category: 'signature' },
  { id: 3, name: 'Caramel Latte', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Latte', category: 'signature' },
  { id: 4, name: 'Latte', price: 139, image: 'https://placehold.co/150x150/F9F1E9/333?text=Latte', category: 'signature' },
  { id: 5, name: 'Kape Dulce', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Kape+Dulce', category: 'signature' },
  { id: 6, name: 'Sea Salt Latte', price: 189, image: 'https://placehold.co/150x150/F9F1E9/333?text=Sea+Salt+Latte', category: 'signature' },
  { id: 7, name: 'Spanish Oat', price: 179, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Oat', category: 'signature' },
  { id: 8, name: 'Spanish Latte', price: 149, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Latte', category: 'signature' },
  { id: 9, name: 'Tiramisu', price: 189, image: 'https://placehold.co/150x150/F9F1E9/333?text=Tiramisu', category: 'signature' },
  { id: 10, name: 'White Mocha', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=White+Mocha', category: 'signature' },

  // --- COFFEE BASED (All Regular prices used) ---
  { id: 11, name: 'Caramel Mac', price: 49, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Mac', category: 'coffee-based' },
  { id: 12, name: 'Cinnamon Latte', price: 69, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cinnamon+Latte', category: 'coffee-based' },
  { id: 13, name: 'Macchiato with Ice Cream', price: 69, image: 'https://placehold.co/150x150/F9F1E9/333?text=Macchiato+Ice+Cream', category: 'coffee-based' },
  { id: 14, name: 'Mocha', price: 75, image: 'https://placehold.co/150x150/F9F1E9/333?text=Mocha', category: 'coffee-based' },
  { id: 15, name: 'Spanish Latte (Regular)', price: 49, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Latte', category: 'coffee-based' },
  { id: 16, name: 'Salted Caramel', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Salted+Caramel', category: 'coffee-based' },
  { id: 17, name: 'Vanilla Latte', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Vanilla+Latte', category: 'coffee-based' },

  // --- FRAPPE BASED (All have the same price) ---
  { id: 18, name: 'Caramel Mac Frappe', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Mac+Frappe', category: 'frappe-based' },
  { id: 19, name: 'Biscoff Frappe', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Biscoff+Frappe', category: 'frappe-based' },
  { id: 20, name: 'Cookies N Cream', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cookies+N+Cream', category: 'frappe-based' },
  { id: 21, name: 'Chocolate Frappe', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Chocolate+Frappe', category: 'frappe-based' },
  { id: 22, name: 'Ube Frappe', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Ube+Frappe', category: 'frappe-based' },
  { id: 23, name: 'Java Chips', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Java+Chips', category: 'frappe-based' },
  { id: 24, name: 'Matcha Frappe', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Matcha+Frappe', category: 'frappe-based' },
  { id: 25, name: 'Strawberry Frappe', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Strawberry+Frappe', category: 'frappe-based' },

  // --- NON-COFFEE (All Regular prices used) ---
  { id: 26, name: 'Cocoa Cloud', price: 89, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cocoa+Cloud', category: 'non-coffee' },
  { id: 27, name: 'Iced Cocoa', price: 69, image: 'https://placehold.co/150x150/F9F1E9/333?text=Iced+Cocoa', category: 'non-coffee' },
  { id: 28, name: 'Milky Strawberry', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Milky+Strawberry', category: 'non-coffee' },
  { id: 29, name: 'Blueberry', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Blueberry', category: 'non-coffee' },
  { id: 30, name: 'Ubebabe', price: 55, image: 'https://placehold.co/150x150/F9F1E9/333?text=Ubebabe', category: 'non-coffee' },
  { id: 31, name: 'Oreo Blast', price: 95, image: 'https://placehold.co/150x150/F9F1E9/333?text=Oreo+Blast', category: 'non-coffee' },

  // --- MATCHA BASED (All Regular prices used) ---
  { id: 32, name: 'Matcha', price: 79, image: 'https://placehold.co/150x150/F9F1E9/333?text=Matcha', category: 'matcha-based' },
  { id: 33, name: 'Matcha Oat', price: 109, image: 'https://placehold.co/150x150/F9F1E9/333?text=Matcha+Oat', category: 'matcha-based' },
  { id: 34, name: 'Matchaberry', price: 99, image: 'https://placehold.co/150x150/F9F1E9/333?text=Matchaberry', category: 'matcha-based' },
  { id: 35, name: 'Matcha Pink Cream', price: 119, image: 'https://placehold.co/150x150/F9F1E9/333?text=Matcha+Pink+Cream', category: 'matcha-based' },
  { id: 36, name: 'Sea Salt Matcha', price: 119, image: 'https://placehold.co/150x150/F9F1E9/333?text=Sea+Salt+Matcha', category: 'matcha-based' },
  { id: 37, name: 'Dirty Matcha', price: 119, image: 'https://placehold.co/150x150/F9F1E9/333?text=Dirty+Matcha', category: 'matcha-based' },

  // --- SODA BASED (All Regular prices used) ---
  { id: 38, name: 'Apple Fizz', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Apple+Fizz', category: 'soda-based' },
  { id: 39, name: 'Green Apple with Yakult', price: 85, image: 'https://placehold.co/150x150/F9F1E9/333?text=Green+Apple+Yakult', category: 'soda-based' },
  { id: 40, name: 'Yakulychee', price: 85, image: 'https://placehold.co/150x150/F9F1E9/333?text=Yakulychee', category: 'soda-based' },
  { id: 41, name: 'Lychee', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Lychee', category: 'soda-based' },
  { id: 42, name: 'Honey Lemon', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Honey+Lemon', category: 'soda-based' },
  { id: 43, name: 'Honey Lemon with Yakult', price: 85, image: 'https://placehold.co/150x150/F9F1E9/333?text=Honey+Lemon+Yakult', category: 'soda-based' },
  { id: 44, name: 'Strawberry Soda', price: 70, image: 'https://placehold.co/150x150/F9F1E9/333?text=Strawberry+Soda', category: 'soda-based' },
  { id: 45, name: 'Yakult Berry', price: 90, image: 'https://placehold.co/150x150/F9F1E9/333?text=Yakult+Berry', category: 'soda-based' },

  // --- WAFFLES ---
  { id: 46, name: 'Classic Waffles', price: 65, image: 'https://placehold.co/150x150/F9F1E9/333?text=Classic+Waffles', category: 'waffles' },
  { id: 47, name: 'Chocolate Waffles', price: 69, image: 'https://placehold.co/150x150/F9F1E9/333?text=Chocolate+Waffles', category: 'waffles' },
  { id: 48, name: 'Caramel Waffles', price: 69, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Waffles', category: 'waffles' },
  { id: 49, name: 'Cheese Waffles', price: 75, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cheese+Waffles', category: 'waffles' },
  { id: 50, name: 'Biscoff Waffles', price: 99, image: 'https://placehold.co/150x150/F9F1E9/333?text=Biscoff+Waffles', category: 'waffles' },
  { id: 51, name: 'Strawberry Waffles', price: 75, image: 'https://placehold.co/150x150/F9F1E9/333?text=Strawberry+Waffles', category: 'waffles' },
  { id: 52, name: "S'mores Waffles", price: 89, image: 'https://placehold.co/150x150/F9F1E9/333?text=Smores+Waffles', category: 'waffles' },

  // --- PASTA & SANDWICH ---
  { id: 53, name: 'Carbonara', price: 149, image: 'https://placehold.co/150x150/F9F1E9/333?text=Carbonara', category: 'pasta-sandwich' },
  { id: 54, name: 'Spaghetti', price: 139, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spaghetti', category: 'pasta-sandwich' },
  { id: 55, name: 'Bacon Ham Sandwich', price: 109, image: 'https://placehold.co/150x150/F9F1E9/333?text=Bacon+Ham+Sandwich', category: 'pasta-sandwich' },
  { id: 56, name: 'Egg Sandwich', price: 109, image: 'https://placehold.co/150x150/F9F1E9/333?text=Egg+Sandwich', category: 'pasta-sandwich' },
  { id: 57, name: 'Hotdog Clubhouse', price: 109, image: 'https://placehold.co/150x150/F9F1E9/333?text=Hotdog+Clubhouse', category: 'pasta-sandwich' },

  // --- PIKA - PIKA ---
  { id: 58, name: 'Fries', price: 55, image: 'https://placehold.co/150x150/F9F1E9/333?text=Fries', category: 'pika-pika' },
  { id: 59, name: 'Pres Kopee Mix', price: 99, image: 'https://placehold.co/150x150/F9F1E9/333?text=Pres+Kopee+Mix', category: 'pika-pika' },
  { id: 60, name: 'Cheesy Bacon Overload', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cheesy+Bacon+Overload', category: 'pika-pika' },
  { id: 61, name: 'Beef Nachos', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Beef+Nachos', category: 'pika-pika' },
  { id: 62, name: 'Cheesy Quesadilla', price: 89, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cheesy+Quesadilla', category: 'pika-pika' },
  { id: 63, name: 'Beef Quesadilla', price: 119, image: 'https://placehold.co/150x150/F9F1E9/333?text=Beef+Quesadilla', category: 'pika-pika' },
  { id: 64, name: 'Ham N Cheese Quesadilla', price: 99, image: 'https://placehold.co/150x150/F9F1E9/333?text=Ham+N+Cheese+Quesadilla', category: 'pika-pika' },
  { id: 65, name: "S'more Quesadilla", price: 89, image: 'https://placehold.co/150x150/F9F1E9/333?text=Smore+Quesadilla', category: 'pika-pika' },
  { id: 66, name: 'Egg Wrap', price: 99, image: 'https://placehold.co/150x150/F9F1E9/333?text=Egg+Wrap', category: 'pika-pika' },
];

// Constants for ADD-ONS
export const ADD_ONS: Option[] = [
  { name: 'Nata de Coco', price: 20 },
  { name: 'Popping Boba', price: 25 },
  { name: 'Milk', price: 20 },
  { name: 'Oat Milk', price: 35 },
  { name: 'Ice Cream', price: 20 },
  { name: 'Sweet', price: 15 },
  { name: 'Caramel', price: 15 },
  { name: 'Chocolate', price: 20 },
  { name: 'Espresso', price: 35 },
];

// Initial Cart Data
export const initialCart: CartItem[] = [
  {
    cartItemId: 'uuid-1',
    productId: 8,
    name: 'Spanish Latte',
    basePrice: 149,
    unitPrice: 204,
    quantity: 1,
    options: [
      { name: 'Medium (+P20.00)', price: 20 },
      { name: 'Add-on: Oat Milk', price: 35 },
      { name: 'Sugar: 100%', price: 0 },
    ],
    notes: '',
    baseSubtotal: 204,
    discountPercent: 0,
    discountAmount: 0,
  },
  {
    cartItemId: 'uuid-2',
    productId: 46,
    name: 'Classic Waffles',
    basePrice: 65,
    unitPrice: 85,
    quantity: 2,
    options: [
      { name: 'Add-on: Ice Cream', price: 20 },
    ],
    notes: 'Crispy',
    baseSubtotal: 85,
    discountPercent: 0,
    discountAmount: 0,
  },
];