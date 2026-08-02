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
