import { randomUUID } from "node:crypto";

import { sendAnswerNotification } from "@/lib/notifications";
import { getStorageMode, saveSubmission } from "@/lib/submission-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      questionId?: string;
      answer?: "yes" | "no";
      sessionId?: string;
    };

    if (!body.questionId || !body.answer || !body.sessionId) {
      return Response.json(
        { error: "Missing questionId, answer, or sessionId." },
        { status: 400 },
      );
    }

    const entry = {
      id: randomUUID(),
      questionId: body.questionId,
      answer: body.answer,
      sessionId: body.sessionId,
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    };

    const storage = await saveSubmission(entry);
    const email = await sendAnswerNotification(entry);

    return Response.json({
      ok: true,
      storage: storage.storage,
      emailDelivered: email.delivered,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Could not save the answer.",
        storage: getStorageMode(),
        debugMessage: error instanceof Error ? error.message : "Unknown submission failure.",
      },
      { status: 500 },
    );
  }
}
