// src/app/inventory/page.tsx

"use client";

import React, { useState } from 'react'; 
import {
  Coffee,
  ClipboardPen, 
  PieChart,
  Boxes,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Lato } from 'next/font/google'; 

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

// --- Mock Data for the table ---
// (Later, this will come from your database)
const inventoryData = [
  { id: 1, product: 'oatmilk', category: 'dairy', stock: 12, status: 'in stock', cost: 'PHP 95' },
  { id: 2, product: 'oatmilk', category: 'dairy', stock: 12, status: 'in stock', cost: 'PHP 95' },
  
];

// --- Reusable Button components for this page ---
function ActionButton({ children, className }) {
  return (
    <button
      className={`
        rounded-full px-6 py-3 text-sm font-bold
        transition-all hover:scale-105
        drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        ${className}
      `}
    >
      {children}
    </button>
  );
}

function FilterPill({ children, className }) {
  return (
    <button
      className={`
        rounded-full px-5 py-2 text-sm font-bold text-white
        transition-all hover:opacity-80
        ${className}
      `}
    >
      {children}
    </button>
  );
}

function TableActionButton({ children, className }) {
  return (
    <button
      className={`
        rounded-md px-4 py-1.5 text-sm font-bold
        transition-all hover:opacity-80
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// --- Main Page Component ---
export default function InventoryPage() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/'); // Navigate back to the home/selection page
  };

  // --- Add this new state and handlers ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOrderClick = () => {
    console.log('Order clicked'); 
  };

  const handleAnalyticsClick = () => {
    console.log('Analytics clicked');
  };

  const handleInventoryClick = () => {
    setIsDropdownOpen(false);
    console.log('Inventory clicked');
  };
  // ----------------------------------------

  return (
    // Main page container with the beige background
    <div className="flex min-h-screen flex-col bg-[#F9F1E9] p-6">
      
      {/* 1. Header */}
      <header className="flex w-full items-center justify-between">
        
        {/* --- Logo & Dropdown Wrapper --- */}
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
              Inventory <span className="text-[#6290C3]">Management</span>
            </span>
          </div>

          {/* --- Dropdown Menu --- */}
          {isDropdownOpen && (
            <div
              className="
                absolute top-full left-0 w-64
                rounded-lg bg-white shadow-xl
                ring-1 ring-black ring-opacity-5
                drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
                overflow-hidden z-10
              "
            >
              <div className="py-2">
                <DropdownItem
                  icon={ClipboardPen}
                  label="Order"
                  onClick={handleOrderClick}
                />
                <DropdownItem
                  icon={PieChart}
                  label="Analytics"
                  onClick={handleAnalyticsClick}
                />
                <DropdownItem
                  icon={Boxes}
                  label="Inventory"
                  onClick={handleInventoryClick}
                />
              </div>
            </div>
          )}
        </div>
        {/* --- End of Wrapper --- */}
      </header>

      {/* 2. Action Buttons Row */}
      <nav className="my-6 flex items-center justify-between">
        <div className="flex gap-4">
          <ActionButton className="bg-[#6290C3] text-[#F9F1E9]">
            + new product
          </ActionButton>
          <ActionButton className="bg-[#D9D9D9] text-gray-800">
            generate weekly report
          </ActionButton>
        </div>
        
        {/* Filter Pills */}
        <div className="flex gap-3">
          <FilterPill className="bg-[#333333] text-[#F9F1E9]">all</FilterPill>
          <FilterPill className="bg-[#7CB342] text-[#F9F1E9]">in</FilterPill>
          <FilterPill className="bg-[#FBC02D] text-[#F9F1E9]">low</FilterPill>
          <FilterPill className="bg-[#E53935] text-[#F9F1E9]">out</FilterPill>
        </div>
      </nav>

      {/* 3. Main Table Content */}
      <main className="flex-1 rounded-2xl bg-white p-8 shadow-lg">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 rounded-lg bg-[#E5F1FB] px-6 py-4">
          <div className="font-bold text-gray-600">Product</div>
          <div className="font-bold text-gray-600">Category</div>
          <div className="font-bold text-gray-600">Stock</div>
          <div className="font-bold text-gray-600">Status</div>
          <div className="font-bold text-gray-600">Cost</div>
          <div className="font-bold text-gray-600">Actions</div>
        </div>

        {/* Table Body */}
        <div className="mt-4 flex flex-col gap-4">
          {inventoryData.map((item) => (
            <div key={item.id} className="grid grid-cols-6 items-center gap-4 border-b border-gray-100 px-6 py-4">
              <div className="font-medium text-gray-900">{item.product}</div>
              <div className="text-gray-700">{item.category}</div>
              <div className="text-gray-700">{item.stock}</div>
              <div className="text-gray-700">{item.status}</div>
              <div className="text-gray-700">{item.cost}</div>
              <div className="flex gap-2">
                <TableActionButton className="bg-[#D7EFE0] text-[#34A853]">
                  edit
                </TableActionButton>
                <TableActionButton className="bg-[#FADADD] text-[#E53935]">
                  del
                </TableActionButton>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

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