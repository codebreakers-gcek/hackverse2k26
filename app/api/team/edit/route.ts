import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "Squad detail editing has been officially closed. No further changes can be submitted.",
    },
    { status: 403 }
  );
}

