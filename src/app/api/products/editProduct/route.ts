import { createClient } from "#/utils/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    console.log("PUT Request body:", body);

    const { id, product, category, price } = body;

    if (!id || !product || !category || price == null) {
      console.log(
        "Missing fields - id:",
        id,
        "product:",
        product,
        "category:",
        category,
        "price:",
        price,
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        product_name: product,
        product_category: category,
        product_cost: parseFloat(String(price)),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        {
          error: "Database error",
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Product PUT Error", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error message:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error", message: errorMessage },
      { status: 500 },
    );
  }
}
