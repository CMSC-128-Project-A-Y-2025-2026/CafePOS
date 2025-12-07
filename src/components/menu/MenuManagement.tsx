// src/components/menu/MenuManagement.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import MenuTable from "#/src/components/menu/MenuTable";
import ProductFormModal from "#/src/components/menu/ProductFormModal";
import DeleteConfirmationModal from "#/src/components/menu/DeleteConfirmationModal";
import CategoryFilterPill from "#/src/components/menu/CategoryFilterPill";
import { MenuItem, MenuItemIngredient, InventoryItem } from "@/lib/types";
import { menuCategories } from "@/lib/arrays";
import { SpinnerDemo } from "../ui/spinnerLoader";

const filterCategories = [
  { key: "all", label: "all" },
  ...menuCategories.map((c) => ({ key: c, label: c })),
];

const ingredientNameCache: Record<string, string> = {};

export default function MenuManagement({ fontClassName }: { fontClassName: string }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<MenuItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<MenuItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const LS_MENU = "menu-cache";
  const LS_INVENTORY = "inventory-cache";


  const fetchIngredientName = useCallback(async (item_id: string) => {
    if (ingredientNameCache[item_id]) {
      return ingredientNameCache[item_id];
    }

    const response = await fetch(`/api/inventory/${item_id}/name`);
    if (!response.ok) return "";

    const result = await response.json();
    const name = result[0]?.item_name || "";

    ingredientNameCache[item_id] = name;
    return name;
  }, []);


  const fetchIngredientList = useCallback(
    async (product_id: string) => {
      const response = await fetch(`/api/products/${product_id}/ingredients`);
      if (!response.ok) return [];

      const result = await response.json();
      const items = result.data || [];

      const ingredientList: MenuItemIngredient[] = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.map(async (item: any) => ({
          inventory_id: String(item.item_id),
          name: await fetchIngredientName(String(item.item_id)),
          quantity: item.quantity_needed,
        }))
      );

      return ingredientList;
    },
    [fetchIngredientName]
  );

  useEffect(() => {
    const cachedMenu = localStorage.getItem(LS_MENU);
    const cachedInventory = localStorage.getItem(LS_INVENTORY);

    if (cachedMenu) {
      try {
        setMenuItems(JSON.parse(cachedMenu));
      } catch {}
    }

    if (cachedInventory) {
      try {
        setInventoryItems(JSON.parse(cachedInventory));
      } catch {}
    }

    setIsLoading(false);

    const fetchFresh = async () => {
      try {
        const [productRes, inventoryRes] = await Promise.all([
          fetch("/api/products/getProduct", { cache: "no-store" }),
          fetch("/api/inventory/getItem", { cache: "no-store" }),
        ]);

        if (!productRes.ok || !inventoryRes.ok) throw new Error();

        const productData = await productRes.json();
        const inventoryData = await inventoryRes.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inventory: InventoryItem[] = inventoryData.map((item: any) => ({
          id: String(item.item_id),
          product: item.item_name,
          category: item.item_category,
          stock: item.stock,
          status: item.stock_status,
          cost: item.item_cost,
        }));

        localStorage.setItem(LS_INVENTORY, JSON.stringify(inventory));
        setInventoryItems(inventory);

        const products: MenuItem[] = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          productData.data.map(async (item: any) => ({
            id: String(item.id),
            name: item.product_name,
            price: item.product_cost,
            category: item.product_category,
            ingredients: await fetchIngredientList(String(item.id)),
          }))
        );

        localStorage.setItem(LS_MENU, JSON.stringify(products));
        setMenuItems(products);
      } catch {}
    };

    fetchFresh();
  }, [fetchIngredientList]);

  const handleSaveProduct = useCallback(
    async (newProduct: Omit<MenuItem, "id"> | MenuItem) => {
      try {
        let savedProductId = "0";

        if ("id" in newProduct) {
          const response = await fetch("/api/products/editProduct", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: newProduct.id,
              product: newProduct.name,
              category: newProduct.category,
              price: newProduct.price,
            }),
          });

          if (!response.ok) throw new Error();

          savedProductId = newProduct.id;

          setMenuItems((items) => {
            const updated = items.map((i) => (i.id === newProduct.id ? newProduct : i));
            localStorage.setItem(LS_MENU, JSON.stringify(updated));
            return updated;
          });

          setProductToEdit(null);
        } else {
          const response = await fetch("/api/products/addProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product: newProduct.name,
              category: newProduct.category,
              price: newProduct.price,
            }),
          });

          if (!response.ok) throw new Error();

          const result = await response.json();
          const addedProduct: MenuItem = {
            id: String(result.data[0].id),
            name: result.data[0].product_name,
            price: result.data[0].product_cost,
            category: result.data[0].product_category,
            ingredients: [],
          };

          savedProductId = addedProduct.id;

          setMenuItems((items) => {
            const updated = [addedProduct, ...items];
            localStorage.setItem(LS_MENU, JSON.stringify(updated));
            return updated;
          });

          setIsAddModalOpen(false);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ingredients = (newProduct as any).ingredients ?? [];

        for (const ingredient of ingredients) {
          await fetch(`/api/products/${savedProductId}/ingredients`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              item: ingredient.inventory_id,
              quantity: ingredient.quantity,
            }),
          });
        }
      } catch {}
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch("/api/products/removeProduct", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete.id }),
      });

      if (!response.ok) throw new Error();

      setMenuItems((items) => {
        const updated = items.filter((i) => i.id !== productToDelete.id);
        localStorage.setItem(LS_MENU, JSON.stringify(updated));
        return updated;
      });

      setProductToDelete(null);
    } catch {}
  }, [productToDelete]);

  const filteredMenuItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return menuItems
      .filter(
        (i) =>
          activeCategoryFilter === "all" || i.category === activeCategoryFilter
      )
      .filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.category.toLowerCase().includes(term)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [menuItems, activeCategoryFilter, searchTerm]);

  return (
    <div className={`flex flex-col flex-1 overflow-hidden ${fontClassName}`}>
      <ProductFormModal
        title={productToEdit ? "Edit Menu Item" : "Add New Menu Item"}
        initialData={productToEdit || undefined}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        open={isAddModalOpen || !!productToEdit}
        inventoryItems={inventoryItems}
      />

      {productToDelete && (
        <DeleteConfirmationModal
          productName={productToDelete.name}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <div className="p-6 pt-0 flex flex-col flex-1 overflow-hidden">
        <nav className="mb-4 flex flex-col shrink-0">
          <div className="shrink-0 mb-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#6290C3] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#1A1B41] drop-shadow-md"
            >
              <Plus size={18} />
              New Menu Item
            </button>
          </div>

          <div className="flex flex-wrap gap-3 pb-1">
            {filterCategories.map((cat) => (
              <CategoryFilterPill
                key={cat.key}
                categoryKey={cat.key}
                label={cat.label}
                active={activeCategoryFilter === cat.key}
                onClick={setActiveCategoryFilter}
              />
            ))}
          </div>
        </nav>

        <div className="relative mb-6 drop-shadow-[0px_2px_4px_rgba(0,0,0,0.25)] shrink-0">
          <input
            type="text"
            placeholder="Search product or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-200 bg-white p-4 pl-12 text-lg text-gray-900 placeholder-gray-500 focus:border-[#6290C3] focus:ring-[#6290C3] transition-all"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={24}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <SpinnerDemo name={"products"} />
          </div>
        ) : (
          <MenuTable
            menuItems={filteredMenuItems}
            onEdit={setProductToEdit}
            onDelete={setProductToDelete}
          />
        )}
      </div>
    </div>
  );
}
