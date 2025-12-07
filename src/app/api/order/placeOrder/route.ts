import { createClient } from "#/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, subtotal, discount, total, paymentMethod } = body;

    if (!items || items.length === 0 || total == null) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 },
      );
    }

    const { data: saleData, error: saleError } = await supabase
      .from("sales_by_time")
      .insert([
        {
          order_price: total,
          payment_method: paymentMethod,
        },
      ])
      .select();

    if (saleError) throw saleError;
    
    for (const item of items) {
      const { data: selectData, count, error: selectError } = await supabase
        .from("sales_analytics")
        .select("*", { count: 'exact', head: false })
        .eq("product_id", item.productId);

      if (selectError) throw selectError;

      if (count === 0){
        const { error: insertionError } = await supabase.from("sales_analytics").insert([
          {
            product_id: item.productId,
            total_sold: item.quantity,
          },
        ]);
        if (insertionError) throw insertionError;
      }
      else {
        const total_sold = selectData?.[0]?.total_sold ?? 0;
        const new_total = total_sold + item.quantity;

        const { error: updateError } = await supabase
          .from("sales_analytics")
          .update({
            total_sold: new_total
          })
          .eq("product_id", item.productId);

        if (updateError) throw updateError;
      }
    }
    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        orderId: saleData?.[0]?.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Order POST Error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
