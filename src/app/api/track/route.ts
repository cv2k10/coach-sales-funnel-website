import { track } from "@/lib/automation";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["page_view"]);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { type?: string; path?: string };
    const type = body.type && ALLOWED.has(body.type) ? body.type : "page_view";
    const path = typeof body.path === "string" ? body.path.slice(0, 200) : null;
    if (path && !path.startsWith("/admin")) await track(type, { path: path ?? undefined });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
