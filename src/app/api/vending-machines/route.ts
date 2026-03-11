import { NextResponse } from "next/server";
import { z } from "zod";

const vendingMachinesQuerySchema = z.object({
  swLat: z.coerce.number().min(-90).max(90),
  swLng: z.coerce.number().min(-180).max(180),
  neLat: z.coerce.number().min(-90).max(90),
  neLng: z.coerce.number().min(-180).max(180),
});

const requestHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  origin: "https://vending.pokemon.com",
  referer: "https://vending.pokemon.com/en-us/",
  accept: "application/json, text/plain, */*",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsedQuery = vendingMachinesQuerySchema.safeParse({
    swLat: url.searchParams.get("swLat"),
    swLng: url.searchParams.get("swLng"),
    neLat: url.searchParams.get("neLat"),
    neLng: url.searchParams.get("neLng"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid bounding box parameters." },
      { status: 400 },
    );
  }

  const query = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(parsedQuery.data).map(([key, value]) => [key, String(value)]),
    ),
    unit: "Mi",
  });

  try {
    const response = await fetch(
      `https://api.vending.prod.pokemon.com/v1/machines?${query.toString()}`,
      {
        headers: requestHeaders,
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Official vending API request failed." },
        { status: response.status },
      );
    }

    const payload = await response.json();

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the official vending API." },
      { status: 502 },
    );
  }
}
