// src/app/inventory/components/Buttons.tsx
import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

export function ActionButton({ children, className, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-6 py-3 text-sm font-bold
        transition-all hover:scale-[1.02] active:scale-[0.98]
        drop-shadow-md
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface FilterPillProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  active: boolean;
}

export function FilterPill({ children, className, onClick, active }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-5 py-2 text-sm font-bold
        transition-all duration-200
        ${className}
        ${active ? 'opacity-100 shadow-md ring-2 ring-[#6290C3] ring-offset-2 ring-offset-[#F9F1E9]' : 'opacity-70 hover:opacity-100'}
      `}
    >
      {children}
    </button>
  );
}

interface TableActionButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

export function TableActionButton({ children, className, onClick }: TableActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-md px-4 py-1.5 text-sm font-bold
        transition-all hover:opacity-90 active:scale-[0.98]
        ${className}
      `}
    >
      {children}
    </button>
  );
}