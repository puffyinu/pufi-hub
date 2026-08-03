import { NextRequest, NextResponse } from "next/server";
import { WORLD_CONFIG } from "@/app/config/world";
import { recordWorldIdVerification } from "@/app/services/worldIdNullifier";

interface IDKitResponseItem {
  identifier?: string;
  nullifier?: string;
  [key: string]: unknown;
}

interface IDKitResultPayload {
  protocol_version?: string;
  action?: string;
  responses?: IDKitResponseItem[];
  [key: string]: unknown;
}

interface VerifyRequestBody {
  rp_id?: string;
  idkitResponse?: IDKitResultPayload;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequestBody = await request.json();

    if (!body.idkitResponse) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing idkitResponse.",
        },
        {
          status: 400,
        }
      );
    }

    const rpId = body.rp_id ?? WORLD_CONFIG.rpId;

    const portalResponse = await fetch(
      `https://developer.world.org/api/v4/verify/${rpId}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body.idkitResponse),
      }
    );

    if (!portalResponse.ok) {
      const errorText = await portalResponse.text().catch(() => "");
      console.error("[WORLD-VERIFY-ERROR]", portalResponse.status, errorText);
      return NextResponse.json(
        {
          success: false,
          error: "World ID verification failed.",
        },
        {
          status: 400,
        }
      );
    }

    const action = body.idkitResponse.action ?? WORLD_CONFIG.action;

    const nullifiers = (body.idkitResponse.responses ?? [])
      .map((item) => item.nullifier)
      .filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0
      );

    if (nullifiers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No nullifier returned in proof.",
        },
        {
          status: 400,
        }
      );
    }

    await recordWorldIdVerification(nullifiers, action);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[WORLD-VERIFY-EXCEPTION]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }
}
