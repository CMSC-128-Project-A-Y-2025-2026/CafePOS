import { createClient } from "#/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { id, product, category, stock, cost, status } = body

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {}
    if (product !== undefined) updateData.item_name = product
    if (category !== undefined) updateData.item_category = category
    if (stock !== undefined) updateData.stock = stock
    if (cost !== undefined) updateData.item_cost = cost
    if (status !== undefined) updateData.stock_status = status

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const { data, error } = await supabase.from("inventory").update(updateData).eq("item_id", id).select()

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
    )
  } catch (error) {
    console.error("[Inventory PATCH Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
