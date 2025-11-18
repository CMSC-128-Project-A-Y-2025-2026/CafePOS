"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Coffee,
  ClipboardPen,
  PieChart,
  Boxes,
  X,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Lato } from 'next/font/google';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

// --- Types ---

interface InventoryItem {
  id: number;
  product: string;
  category: string;
  stock: number;
  status: string;
  cost: string;
}

// --- Mock Data ---

const initialInventoryData: InventoryItem[] = [
  { id: 1, product: 'oatmilk', category: 'dairy', stock: 12, status: 'in stock', cost: 'PHP 95' },
  { id: 2, product: 'oatmilk', category: 'dairy', stock: 12, status: 'in stock', cost: 'PHP 95' },
  { id: 3, product: 'whole milk', category: 'dairy', stock: 24, status: 'in stock', cost: 'PHP 80' },
  { id: 4, product: 'espresso beans', category: 'coffee', stock: 5, status: 'low stock', cost: 'PHP 500' },
  { id: 5, product: 'caramel syrup', category: 'syrups', stock: 10, status: 'in stock', cost: 'PHP 250' },
  { id: 6, product: 'croissants', category: 'pastry', stock: 0, status: 'out of stock', cost: 'PHP 45' },
  { id: 7, product: 'banana bread', category: 'pastry', stock: 8, status: 'in stock', cost: 'PHP 55' },
  { id: 8, product: 'green tea', category: 'tea', stock: 15, status: 'in stock', cost: 'PHP 120' },
  { id: 9, product: 'hazelnut syrup', category: 'syrups', stock: 3, status: 'low stock', cost: 'PHP 250' },
  { id: 10, product: 'dark roast beans', category: 'coffee', stock: 20, status: 'in stock', cost: 'PHP 450' },
  { id: 11, product: 'vanilla syrup', category: 'syrups', stock: 30, status: 'in stock', cost: 'PHP 250' },
  { id: 12, product: 'muffins', category: 'pastry', stock: 10, status: 'in stock', cost: 'PHP 60' },
];

// --- Main Component ---

export default function InventoryPage() {
  const router = useRouter();

  // --- State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<InventoryItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventoryData);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

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
    <>
      {/* --- Modals --- */}
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
        <header className="flex w-full items-center justify-between relative z-30 flex-shrink-0">
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div
              className="flex cursor-pointer items-center gap-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]"
              onClick={handleLogoClick}
            >
              <Coffee size={82} className="text-gray-900" />
              <span className="text-[64px] font-black text-gray-900">
                Inventory <span className="text-[#6290C3]">Management</span>
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-10 w-64 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
                <div className="py-2">
                  <DropdownItem icon={ClipboardPen} label="Order" onClick={handleOrderClick} />
                  <DropdownItem icon={PieChart} label="Analytics" onClick={handleAnalyticsClick} />
                  <DropdownItem icon={Boxes} label="Inventory" onClick={handleInventoryClick} />
                </div>
              </div>
            )}
          </div>

          <div className="text-[64px] font-black italic drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]">
            <span className="text-[#6290C3]">{formattedTime.split(' ')[0]}</span>
            <span className="text-gray-900"> {formattedTime.split(' ')[1]}</span>
          </div>
        </header>

        {/* Action Buttons */}
        <nav className="my-6 flex items-center justify-between flex-shrink-0">
          <div className="flex gap-4">
            <ActionButton
              className="bg-[#6290C3] text-[#F9F1E9]"
              onClick={() => setIsAddModalOpen(true)}
            >
              + new product
            </ActionButton>
            <ActionButton
              className="bg-[#D9D9D9] text-gray-800"
              onClick={() => setIsReportModalOpen(true)}
            >
              generate weekly report
            </ActionButton>
          </div>

          <div className="flex gap-3">
            <FilterPill
              className="bg-[#333333] text-[#F9F1E9]"
              active={activeStatusFilter === 'all'}
              onClick={() => setActiveStatusFilter('all')}
            >
              all
            </FilterPill>
            <FilterPill
              className="bg-[#7CB342] text-[#F9F1E9]"
              active={activeStatusFilter === 'in stock'}
              onClick={() => setActiveStatusFilter('in stock')}
            >
              in
            </FilterPill>
            <FilterPill
              className="bg-[#FBC02D] text-[#F9F1E9]"
              active={activeStatusFilter === 'low stock'}
              onClick={() => setActiveStatusFilter('low stock')}
            >
              low
            </FilterPill>
            <FilterPill
              className="bg-[#E53935] text-[#F9F1E9]"
              active={activeStatusFilter === 'out of stock'}
              onClick={() => setActiveStatusFilter('out of stock')}
            >
              out
            </FilterPill>
          </div>
        </nav>

        {/* Search Bar */}
        <div className="relative mb-4 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex-shrink-0">
          <input
            type="text"
            placeholder="Search by product or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 pl-12 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C2E7DA]" size={30} />
        </div>

        {/* Main Table Content */}
        <main className="flex-1 rounded-2xl bg-white p-8 shadow-lg flex flex-col overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 rounded-lg bg-[#E5F1FB] px-6 py-4 flex-shrink-0">
            <div className="font-bold text-gray-600">Product</div>
            <div className="font-bold text-gray-600">Category</div>
            <div className="font-bold text-gray-600">Stock</div>
            <div className="font-bold text-gray-600">Status</div>
            <div className="font-bold text-gray-600">Cost</div>
            <div className="font-bold text-gray-600">Actions</div>
          </div>

          {/* Table Body */}
          <div className="mt-4 flex flex-col gap-4 flex-1 overflow-y-auto">
            {filteredInventory.map((item) => (
              <div key={item.id} className="grid grid-cols-6 items-center gap-4 border-b border-gray-100 px-6 py-4">
                <div className="font-medium text-gray-900">{item.product}</div>
                <div className="text-gray-700">{item.category}</div>
                <div className="text-gray-700">{item.stock}</div>
                <div className="text-gray-700">{item.status}</div>
                <div className="text-gray-700">{item.cost}</div>
                <div className="flex gap-2">
                  <TableActionButton
                    className="bg-[#D7EFE0] text-[#34A853]"
                    onClick={() => setProductToEdit(item)}
                  >
                    edit
                  </TableActionButton>
                  <TableActionButton
                    className="bg-[#FADADD] text-[#E53935]"
                    onClick={() => setProductToDelete(item)}
                  >
                    del
                  </TableActionButton>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

// --- Reusable Components ---

interface ActionButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

function ActionButton({ children, className, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-6 py-3 text-sm font-bold
        transition-all hover:scale-105
        drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)]
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

function FilterPill({ children, className, onClick, active }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full px-5 py-2 text-sm font-bold text-white
        transition-all
        ${className}
        ${active ? 'opacity-100 ring-2 ring-white ring-offset-2 ring-offset-gray-800' : 'opacity-70 hover:opacity-100'}
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

function TableActionButton({ children, className, onClick }: TableActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-md px-4 py-1.5 text-sm font-bold
        transition-all hover:opacity-80
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface DropdownItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function DropdownItem({ icon: IconComponent, label, onClick }: DropdownItemProps) {
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

// --- Modal Components ---

interface InventoryProductModalProps {
  title: string;
  initialData?: InventoryItem;
  onClose: () => void;
  onSave: (data: any) => void; // Using 'any' here for simplicity in handling both edit/add payload shapes
}

function InventoryProductModal({ title, initialData, onClose, onSave }: InventoryProductModalProps) {
  const [product, setProduct] = useState(initialData?.product || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [status, setStatus] = useState(initialData?.status || 'in stock');
  const [cost, setCost] = useState(initialData?.cost || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: any = {
      product,
      category,
      stock: Number(stock),
      status,
      cost
    };

    if (initialData) {
      productData.id = initialData.id;
    }

    onSave(productData);
  };

  const isEditMode = initialData !== undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 transition-all hover:border-[#1A1B41] hover:ring-1 hover:ring-[#1A1B41]"
              required
            >
              <option value="in stock">In stock</option>
              <option value="low stock">Low stock</option>
              <option value="out of stock">Out of stock</option>
            </select>
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Cost (e.g., PHP 95)
            </label>
            <input
              type="text"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#6290C3] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#1A1B41]"
            >
              {isEditMode ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmationModalProps {
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmationModal({ productName, onClose, onConfirm }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Delete Product
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete "{productName}"? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface WeeklyReportModalProps {
  inventory: InventoryItem[];
  onClose: () => void;
}

function WeeklyReportModal({ inventory, onClose }: WeeklyReportModalProps) {
  const outOfStock = inventory.filter(item => item.status === 'out of stock');
  const lowStock = inventory.filter(item => item.status === 'low stock');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Weekly Restock Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Report Content */}
        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {/* Out of Stock (High Priority) */}
          <div>
            <h3 className="text-lg font-semibold text-red-600">
              Immediate Priority (Out of Stock)
            </h3>
            {outOfStock.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700">
                {outOfStock.map(item => (
                  <li key={item.id}>
                    <span className="font-medium text-gray-900">{item.product}</span>
                    (Category: {item.category})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No items are out of stock. Great job!</p>
            )}
          </div>

          {/* Low Stock (Medium Priority) */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-yellow-600">
              Low Stock (Restock Soon)
            </h3>
            {lowStock.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700">
                {lowStock.map(item => (
                  <li key={item.id}>
                    <span className="font-medium text-gray-900">{item.product}</span>
                    (Current Stock: {item.stock})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No items are low in stock.</p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}