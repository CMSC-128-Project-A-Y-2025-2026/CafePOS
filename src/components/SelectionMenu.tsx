// src/components/SelectionMenu.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Coffee, PieChart, Boxes, ArrowRight, ClipboardPen } from 'lucide-react';
import { Lato } from 'next/font/google';
import { useRouter } from 'next/navigation';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] }); 

/**
 * A reusable card component for each choice.
 * We make this separate to avoid repeating code.
 */
function ChoiceCard({ icon, label, onClick }) {
  // We pass the icon component itself (e.g., <Coffee />) as a prop
  const IconComponent = icon;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg p-6">
      {/* Icon */}
      <div className="text-gray-900 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
        <IconComponent size={120} strokeWidth={1.75} />
      </div>

      {/* Label */}
      <h2 className="text-[48px] font-extrabold text-[#6290C3] drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">{label}</h2>

      {/* Button */}
      <button
        onClick={onClick}
        className="
          flex h-20 w-20 items-center justify-center 
          rounded-full bg-[#6290C3] 
          transition-all hover:scale-110 hover:bg-[#1A1B41]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
        "
        aria-label={`Go to ${label}`}
      >
        <ArrowRight size={40} className="text-[#F9F1E9]" />
      </button>
    </div>
  );
}

/**
 * The main Selection Menu page component
 */
export default function SelectionMenu() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // This useEffect hook sets up a live-updating clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // This "cleans up" the timer when the component is removed
    return () => clearInterval(timer);
  }, []); // The empty array means this runs only once on mount

  // Format the time
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // --- Click Handlers ---
  const handleOrderClick = () => {
    // console.log('Order clicked'); 
    router.push('/order'); 
  };

  const handleAnalyticsClick = () => {
        router.push('/analytics');
      };

  const handleInventoryClick = () => {
    router.push('/inventory'); 
  };

  return (
    // Main container
    <div className="flex min-h-screen flex-col bg-[#F9F1E9]">
      
      {/* 1. Header */}
      <header className="flex w-full items-center justify-between p-6">
        
        {/* --- Logo & Dropdown Wrapper --- */}
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {/* Logo (Original) */}
          <div className="flex cursor-pointer items-center gap-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
            <Coffee size={82} className="text-gray-900" />
            <span className="text-[64px] font-black text-gray-900">
              Pres <span className="text-[#6290C3]">Kopee</span>
            </span>
          </div>

          {/* --- Dropdown Menu --- */}
          {/* This only shows when isDropdownOpen is true */}
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


        {/* Time */}
        <div className="text-[64px] font-black italic drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
          {/* Part 1: "12:00" - This span just sets the blue color */}
          <span className="text-[#6290C3]">
            {formattedTime.split(' ')[0]}
          </span>
          
          {/* Part 2: " AM" - This span sets the black color */}
          <span className="text-gray-900">
            {' '}{formattedTime.split(' ')[1]}
          </span>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex flex-1 items-center justify-center p-8">
        {/* This div holds the three choice cards */}
        <div className="flex w-full max-w-6xl flex-col gap-8 md:flex-row">
          <ChoiceCard
            icon={ClipboardPen}
            label="Order"
            onClick={handleOrderClick}
          />
          <ChoiceCard
            icon={PieChart}
            label="Analytics"
            onClick={handleAnalyticsClick}
          />
          <ChoiceCard
            icon={Boxes}
            label="Inventory"
            onClick={handleInventoryClick}
          />
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