"use client";

import React, { useEffect, useState } from "react";
import { MenuItem } from "@/lib/types";
import { InventoryItem } from "@/lib/types";
import { menuCategories } from "@/lib/arrays";
import { Plus } from "lucide-react";
// 1. Import Sonner toast
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  } catch {}
  return Math.random().toString(36).slice(2);
}

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

  const [showDiscard, setShowDiscard] = useState(false);

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
  }, [initialData?.id]);

  function hasUnsavedChanges() {
    if (!name && !price && ingredients.length === 0) return false;
    return true;
  }

  function resetForm() {
    setName("");
    setCategory(menuCategories[0] ?? "");
    setPrice("");
    setIngredients([]);
  }

  function handleSheetOpenChange(next: boolean) {
    if (next === false) {
      if (hasUnsavedChanges()) {
        setShowDiscard(true);
        return;
      }
      resetForm();
      onClose();
    }
  }

  function confirmDiscard() {
    resetForm();
    setShowDiscard(false);
    onClose();
  }

  function cancelDiscard() {
    setShowDiscard(false);
  }

  // 2. Modified handleSubmit to trigger toasts
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure ingredients are selected
    if (ingredients.length === 0) {
      toast.warning("Incomplete Recipe", {
        description: "Please add at least one ingredient to save this product.",
      });
      return;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      ingredients: ingredients.map((i) => {
        const inv = normalizedInventory.find(
          (item) => String(item.id) === i.inventory_id,
        );

        return {
          inventory_id: String(i.inventory_id),
          quantity: Number(i.quantity),
          name: inv?.name ?? "",
        };
      }),
    };

    if (isEditMode) {
      onSave({ id: initialData!.id, ...payload });
      toast.success("Product Updated", {
        description: `${name} has been successfully modified in the menu.`,
      });
    } else {
      onSave(payload);
      toast.success("Product Created", {
        description: `${name} is now available in your store menu.`,
      });
    }
    resetForm();
    onClose();
  };

  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      { uid: makeUid(), inventory_id: "", quantity: "" },
    ]);
  }

  function updateIngredient(
    uid: string,
    field: keyof Omit<IngredientRow, "uid">,
    value: any,
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
    <>
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="w-[920px] flex flex-col max-h-screen"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? "Modify the details of this product."
                : "Add a new item to your menu."}
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 flex-1 min-h-0"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Product Name</label>
              <input
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="border rounded-md p-2"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Category</label>
              <select
                value={category}
                required
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded-md p-2"
              >
                {menuCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Price (PHP)</label>
              <input
                type="number"
                min="0"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded-md p-2"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1 min-h-0">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Ingredients</label>
                <Button type="button" variant="outline" onClick={addIngredient}>
                  <Plus size={14} /> Add
                </Button>
              </div>

              <div className="mt-3 space-y-3 overflow-y-auto pr-1">
                {ingredients.map((item) => (
                  <div
                    key={item.uid}
                    className="flex flex-col gap-2 border p-3 rounded-md"
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {normalizedInventory.find(
                            (inv) => String(inv.id) === item.inventory_id,
                          )?.label ?? "Select ingredient"}
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

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        className="flex-1 rounded-md border p-2"
                        min="0"
                        value={
                          item.quantity === "" ? "" : String(item.quantity)
                        }
                        onChange={(e) =>
                          updateIngredient(
                            item.uid,
                            "quantity",
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        required
                      />

                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded bg-red-200 text-red-700 hover:bg-red-300"
                        onClick={() => removeIngredient(item.uid)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="pt-4 flex gap-3 justify-end border-t">
              <Button
                variant="outline"
                onClick={() => handleSheetOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6290C3] hover:bg-[#1A1B41]">
                {isEditMode ? "Save Changes" : "Add Product"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDiscard}>
        <AlertDialogContent>
          <AlertDialogTitle>Discard product?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. If you close this form, all entered data
            will be lost.
          </AlertDialogDescription>

          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel onClick={cancelDiscard}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDiscard}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Discard
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}