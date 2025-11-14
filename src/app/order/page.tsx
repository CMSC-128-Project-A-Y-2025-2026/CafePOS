// src/app/order/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import {
  Coffee, 
  ClipboardPen, 
  PieChart,
  Boxes,
  Search,
  Plus,
  Minus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Lato } from 'next/font/google'; 
import Image from 'next/image'; // We'll use this for product images

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

// --- Mock Data ---

// (Later, this comes from your database)
const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'iced-coffee', label: 'iced coffee' },
  { id: 'espresso', label: 'espresso' },
  { id: 'milk-tea', label: 'milk tea' },
  { id: 'food', label: 'food' },
];

// (Later, this comes from your database)
const products = [
  { id: 1, name: 'Spanish Latte', price: 60, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Latte', category: 'iced-coffee' },
  { id: 2, name: 'Hazelnut Latte', price: 60, image: 'https://placehold.co/150x150/F9F1E9/333?text=Hazelnut+Latte', category: 'iced-coffee' },
  { id: 3, name: 'Caramel Macchiato', price: 75, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Macchiato', category: 'iced-coffee' },
  { id: 4, name: 'Classic Espresso', price: 40, image: 'https://placehold.co/150x150/F9F1E9/333?text=Espresso', category: 'espresso' },
  { id: 5, name: 'Okinawa Milk Tea', price: 50, image: 'https://placehold.co/150x150/F9F1E9/333?text=Milk+Tea', category: 'milk-tea' },
  { id: 6, name: 'Croissant', price: 45, image: 'https://placehold.co/150x150/F9F1E9/333?text=Croissant', category: 'food' },
];

// --- Main Page Component ---
export default function OrderPage() {
  const router = useRouter();

  // --- State Management ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Pre-populate cart 
  const [cart, setCart] = useState([
    { id: 1, name: 'Spanish Latte', price: 60, quantity: 1 },
    { id: 2, name: 'Hazelnut Latte', price: 60, quantity: 2 },
  ]);

  const [activePaymentMethod, setActivePaymentMethod] = useState('gcash');

  // --- Clock ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // --- Navigation Handlers ---
  const handleLogoClick = () => router.push('/');
  const handleOrderClick = () => setIsDropdownOpen(false);
  const handleAnalyticsClick = () => console.log('Analytics clicked'); // router.push('/analytics')
  const handleInventoryClick = () => router.push('/inventory');

  // --- Cart Logic ---
  const handleUpdateQuantity = (productId, change) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === productId);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + change;
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          return currentCart.filter(item => item.id !== productId);
        } else {
          // Update quantity
          return currentCart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );
        }
      }
      return currentCart;
    });
  };

  const handleAddToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increment quantity
        return currentCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item to cart
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  // --- Calculated Totals ---
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0; // You can add discount logic later
  const total = subtotal - discount;

  return (
    // We use h-screen and overflow-hidden to make sure the page doesn't scroll
    <div className="flex h-screen flex-col bg-[#F9F1E9] p-6">
      
      {/* 1. Header (Consistent with your other pages) */}
      <header className="flex w-full items-center justify-between flex-shrink-0">
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {/* Logo (Using Coffee icon from your Figma) */}
          <div
            className="flex cursor-pointer items-center gap-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={handleLogoClick} 
          >
            {/* Note: Using Coffee icon */}
            <Coffee size={82} className="text-gray-900" />
            <span className="text-[64px] font-black text-gray-900">
              Pres <span className="text-[#6290C3]">Kopee</span>
            </span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-10 w-64 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
              <div className="py-2">
                <DropdownItem icon={ClipboardPen} label="Order" onClick={handleOrderClick} />
                <DropdownItem icon={PieChart} label="Analytics" onClick={handleAnalyticsClick} />
                <DropdownItem icon={Boxes} label="Inventory" onClick={handleInventoryClick} />
              </div>
            </div>
          )}
        </div>

        {/* Time */}
        <div className="text-[64px] font-black italic drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
          <span className="text-[#6290C3]">{formattedTime.split(' ')[0]}</span>
          <span className="text-gray-900"> {formattedTime.split(' ')[1]}</span>
        </div>
      </header>

      {/* 2. Main POS Layout (Categories, Products, Cart) */}
      {/* We use flex-1 and overflow-hidden to make the content area scrollable */}
      <div className="mt-6 flex flex-1 gap-6 overflow-hidden px-5 pb-5">
        
        {/* --- Column 1: Categories --- */}
        {/* 1. Added mt-2 and make the <nav> a flex column */}
        <nav className="flex-shrink-0 rounded-3xl bg-white p-4 shadow-lg mt-2 flex flex-col">
          <div className="flex flex-1 flex-col justify-evenly">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  rounded-2xl px-6 py-4 text-center font-bold
                  capitalize transition-all
                  drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
                  ${activeCategory === category.id
                    ? 'bg-[#1A1B41] text-white' // Active style
                    : 'bg-[#6290C3] text-white' // Inactive style (CHANGED)
                  }
                `}
              >
                {category.label}
              </button>
            ))}
          </div>
        </nav>

        {/* --- Column 2: Products --- */}
        <main className="flex flex-1 flex-col">
          {/* Search Bar */}
          <div className="relative mb-4 mt-2 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]"> 
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 pl-12 text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2E7DA]" size={30} />
          </div>
          
          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto px-2.5 pr-5 pb-5">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products
                .filter(p => activeCategory === 'all' || p.category === activeCategory)
                .map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => handleAddToCart(product)} 
                  />
                ))}
            </div>
          </div>
        </main>

        {/* --- Column 3: Current Order --- */}
        <aside className="w-96 flex-shrink-0 rounded-3xl bg-white p-6 shadow-lg flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex-shrink-0">CURRENT ORDER</h2>
          
          {/* Cart Items - This part scrolls */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {cart.map(item => (
                <OrderItem 
                  key={item.id} 
                  item={item} 
                  onIncrement={() => handleUpdateQuantity(item.id, 1)}
                  onDecrement={() => handleUpdateQuantity(item.id, -1)}
                />
              ))}
            </div>
          </div>

          {/* Order Summary - This part is fixed at the bottom */}
          <div className="mt-6 border-t-2 border-gray-100 pt-6 flex-shrink-0">
            <div className="flex justify-between text-lg text-gray-600">
              <span>Subtotal</span>
              <span>php {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-600 mb-4">
              <span>Discount</span>
              <span>php {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
              <span>TOTAL</span>
              <span>php {total.toFixed(2)}</span>
            </div>

            {/* Payment Options */}
            <div className="flex justify-around mb-6">
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

            {/* Continue Button */}
            <button className="w-full rounded-2xl bg-[#6290C3] py-4 text-xl font-bold text-white transition-all hover:bg-[#1A1B41]">
              CONTINUE
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// --- Reusable Sub-Components ---

function DropdownItem({ icon, label, onClick }) {
  const IconComponent = icon;
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-3 px-4 py-3 
        text-left text-lg font-medium text-gray-800 
        transition-colors hover:bg-gray-100
        ${lato.className} 
      `}
    >
      <IconComponent size={20} className="text-gray-600" />
      <span>{label}</span>
    </button>
  );
}

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-md transition-all hover:shadow-lg">
      <Image
        src={product.image}
        alt={product.name}
        width={150}
        height={150}
        className="rounded-lg object-cover"
        // Handle image loading errors with a fallback
        onError={(e) => { e.currentTarget.src = `https://placehold.co/150x150/F9F1E9/333?text=${product.name.replace(' ', '+')}` }}
      />
      <h3 className="mt-4 text-lg font-bold text-gray-800">{product.name}</h3>
      <p className="text-md font-semibold text-gray-600">php {product.price.toFixed(2)}</p>
      <div className="mt-4 flex w-full justify-between items-center">
        <button className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-all hover:bg-gray-300">
          {/* "D" button, maybe "Details"? Using ... for now */}
          ...
        </button>
        <button 
          onClick={onAddToCart}
          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

function OrderItem({ item, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
        <p className="text-md text-gray-500">php {item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-2">
        <button onClick={onDecrement} className="text-gray-600 hover:text-red-500">
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-lg font-bold text-gray-900">{item.quantity}</span>
        <button onClick={onIncrement} className="text-gray-600 hover:text-green-500">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

function PaymentButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg px-6 py-2 text-lg font-bold capitalize
        transition-all
        drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        ${active 
          ? 'bg-[#1A1B41] text-white' // Active style
          : 'bg-[#6290C3] text-white' // Inactive style
        }
      `}
    >
      {children}
    </button>
  );
}