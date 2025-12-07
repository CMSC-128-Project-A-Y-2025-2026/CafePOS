// src/app/analytics/components/AnalyticsHeader.tsx
"use client";
import { useEffect, useState } from "react";
import {
  Coffee,
  ClipboardPen,
  PieChart,
  Boxes,
  Menu,
  Bell,
} from "lucide-react";
import { DropdownItem } from "#/src/components/ui/HelperComponents";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UniversalHeaderProps {
  pageName1: string;
  pageName2: string;
}

function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function UniversalHeader({
  pageName1,
  pageName2,
}: UniversalHeaderProps) {
  const router = useRouter();
  const formattedTime = useClock();

  const handleMenuClick = () => router.push("/menu");
  const handleLogoClick = () => router.push("/");
  const handleOrderClick = () => router.push("/order");
  const handleAnalyticsClick = () => router.push("/analytics");
  const handleInventoryClick = () => router.push("/inventory");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Fetch low stock items count
  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await fetch("/api/inventory/getItem");
        if (!response.ok) return;
        const data = await response.json();

        const lowStockItems = data.filter(
          (item: { stock_status: string }) =>
            item.stock_status === "low stock" ||
            item.stock_status === "out of stock",
        );
        setLowStockCount(lowStockItems.length);
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      }
    };

    fetchLowStockCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLowStockCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAlertClick = async () => {
    try {
      const response = await fetch("/api/inventory/getItem");
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();

      const lowStockItems = data.filter(
        (item: { stock_status: string }) =>
          item.stock_status === "low stock" ||
          item.stock_status === "out of stock",
      );

      if (lowStockItems.length === 0) {
        toast.success("All ingredients are well stocked! 🎉");
        return;
      }

      // Group by status
      const outOfStock = lowStockItems.filter(
        (item: { stock_status: string }) =>
          item.stock_status === "out of stock",
      );
      const lowStock = lowStockItems.filter(
        (item: { stock_status: string }) => item.stock_status === "low stock",
      );

      // Create message
      let message = "";

      if (outOfStock.length > 0) {
        message += "🔴 OUT OF STOCK:\n";
        outOfStock.forEach((item: { item_name: string; stock: number }) => {
          message += `• ${item.item_name} (${item.stock})\n`;
        });
      }

      if (lowStock.length > 0) {
        if (message) message += "\n";
        message += "🟡 LOW STOCK:\n";
        lowStock.forEach(
          (item: {
            item_name: string;
            stock: number;
            item_threshold: number;
          }) => {
            message += `• ${item.item_name} (${item.stock}/${item.item_threshold})\n`;
          },
        );
      }

      toast.error(message, {
        duration: 10000,
        style: {
          whiteSpace: "pre-line",
          maxWidth: "500px",
        },
      });
    } catch (error) {
      console.error("Failed to fetch low stock items", error);
      toast.error("Failed to load inventory status");
    }
  };

  const page_name_1 = pageName1;
  const page_name_2 = pageName2;
  return (
    <header
      className={
        page_name_1 == "Menu"
          ? "flex w-full items-center justify-between relative z-30 shrink-0 p-6"
          : "flex w-full items-center justify-between relative z-30 shrink-0"
      }
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');`}
      </style>
      <div
        className="relative z-50"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <div
          className="flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80 pb-1"
          onClick={handleLogoClick}
        >
          <div className="drop-shadow-md">
            <Coffee size={72} className="text-gray-900" />
          </div>
          <span
            className="text-[64px] font-black leading-tight text-gray-900 drop-shadow-sm"
            style={{ fontFamily: "'Shrikhand', cursive" }}
          >
            {page_name_1} <span className="text-[#6290C3]">{page_name_2}</span>
          </span>
        </div>

        <div
          className={`
            absolute left-0 top-full w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out
            ${isDropdownOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"} /* max-h adjusted */
          `}
        >
          <div className="py-2">
            <DropdownItem
              icon={ClipboardPen}
              label="Order"
              onClick={handleOrderClick}
            />
            <DropdownItem
              icon={PieChart}
              label="Analytics"
              onClick={handleAnalyticsClick}
            />
            <DropdownItem
              icon={Boxes}
              label="Inventory"
              onClick={handleInventoryClick}
            />
            <DropdownItem
              icon={Menu}
              label="Menu"
              onClick={handleMenuClick}
            />{" "}
          </div>
        </div>
      </div>

      {/* Alert Button & Time */}
      <div className="flex items-center gap-6">
        {/* Alert Button */}
        <button
          onClick={handleAlertClick}
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#6290C3] hover:bg-[#1A1B41] transition-all duration-200 shadow-lg hover:shadow-xl group"
          title="Check low stock items"
        >
          <Bell size={32} className="text-white" />
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
              {lowStockCount}
            </span>
          )}
        </button>

        {/* Time */}
        <div className="flex items-baseline gap-3 font-black italic tracking-tight drop-shadow-sm">
          <span className="text-[64px] text-[#6290C3]">
            {formattedTime.split(" ")[0]}
          </span>
          <span className="text-gray-900 text-[48px]">
            {formattedTime.split(" ")[1]}
          </span>
        </div>
      </div>
    </header>
  );
}
