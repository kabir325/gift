import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type SubmissionEntry = {
  id: string;
  questionId: string;
  answer: "yes" | "no";
  sessionId: string;
  createdAt: string;
  userAgent: string | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ANSWERS_KEY = process.env.UPSTASH_REDIS_KEY ?? "gift:answers";
const IS_VERCEL = Boolean(process.env.VERCEL);

function hasUpstashConfig() {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

async function callUpstash(command: string[]) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    throw new Error("Upstash is not configured.");
  }

  const response = await fetch(UPSTASH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Upstash request failed.");
  }

  return (await response.json()) as { result?: unknown };
}

async function ensureLocalStore() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readLocalEntries() {
  await ensureLocalStore();
  const raw = await readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as SubmissionEntry[];
}

async function writeLocalEntries(entries: SubmissionEntry[]) {
  await ensureLocalStore();
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
}

export async function saveSubmission(entry: SubmissionEntry) {
  if (hasUpstashConfig()) {
    await callUpstash(["LPUSH", ANSWERS_KEY, JSON.stringify(entry)]);
    await callUpstash(["LTRIM", ANSWERS_KEY, "0", "249"]);

    return {
      storage: "upstash",
    };
  }

  if (IS_VERCEL) {
    return {
      storage: "disabled",
    };
  }

  const entries = await readLocalEntries();
  entries.unshift(entry);
  await writeLocalEntries(entries.slice(0, 250));

  return {
    storage: "local-file",
  };
}

export async function listSubmissions() {
  if (hasUpstashConfig()) {
    const response = await callUpstash(["LRANGE", ANSWERS_KEY, "0", "199"]);
    const result = Array.isArray(response.result) ? response.result : [];

    return result
      .map((item) => {
        if (typeof item !== "string") {
          return null;
        }

        try {
          return JSON.parse(item) as SubmissionEntry;
        } catch {
          return null;
        }
      })
      .filter((item): item is SubmissionEntry => item !== null);
  }

  if (IS_VERCEL) {
    return [];
  }

  return readLocalEntries();
}

export function getStorageMode() {
  if (hasUpstashConfig()) {
    return "upstash";
  }

  return IS_VERCEL ? "disabled" : "local-file";
}
