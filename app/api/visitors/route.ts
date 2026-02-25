import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Insert a new page view record every time (no unique check)
    const { error: insertError } = await supabase.from("site_stats").insert([
      {
        visitor_ip:
          request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
        page_path: "/",
        created_date: today,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
    }

    // Count total page views (all time)
    const { count: totalCount, error: totalError } = await supabase
      .from("site_stats")
      .select("*", { count: "exact", head: true });

    if (totalError) throw totalError;

    // Count page views for today
    const { count: todayCount, error: todayError } = await supabase
      .from("site_stats")
      .select("*", { count: "exact", head: true })
      .gte("visited_at", `${today}T00:00:00`);

    if (todayError) throw todayError;

    return NextResponse.json({
      totalVisitors: totalCount || 0,
      todayVisitors: todayCount || 0,
      success: true,
    });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { error: "Failed to track visitor", success: false },
      { status: 500 },
    );
  }
}
