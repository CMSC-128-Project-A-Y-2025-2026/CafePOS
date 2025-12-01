// src/app/analytics/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google'; 

// Import components
import AnalyticsHeader from './components/AnalyticsHeader';
import TabNavigation from './components/TabNavigation';
import PerformanceTab from './components/PerformanceTab';
import BestsellerTab from './components/BestsellerTab';
import TrendTab from './components/TrendTab';

// Load Montserrat font 
export const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

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
    <div className={`flex min-h-screen flex-col bg-[#F9F1E9] p-5 ${montserrat.className}`}>
      
      <AnalyticsHeader
        formattedTime={formattedTime}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        handleLogoClick={handleLogoClick}
        handleOrderClick={handleOrderClick}
        handleAnalyticsClick={handleAnalyticsClick}
        handleInventoryClick={handleInventoryClick}
      />

      {/* Tab Navigation */}
      <TabNavigation
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        activeTimeFilter={activeTimeFilter}
        setActiveTimeFilter={setActiveTimeFilter}
      />

      {/* Tab Content */}
      <main className="flex-1 rounded-2xl bg-white p-6 shadow-lg overflow-hidden drop-shadow-md">
        {activeMainTab === 'performance' && <PerformanceTab />}
        {activeMainTab === 'bestseller' && <BestsellerTab />}
        {activeMainTab === 'trend' && <TrendTab />}
      </main>
    </div>
  );
}