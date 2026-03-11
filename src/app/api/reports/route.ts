import { NextRequest, NextResponse } from "next/server";
import { stockReportSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = stockReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid report payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      report: {
        ...parsed.data,
        id: "pending-persistence",
      },
    },
    { status: 201 },
  );
}
