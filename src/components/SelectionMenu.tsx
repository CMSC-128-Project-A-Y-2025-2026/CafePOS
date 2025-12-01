"use client";
import React, { useState, useEffect } from 'react';
import { Montserrat } from 'next/font/google';
import SelectionHeader from './SelectionMenu/SelectionHeader';
import MainMenu from './SelectionMenu/MainMenu';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function SelectionMenu() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '--:-- --';

  return (
    <div className={`flex min-h-screen flex-col bg-[#F9F1E9] ${montserrat.className}`}>
      <SelectionHeader formattedTime={formattedTime} />
      <MainMenu />
    </div>
  );
}
