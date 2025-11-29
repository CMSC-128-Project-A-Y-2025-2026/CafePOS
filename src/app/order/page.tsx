"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Coffee,
  ClipboardPen,
  PieChart,
  Boxes,
  Search,
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';

// Load Montserrat font
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

// --- Types ---

interface Category {
  id: string;
  label: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Option {
  name: string;
  price: number;
}

interface CartItem {
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

// --- Mock Data ---

// Categories List 
const newCategories: Category[] = [
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

const products: Product[] = [
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

// --- Sub-Components (ProductCard, DropdownItem, OrderItem, PaymentButton, CategoryButton) ---

interface DropdownItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function DropdownItem({ icon: IconComponent, label, onClick }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-3 px-4 py-3
        text-left text-lg font-medium text-gray-800
        transition-colors hover:bg-[#6290C3]/10 hover:text-[#6290C3]
        ${montserrat.className}
      `}
    >
      <IconComponent size={20} className="text-gray-500" />
      <span>{label}</span>
    </button>
  );
}

interface ProductCardProps {
  product: Product;
  onCustomize: () => void;
}

function ProductCard({ product, onCustomize }: ProductCardProps) {
  return (
    <div
      className="
        group flex flex-col justify-between items-center rounded-2xl bg-white p-4
        shadow-md transition-all duration-200
        hover:shadow-xl hover:-translate-y-0.5 border border-gray-100
        cursor-pointer h-full min-h-[150px]
      "
      onClick={onCustomize}
    >
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h3 className="text-xl font-extrabold text-gray-900 leading-snug">{product.name}</h3>
        <p className="text-lg font-bold text-[#6290C3] mt-1">PHP {product.price.toFixed(2)}</p>
      </div>

      <div className="mt-4 w-full flex-shrink-0">
        <div
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#E5F1FB] p-2 text-[#6290C3] font-semibold transition-all group-hover:bg-[#6290C3] group-hover:text-white"
        >
          <Plus size={18} />
          <span>Select</span>
        </div>
      </div>
    </div>
  );
}

interface OrderItemProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

function OrderItem({ item, onIncrement, onDecrement }: OrderItemProps) {
  const optionsDisplay = item.options.map(o => o.name).filter(n => !n.includes('Sugar:') || n !== 'Sugar: 100%').join(', ');
  const sugarDisplay = item.options.find(o => o.name.includes('Sugar:'))?.name || '';
  const discountDisplay = item.discountPercent > 0 ? `(${item.discountPercent}% OFF)` : '';

  return (
    <div className="flex items-start justify-between border-b border-gray-100 pb-3">
      <div className="pr-2">
        <h4 className="text-lg font-bold text-gray-900 leading-snug">
          {item.name}
          <span className="text-xs text-red-600 font-semibold ml-1">{discountDisplay}</span>
        </h4>
        <div className='flex flex-col text-sm text-gray-600'>
          {optionsDisplay && (
            <p className='text-xs'>• {optionsDisplay}</p>
          )}
          {sugarDisplay && (
            <p className='text-xs'>• {sugarDisplay}</p>
          )}
        </div>

        {item.notes && (
          <p className="text-xs text-gray-500 italic mt-1">Note: "{item.notes}"</p>
        )}
        <p className="text-base font-semibold text-gray-700 mt-1">PHP {(item.unitPrice * item.quantity).toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 flex-shrink-0 mt-1">
        <button
          onClick={onDecrement}
          className="text-gray-600 hover:bg-red-200 p-1 rounded-md transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-base font-bold text-gray-900">{item.quantity}</span>
        <button
          onClick={onIncrement}
          className="text-gray-600 hover:bg-green-200 p-1 rounded-md transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

interface PaymentButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function PaymentButton({ children, active, onClick }: PaymentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 rounded-xl px-4 py-2 text-sm font-bold capitalize
        transition-all duration-200 hover:scale-[1.02]
        shadow-md
        ${active
          ? 'bg-[#1A1B41] text-white shadow-lg ring-2 ring-[#6290C3]'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
}

function CategoryButton({ category, active, onClick }: { category: Category, active: boolean, onClick: () => void }) {
  const words = category.label.split(' ');
  const firstLine = words[0];
  const secondLine = words.slice(1).join(' ');

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center h-10 px-1 py-1 text-sm font-extrabold capitalize w-full
        transition-all duration-200 rounded-xl hover:scale-[1.02]
        shadow-md text-center flex-1 
        ${active
          ? 'bg-[#1A1B41] text-white shadow-lg ring-2 ring-white transform scale-[1.05] border-2 border-[#6290C3]'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
    >
      <span className="text-xs leading-none">{firstLine}</span> 
      {secondLine && <span className="text-[10px] leading-none">{secondLine}</span>}
    </button>
  );
}

// --- CONSTANTS for ADD-ONS (UPDATED) ---
const ADD_ONS: Option[] = [
  { name: 'Nata de Coco', price: 20 },
  { name: 'Popping Boba', price: 25 },
  { name: 'Milk', price: 20 }, // Regular Milk (P20)
  { name: 'Oat Milk', price: 35 }, // Oat Milk (P35) 
  { name: 'Ice Cream', price: 20 },
  { name: 'Sweet', price: 15 },
  { name: 'Caramel', price: 15 },
  { name: 'Chocolate', price: 20 },
  { name: 'Espresso', price: 35 },
];


// --- UPDATED CustomizeProductModal ---

interface CustomizeProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, options: Option[], notes: string, discountPercent: number) => void;
}

function CustomizeProductModal({ product, onClose, onAddToCart }: CustomizeProductModalProps) {
  const isDrink = ['signature', 'coffee-based', 'frappe-based', 'non-coffee', 'matcha-based', 'soda-based'].includes(product.category);

  // States for customization
  const [size, setSize] = useState('regular'); // 'regular', 'medium', 'large'
  const [sugar, setSugar] = useState('100%');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const basePrice = product.price;

  // --- Option Calculation ---

  // 1. Size Option
  const getSizePrice = () => {
    if (size === 'medium') return 20;
    if (size === 'large') return 40;
    return 0;
  };
  const sizeOption: Option | null = isDrink && size !== 'regular' 
    ? { name: `${size.charAt(0).toUpperCase() + size.slice(1)} (+P${getSizePrice().toFixed(2)})`, price: getSizePrice() } 
    : isDrink ? { name: 'Regular Size', price: 0 } : null;

  // 2. Sugar Option
  const sugarOption: Option | null = isDrink ? { name: `Sugar: ${sugar}`, price: 0 } : null;

  // 3. Add Ons
  const addOnOptions: Option[] = ADD_ONS
    .filter(ao => selectedAddOns.includes(ao.name))
    .map(ao => ({ name: `Add-on: ${ao.name}`, price: ao.price }));
    

  // Combine all active options
  // Filter only for paid options and the sugar level
  const allOptions: Option[] = [
    ...(sizeOption ? [sizeOption] : []),
    ...(sugarOption ? [sugarOption] : []),
    ...addOnOptions,
  ].filter(o => o.price > 0 || o.name.startsWith('Sugar:')); 

  const optionsPrice = allOptions.reduce((acc, opt) => acc + opt.price, 0);
  const subtotal = basePrice + optionsPrice;
  const discountAmount = subtotal * (discountPercent / 100);
  const finalPrice = subtotal - discountAmount;

  // --- Handlers ---
  const handleAddOnToggle = (name: string) => {
    setSelectedAddOns(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };
  
  const handleSubmit = () => {
    onAddToCart(product, allOptions, notes, discountPercent);
    onClose();
  };

  const handleSkip = () => {
    // If it's a drink, include default size and sugar, otherwise empty options.
    const defaultOptions: Option[] = isDrink ? [{ name: 'Regular Size', price: 0 }, { name: 'Sugar: 100%', price: 0 }] : [];
    onAddToCart(product, defaultOptions, '', discountPercent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-900">Customize: {product.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 space-y-8">
          
          {/* Size Selection (Only for drinks) */}
          {isDrink && (
            <div className='border-b pb-6'>
              <label className="block text-lg font-bold text-gray-900 mb-3">Size Selection</label>
              <div className="mt-2 flex gap-3">
                {['regular', 'medium', 'large'].map(s => (
                  <label 
                    key={s} 
                    className={`flex-1 rounded-xl p-3 border-2 cursor-pointer transition-all hover:shadow-md ${s === size ? 'border-[#6290C3] bg-[#E5F1FB]' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                  >
                    <input type="radio" name="size" value={s} checked={s === size} onChange={(e) => setSize(e.target.value)} className="sr-only" />
                    <span className="block text-center text-base font-bold text-gray-900 capitalize">{s}</span>
                    <span className="block text-center text-sm text-gray-500">
                      {s === 'medium' ? '(+ PHP 20.00)' : s === 'large' ? '(+ PHP 40.00)' : '(Base)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Level (Only for drinks) */}
          {isDrink && (
            <div className='border-b pb-6'>
              <label className="block text-lg font-bold text-gray-900 mb-3">Sugar Level</label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {['0%', '25%', '50%', '100%'].map(level => (
                  <label 
                    key={level} 
                    className={`rounded-xl p-3 border-2 cursor-pointer transition-all hover:shadow-md ${sugar === level ? 'border-[#6290C3] bg-[#E5F1FB]' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                  >
                    <input type="radio" name="sugar" value={level} checked={sugar === level} onChange={(e) => setSugar(e.target.value)} className="sr-only" />
                    <span className="block text-center text-base font-bold text-gray-900">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Add-ons Section (Only for drinks - Food items skip this section) */}
          {isDrink && (
            <div className='border-b pb-6'>
              <label className="block text-lg font-bold text-gray-900 mb-3">Add Ons</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {ADD_ONS.map(ao => (
                  <button
                    key={ao.name}
                    onClick={() => handleAddOnToggle(ao.name)}
                    className={`
                      rounded-xl p-3 border-2 cursor-pointer transition-all text-left
                      ${selectedAddOns.includes(ao.name) ? 'border-[#6290C3] bg-[#E5F1FB]' : 'border-gray-300 bg-white hover:bg-gray-50'}
                    `}
                  >
                    <span className="block text-sm font-bold text-gray-900 leading-tight">{ao.name}</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {`(+ PHP ${ao.price.toFixed(2)})`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Notes */}
          <div className='border-b pb-6'>
            <label htmlFor="notes" className="block text-lg font-bold text-gray-900 mb-3">
              Notes
            </label>
            <textarea
              id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
              placeholder="Customer requests (e.g., iced, hot, less salt)..."
            />
          </div>

          {/* Item Discount */}
          <div className='border-b pb-6'>
            <label htmlFor="discount" className="block text-lg font-bold text-gray-900 mb-3">
              Item Discount (%)
            </label>
            <input
              type="number" id="discount" placeholder="0"
              value={discountPercent === 0 ? '' : discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
            />
          </div>

          {/* Summary */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between text-base text-gray-600">
              <span>Base Price:</span>
              <span>PHP {basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base text-gray-600">
              <span>Options Total:</span>
              <span>+ PHP {optionsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-700 border-t border-gray-200 pt-1">
              <span>Subtotal:</span>
              <span>PHP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-red-600">
              <span>Discount ({discountPercent}%):</span>
              <span>- PHP {discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-gray-900 border-t-2 border-gray-300 pt-2">
              <span>Final Price:</span>
              <span>PHP {finalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-between gap-4">
            <button
              type="button" onClick={handleSkip}
              className="rounded-xl bg-gray-200 px-5 py-3 text-base font-bold text-gray-700 hover:bg-gray-300 transition-colors flex-1 shadow-md"
            >
              Skip Customization
            </button>
            <button
              type="button" onClick={handleSubmit}
              className="rounded-xl bg-[#6290C3] px-5 py-3 text-base font-bold text-white transition-all hover:bg-[#1A1B41] flex-1 shadow-md"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- Main Order Page Component ---

export default function OrderPage() {
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  // Initial active category is 'all'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePaymentMethod, setActivePaymentMethod] = useState('gcash');
  const [productToCustomize, setProductToCustomize] = useState<Product | null>(null);
  const [totalOrderDiscountPercent, setTotalOrderDiscountPercent] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([
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
  ]);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime ? currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) : '--:-- --';

  const handleLogoClick = () => router.push('/');
  const handleOrderClick = () => setIsDropdownOpen(false);
  const handleAnalyticsClick = () => router.push('/analytics');
  const handleInventoryClick = () => router.push('/inventory');

  const handleAddToCart = (
    product: Product,
    options: Option[],
    notes: string,
    discountPercent: number
  ) => {
    const basePrice = product.price;
    const optionsPrice = options.reduce((acc, opt) => acc + opt.price, 0);
    const baseSubtotal = basePrice + optionsPrice;
    const discountAmount = baseSubtotal * (discountPercent / 100);
    const finalUnitPrice = baseSubtotal - discountAmount;

    // Use JSON.stringify for a reliable options/notes string for cart entry ID
    const optionsAndNotesString = JSON.stringify({ options: options.map(o => ({n: o.name, p: o.price})).sort(), notes: notes, discountPercent: discountPercent });
    const cartEntryId = `${product.id}-${optionsAndNotesString}`;

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.cartEntryId === cartEntryId);

      if (existingItem) {
        return currentCart.map(item =>
          item.cartEntryId === cartEntryId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newCartItem: CartItem = {
          cartItemId: crypto.randomUUID(),
          cartEntryId: cartEntryId,
          productId: product.id,
          name: product.name,
          basePrice: basePrice,
          unitPrice: finalUnitPrice,
          baseSubtotal: baseSubtotal,
          quantity: 1,
          options: options,
          notes: notes,
          discountPercent: discountPercent,
          discountAmount: discountAmount,
        };
        // Add new items to the top of the cart
        return [newCartItem, ...currentCart]; 
      }
    });

    setProductToCustomize(null);
  };


  const handleUpdateQuantity = (cartItemId: string, change: number) => {
    setCart(currentCart => {
      const targetItem = currentCart.find(item => item.cartItemId === cartItemId);
      if (!targetItem) return currentCart;

      const newQuantity = targetItem.quantity + change;

      if (newQuantity <= 0) {
        return currentCart.filter(item => item.cartItemId !== cartItemId);
      } else {
        return currentCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
        );
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => activeCategory === 'all' || p.category === activeCategory)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeCategory, searchTerm]);

  const subtotal = cart.reduce((acc, item) => acc + (item.baseSubtotal * item.quantity), 0);
  const totalItemDiscount = cart.reduce((acc, item) => acc + (item.discountAmount * item.quantity), 0);
  const subtotalAfterItemDiscounts = subtotal - totalItemDiscount;
  const totalOrderDiscountAmount = subtotalAfterItemDiscounts * (totalOrderDiscountPercent / 100);
  const total = subtotalAfterItemDiscounts - totalOrderDiscountAmount;


  return (
    <div className={montserrat.className}>
      {productToCustomize && (
        <CustomizeProductModal
          product={productToCustomize}
          onClose={() => setProductToCustomize(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <div className="flex h-screen flex-col bg-[#F9F1E9] p-6">
        {/* Header */}
        <header className="flex w-full items-center justify-between flex-shrink-0 relative z-30">
          <div
            className="relative z-50"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div
              className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80 pb-1"
              onClick={handleLogoClick}
            >
              <div className="drop-shadow-md">
                <Coffee size={72} className="text-gray-900" />
              </div>
              <span className="text-[64px] font-black leading-tight text-gray-900 drop-shadow-sm">
                Pres <span className="text-[#6290C3]">Kopee</span>
              </span>
            </div>

            <div 
              className={`
                absolute left-0 top-full w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out
                ${isDropdownOpen ? 'max-h-64 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}
              `}
            >
              <div className="py-2">
                <DropdownItem icon={ClipboardPen} label="Order" onClick={handleOrderClick} />
                <DropdownItem icon={PieChart} label="Analytics" onClick={handleAnalyticsClick} />
                <DropdownItem icon={Boxes} label="Inventory" onClick={handleInventoryClick} />
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3 font-black italic tracking-tight drop-shadow-sm">
            <span className="text-[64px] text-[#6290C3]">
              {formattedTime.split(' ')[0]}
            </span>
            <span className="text-gray-900 text-[48px]">
              {formattedTime.split(' ')[1]}
            </span>
          </div>
        </header>

        {/* Main Layout */}
        <div className="mt-6 flex flex-1 gap-6 overflow-hidden p-4 pb-6 pt-1">
          
          {/* Categories */}
          <nav className="flex-shrink-0 w-48 rounded-3xl bg-white p-4 shadow-xl flex flex-col h-full"> 
            <div className="flex flex-1 flex-col justify-start gap-2"> 
              {newCategories.map((category) => (
                <CategoryButton 
                  key={category.id}
                  category={category}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                />
              ))}
            </div>
          </nav>

          {/* Products */}
          <main className="flex flex-1 flex-col">
            <div className="relative mb-4 flex-shrink-0 drop-shadow-md z-10">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 pl-12 text-lg text-gray-900 placeholder-gray-500 focus:border-[#6290C3] focus:ring-[#6290C3] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3 pt-3">
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCustomize={() => setProductToCustomize(product)}
                  />
                ))}
              </div>
            </div>
          </main>

          {/* Current Order (OPTIMIZED AREA) */}
          <aside className="w-96 flex-shrink-0 rounded-3xl bg-white p-6 shadow-xl flex flex-col h-full">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex-shrink-0 border-b pb-2">CURRENT ORDER</h2>

            {/* Scrollable Order Items List (Gets more vertical space now) */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="flex flex-col gap-4">
                {cart.map(item => (
                  <OrderItem
                    key={item.cartItemId}
                    item={item}
                    onIncrement={() => handleUpdateQuantity(item.cartItemId, 1)}
                    onDecrement={() => handleUpdateQuantity(item.cartItemId, -1)}
                  />
                ))}
              </div>
            </div>

            {/* Tighter Breakdown Section */}
            <div className="mt-4 border-t-2 border-gray-200 pt-3 flex-shrink-0">
              {/* Subtotal & Item Discounts */}
              <div className="flex justify-between text-sm text-gray-600 mb-0.5">
                <span>Subtotal</span>
                <span>PHP {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Item Discounts</span>
                <span className="text-red-600 font-semibold">- PHP {totalItemDiscount.toFixed(2)}</span>
              </div>

              {/* Order Discount Input */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1 pt-0.5 border-t border-dashed border-gray-200">
                <label htmlFor="orderDiscount" className="font-bold">Order Discount (%)</label>
                <input
                  type="number"
                  id="orderDiscount"
                  placeholder="0"
                  value={totalOrderDiscountPercent === 0 ? '' : totalOrderDiscountPercent}
                  onChange={(e) => setTotalOrderDiscountPercent(Number(e.target.value) || 0)}
                  className="w-16 rounded-md border border-gray-300 p-0.5 text-right shadow-sm focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 text-xs transition-all"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Order Discount Amount</span>
                <span className="text-red-600 font-semibold">- PHP {totalOrderDiscountAmount.toFixed(2)}</span>
              </div>

              {/* TOTAL */}
              <div className="flex justify-between text-xl font-black text-gray-900 mb-3 pt-1 border-t-2 border-gray-300">
                <span>TOTAL</span>
                <span>PHP {total.toFixed(2)}</span>
              </div>

              {/* Payment Buttons */}
              <div className="flex justify-between mb-3 gap-2">
                <PaymentButton
                  active={activePaymentMethod === 'cash'}
                  onClick={() => setActivePaymentMethod('cash')}
                >
                  cash
                </PaymentButton>
                <PaymentButton
                  active={activePaymentMethod === 'gcash'}
                  onClick={() => setActivePaymentMethod('gcash')}
                >
                  gcash
                </PaymentButton>
                <PaymentButton
                  active={activePaymentMethod === 'card'}
                  onClick={() => setActivePaymentMethod('card')}
                >
                  card
                </PaymentButton>
              </div>

              {/* CHECK OUT Button */}
              <button className="w-full rounded-xl bg-[#6290C3] py-3 text-lg font-black text-white transition-all hover:bg-[#1A1B41] shadow-lg hover:shadow-xl">
                CHECK OUT
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}