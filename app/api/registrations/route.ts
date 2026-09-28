import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "Sorry, registration is closed. We will happy to see you in next year.",
    },
    { status: 403 }
  );
}
