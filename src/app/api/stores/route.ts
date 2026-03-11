import { NextRequest, NextResponse } from "next/server";
import { storesQuerySchema } from "@/lib/validation";

export function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = storesQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    stores: [],
    meta: {
      ...parsed.data,
      total: 0,
    },
  });
}
