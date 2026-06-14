import { listSubmissions } from "@/lib/submission-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const expectedPassword = process.env.DASHBOARD_ACCESS_KEY;

    if (!expectedPassword) {
      return Response.json(
        {
          error: "Set DASHBOARD_ACCESS_KEY before using the dashboard.",
        },
        { status: 503 },
      );
    }

    if (!body.password || body.password !== expectedPassword) {
      return Response.json(
        {
          error: "Wrong password.",
        },
        { status: 401 },
      );
    }

    const entries = await listSubmissions();

    return Response.json({
      ok: true,
      entries,
    });
  } catch {
    return Response.json(
      {
        error: "Could not load the dashboard data.",
      },
      { status: 500 },
    );
  }
}
