// src/components/order/OrderTerminal.tsx
"use client";

import { useState, useMemo, useEffect } from "react";

import type { Product, Option, CartItem, OrderItem } from "@/lib/types";
import { initialCart } from "@/app/order/mockData";

import ProductList from "./ProductList";
import OrderSummary from "./OrderSummary";
import CustomizeProductModal from "./CustomizeProductModal";
import UniversalHeader from "../ui/UniversalHeader";

export default function OrderTerminal({
  fontClassName,
}: {
  fontClassName: string;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = useState("gcash");
  const [productToCustomize, setProductToCustomize] = useState<Product | null>(
    null,
  );
  const [totalOrderDiscountPercent, setTotalOrderDiscountPercent] = useState(0);
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products/addProduct");
        if (!response.ok) throw new Error("Failed to fetch products");
        const result = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productsData: Product[] = result.data.map((item: any) => ({
          id: String(item.id),
          name: item.product_name,
          price: item.product_cost,
          category: item.product_category,
          image: `https://placehold.co/150x150/F9F1E9/333?text=${encodeURIComponent(item.product_name)}`,
        }));

        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products", error);
        // Fallback to empty products, user can still use if needed
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    try {
      setIsCheckingOut(true);

      // Transform cart items to order items
      const orderItems: OrderItem[] = cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        options: item.options,
        notes: item.notes,
      }));

      const response = await fetch("/api/order/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          subtotal,
          discount: totalOrderDiscountAmount,
          total,
          paymentMethod: activePaymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      const result = await response.json();
      alert(`Order placed successfully! Order ID: ${result.orderId}`);

      // Clear cart after successful order
      setCart([]);
      setTotalOrderDiscountPercent(0);
    } catch (error) {
      console.error("Checkout error", error);
      alert(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => activeCategory === "all" || p.category === activeCategory)
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeCategory, searchTerm, products]);

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
        <UniversalHeader pageName1="Pres" pageName2="Kopee" />

        <div className="mt-6 flex flex-1 gap-6 overflow-hidden p-4 pb-6 pt-1">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <p className="text-lg text-gray-600">Loading products...</p>
            </div>
          ) : (
            <>
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
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
