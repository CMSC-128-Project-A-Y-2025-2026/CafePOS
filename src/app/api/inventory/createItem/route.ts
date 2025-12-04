import { createClient } from "#/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { product, category, stock, cost, status = "In stock" } = body

    // Validate required fields
    if (!product || !category || stock === undefined || !cost) {
      throw new Error("Missing required fields");
    }

    const { data, error } = await supabase
      .from("inventory")
      .insert([
        {
          item_name: product,
          item_category: category,
          stock: stock,
          item_cost: cost,
          stock_status: status,
        },
      ])
      .select()

    if (error) {
       throw new Error(error.message || "Failed to create inventory item");
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Inventory POST Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}