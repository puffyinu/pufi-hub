import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "World verification endpoint is under development.",
    },
    {
      status: 501,
    }
  );
}