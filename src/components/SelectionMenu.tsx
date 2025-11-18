"use client";

import React, { useState, useEffect } from 'react';
import { Coffee, PieChart, Boxes, ArrowRight, ClipboardPen } from 'lucide-react';
import { Lato } from 'next/font/google';
import { useRouter } from 'next/navigation';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

interface ActionItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function ChoiceCard({ icon: IconComponent, label, onClick }: ActionItemProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg p-6">
      <div className="text-gray-900 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
        <IconComponent size={120} strokeWidth={1.75} />
      </div>

      <h2 className="text-[48px] font-extrabold text-[#6290C3] drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
        {label}
      </h2>

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

function DropdownItem({ icon: IconComponent, label, onClick }: ActionItemProps) {
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

export default function SelectionMenu() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handleOrderClick = () => router.push('/order');
  const handleAnalyticsClick = () => router.push('/analytics');
  const handleInventoryClick = () => router.push('/inventory');

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F1E9]">
      {/* Header */}
      <header className="flex w-full items-center justify-between p-6">
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {/* Logo */}
          <div className="flex cursor-pointer items-center gap-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
            <Coffee size={82} className="text-gray-900" />
            <span className="text-[64px] font-black text-gray-900">
              Pres <span className="text-[#6290C3]">Kopee</span>
            </span>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 z-10 w-64 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
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

        {/* Time */}
        <div className="text-[64px] font-black italic drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
          <span className="text-[#6290C3]">
            {formattedTime.split(' ')[0]}
          </span>
          <span className="text-gray-900">
            {' '}{formattedTime.split(' ')[1]}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-8">
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