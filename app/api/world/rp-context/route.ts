import { NextRequest, NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit-core/signing";
import {
  validateWorldServerConfig,
  WORLD_SERVER_CONFIG,
} from "@/app/config/worldServer";
import { WORLD_CONFIG } from "@/app/config/world";
import type { RpContext } from "@/app/types/rpContext";

interface RpContextRequestBody {
  action?: string;
}

export async function POST(request: NextRequest) {
  try {
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

    const body: RpContextRequestBody = await request.json().catch(() => ({}));

    const action =
      typeof body.action === "string" && body.action.trim() !== ""
        ? body.action
        : WORLD_CONFIG.action;

    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex: WORLD_SERVER_CONFIG.rpSigningKey,
      action,
    });

    const rpContext: RpContext = {
      rp_id: WORLD_CONFIG.rpId,
      nonce,
      created_at: createdAt,
      expires_at: expiresAt,
      signature: sig,
    };

    return NextResponse.json({
      success: true,
      rpContext,
    });
  } catch (error) {
    console.error("[RP-CONTEXT-ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate RP signature.",
      },
      {
        status: 500,
      }
    );
  }
}
