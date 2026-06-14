"use client";

import { useMemo, useState } from "react";

type SubmissionEntry = {
  id: string;
  questionId: string;
  answer: "yes" | "no";
  sessionId: string;
  createdAt: string;
  userAgent: string | null;
};

function formatQuestion(questionId: string) {
  switch (questionId) {
    case "talk":
      return "Did you have the talk you were to have?";
    case "week":
      return "Are you okay with the one week thing?";
    case "sure":
      return "Are you really sure?";
    default:
      return questionId;
  }
}

export default function DashboardClient() {
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState<SubmissionEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, SubmissionEntry[]>();

    for (const entry of entries) {
      const current = groups.get(entry.sessionId) ?? [];
      current.push(entry);
      groups.set(entry.sessionId, current);
    }

    return Array.from(groups.entries());
  }, [entries]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const payload = (await response.json()) as {
        error?: string;
        entries?: SubmissionEntry[];
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not open the dashboard.");
      }

      setEntries(payload.entries ?? []);
      setLoaded(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not open the dashboard.");
      setLoaded(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#11040d] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.45em] text-rose-200/70">Private Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Answer history</h1>
          <p className="mt-5 text-base leading-8 text-white/72">
            This page shows each answer saved from the site. Use your access key to unlock it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur sm:flex-row"
        >
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Dashboard access key"
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-[#1b0b15] px-5 py-3 text-white outline-none placeholder:text-white/35"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#22040f] transition hover:bg-rose-50 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Open"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}

        {loaded ? (
          <section className="mt-12 space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/72">
                Sessions tracked: <span className="font-semibold text-white">{groupedEntries.length}</span>
              </p>
              <p className="mt-2 text-sm text-white/72">
                Answers tracked: <span className="font-semibold text-white">{entries.length}</span>
              </p>
            </div>

            {groupedEntries.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white/72">
                No answers yet.
              </div>
            ) : (
              groupedEntries.map(([sessionId, sessionEntries]) => (
                <article
                  key={sessionId}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-rose-200/75">Session</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{sessionId}</h2>
                  <div className="mt-6 space-y-4">
                    {sessionEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-[1.5rem] border border-white/10 bg-[#180813] p-5"
                      >
                        <p className="text-sm font-semibold text-white">
                          {formatQuestion(entry.questionId)}
                        </p>
                        <p className="mt-2 text-sm text-white/72">
                          Answered <span className="font-semibold text-white">{entry.answer}</span> on{" "}
                          {new Date(entry.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}
