// src/app/order/components/OrderSummary.tsx
"use client"
import { CartItem } from "@/lib/types"
import OrderItem from "./OrderItem"
import PaymentButton from "./PaymentButton"

interface OrderSummaryProps {
  cart: CartItem[]
  subtotal: number
  totalItemDiscount: number
  totalOrderDiscountPercent: number
  totalOrderDiscountAmount: number
  total: number
  activePaymentMethod: string
  setTotalOrderDiscountPercent: (percent: number) => void
  setActivePaymentMethod: (method: string) => void
  handleUpdateQuantity: (cartItemId: string, change: number) => void
  onCheckout: () => void
  isCheckingOut: boolean
}

export default function OrderSummary({
  cart,
  subtotal,
  totalItemDiscount,
  totalOrderDiscountPercent,
  totalOrderDiscountAmount,
  total,
  activePaymentMethod,
  setTotalOrderDiscountPercent,
  setActivePaymentMethod,
  handleUpdateQuantity,
  onCheckout,
  isCheckingOut,
}: OrderSummaryProps) {
  return (
    <aside className="w-96 shrink-0 rounded-3xl bg-white p-6 shadow-xl flex flex-col h-full">
      <h2 className="text-xl font-extrabold text-gray-900 mb-4 shrink-0 border-b pb-2">CURRENT ORDER</h2>

      {/* Scrollable Order Items List */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <OrderItem
              key={item.cartItemId}
              item={item}
              onIncrement={() => handleUpdateQuantity(item.cartItemId, 1)}
              onDecrement={() => handleUpdateQuantity(item.cartItemId, -1)}
            />
          ))}
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="mt-4 border-t-2 border-gray-200 pt-3 shrink-0">
        {/* Subtotal & Item Discounts */}
        <div className="flex justify-between text-sm text-gray-600 mb-0.5">
          <span>Subtotal</span>
          <span>PHP {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Item Discounts</span>
          <span className="text-red-600 font-semibold">- PHP {totalItemDiscount.toFixed(2)}</span>
        </div>

        {/* Order Discount Input */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-1 pt-0.5 border-t border-dashed border-gray-200">
          <label htmlFor="orderDiscount" className="font-bold">
            Order Discount (%)
          </label>
          <input
            type="number"
            id="orderDiscount"
            placeholder="0"
            value={totalOrderDiscountPercent === 0 ? "" : totalOrderDiscountPercent}
            onChange={(e) => setTotalOrderDiscountPercent(Number(e.target.value) || 0)}
            className="w-16 rounded-md border border-gray-300 p-0.5 text-right shadow-sm focus:border-[#6290C3] focus:ring-[#6290C3] text-gray-900 text-xs transition-all"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>Order Discount Amount</span>
          <span className="text-red-600 font-semibold">- PHP {totalOrderDiscountAmount.toFixed(2)}</span>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between text-xl font-black text-gray-900 mb-3 pt-1 border-t-2 border-gray-300">
          <span>TOTAL</span>
          <span>PHP {total.toFixed(2)}</span>
        </div>

        {/* Payment Method Buttons */}
        <div className="flex justify-between mb-3 gap-2">
          {["cash", "gcash", "card"].map((method) => (
            <PaymentButton
              key={method}
              active={activePaymentMethod === method}
              onClick={() => setActivePaymentMethod(method)}
            >
              {method}
            </PaymentButton>
          ))}
        </div>

        {/* CHECK OUT Button */}
        <button
          onClick={onCheckout}
          disabled={cart.length === 0 || isCheckingOut}
          className="w-full rounded-xl bg-[#6290C3] py-3 text-lg font-black text-white transition-all hover:bg-[#1A1B41] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isCheckingOut ? "Processing..." : "CHECK OUT"}
        </button>
      </div>
    </aside>
  )
}
