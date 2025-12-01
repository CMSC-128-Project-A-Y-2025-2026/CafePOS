// src/app/inventory/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';

// Import necessary components/types from external files
import { Coffee } from 'lucide-react';
import { InventoryItem } from './types'; // New file
import { initialInventoryData } from './mockData'; // New file
import InventoryHeader from './components/InventoryHeader'; // New file
import InventoryActions from './components/InventoryActions'; // New file
import InventoryTable from './components/InventoryTable'; // New file
import InventoryProductModal from './components/InventoryProductModal'; // Moved file
import DeleteConfirmationModal from './components/DeleteConfirmationModal'; // Moved file
import WeeklyReportModal from './components/WeeklyReportModal'; // Moved file


// Load Montserrat font
export const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function InventoryPage() {
  const router = useRouter();

  // --- State  ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<InventoryItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventoryData);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // --- Effects ---
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime ? currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) : '--:-- --';

  // --- Handlers  ---
  const handleLogoClick = () => router.push('/');
  const handleOrderClick = () => router.push('/order');
  const handleAnalyticsClick = () => router.push('/analytics');
  const handleInventoryClick = () => setIsDropdownOpen(false);

  const handleAddProduct = (newProduct: Omit<InventoryItem, 'id'>) => {
    const productWithId = {
      ...newProduct,
      id: inventoryData.length > 0 ? Math.max(...inventoryData.map(i => i.id)) + 1 : 1
    };
    setInventoryData(currentData => [productWithId, ...currentData]);
    setIsAddModalOpen(false);
  };

  const handleEditProduct = (updatedProduct: InventoryItem) => {
    setInventoryData(currentData =>
      currentData.map(item =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
    setProductToEdit(null);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setInventoryData(currentData =>
        currentData.filter(item => item.id !== productToDelete.id)
      );
      setProductToDelete(null);
    }
  };

  const filteredInventory = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = inventoryData
      .filter(item => {
        if (activeStatusFilter === 'all') return true;
        return item.status === activeStatusFilter;
      })
      .filter(item => {
        return (
          item.product.toLowerCase().includes(lowerSearchTerm) ||
          item.category.toLowerCase().includes(lowerSearchTerm)
        );
      });

    // Sort alphabetically
    filtered.sort((a, b) => a.product.localeCompare(b.product));

    return filtered;
  }, [inventoryData, activeStatusFilter, searchTerm]);

  return (
    <div className={montserrat.className}>
      {/* --- Modals ---  */}
      {isAddModalOpen && (
        <InventoryProductModal
          title="Add New Product"
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
        />
      )}
      {productToEdit && (
        <InventoryProductModal
          title="Edit Product"
          initialData={productToEdit}
          onClose={() => setProductToEdit(null)}
          onSave={handleEditProduct}
        />
      )}
      {productToDelete && (
        <DeleteConfirmationModal
          productName={productToDelete.product}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
      {isReportModalOpen && (
        <WeeklyReportModal
          inventory={inventoryData}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      <div className="flex h-screen flex-col bg-[#F9F1E9] p-6">
        {/* Header */}
        <InventoryHeader
          formattedTime={formattedTime}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleLogoClick={handleLogoClick}
          handleOrderClick={handleOrderClick}
          handleAnalyticsClick={handleAnalyticsClick}
          handleInventoryClick={handleInventoryClick}
        />

        {/* Action Buttons, Filter Pills, Search Bar */}
        <InventoryActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatusFilter={activeStatusFilter}
          setActiveStatusFilter={setActiveStatusFilter}
          onAddProductClick={() => setIsAddModalOpen(true)}
          onGenerateReportClick={() => setIsReportModalOpen(true)}
        />

        {/* Main Table Content */}
        <InventoryTable
          filteredInventory={filteredInventory}
          setProductToEdit={setProductToEdit}
          setProductToDelete={setProductToDelete}
        />
      </div>
    </div>
  );
}