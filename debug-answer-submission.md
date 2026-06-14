# Debug Session: answer-submission

- Status: OPEN
- Symptom: On the deployed site, answering the first three yes/no questions does not progress to the video page.
- Expected: Each answer should submit successfully and the flow should advance.

## Hypotheses

1. The `/api/answers` route fails on Vercel because the local file fallback cannot write to disk.
2. The client advances only after a successful submission, so any API error blocks navigation.
3. Missing deployment env vars trigger a server-side failure during submission or notification.
4. The request payload or response handling is malformed in production and prevents success.

## Evidence Log

- Code inspection: `saveSubmission()` fell back to local file storage when Upstash was missing.
- Production risk: that fallback is unsuitable for Vercel serverless deployments.
- Instrumentation added: `/api/answers` now returns `debugMessage` on failure.
- Post-fix runtime check with `VERCEL=1`:
  - `mode: "disabled"`
  - `saved.storage: "disabled"`
  - `listedCount: 0`
- Build verification: `npm run build` passed after the fix.

## Next Step

- Redeploy and verify that the question flow now advances on the deployed site.
