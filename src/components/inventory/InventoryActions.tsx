// src/app/inventory/components/InventoryActions.tsx
import React from "react";
import { Search } from "lucide-react";
import { ActionButton, FilterPill } from "./Buttons";

interface InventoryActionsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeStatusFilter: string;
  setActiveStatusFilter: (status: string) => void;
  onAddProductClick: () => void;
  onGenerateReportClick: () => void;
}

export default function InventoryActions({
  searchTerm,
  setSearchTerm,
  activeStatusFilter,
  setActiveStatusFilter,
  onAddProductClick,
  onGenerateReportClick,
}: InventoryActionsProps) {
  return (
    <>
      {/* Action Buttons */}
      <nav className="my-6 flex items-center justify-between shrink-0">
        <div className="flex gap-4">
          <ActionButton
            className="bg-[#6290C3] text-[#F9F1E9] hover:bg-[#1A1B41]"
            onClick={onAddProductClick}
          >
            + new product
          </ActionButton>
          <ActionButton
            className="bg-[#D9D9D9] text-gray-800 hover:bg-[#C0C0C0]"
            onClick={onGenerateReportClick}
          >
            generate weekly report
          </ActionButton>
        </div>

        <div className="flex gap-3">
          {/* Filter Pills */}
          <FilterPill
            className="bg-[#333333] text-[#F9F1E9]"
            active={activeStatusFilter === "all"}
            onClick={() => setActiveStatusFilter("all")}
          >
            all
          </FilterPill>
          <FilterPill
            className="bg-[#7CB342] text-white"
            active={activeStatusFilter === "in stock"}
            onClick={() => setActiveStatusFilter("in stock")}
          >
            in
          </FilterPill>
          <FilterPill
            className="bg-[#FBC02D] text-white"
            active={activeStatusFilter === "low stock"}
            onClick={() => setActiveStatusFilter("low stock")}
          >
            low
          </FilterPill>
          <FilterPill
            className="bg-[#E53935] text-white"
            active={activeStatusFilter === "out of stock"}
            onClick={() => setActiveStatusFilter("out of stock")}
          >
            out
          </FilterPill>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="relative mb-4 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)] shrink-0">
        <input
          type="text"
          placeholder="Search by product or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 pl-12 text-lg text-gray-900 placeholder-gray-500 focus:border-[#6290C3] focus:ring-[#6290C3] transition-all"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={24}
        />
      </div>
    </>
  );
}
