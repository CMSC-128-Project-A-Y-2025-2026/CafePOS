import { createClient } from "#/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const body = await request.json();
    const { item, quantity } = body;

    if (!item || !quantity)
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );

    const { error } = await supabase.from("product_items_needed").insert({
      product_id: id,
      item_id: item,
      quantity_needed: quantity,
    });

    if (error) throw error;

    return NextResponse.json(
      { message: "Successfully linked product and inventory item" },
      { status: 200 },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Internal server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const { error } = await supabase
      .from("product_items_needed")
      .delete()
      .eq("product_id", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Cleared all links." },
      { status: 200 },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Internal server error." },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from("product_items_needed")
      .select("*")
      .eq("product_id", id);

    if (error) throw error;

    return NextResponse.json(
      { data },
      { status: 200 },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Internal server error." },
      { status: 500 },
    );
  }
}
