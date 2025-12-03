import { createClient } from "#/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    

    const { data, error } = await supabase.from("inventory").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message || "Failed to fetch inventory" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("[Inventory GET Error]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}