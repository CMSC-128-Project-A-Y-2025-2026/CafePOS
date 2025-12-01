// src/app/analytics/components/TabNavigation.tsx
import React from 'react';
import { TabButton, TimeFilterButton } from './HelperComponents';

interface TabNavigationProps {
  activeMainTab: string;
  setActiveMainTab: (tab: string) => void;
  activeTimeFilter: string;
  setActiveTimeFilter: (filter: string) => void;
}

export default function TabNavigation({
  activeMainTab,
  setActiveMainTab,
  activeTimeFilter,
  setActiveTimeFilter,
}: TabNavigationProps) {
  return (
    // UPDATED: Reduced padding of the container from p-2 to p-1.5
    <nav className="my-4 flex w-full max-w-4xl mx-auto items-center justify-between rounded-full bg-white p-1.5 shadow-lg drop-shadow-md">
      {/* Left: Main Tabs */}
      <div className="flex">
        <TabButton label="Performance" active={activeMainTab === 'performance'} onClick={() => setActiveMainTab('performance')} />
        <TabButton label="Bestseller" active={activeMainTab === 'bestseller'} onClick={() => setActiveMainTab('bestseller')} />
        <TabButton label="Trend" active={activeMainTab === 'trend'} onClick={() => setActiveMainTab('trend')} />
      </div>

      {/* Right: Time Filter */}
      {/* UPDATED: Reduced padding of the filter wrapper from p-1 to p-0.5 */}
      <div className="flex gap-1 rounded-full bg-gray-100 p-0.5 mr-1"> 
        <TimeFilterButton label="today" active={activeTimeFilter === 'today'} onClick={() => setActiveTimeFilter('today')} />
        <TimeFilterButton label="week" active={activeTimeFilter === 'week'} onClick={() => setActiveTimeFilter('week')} />
        <TimeFilterButton label="month" active={activeTimeFilter === 'month'} onClick={() => setActiveTimeFilter('month')} />
      </div>
    </nav>
  );
}