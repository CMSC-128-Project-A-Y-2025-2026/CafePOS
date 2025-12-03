import { createClient } from "#/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();
    console.log("Fetching raw sales data...");
    try {
        const { data, error } = await supabase.from('sales_by_time').select('*').order('created_at', { ascending: true });
        if(error) throw new Error;

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch daily analytics' }, { status: 500 })
    }
}
