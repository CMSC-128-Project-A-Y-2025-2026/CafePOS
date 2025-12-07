"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Product, Option } from "@/lib/types";
import { ADD_ONS } from "../../app/order/mockData";
import { toast } from "sonner";

interface CustomizeProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    options: Option[],
    notes: string,
    discountPercent: number
  ) => void;
}

export default function CustomizeProductModal({
  product,
  onClose,
  onAddToCart,
}: CustomizeProductModalProps) {
  const isDrink = [
    "signature",
    "coffee-based",
    "frappe-based",
    "non-coffee",
    "matcha-based",
    "soda-based",
  ].includes(product.category);

  // States for customization
  const [size, setSize] = useState("regular");
  const [sugar, setSugar] = useState("100%");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const basePrice = product.price;

  // --- Option Calculation ---
  const getSizePrice = () => {
    if (size === "medium") return 20;
    if (size === "large") return 40;
    return 0;
  };

  const sizeOption: Option | null =
    isDrink && size !== "regular"
      ? {
          name: `${size.charAt(0).toUpperCase() + size.slice(1)} (+P${getSizePrice().toFixed(2)})`,
          price: getSizePrice(),
        }
      : isDrink
      ? { name: "Regular Size", price: 0 }
      : null;

  const sugarOption: Option | null = isDrink
    ? { name: `Sugar: ${sugar}`, price: 0 }
    : null;

  const addOnOptions: Option[] = ADD_ONS.filter((ao) =>
    selectedAddOns.includes(ao.name)
  ).map((ao) => ({ name: `Add-on: ${ao.name}`, price: ao.price }));

  const allOptions: Option[] = [
    ...(sizeOption ? [sizeOption] : []),
    ...(sugarOption ? [sugarOption] : []),
    ...addOnOptions,
  ].filter((o) => o.price > 0 || o.name.startsWith("Sugar:"));

  const optionsPrice = allOptions.reduce((acc, opt) => acc + opt.price, 0);
  const subtotal = basePrice + optionsPrice;
  const discountAmount = subtotal * (discountPercent / 100);
  const finalPrice = subtotal - discountAmount;

  // --- Handlers ---
  const handleAddOnToggle = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = () => {
    if (discountPercent > 100 || discountPercent < 0) {
      toast.error("Invalid Discount", {
        description: "Discount cannot be less than 0% or more than 100%.",
      });
      return;
    }

    onAddToCart(product, allOptions, notes, discountPercent);
    
    toast.success(`${product.name} added to order`, {
      description: isDrink 
        ? `${size.charAt(0).toUpperCase() + size.slice(1)} size, ${sugar} sugar.` 
        : "Item added successfully.",
    });

    onClose();
  };

  const handleSkip = () => {
    const defaultOptions: Option[] = isDrink
      ? [
          { name: "Regular Size", price: 0 },
          { name: "Sugar: 100%", price: 0 },
        ]
      : [];
    onAddToCart(product, defaultOptions, "", 0);

    toast.success(`${product.name} added with default settings`);

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Customize: {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 space-y-8">
          {/* Size Selection */}
          {isDrink && (
            <div className="border-b pb-6">
              <label className="block text-lg font-bold text-gray-900 mb-3">Size Selection</label>
              <div className="mt-2 flex gap-3">
                {["regular", "medium", "large"].map((s) => (
                  <label
                    key={s}
                    className={`flex-1 rounded-xl p-3 border-2 cursor-pointer transition-all hover:shadow-md ${s === size ? "border-[#6290C3] bg-[#E5F1FB]" : "border-gray-300 bg-white hover:bg-gray-50"}`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      checked={s === size}
                      onChange={(e) => setSize(e.target.value)}
                      className="sr-only"
                    />
                    <span className="block text-center text-base font-bold text-gray-900 capitalize">{s}</span>
                    <span className="block text-center text-sm text-gray-500">
                      {s === "medium" ? "(+ PHP 20.00)" : s === "large" ? "(+ PHP 40.00)" : "(Base)"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sugar Level */}
          {isDrink && (
            <div className="border-b pb-6">
              <label className="block text-lg font-bold text-gray-900 mb-3">Sugar Level</label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                {["0%", "25%", "50%", "100%"].map((level) => (
                  <label
                    key={level}
                    className={`rounded-xl p-3 border-2 cursor-pointer transition-all hover:shadow-md ${sugar === level ? "border-[#6290C3] bg-[#E5F1FB]" : "border-gray-300 bg-white hover:bg-gray-50"}`}
                  >
                    <input
                      type="radio"
                      name="sugar"
                      value={level}
                      checked={sugar === level}
                      onChange={(e) => setSugar(e.target.value)}
                      className="sr-only"
                    />
                    <span className="block text-center text-base font-bold text-gray-900">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {isDrink && (
            <div className="border-b pb-6">
              <label className="block text-lg font-bold text-gray-900 mb-3">Add Ons</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {ADD_ONS.map((ao) => (
                  <button
                    key={ao.name}
                    onClick={() => handleAddOnToggle(ao.name)}
                    className={`rounded-xl p-3 border-2 cursor-pointer transition-all text-left ${selectedAddOns.includes(ao.name) ? "border-[#6290C3] bg-[#E5F1FB]" : "border-gray-300 bg-white hover:bg-gray-50"}`}
                  >
                    <span className="block text-sm font-bold text-gray-900 leading-tight">{ao.name}</span>
                    <span className="block text-xs text-gray-500 mt-1">{`(+ PHP ${ao.price.toFixed(2)})`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="border-b pb-6">
            <label htmlFor="notes" className="block text-lg font-bold text-gray-900 mb-3">Notes</label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 transition-all"
              placeholder="Customer requests..."
            />
          </div>

          {/* Discount */}
          <div className="border-b pb-6">
            <label htmlFor="discount" className="block text-lg font-bold text-gray-900 mb-3">Item Discount (%)</label>
            <input
              type="number"
              id="discount"
              value={discountPercent === 0 ? "" : discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900"
            />
          </div>

          {/* Summary */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between text-base text-gray-600">
              <span>Subtotal:</span>
              <span>PHP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-red-600">
              <span>Discount ({discountPercent}%):</span>
              <span>- PHP {discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-gray-900 border-t-2 border-gray-300 pt-2">
              <span>Final Price:</span>
              <span>PHP {finalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-xl bg-gray-200 px-5 py-3 text-base font-bold text-gray-700 hover:bg-gray-300 transition-colors flex-1 shadow-md"
            >
              Skip Customization
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-[#6290C3] px-5 py-3 text-base font-bold text-white transition-all hover:bg-[#1A1B41] flex-1 shadow-md"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}