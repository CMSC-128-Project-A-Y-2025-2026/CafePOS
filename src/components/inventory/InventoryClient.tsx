"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { InventoryItem } from "@/lib/types";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryActions from "@/components/inventory/InventoryActions";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryProductModal from "@/components/inventory/InventoryProductModal";
import DeleteConfirmationModal from "@/components/inventory/DeleteConfirmationModal";
import WeeklyReportModal from "@/components/inventory/WeeklyReportModal";
import { SpinnerDemo } from "../ui/spinnerLoader";

type InventorySaveData = Omit<InventoryItem, "id"> & { id?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatInventoryItem(raw: any): InventoryItem {
  return {
    id: raw.item_id,
    product: raw.item_name,
    category: raw.item_category,
    stock: raw.stock,
    status: raw.stock_status,
    cost: `PHP ${raw.item_cost}`,
  };
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

export default function InventoryClient() {
  const router = useRouter();
  const formattedTime = useClock();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<InventoryItem | null>(
    null,
  );
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(
    null,
  );
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inventory/getItem", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch items");
      const json = await response.json();

      setInventoryData(json.map(formatInventoryItem));
    } catch (err) {
      console.error("Inventory fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleAddProduct = async (newProduct: InventorySaveData) => {
    try {
      const costValue =
        Number(newProduct.cost?.toString().replace("PHP ", "")) || 0;

      const response = await fetch("/api/inventory/createItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, cost: costValue }),
      });

      if (!response.ok) throw new Error("Failed to create product");

      const result = await response.json();
      setInventoryData((prev) => [
        formatInventoryItem(result.data[0]),
        ...prev,
      ]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("[Add Product Error]", err);
    }
  };

  const handleEditProduct = async (updated: InventorySaveData) => {
    if (!updated.id) return;

    try {
      const costValue = updated.cost
        ? Number(updated.cost.toString().replace("PHP ", ""))
        : undefined;

      const response = await fetch("/api/inventory/editItem", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updated, cost: costValue }),
      });

      if (!response.ok) throw new Error("Failed to update product");

      const result = await response.json();
      const updatedItem = formatInventoryItem(result.data[0]);

      setInventoryData((prev) =>
        prev.map((item) => (item.id === updated.id ? updatedItem : item)),
      );

      setProductToEdit(null);
    } catch (err) {
      console.error("[Edit Product Error]", err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch("/api/inventory/removeItem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete.id }),
      });

      if (!response.ok) throw new Error("Failed to delete");

      setInventoryData((prev) =>
        prev.filter((item) => item.id !== productToDelete.id),
      );

      setProductToDelete(null);
    } catch (err) {
      console.error("[Delete Product Error]", err);
    }
  };

  const filteredInventory = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return inventoryData
      .filter((item) =>
        activeStatusFilter === "all"
          ? true
          : item.status === activeStatusFilter,
      )
      .filter(
        (item) =>
          item.product.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      )
      .sort((a, b) => a.product.localeCompare(b.product));
  }, [inventoryData, activeStatusFilter, searchTerm]);

  return (
    <>
      {/* Modals */}
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

      {/* Header */}
      <InventoryHeader
        formattedTime={formattedTime}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        handleLogoClick={() => router.push("/")}
        handleOrderClick={() => router.push("/order")}
        handleAnalyticsClick={() => router.push("/analytics")}
        handleInventoryClick={() => setIsDropdownOpen(false)}
      />

      {/* Filters + Actions */}
      <InventoryActions
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeStatusFilter={activeStatusFilter}
        setActiveStatusFilter={setActiveStatusFilter}
        onAddProductClick={() => setIsAddModalOpen(true)}
        onGenerateReportClick={() => setIsReportModalOpen(true)}
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-lg text-gray-600">
            <SpinnerDemo name={"inventory"} />
          </div>
        </div>
      ) : (
        <InventoryTable
          filteredInventory={filteredInventory}
          setProductToEdit={setProductToEdit}
          setProductToDelete={setProductToDelete}
        />
      )}
    </>
  );
}
