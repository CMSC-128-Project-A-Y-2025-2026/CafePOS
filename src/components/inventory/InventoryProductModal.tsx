// src/app/inventory/components/InventoryProductModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { InventoryItem } from "@/lib/types";
// Import the structured categories array
import { inventoryCategories } from "@/lib/arrays";

interface InventoryProductModalProps {
  title: string;
  initialData?: InventoryItem;
  onClose: () => void;
  onSave: (data: InventoryItem) => void;
}

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: string | number;
}

const InputField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = true,
  min,
}: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      min={min}
      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
      required={required}
    />
  </div>
);

export default function InventoryProductModal({
  title,
  initialData,
  onClose,
  onSave,
}: InventoryProductModalProps) {
  const [product, setProduct] = useState(initialData?.product || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [stock, setStock] = useState(initialData?.stock.toString() || "");
  const [itemThreshold, setItemThreshold] = useState(
    initialData?.item_threshold?.toString() || "",
  );
  const [cost, setCost] = useState(initialData?.cost || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: InventoryItem = {
      id: String(initialData?.id) || String(Math.floor(Date.now() / 1000)),
      product,
      category,
      stock: Number(stock),
      item_threshold: Number(itemThreshold),
      status: initialData?.status || "in stock", // status will be auto-set server-side
      cost,
    };

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
          <InputField
            label="Product Name"
            id="product"
            value={product}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct(e.target.value)
            }
          />

          {/* New Category Dropdown - Replaces the old InputField */}
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
              <option value="" disabled>
                Select an Inventory Category
              </option>
              {inventoryCategories.map((mainCategory) => (
                <optgroup key={mainCategory.value} label={mainCategory.label}>
                  {mainCategory.subcategories.map((subCategory) => (
                    <option key={subCategory.value} value={subCategory.label}>
                      {subCategory.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          {/* End of New Category Dropdown */}

          <InputField
            label="Stock"
            id="stock"
            type="number"
            value={stock}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStock(e.target.value)
            }
            min="0"
          />

          <InputField
            label="Low Stock Threshold"
            id="item_threshold"
            type="number"
            value={itemThreshold}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setItemThreshold(e.target.value)
            }
            min="0"
          />

          <InputField
            label="Cost (e.g., PHP 95)"
            id="cost"
            value={cost}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCost(e.target.value)
            }
          />

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
