import { NextResponse } from "next/server";

import { getSitesForClient } from "@/lib/notion-sync";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await getSitesForClient();
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        sites: [],
        source: "unavailable" as const,
        syncedAt: null,
        error: "sites-unavailable",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
