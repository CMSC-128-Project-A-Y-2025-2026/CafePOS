// src/components/order/OrderTerminal.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Import all definitions and data (Adjusted paths for new file location)
import { Product, Option, CartItem } from "#/src/app/order/types";
import { products, initialCart } from "#/src/app/order/mockData";

// Import components (Adjusted paths for new file location)
import OrderHeader from "./OrderHeader";
import ProductList from "./ProductList";
import OrderSummary from "./OrderSummary";
import CustomizeProductModal from "./CustomizeProductModal";

// --- Main Order Terminal Component ---

// Receives fontClassName from the Server Component
export default function OrderTerminal({ fontClassName }: { fontClassName: string }) {
  const router = useRouter();

  // --- State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = useState("gcash");
  const [productToCustomize, setProductToCustomize] = useState<Product | null>(
    null,
  );
  const [totalOrderDiscountPercent, setTotalOrderDiscountPercent] = useState(0);
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  // --- Effects (Time) ---
  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // --- Router Handlers ---
  const handleLogoClick = () => router.push("/");
  const handleOrderClick = () => setIsDropdownOpen(false);
  const handleAnalyticsClick = () => router.push("/analytics");
  const handleInventoryClick = () => router.push("/inventory");

  // --- Cart Handlers ---
  const handleAddToCart = (
    product: Product,
    options: Option[],
    notes: string,
    discountPercent: number,
  ) => {
    const basePrice = product.price;
    const optionsPrice = options.reduce((acc, opt) => acc + opt.price, 0);
    const baseSubtotal = basePrice + optionsPrice;
    const discountAmount = baseSubtotal * (discountPercent / 100);
    const finalUnitPrice = baseSubtotal - discountAmount;

    // Use JSON.stringify for a reliable options/notes string for cart entry ID
    const optionsAndNotesString = JSON.stringify({
      options: options.map((o) => ({ n: o.name, p: o.price })).sort(),
      notes: notes,
      discountPercent: discountPercent,
    });
    const cartEntryId = `${product.id}-${optionsAndNotesString}`;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.cartEntryId === cartEntryId,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.cartEntryId === cartEntryId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        const newCartItem: CartItem = {
          cartItemId: crypto.randomUUID(),
          cartEntryId: cartEntryId,
          productId: product.id,
          name: product.name,
          basePrice: basePrice,
          unitPrice: finalUnitPrice,
          baseSubtotal: baseSubtotal,
          quantity: 1,
          options: options,
          notes: notes,
          discountPercent: discountPercent,
          discountAmount: discountAmount,
        };
        // Add new items to the top of the cart
        return [newCartItem, ...currentCart];
      }
    });

    setProductToCustomize(null);
  };

  const handleUpdateQuantity = (cartItemId: string, change: number) => {
    setCart((currentCart) => {
      const targetItem = currentCart.find(
        (item) => item.cartItemId === cartItemId,
      );
      if (!targetItem) return currentCart;

      const newQuantity = targetItem.quantity + change;

      if (newQuantity <= 0) {
        return currentCart.filter((item) => item.cartItemId !== cartItemId);
      } else {
        return currentCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item,
        );
      }
    });
  };

  // --- Memos (Calculations) ---
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => activeCategory === "all" || p.category === activeCategory)
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeCategory, searchTerm]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.baseSubtotal * item.quantity,
      0,
    );
  }, [cart]);

  const totalItemDiscount = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.discountAmount * item.quantity,
      0,
    );
  }, [cart]);

  const subtotalAfterItemDiscounts = subtotal - totalItemDiscount;
  const totalOrderDiscountAmount =
    subtotalAfterItemDiscounts * (totalOrderDiscountPercent / 100);
  const total = subtotalAfterItemDiscounts - totalOrderDiscountAmount;

  return (
    <div className={fontClassName}>
      {productToCustomize && (
        <CustomizeProductModal
          product={productToCustomize}
          onClose={() => setProductToCustomize(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <div className="flex h-screen flex-col bg-[#F9F1E9] p-6">
        <OrderHeader
          formattedTime={formattedTime}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleLogoClick={handleLogoClick}
          handleOrderClick={handleOrderClick}
          handleAnalyticsClick={handleAnalyticsClick}
          handleInventoryClick={handleInventoryClick}
        />

        {/* Main Layout */}
        <div className="mt-6 flex flex-1 gap-6 overflow-hidden p-4 pb-6 pt-1">
          <ProductList
            filteredProducts={filteredProducts}
            activeCategory={activeCategory}
            searchTerm={searchTerm}
            setActiveCategory={setActiveCategory}
            setSearchTerm={setSearchTerm}
            setProductToCustomize={setProductToCustomize}
          />

          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            totalItemDiscount={totalItemDiscount}
            totalOrderDiscountPercent={totalOrderDiscountPercent}
            totalOrderDiscountAmount={totalOrderDiscountAmount}
            total={total}
            activePaymentMethod={activePaymentMethod}
            setTotalOrderDiscountPercent={setTotalOrderDiscountPercent}
            setActivePaymentMethod={setActivePaymentMethod}
            handleUpdateQuantity={handleUpdateQuantity}
          />
        </div>
      </div>
    </div>
  );
}