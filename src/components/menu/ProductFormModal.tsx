// src/app/menu/components/ProductFormModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { MenuItem } from "../../app/menu/types";
import { menuCategories } from "../../app/menu/mockData"; // Import fixed categories

interface ProductFormModalProps {
  title: string;
  initialData?: MenuItem;
  onClose: () => void;
  onSave: (data: MenuItem) => void;
}

export default function ProductFormModal({
  title,
  initialData,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  // Initialize category to the first category if adding, or the existing one if editing
  const [category, setCategory] = useState(
    initialData?.category || menuCategories[0] || "",
  );
  const [price, setPrice] = useState(initialData?.price.toString() || "");

  // Removed image state and field

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: MenuItem = {
      id: initialData?.id || Math.floor(Date.now() / 1000),
      name,
      category,
      price: Number(price),
      // Automatically generate a placeholder image URL, as the field was removed
      image:
        initialData?.image ||
        `https://placehold.co/150x150/F9F1E9/333?text=${name}`,
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
              required
            />
          </div>

          {/* CATEGORY DROPDOWN */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
              required
            >
              {menuCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (PHP)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#6290C3] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#1A1B41]"
            >
              {isEditMode ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
