// src/app/menu/components/CategoryFilterPill.tsx

import React from 'react';

interface CategoryFilterPillProps {
  label: string;
  categoryKey: string; // e.g., 'signature'
  active: boolean;
  onClick: (key: string) => void;
}

export default function CategoryFilterPill({ label, categoryKey, active, onClick }: CategoryFilterPillProps) {
  // Function to capitalize labels like 'coffee-based' to 'Coffee Based'
  const displayLabel = label.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // NOTE: Inventory pills use py-2 and px-5. We will use these exact dimensions now.
  return (
    <button
      onClick={() => onClick(categoryKey)}
      className={`
        /* CHANGE: px-4 py-1.5 -> px-3 py-1 (Smaller) */
        rounded-full px-6 py-2 text-xs font-bold capitalize /* Also shrunk font size for compactness */
        transition-all duration-200 drop-shadow-md flex-shrink-0
        
        ${active
          ? 'bg-[#333333] text-[#F9F1E9] opacity-100 shadow-md ring-2 ring-[#6290C3] ring-offset-2 ring-offset-[#F9F1E9]' 
          : 'bg-[#333333]/70 text-[#F9F1E9]/80 hover:opacity-100 hover:text-[#F9F1E9]' 
        }
      `}
    >
      {displayLabel}
    </button>
  );
}