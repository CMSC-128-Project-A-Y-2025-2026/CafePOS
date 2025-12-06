import { createClient } from "#/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const getStatus = (stock: number, threshold: number) => {
  if (stock <= 0) return "out of stock";
  if (stock <= threshold) return "low stock";
  return "in stock";
};

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { id, product, category, stock, cost, item_threshold } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 },
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from("inventory")
      .select("item_id, stock, item_threshold")
      .eq("item_id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const newStock = stock !== undefined ? Number(stock) : existing.stock;
    const newThreshold =
      item_threshold !== undefined
        ? Number(item_threshold)
        : existing.item_threshold;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      stock_status: getStatus(newStock, newThreshold),
    };
    if (product !== undefined) updateData.item_name = product;
    if (category !== undefined) updateData.item_category = category;
    if (stock !== undefined) updateData.stock = newStock;
    if (cost !== undefined) updateData.item_cost = cost;
    if (item_threshold !== undefined) updateData.item_threshold = newThreshold;

    const { data, error } = await supabase
      .from("inventory")
      .update(updateData)
      .eq("item_id", id)
      .select();

    if (error) {
      throw new Error(error.message || "Failed to update inventory item");
    }

    if (!data || data.length === 0) {
      throw new Error("Item not found");
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Inventory PATCH Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
