import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/services/supabaseAdmin";

interface WalletStatusRequestBody {
  address?: string;
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const body: WalletStatusRequestBody = await request.json();
    const address = body.address?.toLowerCase();

    if (!address) {
      return NextResponse.json(
        { success: false, error: "Missing address." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("verified_wallets")
      .select("wallet_address")
      .eq("wallet_address", address)
      .maybeSingle();

    if (error) {
      console.error("[WALLET-STATUS-ERROR]", error);
      return NextResponse.json(
        { success: false, error: "Failed to check wallet status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: data !== null,
    });
  } catch (error) {
    console.error("[WALLET-STATUS-EXCEPTION]", error);
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
