"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ChoiceCardProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

export default function ChoiceCard({ icon: IconComponent, label, onClick }: ChoiceCardProps) {
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
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#6290C3]/5 transition-all group-hover:bg-[#6290C3]/10" />
      <div className="z-10 mb-6 text-gray-400 transition-colors duration-300 group-hover:text-[#6290C3]">
        <IconComponent size={100} strokeWidth={1.5} />
      </div>
      <h2 className="z-10 mb-8 text-[40px] font-extrabold text-gray-800 transition-colors group-hover:text-[#6290C3]">
        {label}
      </h2>
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
