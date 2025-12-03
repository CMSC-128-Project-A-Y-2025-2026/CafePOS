import { createClient } from "#/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const body = await request.json();
    const { order_price } = body;
    const { error } = await supabase
      .from("sales_by_time")
      .insert({ order_price: order_price });

    if (error) throw new Error();

    return NextResponse.json(
      { message: "Sale added to logs successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to add sale to logs" },
      { status: 500 },
    );
  }
}
