import { createClient } from "#/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const getStatus = (stock: number, threshold: number) => {
  if (stock <= 0) return "out of stock";
  if (stock <= threshold) return "low stock";
  return "in stock";
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { product, category, stock, cost, item_threshold } = body;

    const stockNum = Number(stock);
    const thresholdNum = Number(item_threshold);
    const costNum = Number(cost);

    // Validate required fields
    if (
      !product ||
      !category ||
      stock === undefined ||
      cost === undefined ||
      item_threshold === undefined ||
      Number.isNaN(stockNum) ||
      Number.isNaN(thresholdNum) ||
      Number.isNaN(costNum)
    ) {
      throw new Error("Missing required fields");
    }

    const status = getStatus(stockNum, thresholdNum);

    const { data, error } = await supabase
      .from("inventory")
      .insert([
        {
          item_name: product,
          item_category: category,
          stock: stockNum,
          item_cost: costNum,
          item_threshold: thresholdNum,
          stock_status: status,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message || "Failed to create inventory item");
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Inventory POST Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
