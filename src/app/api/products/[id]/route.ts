import { createClient } from "#/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }){
    const supabase = await createClient();
    const { id } = await params;
    
    try{
        const body = await request.json();
        const { item, quantity } = body;

        if (!item || !quantity) throw new Error("Missing required fields.");

        const { error } = await supabase.from('product_items_needed').insert({
            product_id: id,
            item_id: item,
            quantity_needed: quantity
        });

        if(error) throw new Error("Internal server error.");
        
        return NextResponse.json({ message: "Successfully linked product and inventory item" }, { status: 200 });
    } catch(error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}