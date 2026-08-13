import { NextRequest, NextResponse } from "next/server";
import { processDailyClaim } from "@/app/services/dailyClaimEngineDb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const walletAddress = body?.walletAddress as string | undefined;

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: "walletAddress is required." },
        { status: 400 }
      );
    }

    const result = await processDailyClaim(walletAddress);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[API /claim/daily] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { getSupabaseAdmin } = await import("@/app/services/supabaseAdmin");
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress")?.toLowerCase();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: "walletAddress is required." },
        { status: 400 }
      );
    }

    const cooldownHours = 24;
    const cooldownMs = cooldownHours * 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - cooldownMs).toISOString();

    const { data: recentClaims, error } = await supabaseAdmin
      .from("daily_claims")
      .select("claimed_at")
      .eq("wallet_address", walletAddress)
      .gte("claimed_at", cutoff)
      .order("claimed_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("[API /claim/daily GET] Database error:", error);
      return NextResponse.json(
        { success: false, error: "Database error." },
        { status: 500 }
      );
    }

    if (recentClaims && recentClaims.length > 0) {
      const lastClaimedAt = new Date(recentClaims[0].claimed_at);
      const nextClaimAt = new Date(lastClaimedAt.getTime() + cooldownMs);
      return NextResponse.json({
        success: true,
        claimed: true,
        nextClaimAt: nextClaimAt.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      claimed: false,
    });
  } catch (error) {
    console.error("[API /claim/daily GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
