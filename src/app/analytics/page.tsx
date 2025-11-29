"use client";

import React, { useState, useEffect } from 'react';
import {
  Coffee,
  ClipboardPen,
  PieChart,
  Boxes,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google'; 
import Image from 'next/image';
import {
  Bar,
  BarChart,
  Line, 
  LineChart, 
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// Load Montserrat font
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

// --- Types ---

interface SalesItem {
  hour?: string;
  day?: string;
  sales: number;
  color?: string;
}

interface TopSellerProduct {
    id: number;
    productName: string;
    price: number;
    category: string;
    itemsSold: number;
    rank?: number;
}


// --- Mock Data ---

const salesByHourData: SalesItem[] = [
  { hour: '11 AM', sales: 720 }, { hour: '12 PM', sales: 1942 }, { hour: '1 PM', sales: 971 },
  { hour: '2 PM', sales: 486 }, { hour: '3 PM', sales: 450 }, { hour: '4 PM', sales: 1200 },
  { hour: '5 PM', sales: 1800 }, { hour: '6 PM', sales: 1500 },
];

const salesByDayData: SalesItem[] = [
  { day: 'Sun', sales: 1300, color: '#FFB6C1' }, { day: 'Mon', sales: 1200, color: '#D2B48C' },
  { day: 'Tue', sales: 1800, color: '#98FB98' }, { day: 'Wed', sales: 2100, color: '#20B2AA' },
  { day: 'Thu', sales: 1300, color: '#ADD8E6' }, { day: 'Fri', sales: 1250, color: '#DDA0DD' },
  { day: 'Sat', sales: 3000, color: '#F08080' }, 
];

// --- UPDATED BESTSELLER PRODUCTS ---
const allTopBestsellers: TopSellerProduct[] = [
    // Signature
    { id: 1, productName: 'Americano', price: 99, category: 'signature', itemsSold: 120 },
    { id: 2, productName: 'Spanish Latte', price: 149, category: 'signature', itemsSold: 180 },
    { id: 3, productName: 'Biscoff Latte', price: 189, category: 'signature', itemsSold: 95 },
    
    // Coffee Based
    { id: 4, productName: 'Caramel Mac', price: 49, category: 'coffee-based', itemsSold: 150 },
    { id: 5, productName: 'Vanilla Latte', price: 65, category: 'coffee-based', itemsSold: 110 },
    { id: 6, productName: 'Salted Caramel', price: 65, category: 'coffee-based', itemsSold: 88 },
    
    // Frappe Based
    { id: 7, productName: 'Cookies N Cream', price: 159, category: 'frappe-based', itemsSold: 75 },
    { id: 8, productName: 'Biscoff Frappe', price: 159, category: 'frappe-based', itemsSold: 62 },
    { id: 9, productName: 'Java Chips', price: 159, category: 'frappe-based', itemsSold: 45 },

    // Non-Coffee
    { id: 10, productName: 'Cocoa Cloud', price: 89, category: 'non-coffee', itemsSold: 55 },
    { id: 11, productName: 'Iced Cocoa', price: 69, category: 'non-coffee', itemsSold: 70 },
    { id: 12, productName: 'Milky Strawberry', price: 65, category: 'non-coffee', itemsSold: 35 },

    // Matcha Based
    { id: 13, productName: 'Matcha', price: 79, category: 'matcha-based', itemsSold: 40 },
    { id: 14, productName: 'Sea Salt Matcha', price: 119, category: 'matcha-based', itemsSold: 30 },

    // Soda Based
    { id: 15, productName: 'Yakult Berry', price: 90, category: 'soda-based', itemsSold: 58 },
    { id: 16, productName: 'Green Apple with Yakult', price: 85, category: 'soda-based', itemsSold: 48 },

    // Waffles
    { id: 17, productName: 'Classic Waffles', price: 65, category: 'waffles', itemsSold: 135 },
    { id: 18, productName: 'Chocolate Waffles', price: 69, category: 'waffles', itemsSold: 72 },

    // Pasta & Sandwich
    { id: 19, productName: 'Carbonara', price: 149, category: 'pasta-sandwich', itemsSold: 68 },
    { id: 20, productName: 'Hotdog Clubhouse', price: 109, category: 'pasta-sandwich', itemsSold: 50 },

    // Pika-Pika
    { id: 21, productName: 'Fries', price: 55, category: 'pika-pika', itemsSold: 145 },
    { id: 22, productName: 'Beef Nachos', price: 159, category: 'pika-pika', itemsSold: 90 },
    { id: 23, productName: 'Pres Kopee Mix', price: 99, category: 'pika-pika', itemsSold: 85 },
];


// --- Main Component ---

export default function AnalyticsPage() {
  const router = useRouter();

  // --- State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMainTab, setActiveMainTab] = useState('performance');
  const [activeTimeFilter, setActiveTimeFilter] = useState('week');

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // --- Handlers ---
  const handleLogoClick = () => router.push('/');
  const handleOrderClick = () => router.push('/order');
  const handleAnalyticsClick = () => setIsDropdownOpen(false);
  const handleInventoryClick = () => router.push('/inventory');

  return (
    <div className={`flex min-h-screen flex-col bg-[#F9F1E9] p-6 ${montserrat.className}`}>
      {/* Header */}
      <header className="flex w-full items-center justify-between relative z-30 flex-shrink-0">
        <div
          className="relative z-50" 
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80 pb-1"
            onClick={handleLogoClick}
          >
            <div className="drop-shadow-md">
              <Coffee size={72} className="text-gray-900" /> 
            </div>
            <span className="text-[64px] font-black leading-tight text-gray-900 drop-shadow-sm">
              Sales Report <span className="text-[#6290C3]">Generation</span>
            </span>
          </div>

          {/* Dropdown Menu */}
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

        {/* Time */}
        <div className="flex items-baseline gap-3 font-black italic tracking-tight drop-shadow-sm">
          <span className="text-[64px] text-[#6290C3]">
            {formattedTime.split(' ')[0]}
          </span>
          <span className="text-gray-900 text-[48px]">
            {formattedTime.split(' ')[1]}
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="my-6 flex w-full max-w-4xl mx-auto items-center justify-between rounded-full bg-white p-2 shadow-lg drop-shadow-md">
        {/* Left: Main Tabs */}
        <div className="flex">
          <TabButton label="Performance" active={activeMainTab === 'performance'} onClick={() => setActiveMainTab('performance')} />
          <TabButton label="Bestseller" active={activeMainTab === 'bestseller'} onClick={() => setActiveMainTab('bestseller')} />
          <TabButton label="Trend" active={activeMainTab === 'trend'} onClick={() => setActiveMainTab('trend')} />
        </div>

        {/* Right: Time Filter */}
        <div className="flex gap-1 rounded-full bg-gray-100 p-1 mr-2">
          <TimeFilterButton label="today" active={activeTimeFilter === 'today'} onClick={() => setActiveTimeFilter('today')} />
          <TimeFilterButton label="week" active={activeTimeFilter === 'week'} onClick={() => setActiveTimeFilter('week')} />
          <TimeFilterButton label="month" active={activeTimeFilter === 'month'} onClick={() => setActiveTimeFilter('month')} />
        </div>
      </nav>

      {/* Tab Content */}
      <main className="flex-1 rounded-2xl bg-white p-8 shadow-lg overflow-hidden drop-shadow-md">
        {activeMainTab === 'performance' && <PerformanceTab />}
        {activeMainTab === 'bestseller' && <BestsellerTab />}
        {activeMainTab === 'trend' && <TrendTab />}
      </main>
    </div>
  );
}

// --- Tab Content Views ---

function PerformanceTab() {
  return (
    <div className="flex h-full gap-6">
      {/* Stats */}
      <div className="flex w-72 flex-col gap-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">PERFORMANCE ANALYSIS</h2>
        <StatCard label="Total Revenue" value={`PHP 15,450.00`} color="green" />
        <StatCard label="Gross Profit" value={`PHP 5,430.00`} color="teal" />
        <StatCard label="Transactions" value="234" color="blue" />
        <StatCard label="Average Sale" value={`PHP 450.00`} color="dark" />
      </div>
      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesByDayData} margin={{ top: 5, right: 30, bottom: 5, left: 60 }}>
            <Line type="monotone" dataKey="sales" stroke="#6290C3" strokeWidth={4} dot={false} /> 
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="day" /> 
            <YAxis tickFormatter={(value) => `PHP ${value}`} /> 
            <Tooltip formatter={(value: number) => [`PHP ${value.toFixed(2)}`, 'Sales Revenue']} /> 
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BestsellerTab() {
  // Step 1: Define the POS-matching categories
  const [filter, setFilter] = useState('all'); 

  const categories = [
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

  // Step 2: Filter products by the active category ID
  const filteredProducts = allTopBestsellers.filter(p => filter === 'all' || p.category === filter);

  // Step 3: Sort the filtered products by itemsSold (descending) and assign a rank
  const rankedProducts = filteredProducts
    .sort((a, b) => b.itemsSold - a.itemsSold)
    .map((product, index) => ({
      ...product,
      rank: index + 1,
    }));

  // Limit to top 5 for display (simulating a ranking)
  const topFive = rankedProducts.slice(0, 5);


  return (
    <div className="flex h-full flex-col">
      <h2 className="text-3xl font-bold text-gray-900 mb-4 px-3">BESTSELLER IDENTIFICATION</h2> 
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 px-3"> 
        {categories.map(cat => (
            <BestsellerFilterPill 
                key={cat.id}
                label={cat.label} 
                active={filter === cat.id} 
                onClick={() => setFilter(cat.id)} 
            />
        ))}
      </div>
      
      {/* Content (DYNAMIC HEIGHT FIX) */}
      <div className="max-h-full grid grid-cols-2 gap-6 overflow-y-auto px-3 pb-3 lg:grid-cols-3 xl:grid-cols-4"> 
        {topFive.length > 0 ? (
            topFive.map(product => (
                <BestsellerProductCard key={product.id} product={product} />
            ))
        ) : (
            <p className="col-span-4 text-center text-xl text-gray-500 py-10">
                No top sellers found for the "{categories.find(c => c.id === filter)?.label}" category in this period.
            </p>
        )}
      </div>
    </div>
  );
}

function TrendTab() {
  const [filter, setFilter] = useState<'hour' | 'day'>('hour');

  const data = filter === 'hour' ? salesByHourData : salesByDayData;
  const dataKey = filter === 'hour' ? 'hour' : 'day';
  const chartTitle = filter === 'hour' 
    ? "Sales by Hour of Day" 
    : "Sales by Day of Week";

  return (
    <div className="flex h-full flex-col gap-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">TREND ANALYSIS</h2>

      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-xl font-bold text-gray-800">{chartTitle}</h3>
        <div className="flex gap-1 rounded-full bg-gray-100 p-1">
          <TimeFilterButton 
            label="Hourly Sales" 
            active={filter === 'hour'} 
            onClick={() => setFilter('hour')} 
          />
          <TimeFilterButton 
            label="Daily Sales" 
            active={filter === 'day'} 
            onClick={() => setFilter('day')} 
          />
        </div>
      </div>
      
      {/* Chart container */}
      <div className="h-[400px] bg-white p-4 rounded-xl shadow-md"> 
        <ResponsiveContainer width="100%" height="100%"> 
          <LineChart data={data} margin={{ top: 5, right: 30, bottom: 5, left: 60 }}>
            <CartesianGrid strokeDasharray="5 5" vertical={false} /> 
            <XAxis dataKey={dataKey} />
            <YAxis
              tickFormatter={(value) => `PHP ${value}`} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(value: number) => [`PHP ${value.toFixed(2)}`, 'Sales Revenue']} />
            
            {/* Line chart rendering */}
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#6290C3" 
              strokeWidth={3} 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- Helper Components ---

interface BestsellerProductCardProps {
    product: TopSellerProduct;
}

function BestsellerProductCard({ product }: BestsellerProductCardProps) {
    // Helper function to map category ID back to label for display
    const getCategoryLabel = (id: string) => {
      switch (id) {
        case 'signature': return 'Signature';
        case 'coffee-based': return 'Coffee Based';
        case 'frappe-based': return 'Frappe Based';
        case 'non-coffee': return 'Non-Coffee';
        case 'matcha-based': return 'Matcha Based';
        case 'soda-based': return 'Soda Based';
        case 'waffles': return 'Waffles';
        case 'pasta-sandwich': return 'Pasta & Sandwich';
        case 'pika-pika': return 'Pika-Pika';
        default: return 'All';
      }
    };

    // Determine badge color based on rank
    const badgeColor = 
        product.rank === 1 ? 'bg-[#FFD700] text-[#333]' : // Gold for Rank 1
        product.rank === 2 ? 'bg-[#C0C0C0] text-[#333]' : // Silver for Rank 2
        product.rank === 3 ? 'bg-[#CD7F32] text-white' : // Bronze for Rank 3
        'bg-gray-200 text-gray-700';

    return (
        <div className="
            flex flex-col items-center justify-between text-center
            rounded-2xl bg-white p-5 shadow-sm border border-gray-100 
            transition-all duration-300 hover:shadow-md hover:border-[#6290C3]
        ">
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center 
                text-3xl font-black mb-3 shrink-0 ${badgeColor} shadow-md
            `}>
                {product.rank}
            </div>

            <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-xl font-extrabold text-gray-900 leading-snug mt-2">{product.productName}</h3>
                <p className="text-sm font-semibold text-gray-500 capitalize">{getCategoryLabel(product.category)}</p>
            </div>
            
            <p className="text-xl font-bold text-[#6290C3] mt-3">PHP {product.price.toFixed(2)}</p>
            <p className="text-xs text-gray-600 mt-1">({product.itemsSold} sold)</p>
        </div>
    );
}


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

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex-1 rounded-full px-6 py-3 text-center text-lg font-bold
        transition-colors z-10
        ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
      `}
    >
      {label}
      {active && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1.5 rounded-full bg-[#6290C3]" /> 
      )}
    </button>
  );
}

interface TimeFilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function TimeFilterButton({ label, active, onClick }: TimeFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-5 py-2 text-sm font-bold capitalize transition-all
        ${active
          ? 'bg-[#1A1B41] text-white shadow-md' 
          : 'bg-transparent text-gray-600 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}

interface BestsellerFilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function BestsellerFilterPill({ label, active, onClick }: BestsellerFilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-5 py-2 text-sm font-bold capitalize
        drop-shadow-md 
        ${active ? 'bg-[#1A1B41] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
      `}
    >
      {label}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: 'green' | 'teal' | 'blue' | 'dark';
  smallText?: boolean;
}

function StatCard({ label, value, color, smallText = false }: StatCardProps) {
  const colorClasses = {
    green: 'bg-[#D7EFE0] text-gray-900', 
    teal: 'bg-[#C2E7DA] text-gray-900',
    blue: 'bg-[#6290C3] text-white',
    dark: 'bg-[#1A1B41] text-white',
  };

  return (
    <div className={`rounded-2xl p-6 ${colorClasses[color]} drop-shadow-md`}> 
      <span className="block text-lg font-semibold">{label}</span>
      <span className={`block mt-2 ${smallText ? 'text-2xl' : 'text-4xl'} font-bold`}>{value}</span>
    </div>
  );
}