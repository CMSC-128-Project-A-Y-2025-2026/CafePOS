import { createClient } from "#/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("inventory").delete().eq("item_id", id)

    if (error) {
      return NextResponse.json({ error: error.message || "Failed to delete inventory item" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Item deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Inventory DELETE Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

