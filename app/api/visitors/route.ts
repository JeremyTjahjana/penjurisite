import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || request.ip || "unknown";

    // Create a hash of IP + user agent for unique visitor identification
    const userAgent = request.headers.get("user-agent") || "";
    const visitorHash = crypto
      .createHash("sha256")
      .update(ip + userAgent)
      .digest("hex")
      .substring(0, 16);

    // Check if visitor already exists today
    const today = new Date().toISOString().split("T")[0];

    const { data: existingVisitor, error: checkError } = await supabase
      .from("site_stats")
      .select("id")
      .eq("visitor_hash", visitorHash)
      .gte("visited_at", `${today}T00:00:00`)
      .single();

    // If visitor doesn't exist today, insert new record
    if (!existingVisitor && !checkError) {
      await supabase.from("site_stats").insert([
        {
          visitor_hash: visitorHash,
          visitor_ip: ip,
          page_path: "/",
          created_date: today,
        },
      ]);
    }

    // Get total unique visitors count for all time
    const { data: allVisitors, error: countError } = await supabase
      .from("site_stats")
      .select("visitor_hash", { count: "exact" });

    if (countError) throw countError;

    // Get unique visitors count for today
    const { data: todayVisitors, error: todayError } = await supabase
      .from("site_stats")
      .select("visitor_hash", { count: "exact" })
      .gte("visited_at", `${today}T00:00:00`);

    if (todayError) throw todayError;

    return NextResponse.json({
      totalVisitors: allVisitors?.length || 0,
      todayVisitors: todayVisitors?.length || 0,
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
