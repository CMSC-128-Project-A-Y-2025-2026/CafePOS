// src/components/menu/MenuManagement.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus } from "lucide-react";

import MenuTable from "#/src/components/menu/MenuTable";
import ProductFormModal from "#/src/components/menu/ProductFormModal";
import DeleteConfirmationModal from "#/src/components/menu/DeleteConfirmationModal";
import CategoryFilterPill from "#/src/components/menu/CategoryFilterPill";
import { MenuItem } from "../../app/menu/types"; // Adjust import path
import { menuCategories } from "../../app/menu/mockData"; // Adjust import path

// Define the categories list including 'all' here for use in filtering
const filterCategories = [
  { key: "all", label: "all" },
  ...menuCategories.map((c) => ({ key: c, label: c })),
];

// We pass the font class in from the Server Component to keep it out of the client bundle
export default function MenuManagement({
  fontClassName,
}: {
  fontClassName: string;
}) {
  // --- State ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<MenuItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<MenuItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch products from database ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products/addProduct");
        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();

        // Map database fields to MenuItem interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const products: MenuItem[] = result.data.map((item: any) => {
          console.log("Database item:", item);
          console.log("ID type:", typeof item.id, "ID value:", item.id);
          return {
            id: String(item.id), // Ensure it's a string
            name: item.product_name,
            price: item.product_cost,
            category: item.product_category,
            image: "", // Placeholder for future use
          };
        });

        console.log("Mapped products:", products);
        setMenuItems(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Handlers ---
  const handleSaveProduct = async (
    newProduct: Omit<MenuItem, "id"> | MenuItem,
  ) => {
    try {
      if ("id" in newProduct) {
        // Edit existing product
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

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          try {
            const errorData = JSON.parse(errorText);
            console.error("API Error:", errorData);
          } catch {
            console.error("Could not parse error as JSON:", errorText);
          }
          throw new Error("Failed to update product");
        }

        const result = await response.json();
        console.log("Update success:", result);

        setMenuItems((currentItems) =>
          currentItems.map((item) =>
            item.id === newProduct.id ? newProduct : item,
          ),
        );
        setProductToEdit(null);
      } else {
        // Add new product
        const response = await fetch("/api/products/addProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: newProduct.name,
            category: newProduct.category,
            price: newProduct.price,
          }),
        });

        if (!response.ok) throw new Error("Failed to add product");

        const result = await response.json();
        console.log("Add product result:", result);
        const addedProduct: MenuItem = {
          id: String(result.data[0].id),
          name: result.data[0].product_name,
          price: result.data[0].product_cost,
          category: result.data[0].product_category,
          image: "",
        };

        setMenuItems((currentItems) => [addedProduct, ...currentItems]);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await fetch("/api/products/removeProduct", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productToDelete.id }),
        });

        if (!response.ok) throw new Error("Failed to delete product");

        setMenuItems((currentItems) =>
          currentItems.filter((item) => item.id !== productToDelete.id),
        );
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // --- Filtered List (Memoized for performance) ---
  const filteredMenuItems = useMemo(() => {
    return menuItems
      .filter(
        (item) =>
          activeCategoryFilter === "all" ||
          item.category === activeCategoryFilter,
      )
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [menuItems, activeCategoryFilter, searchTerm]);

  return (
    <div className={`flex flex-col flex-1 overflow-hidden ${fontClassName}`}>
      {/* Modals */}
      {(isAddModalOpen || productToEdit) && (
        <ProductFormModal
          title={productToEdit ? "Edit Menu Item" : "Add New Menu Item"}
          initialData={productToEdit || undefined}
          onClose={() => {
            setIsAddModalOpen(false);
            setProductToEdit(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {productToDelete && (
        <DeleteConfirmationModal
          productName={productToDelete.name}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Main Content Area */}
      <div className="p-6 pt-0 flex flex-col flex-1 overflow-hidden">
        {/* CONSOLIDATED ACTION BLOCK: Button and Filters stacked vertically */}
        <nav className="mb-4 flex flex-col shrink-0">
          {/* Row 1: Action Button */}
          <div className="shrink-0 mb-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#6290C3] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#1A1B41] drop-shadow-md"
            >
              <Plus size={18} />
              New Menu Item
            </button>
          </div>

          {/* Row 2: Category Filters */}
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

        {/* SEARCH BAR (Long and Wide) */}
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

        {/* Main Table (Uses internal scrolling) */}
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-lg text-gray-600">Loading products...</div>
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
