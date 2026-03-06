import { NextResponse } from "next/server";

import { getNotionSyncStatus, syncNotionSites } from "@/lib/notion-sync";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const secret = process.env.NOTION_SYNC_SECRET;
  if (!secret) return true;

  const secretFromHeader = request.headers.get("x-sync-secret");
  if (secretFromHeader && secretFromHeader === secret) return true;

  const authorization = request.headers.get("authorization");
  if (!authorization) return false;

  const [type, token] = authorization.split(" ");
  if (type?.toLowerCase() !== "bearer") return false;
  return token === secret;
}

export async function GET() {
  try {
    const status = await getNotionSyncStatus();
    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to read Notion sync status",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const forceByQuery = url.searchParams.get("force");
    const reclassifyByQuery = url.searchParams.get("reclassify");
    const body = (await request.json().catch(() => ({}))) as { force?: boolean; reclassify?: boolean };
    const force = typeof body.force === "boolean" ? body.force : forceByQuery === "1" || forceByQuery === "true";
    const reclassify =
      typeof body.reclassify === "boolean"
        ? body.reclassify
        : reclassifyByQuery === "1" || reclassifyByQuery === "true";

    const result = await syncNotionSites({ force, reclassify });
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Notion sync failed",
      },
      { status: 500 },
    );
  }
}
