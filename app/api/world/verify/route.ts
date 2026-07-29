import { NextRequest, NextResponse } from "next/server";

interface VerifyRequest {
  proof?: unknown;
  nullifier_hash?: string;
  merkle_root?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();

    if (!body.proof) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing proof.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: false,
      status: "pending",
      message:
        "Managed World ID verification has not been connected yet.",
    });
  } catch {
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