import { NextResponse } from "next/server";
import { validateWorldServerConfig } from "@/app/config/worldServer";
import {
  createNonce,
  createTimestamp,
  createExpiration,
} from "@/app/services/worldNonce";
import type { RpContext } from "@/app/types/rpContext";

export async function GET() {
  if (!validateWorldServerConfig()) {
    return NextResponse.json(
      {
        success: false,
        error: "WORLD_RP_SIGNING_KEY is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  const rpContext: RpContext = {
  rp_id: process.env.NEXT_PUBLIC_WORLD_RP_ID ?? "",
  nonce: createNonce(),
  created_at: createTimestamp(),
  expires_at: createExpiration(),
  signature: "",
};

return NextResponse.json({
  success: true,
  rpContext,
});
}