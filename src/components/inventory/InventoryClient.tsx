"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import type { InventoryItem } from "@/lib/types";
import InventoryActions from "@/components/inventory/InventoryActions";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryProductModal from "@/components/inventory/InventoryProductModal";
import DeleteConfirmationModal from "@/components/inventory/DeleteConfirmationModal";
import WeeklyReportModal from "@/components/inventory/WeeklyReportModal";
import { SpinnerDemo } from "../ui/spinnerLoader";
import UniversalHeader from "../ui/UniversalHeader";

type InventorySaveData = Omit<InventoryItem, "id"> & { id?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatInventoryItem(raw: any): InventoryItem {
  return {
    id: raw.item_id,
    product: raw.item_name,
    category: raw.item_category,
    stock: raw.stock,
    item_threshold: raw.item_threshold,
    status: raw.stock_status,
    cost: `PHP ${raw.item_cost}`,
  };
}

export default function InventoryClient() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<InventoryItem | null>(
    null);
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(
    null
  );
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);

      // --- Local Storage Cache Check ---
      const cached = localStorage.getItem("inventory-cache");
      if (cached) {
        setInventoryData(JSON.parse(cached));
      }

      const response = await fetch("/api/inventory/getItem", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch items");
      const json = await response.json();

      const formatted = json.map(formatInventoryItem);

      // Update cache only if data changed
      if (JSON.stringify(formatted) !== JSON.stringify(cached)) {
        localStorage.setItem("inventory-cache", JSON.stringify(formatted));
        setInventoryData(formatted);
      }
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

      if (!response.ok) {
        const errText = await response.text();
        console.error("Create item error response:", errText);
        throw new Error("Failed to create product");
      }

      const result = await response.json();
      const newItem = formatInventoryItem(result.data[0]);

      setInventoryData((prev) => {
        const updated = [newItem, ...prev];

        // --- Update Local Storage Cache ---
        localStorage.setItem("inventory-cache", JSON.stringify(updated));

        return updated;
      });

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

      setInventoryData((prev) => {
        const newList = prev.map((item) =>
          item.id === updated.id ? updatedItem : item
        );

        // --- Update Local Storage Cache ---
        localStorage.setItem("inventory-cache", JSON.stringify(newList));

        return newList;
      });

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

      setInventoryData((prev) => {
        const newList = prev.filter(
          (item) => item.id !== productToDelete.id
        );

        // --- Update Local Storage Cache ---
        localStorage.setItem("inventory-cache", JSON.stringify(newList));

        return newList;
      });

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
          : item.status === activeStatusFilter
      )
      .filter(
        (item) =>
          item.product.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
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
      <UniversalHeader pageName1="Inventory" pageName2="Management" />
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
