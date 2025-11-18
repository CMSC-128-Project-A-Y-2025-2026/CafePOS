"use client";

import React, { useState, useEffect } from 'react';
import { Coffee, PieChart, Boxes, ArrowRight, ClipboardPen } from 'lucide-react';
import { Montserrat } from 'next/font/google'; 
import { useRouter } from 'next/navigation';

// Load Montserrat font
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

// --- Interface and Card Components  ---

interface ActionItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function ChoiceCard({ icon: IconComponent, label, onClick }: ActionItemProps) {
  return (
    <div 
      onClick={onClick}
      className="
        group relative flex flex-1 cursor-pointer flex-col items-center justify-between 
        overflow-hidden rounded-3xl bg-white p-10 
        shadow-[0px_4px_16px_rgba(0,0,0,0.1)] 
        transition-all duration-300 ease-in-out
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#6290C3]/20
        border-2 border-transparent hover:border-[#6290C3]/30
      "
    >
      {/* Background Decoration */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#6290C3]/5 transition-all group-hover:bg-[#6290C3]/10" />

      {/* Icon Section */}
      <div className="z-10 mb-6 text-gray-400 transition-colors duration-300 group-hover:text-[#6290C3]">
        <IconComponent size={100} strokeWidth={1.5} />
      </div>

      {/* Label Section */}
      <h2 className="z-10 mb-8 text-[40px] font-extrabold text-gray-800 transition-colors group-hover:text-[#6290C3]">
        {label}
      </h2>

      {/* Button Section */}
      <div
        className="
          z-10 flex h-16 w-16 items-center justify-center 
          rounded-full bg-[#6290C3] shadow-md
          transition-all duration-300 
          group-hover:scale-110 group-hover:bg-[#1A1B41]
        "
        aria-label={`Go to ${label}`}
      >
        <ArrowRight size={32} className="text-[#F9F1E9]" />
      </div>
    </div>
  );
}

function DropdownItem({ icon: IconComponent, label, onClick }: ActionItemProps) {
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

export default function SelectionMenu() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime ? currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) : '--:-- --';

  const handleOrderClick = () => router.push('/order');
  const handleAnalyticsClick = () => router.push('/analytics');
  const handleInventoryClick = () => router.push('/inventory');

  return (
    <div className={`flex min-h-screen flex-col bg-[#F9F1E9] ${montserrat.className}`}>
      {/* Header */}
      <header className="flex w-full items-center justify-between px-8 py-6">
        
        {/* Logo and Dropdown Container */}
        <div
          className="relative z-50"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {/* Logo (The hover trigger) */}
          <div className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80 pb-1">
            <div className="drop-shadow-md">
                <Coffee size={72} className="text-gray-900" /> 
            </div>
            <span className="text-[64px] font-black leading-tight text-gray-900 drop-shadow-sm">
              Pres <span className="text-[#6290C3]">Kopee</span>
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

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
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