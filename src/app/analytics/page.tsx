// src/app/analytics/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react'; 
import {
  Coffee,
  ClipboardPen, 
  PieChart,
  Boxes,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Lato } from 'next/font/google'; 
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

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

// --- Mock Data for Charts ---
const performanceData = [
  { name: 'A', value: 100 }, { name: 'B', value: 500 }, { name: 'C', value: 400 },
  { name: 'D', value: 1000 }, { name: 'E', value: 400 }, { name: 'F', value: 200 },
  { name: 'G', value: 300 }, { name: 'H', value: 200 }, { name: 'I', value: 1000 },
];
const salesByHourData = [
  { hour: '11 AM', sales: 720 }, { hour: '12 PM', sales: 1942 }, { hour: '1 PM', sales: 971 },
  { hour: '2 PM', sales: 486 }, { hour: '3 PM', sales: 450 },
];
const salesByDayData = [
  { day: 'Sun', sales: 1300, color: '#FFB6C1' }, { day: 'Mon', sales: 1200, color: '#D2B48C' }, 
  { day: 'Tue', sales: 1800, color: '#98FB98' }, { day: 'Wed', sales: 2100, color: '#20B2AA' }, 
  { day: 'Thu', sales: 1300, color: '#ADD8E6' }, { day: 'Fri', sales: 1250, color: '#DDA0DD' }, 
  { day: 'Sat', sales: 1250, color: '#F08080' },
];
const bestsellerData = {
  productName: 'Spanish Latte',
  category: 'Iced Coffee',
  itemsSold: 67,
  totalRevenue: 699.00,
  image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Latte'
};

// --- Reusable Button Components ---
function TimeFilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-5 py-2 text-sm font-bold capitalize transition-all
        ${active
          ? 'bg-[#1A1B41] text-white shadow-md' // Dark blue for active
          : 'bg-transparent text-gray-600 hover:bg-gray-200' // Transparent for inactive
        }
      `}
    >
      {label}
    </button>
  );
}

// --- Main Page Component ---
export default function AnalyticsPage() {
  const router = useRouter();

  // --- State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMainTab, setActiveMainTab] = useState('performance'); 
  const [activeTimeFilter, setActiveTimeFilter] = useState('week'); 

  // --- Clock Timer ---
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
  const handleLogoClick = () => { router.push('/'); };
  const handleOrderClick = () => { router.push('/order'); };
  const handleAnalyticsClick = () => { setIsDropdownOpen(false); };
  const handleInventoryClick = () => { router.push('/inventory'); };

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F1E9] p-6">
      {/* 1. Header */}
      <header className="flex w-full items-center justify-between relative z-30 flex-shrink-0">
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {/* Logo and Title */}
          <div
            className="flex cursor-pointer items-center gap-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={handleLogoClick} 
          >
            <Coffee size={82} className="text-gray-900" />
            <span className="text-[64px] font-black text-gray-900">
              Sales Report <span className="text-[#6290C3]">Generation</span>
            </span>
          </div>

          {/* --- Dropdown Menu --- */}
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

      {/* 2. Main Tab Navigation */}
      <nav className="my-6 flex w-full max-w-4xl mx-auto items-center justify-between rounded-full bg-white p-2 shadow-lg drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
        {/* Left Side: Main Tabs */}
        <div className="flex">
          <TabButton label="Performance" active={activeMainTab === 'performance'} onClick={() => setActiveMainTab('performance')} />
          <TabButton label="Bestseller" active={activeMainTab === 'bestseller'} onClick={() => setActiveMainTab('bestseller')} />
          <TabButton label="Trend" active={activeMainTab === 'trend'} onClick={() => setActiveMainTab('trend')} />
        </div>

        {/* Right Side: Time Filter */}
        <div className="flex gap-1 rounded-full bg-gray-100 p-1 mr-2">
          <TimeFilterButton label="today" active={activeTimeFilter === 'today'} onClick={() => setActiveTimeFilter('today')} />
          <TimeFilterButton label="week" active={activeTimeFilter === 'week'} onClick={() => setActiveTimeFilter('week')} />
          <TimeFilterButton label="month" active={activeTimeFilter === 'month'} onClick={() => setActiveTimeFilter('month')} />
        </div>
      </nav>

      {/* 3. Conditional Tab Content */}
      <main className="flex-1 rounded-2xl bg-white p-8 shadow-lg overflow-hidden drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
        {/* Render the correct tab based on state */}
        {activeMainTab === 'performance' && <PerformanceTab />}
        {activeMainTab === 'bestseller' && <BestsellerTab />}
        {activeMainTab === 'trend' && <TrendTab />}
      </main>
    </div>
  );
}

// --- Reusable DropdownItem Component ---
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

// --- Reusable Main Tab Button ---
function TabButton({ label, active, onClick }) {
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
      {/* The green underline */}
      {active && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1.5 rounded-full bg-[#C2E7DA]" />
      )}
    </button>
  );
}

// --- Tab Content Components ---

function PerformanceTab() {
  return (
    <div className="flex h-full gap-6">
      {/* Left Column: Stats */}
      <div className="flex w-72 flex-col gap-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">PERFORMANCE ANALYSIS</h2>
        <StatCard label="Total Revenue" value={`PHP 15,450.00`} color="green" />
        <StatCard label="Gross Profit" value={`PHP 5,430.00`} color="teal" />
        <StatCard label="Transactions" value="234" color="blue" />
        <StatCard label="Average Sale" value={`PHP 450.00`} color="dark" />
      </div>
      {/* Right Column: Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
            <Line type="monotone" dataKey="value" stroke="#C2E7DA" strokeWidth={4} dot={false} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BestsellerTab() {
  const [filter, setFilter] = useState('all');
  return (
    <div className="flex h-full flex-col">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">BESTSELLER IDENTIFICATION</h2>
      {/* Filter Pills */}
      <div className="flex gap-2 mb-6">
        <BestsellerFilterPill label="all" active={filter === 'all'} onClick={() => setFilter('all')} />
        <BestsellerFilterPill label="iced" active={filter === 'iced'} onClick={() => setFilter('iced')} />
        <BestsellerFilterPill label="espr" active={filter === 'espr'} onClick={() => setFilter('espr')} />
        <BestsellerFilterPill label="mtea" active={filter === 'mtea'} onClick={() => setFilter('mtea')} />
        <BestsellerFilterPill label="food" active={filter === 'food'} onClick={() => setFilter('food')} />
      </div>
      {/* Content */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <StatCard label="Product Name" value={bestsellerData.productName} color="green" smallText />
          <StatCard label="Category" value={bestsellerData.category} color="teal" smallText />
          <StatCard label="Items Sold" value={`${bestsellerData.itemsSold} Sold`} color="blue" />
          <StatCard label="Total Revenue" value={`PHP ${bestsellerData.totalRevenue.toFixed(2)}`} color="dark" />
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
          <Image src={bestsellerData.image} alt={bestsellerData.productName} width={150} height={150} className="rounded-lg" />
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-[#6290C3]">Rank 1</span>
            <h3 className="text-xl font-semibold text-gray-800">{bestsellerData.productName}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- *** THIS IS THE CHANGED SECTION *** ---
function TrendTab() {
  const [filter, setFilter] = useState('hour'); // 'hour' or 'day'
  const data = filter === 'hour' ? salesByHourData : salesByDayData;
  const dataKey = filter === 'hour' ? 'hour' : 'day';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-900">TREND ANALYSIS</h2>
        
        {/* --- UPDATED THIS BLOCK --- */}
        {/* Replaced SubFilterPill with TimeFilterButton */}
        <div className="flex gap-1 rounded-full bg-gray-100 p-1">
          <TimeFilterButton label="By Hour" active={filter === 'hour'} onClick={() => setFilter('hour')} />
          <TimeFilterButton label="By Day" active={filter === 'day'} onClick={() => setFilter('day')} />
        </div>
      </div>
      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={dataKey} />
            <YAxis 
              tickFormatter={(value) => `$${value}`} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip />
            {filter === 'hour' && <Bar dataKey="sales" fill={'#6290C3'} radius={[8, 8, 0, 0]} />}
            {filter === 'day' && data.map((entry) => <Bar key={entry.day} dataKey="sales" fill={entry.color} radius={[8, 8, 0, 0]} />)}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
// --- *** END OF CHANGED SECTION *** ---


// --- Bestseller Filter Pill ---
function BestsellerFilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-5 py-2 text-sm font-bold capitalize
        drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        ${active ? 'bg-[#333333] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
      `}
    >
      {label}
    </button>
  );
}

// --- *** DELETED SubFilterPill component *** ---
// We are now using TimeFilterButton instead.


// --- Reusable Stat Card ---
function StatCard({ label, value, color, smallText = false }) {
  // Updated the color values to use your hex codes
  const colorClasses = {
    green: 'bg-[#F1FFE7] text-gray-900', // Light green bg, dark text
    teal: 'bg-[#C2E7DA] text-gray-900', // Light teal bg, dark text
    blue: 'bg-[#6290C3] text-white', // Brand blue bg, white text
    dark: 'bg-[#000000] text-white', // Black bg, white text
  };

  return (
    <div className={`rounded-2xl p-6 ${colorClasses[color]} drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}>
      <span className="block text-lg font-semibold">{label}</span>
      <span className={`block mt-2 ${smallText ? 'text-2xl' : 'text-4xl'} font-bold`}>{value}</span>
    </div>
  );
}