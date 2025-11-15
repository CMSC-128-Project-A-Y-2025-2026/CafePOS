// src/app/order/page.tsx

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
  X, // For the modal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Lato } from 'next/font/google'; 
import Image from 'next/image';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

// --- Mock Data ---
const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'iced-coffee', label: 'iced coffee' },
  { id: 'espresso', label: 'espresso' },
  { id: 'milk-tea', label: 'milk tea' },
  { id: 'food', label: 'food' },
];

const products = [
  { id: 1, name: 'Spanish Latte', price: 60, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Latte', category: 'iced-coffee' },
  { id: 2, name: 'Hazelnut Latte', price: 60, image: 'https://placehold.co/150x150/F9F1E9/333?text=Hazelnut+Latte', category: 'iced-coffee' },
  { id: 3, name: 'Caramel Macchiato', price: 75, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Macchiato', category: 'iced-coffee' },
  { id: 4, name: 'Classic Espresso', price: 40, image: 'https://placehold.co/150x150/F9F1E9/333?text=Espresso', category: 'espresso' },
  { id: 5, name: 'Okinawa Milk Tea', price: 50, image: 'https://placehold.co/150x150/F9F1E9/333?text=Milk+Tea', category: 'milk-tea' },
  { id: 6, name: 'Croissant', price: 45, image: 'https://placehold.co/150x150/F9F1E9/333?text=Croissant', category: 'food' },
  { id: 7, name: 'Americano', price: 50, image: 'https://placehold.co/150x150/F9F1E9/333?text=Americano', category: 'espresso' },
  { id: 8, name: 'Taro Milk Tea', price: 50, image: 'https://placehold.co/150x150/F9F1E9/333?text=Taro+Milk+Tea', category: 'milk-tea' },
  { id: 9, name: 'Matcha Latte', price: 70, image: 'https://placehold.co/150x150/F9F1E9/333?text=Matcha+Latte', category: 'iced-coffee' },
  { id: 10, name: 'Cheese Bread', price: 35, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cheese+Bread', category: 'food' },
];

// --- Main Page Component ---
export default function OrderPage() {
  const router = useRouter();

  // --- State Management ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activePaymentMethod, setActivePaymentMethod] = useState('gcash'); 
  const [productToCustomize, setProductToCustomize] = useState(null); 
  const [totalOrderDiscountPercent, setTotalOrderDiscountPercent] = useState(0); 

  const [cart, setCart] = useState([
    { 
      cartItemId: 'uuid-1', 
      productId: 1, 
      name: 'Spanish Latte', 
      basePrice: 60,
      unitPrice: 70, 
      quantity: 1, 
      options: [
        { name: 'Oatmilk', price: 10 },
        { name: 'Sugar: 100%', price: 0 },
      ],
      notes: '',
      discountPercent: 0,
      discountAmount: 0,
      baseSubtotal: 70,
    },
    { 
      cartItemId: 'uuid-2', 
      productId: 2, 
      name: 'Hazelnut Latte', 
      basePrice: 60,
      unitPrice: 60,
      quantity: 2, 
      options: [
        { name: 'Sugar: 100%', price: 0 },
      ],
      notes: '',
      discountPercent: 0,
      discountAmount: 0,
      baseSubtotal: 60,
    },
  ]);

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
  const handleAnalyticsClick = () => router.push('/analytics');
  const handleInventoryClick = () => router.push('/inventory');

  // --- Cart Logic ---
  const handleAddToCart = (product, options, notes, discountPercent) => {
    const basePrice = product.price;
    const optionsPrice = options.reduce((acc, opt) => acc + opt.price, 0);
    const baseSubtotal = basePrice + optionsPrice;
    const discountAmount = baseSubtotal * (discountPercent / 100);
    const finalUnitPrice = baseSubtotal - discountAmount;

    const optionsString = options.map(o => o.name).sort().join(',');
    const cartEntryId = `${product.id}-${optionsString}-${discountPercent}-${notes}`;

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.cartEntryId === cartEntryId);
      
      if (existingItem) {
        return currentCart.map(item =>
          item.cartEntryId === cartEntryId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newCartItem = {
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
        return [newCartItem, ...currentCart];
      }
    });

    setProductToCustomize(null); 
  };

  const handleUpdateQuantity = (cartItemId, change) => {
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

  // --- Filtered Product List ---
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => activeCategory === 'all' || p.category === activeCategory)
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeCategory, searchTerm]); 


  // --- Calculated Totals ---
  const subtotal = cart.reduce((acc, item) => acc + (item.baseSubtotal * item.quantity), 0);
  const totalItemDiscount = cart.reduce((acc, item) => acc + (item.discountAmount * item.quantity), 0);
  const subtotalAfterItemDiscounts = subtotal - totalItemDiscount;
  const totalOrderDiscountAmount = subtotalAfterItemDiscounts * (totalOrderDiscountPercent / 100);
  const total = subtotalAfterItemDiscounts - totalOrderDiscountAmount;

  return (
    <>
      {productToCustomize && (
        <CustomizeProductModal
          product={productToCustomize}
          onClose={() => setProductToCustomize(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <div className="flex h-screen flex-col bg-[#F9F1E9] p-6">
        
        {/* 1. Header */}
        <header className="flex w-full items-center justify-between flex-shrink-0 relative z-30">
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div
              className="flex cursor-pointer items-center gap-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]"
              onClick={handleLogoClick} 
            >
              <Coffee size={82} className="text-gray-900" />
              <span className="text-[64px] font-black text-gray-900">
                Pres <span className="text-[#6290C3]">Kopee</span>
              </span>
            </div>
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
          <div className="text-[64px] font-black italic drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
            <span className="text-[#6290C3]">{formattedTime.split(' ')[0]}</span>
            <span className="text-gray-900"> {formattedTime.split(' ')[1]}</span>
          </div>
        </header>

        {/* 2. Main POS Layout */}
        <div className="mt-6 flex flex-1 gap-6 overflow-hidden p-4 pb-6 pt-1"> 
          
          {/* --- Column 1: Categories --- */}
          <nav className="flex-shrink-0 rounded-3xl bg-white p-4 shadow-lg flex flex-col h-full">
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
                      ? 'bg-[#1A1B41] text-white' 
                      : 'bg-[#D9E6F2] text-gray-800'
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
            <div className="relative mb-4 flex-shrink-0 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)] z-10"> 
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 pl-12 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2E7DA]" size={30} />
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 pb-3 pt-3">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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

          {/* --- Column 3: Current Order --- */}
          <aside className="w-96 flex-shrink-0 rounded-3xl bg-white p-6 shadow-lg flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">CURRENT ORDER</h2>
            
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

            <div className="mt-6 border-t-2 border-gray-100 pt-4 flex-shrink-0">
              <div className="flex justify-between text-base text-gray-600">
                <span>Subtotal</span>
                <span>php {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600">
                <span>Item Discounts</span>
                <span className="text-red-500">- php {totalItemDiscount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center text-base text-gray-600">
                <label htmlFor="orderDiscount" className="font-medium">Order Discount (%)</label>
                <input
                  type="number"
                  id="orderDiscount"
                  placeholder="0"
                  value={totalOrderDiscountPercent === 0 ? '' : totalOrderDiscountPercent}
                  onChange={(e) => setTotalOrderDiscountPercent(Number(e.target.value) || 0)}
                  className="w-20 rounded-md border-gray-300 p-1 text-right shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 text-sm"
                />
              </div>
              <div className="flex justify-between text-base text-gray-600 mb-2">
                <span>Order Discount Amount</span>
                <span className="text-red-500">- php {totalOrderDiscountAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-4">
                <span>TOTAL</span>
                <span>php {total.toFixed(2)}</span>
              </div>

              <div className="flex justify-around mb-4">
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

              <button className="w-full rounded-2xl bg-[#6290C3] py-3 text-lg font-bold text-white transition-all hover:bg-[#1A1B41] drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                CONTINUE
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
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

function ProductCard({ product, onCustomize }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-md transition-all hover:shadow-lg drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
      <Image
        src={product.image}
        alt={product.name}
        width={150}
        height={150}
        className="rounded-lg object-cover"
        onError={(e) => { e.currentTarget.src = `https://placehold.co/150x150/F9F1E9/333?text=${product.name.replace(' ', '+')}` }}
      />
      <h3 className="mt-4 text-lg font-bold text-gray-800">{product.name}</h3>
      <p className="text-md font-semibold text-gray-600">php {product.price.toFixed(2)}</p>
      <div className="mt-4 flex w-full">
        <button 
          onClick={onCustomize} 
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200"
        >
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}

function OrderItem({ item, onIncrement, onDecrement }) {
  const optionsDisplay = item.options.map(o => o.name).join(', ');
  const discountDisplay = item.discountPercent > 0 ? `(${item.discountPercent}% Off)` : '';

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-base font-semibold text-gray-900">{item.name} <span className="text-xs text-red-500">{discountDisplay}</span></h4>
        {optionsDisplay && (
          <p className="text-xs text-gray-500">{optionsDisplay}</p>
        )}
        {item.notes && (
          <p className="text-xs text-gray-500 italic">Notes: "{item.notes}"</p>
        )}
        <p className="text-sm text-gray-500">php {item.unitPrice.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1.5">
        <button onClick={onDecrement} className="text-gray-600 hover:text-red-500">
          <Minus size={14} />
        </button>
        <span className="w-5 text-center text-base font-bold text-gray-900">{item.quantity}</span>
        <button onClick={onIncrement} className="text-gray-600 hover:text-green-500">
          <Plus size={14} />
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
        rounded-lg px-4 py-2 text-base font-bold capitalize
        transition-all
        drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        ${active 
          ? 'bg-[#1A1B41] text-white' 
          : 'bg-gray-100 text-gray-700'
        }
      `}
    >
      {children}
    </button>
  );
}

function CustomizeProductModal({ product, onClose, onAddToCart }) {
  const [size, setSize] = useState('regular');
  const [sugar, setSugar] = useState('100%');
  const [useOatmilk, setUseOatmilk] = useState(false);
  const [notes, setNotes] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); 

  const defaultOptions = [
    { name: `Sugar: 100%`, price: 0 }
  ];

  const basePrice = product.price;
  
  const sizeOption = { name: 'Upsize', price: size === 'upsized' ? 20 : 0 };
  const oatmilkOption = { name: 'Oatmilk', price: useOatmilk ? 10 : 0 };
  const sugarOption = { name: `Sugar: ${sugar}`, price: 0 };
  
  const allOptions = [
    ...(size === 'upsized' ? [sizeOption] : []),
    ...(useOatmilk ? [oatmilkOption] : []),
    sugarOption, 
  ];
  
  const optionsPrice = allOptions.reduce((acc, opt) => acc + opt.price, 0);
  const subtotal = basePrice + optionsPrice;
  const discountAmount = subtotal * (discountPercent / 100);
  const finalPrice = subtotal - discountAmount;

  const handleSubmit = () => {
    onAddToCart(product, allOptions, notes, discountPercent); 
  };

  const handleSkip = () => {
    onAddToCart(product, defaultOptions, '', discountPercent); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Customize: {product.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <div className="mt-2 flex gap-4">
              <label className={`flex-1 rounded-md p-4 border-2 cursor-pointer ${size === 'regular' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input type="radio" name="size" value="regular" checked={size === 'regular'} onChange={(e) => setSize(e.target.value)} className="sr-only" />
                <span className="block text-center font-medium text-gray-900">Regular</span>
                <span className="block text-center text-sm text-gray-500">(+ PHP 0.00)</span>
              </label>
              <label className={`flex-1 rounded-md p-4 border-2 cursor-pointer ${size === 'upsized' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input type="radio" name="size" value="upsized" checked={size === 'upsized'} onChange={(e) => setSize(e.target.value)} className="sr-only" />
                <span className="block text-center font-medium text-gray-900">Upsize</span>
                <span className="block text-center text-sm text-gray-500">(+ PHP 20.00)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sugar Level</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {['0%', '25%', '50%', '100%'].map(level => (
                <label key={level} className={`rounded-md p-3 border-2 cursor-pointer ${sugar === level ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                  <input type="radio" name="sugar" value={level} checked={sugar === level} onChange={(e) => setSugar(e.target.value)} className="sr-only" />
                  <span className="block text-center font-medium text-gray-900">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="oatmilk"
              type="checkbox"
              checked={useOatmilk}
              onChange={(e) => setUseOatmilk(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="oatmilk" className="ml-3 block text-sm font-medium text-gray-700">
              Add Oatmilk (+ PHP 10.00)
            </label>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (e.g., "less ice")
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              placeholder="Customer requests..."
            />
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              placeholder="e.g., 10"
              value={discountPercent === 0 ? '' : discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Base Price:</span>
              <span>PHP {basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Options:</span>
              <span>+ PHP {optionsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>PHP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-500">
              <span>Discount ({discountPercent}%):</span>
              <span>- PHP {discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Final Price:</span>
              <span>PHP {finalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Skip (Add as Default)
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-[#6290C3] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#1A1B41]"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}