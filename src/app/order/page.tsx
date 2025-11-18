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

const categories: Category[] = [
  { id: 'all', label: 'ALL' },
  { id: 'iced-coffee', label: 'iced coffee' },
  { id: 'espresso', label: 'espresso' },
  { id: 'milk-tea', label: 'milk tea' },
  { id: 'food', label: 'food' },
];

const products: Product[] = [
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

// --- Sub-Components ---

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
        flex-1 rounded-xl px-4 py-3 text-base font-bold capitalize
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
    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center h-full px-2 text-sm font-extrabold capitalize w-full 
                transition-all duration-200 rounded-xl hover:scale-[1.02]
                shadow-md
                ${active
                    ? 'bg-[#1A1B41] text-white shadow-lg ring-2 ring-white transform scale-[1.05] border-2 border-[#6290C3]'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
            `}
        >
            <span className="text-lg leading-none">{category.label.split(' ')[0]}</span>
            {category.label.split(' ')[1] && <span className="leading-none text-xs -mt-0.5">{category.label.split(' ')[1]}</span>}
        </button>
    );
}

interface CustomizeProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, options: Option[], notes: string, discountPercent: number) => void;
}

function CustomizeProductModal({ product, onClose, onAddToCart }: CustomizeProductModalProps) {
  const [size, setSize] = useState('regular');
  const [sugar, setSugar] = useState('100%');
  const [useOatmilk, setUseOatmilk] = useState(false);
  const [notes, setNotes] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const defaultOptions: Option[] = [
    { name: `Sugar: 100%`, price: 0 }
  ];

  const basePrice = product.price;

  const sizeOption = { name: 'Upsize', price: size === 'upsized' ? 20 : 0 };
  const oatmilkOption = { name: 'Oatmilk', price: useOatmilk ? 10 : 0 };
  const sugarOption = { name: `Sugar: ${sugar}`, price: 0 };

  const allOptions: Option[] = [
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
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-900">Customize: {product.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 space-y-8">
          
          {/* Size Selection */}
          <div className='border-b pb-6'>
            <label className="block text-lg font-bold text-gray-900 mb-3">Size</label>
            <div className="mt-2 flex gap-4">
              {['regular', 'upsized'].map(s => (
                <label 
                  key={s} 
                  className={`flex-1 rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md ${s === size ? 'border-[#6290C3] bg-[#E5F1FB]' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                >
                  <input type="radio" name="size" value={s} checked={s === size} onChange={(e) => setSize(e.target.value)} className="sr-only" />
                  <span className="block text-center text-base font-bold text-gray-900 capitalize">{s}</span>
                  <span className="block text-center text-sm text-gray-500">(+ PHP {s === 'upsized' ? '20.00' : '0.00'})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sugar Level */}
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

          {/* Extras */}
          <div className="flex items-center border-b pb-6">
            <input
              id="oatmilk"
              type="checkbox"
              checked={useOatmilk}
              onChange={(e) => setUseOatmilk(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-[#6290C3] focus:ring-[#6290C3]"
            />
            <label htmlFor="oatmilk" className="ml-3 block text-base font-semibold text-gray-700 cursor-pointer">
              Add Oatmilk <span className='text-sm text-gray-500'>(+ PHP 10.00)</span>
            </label>
          </div>

          {/* Notes */}
          <div className='border-b pb-6'>
            <label htmlFor="notes" className="block text-lg font-bold text-gray-900 mb-3">
              Notes
            </label>
            <textarea
              id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
              placeholder="Customer requests (e.g., less ice, extra hot)..."
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
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePaymentMethod, setActivePaymentMethod] = useState('gcash');
  const [productToCustomize, setProductToCustomize] = useState<Product | null>(null);
  const [totalOrderDiscountPercent, setTotalOrderDiscountPercent] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([
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

    const optionsString = options.map(o => o.name).sort().join(',');
    const cartEntryId = `${product.id}-${optionsString}-${discountPercent}-${notes}`;

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
            <div className="flex flex-1 flex-col justify-around gap-2">
              {categories.map((category) => (
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

          {/* Current Order */}
          <aside className="w-96 flex-shrink-0 rounded-3xl bg-white p-6 shadow-xl flex flex-col h-full">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex-shrink-0 border-b pb-2">CURRENT ORDER</h2>

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

            <div className="mt-6 border-t-2 border-gray-200 pt-4 flex-shrink-0">
              <div className="flex justify-between text-base text-gray-600 mb-1">
                <span>Subtotal</span>
                <span>PHP {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600 mb-1">
                <span>Item Discounts</span>
                <span className="text-red-600 font-semibold">- PHP {totalItemDiscount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-base text-gray-600 mb-2 pt-1 border-t border-dashed border-gray-200">
                <label htmlFor="orderDiscount" className="font-bold">Order Discount (%)</label>
                <input
                  type="number"
                  id="orderDiscount"
                  placeholder="0"
                  value={totalOrderDiscountPercent === 0 ? '' : totalOrderDiscountPercent}
                  onChange={(e) => setTotalOrderDiscountPercent(Number(e.target.value) || 0)}
                  className="w-20 rounded-md border border-gray-300 p-1 text-right shadow-sm focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 text-sm transition-all"
                />
              </div>
              <div className="flex justify-between text-base text-gray-600 mb-3">
                <span>Order Discount Amount</span>
                <span className="text-red-600 font-semibold">- PHP {totalOrderDiscountAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-2xl font-black text-gray-900 mb-4 pt-2 border-t-2 border-gray-300">
                <span>TOTAL</span>
                <span>PHP {total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4 gap-2">
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

              <button className="w-full rounded-xl bg-[#6290C3] py-4 text-xl font-black text-white transition-all hover:bg-[#1A1B41] shadow-lg hover:shadow-xl">
                CHECK OUT
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}