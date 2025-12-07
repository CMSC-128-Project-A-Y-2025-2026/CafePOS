import { createClient } from "#/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("product_name");

    if (productsError) throw productsError;

    // Get all product-ingredient relationships
    const { data: productItems, error: productItemsError } = await supabase
      .from("product_items_needed")
      .select("product_id, item_id, quantity_needed");

    if (productItemsError) throw productItemsError;

    // Get all inventory items
    const { data: inventory, error: inventoryError } = await supabase
      .from("inventory")
      .select("item_id, item_name, stock, stock_status, item_threshold");

    if (inventoryError) throw inventoryError;

    // Create a map for quick inventory lookup
    const inventoryMap = new Map(
      inventory?.map((item) => [item.item_id, item]) || []
    );

    // Enhance products with stock status
    const productsWithStock = products?.map((product) => {
      const ingredients = productItems?.filter(
        (pi) => pi.product_id === product.id
      ) || [];

      const ingredientDetails = ingredients.map((ing) => {
        const inventoryItem = inventoryMap.get(ing.item_id);
        return {
          item_id: ing.item_id,
          item_name: inventoryItem?.item_name || "Unknown",
          stock: inventoryItem?.stock || 0,
          stock_status: inventoryItem?.stock_status || "unknown",
          item_threshold: inventoryItem?.item_threshold || 0,
          quantity_needed: ing.quantity_needed,
        };
      });

      const hasLowStock = ingredientDetails.some(
        (ing) => ing.stock_status === "low stock"
      );
      const hasOutOfStock = ingredientDetails.some(
        (ing) => ing.stock_status === "out of stock"
      );

      return {
        ...product,
        hasLowStock,
        hasOutOfStock,
        ingredients: ingredientDetails,
      };
    }) || [];

    return NextResponse.json({ data: productsWithStock });
  } catch (error) {
    console.error("Error fetching products with stock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
