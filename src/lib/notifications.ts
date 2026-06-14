function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendAnswerNotification({
  questionId,
  answer,
  createdAt,
  sessionId,
}: {
  questionId: string;
  answer: string;
  createdAt: string;
  sessionId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_TO_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return {
      delivered: false,
      reason: "Email is not configured.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New answer received: ${questionId} = ${answer}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #241018;">
          <h2 style="margin-bottom: 16px;">A new answer came in</h2>
          <p><strong>Question:</strong> ${escapeHtml(questionId)}</p>
          <p><strong>Answer:</strong> ${escapeHtml(answer)}</p>
          <p><strong>Time:</strong> ${escapeHtml(createdAt)}</p>
          <p><strong>Session:</strong> ${escapeHtml(sessionId)}</p>
        </div>
      `,
    }),
  });

  return {
    delivered: response.ok,
    reason: response.ok ? null : "Resend rejected the request.",
  };
}
