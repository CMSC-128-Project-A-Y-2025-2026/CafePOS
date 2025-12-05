"use client";

import React, { useEffect, useState } from "react";
import { MenuItem } from "../../app/menu/types";
import { InventoryItem } from "@/lib/types";
import { menuCategories } from "../../app/menu/mockData";
import { Plus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

type IngredientRow = {
  uid: string;
  inventory_id: string;
  quantity: number | "";
};

interface ProductFormModalProps {
  title: string;
  initialData?: MenuItem & {
    ingredients?: { inventory_id?: string | number; quantity?: number }[];
  };
  onClose: () => void;
  onSave: (data: Omit<MenuItem, "id"> | MenuItem) => void;
  open: boolean;
  inventoryItems: InventoryItem[];
}

function makeUid() {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return Math.random().toString(36).slice(2);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeInventoryItem(inv: any, idx: number) {
  const id = inv?.id ?? inv?.item_id ?? inv?.itemId ?? null;
  const name = inv?.item_name ?? inv?.itemName ?? inv?.product ?? `Item ${idx}`;
  const category =
    inv?.item_category ?? inv?.category ?? inv?.itemCategory ?? "";
  const optionKey = id != null ? String(id) : `${name}-${category}-${idx}`;
  const optionValue = id != null ? String(id) : `${name}-${idx}`;
  const label = category ? `${name} (${category})` : name;
  return { id, name, category, optionKey, optionValue, label };
}

export default function ProductFormModal({
  title,
  initialData,
  onClose,
  onSave,
  open,
  inventoryItems,
}: ProductFormModalProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? menuCategories[0] ?? "",
  );
  const [price, setPrice] = useState(
    initialData?.price != null ? String(initialData.price) : "",
  );
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData?.ingredients && Array.isArray(initialData.ingredients)) {
      setIngredients(
        initialData.ingredients.map((ing) => ({
          uid: makeUid(),
          inventory_id:
            ing.inventory_id != null ? String(ing.inventory_id) : "",
          quantity: typeof ing.quantity === "number" ? ing.quantity : "",
        })),
      );
    } else {
      if (!initialData) {
        setIngredients([]);
      }
    }

    setName(initialData?.name ?? "");
    setCategory(initialData?.category ?? menuCategories[0] ?? "");
    setPrice(initialData?.price != null ? String(initialData.price) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      category,
      price: Number(price),
      ingredients: ingredients.map((i) => ({
        inventory_id: String(i.inventory_id),
        quantity: Number(i.quantity),
      })),
    };

    if (isEditMode) {
      onSave({ id: initialData!.id, ...payload });
    } else {
      onSave(payload);
    }
  };

  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      {
        uid: makeUid(),
        inventory_id: "",
        quantity: "",
      },
    ]);
  }

  function updateIngredient(
    uid: string,
    field: keyof Omit<IngredientRow, "uid">,
    value: string | number | "",
  ) {
    setIngredients((prev) =>
      prev.map((it) => (it.uid === uid ? { ...it, [field]: value } : it)),
    );
  }

  function removeIngredient(uid: string) {
    setIngredients((prev) => prev.filter((i) => i.uid !== uid));
  }

  const normalizedInventory = (inventoryItems ?? []).map((inv, idx) =>
    normalizeInventoryItem(inv, idx),
  );

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-[920px] space-y-6">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>
                {isEditMode
                  ? "Modify the details of this product."
                  : "Add a new item to your menu."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Product Name</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md p-2 text-gray-900 focus:border-[#6290C3] focus:ring-[#6290C3]"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-md p-2 text-gray-900 focus:border-[#6290C3] focus:ring-[#6290C3]"
            >
              {menuCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .split("-")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Price (PHP)</label>
            <input
              type="number"
              min="0"
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded-md p-2 text-gray-900 focus:border-[#6290C3] focus:ring-[#6290C3]"
            />
          </div>

          {/* Ingredients */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Ingredients</label>
              <Button
                type="button"
                variant="outline"
                onClick={addIngredient}
                className="flex items-center gap-2"
              >
                <Plus size={14} /> Add
              </Button>
            </div>

            <div className="mt-3 space-y-3">
              {ingredients.map((item) => (
                <div
                  key={item.uid}
                  className="flex flex-col gap-2 border p-3 rounded-md"
                >
                  {(() => {
                    const selectedLabel =
                      normalizedInventory.find(
                        (inv) => String(inv.id) === item.inventory_id,
                      )?.label || "Select ingredient";

                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedLabel}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[300px]">
                          <Command>
                            <CommandInput placeholder="Search ingredient..." />
                            <CommandList>
                              {normalizedInventory.map((inv) => (
                                <CommandItem
                                  key={inv.optionKey}
                                  value={inv.name}
                                  onSelect={() =>
                                    updateIngredient(
                                      item.uid,
                                      "inventory_id",
                                      String(inv.id),
                                    )
                                  }
                                >
                                  {inv.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}

                  {/* Quantity + Remove button row */}
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      className="flex-1 rounded-md border border-gray-300 p-2 shadow-sm"
                      min="0"
                      value={item.quantity === "" ? "" : String(item.quantity)}
                      onChange={(e) => {
                        const v = e.target.value;
                        updateIngredient(
                          item.uid,
                          "quantity",
                          v === "" ? "" : Number(v),
                        );
                      }}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => removeIngredient(item.uid)}
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter className="pt-4 flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#6290C3] hover:bg-[#1A1B41]">
              {isEditMode ? "Save Changes" : "Add Product"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
