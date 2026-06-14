"use client";

import { useMemo, useState } from "react";

import SongStage from "@/components/song-stage";

type Choice = "yes" | "no";
type Stage =
  | "questions"
  | "goodbye-talk"
  | "goodbye-mind"
  | "video"
  | "slides"
  | "timeline"
  | "letters"
  | "songs"
  | "final";

type Question = {
  id: "talk" | "week" | "sure";
  prompt: string;
  note: string;
};

type TimelineMoment = {
  id: string;
  label: string;
  title: string;
  detail: string;
};

type Letter = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
};

const eraBracelet = [
  "Fearless",
  "Red",
  "1989",
  "Lover",
  "Folklore",
  "Midnights",
];

const hiddenNotes = [
  "look for the number she would smile at first",
  "hide one line about her favorite little habit",
  "mention the place that always reminds you of her",
  "leave one detail only the two of you would catch",
];

const questions: Question[] = [
  {
    id: "talk",
    prompt: "Did you have the talk you were to have?",
    note: "Take your time. This page waits for you.",
  },
  {
    id: "week",
    prompt: "Are you okay with the one week thing?",
    note: "No pressure, only honesty.",
  },
  {
    id: "sure",
    prompt: "Are you really sure?",
    note: "This is me making sure your yes is a real yes.",
  },
];

const slides = [
  {
    title: "A Soft Start",
    text: "This whole little corner of the internet is here because you matter to me in a way that is calm, deep, and impossible to explain in one sentence.",
  },
  {
    title: "What I Hope You Feel",
    text: "I hope this feels thoughtful, safe, and warm. Something you can open slowly and sit with when you want to hear me out.",
  },
  {
    title: "Why I Made This",
    text: "I wanted more than a text and more than one conversation. I wanted something that could hold memories, honesty, and the version of us that still makes me smile.",
  },
  {
    title: "Whatever Happens",
    text: "My favourite part has always been you. Everything else here is just me trying to say that beautifully.",
  },
];

const timelineMoments: TimelineMoment[] = [
  {
    id: "m1",
    label: "01",
    title: "The Beginning",
    detail:
      "Use this space for the first moment that felt special. A first conversation, first joke, first instant of comfort, or the first time she really stuck in your head.",
  },
  {
    id: "m2",
    label: "02",
    title: "The Turning Point",
    detail:
      "Add the memory where things started to feel real. Something small, but unforgettable. The kind of moment that became important after the fact.",
  },
  {
    id: "m3",
    label: "03",
    title: "The Favourite Memory",
    detail:
      "Make this one vivid. A place, a look, a laugh, a late-night talk, or a simple day that somehow became one of your favourites together.",
  },
  {
    id: "m4",
    label: "04",
    title: "This Chapter",
    detail:
      "This node can hold what this week means to you. Honest, gentle, and hopeful. A reminder that this page is part of a bigger story, not the whole thing.",
  },
];

const letters: Letter[] = [
  {
    id: "l1",
    title: "If You Open This First",
    excerpt: "A simple letter that feels like taking a deep breath.",
    body:
      "I made this because I wanted to say things with care. Not rushed, not half-typed, not lost in a moment. Just clearly, gently, and in a way you could come back to whenever you wanted.",
  },
  {
    id: "l2",
    title: "What I Appreciate About You",
    excerpt: "A place for the traits, habits, and tiny things you adore.",
    body:
      "This section is perfect for the details you notice: the way she reassures people, the way she laughs, the way she thinks, the way she carries herself, and the tiny things that make her unmistakably her.",
  },
  {
    id: "l3",
    title: "What I Hope For",
    excerpt: "Future-facing, soft, and sincere.",
    body:
      "Write about what you hope to build, what you want to learn together, and what kind of gentleness you want to protect between you both. Keep it honest and calm.",
  },
];

const goodbyeMessages = {
  talk: {
    title: "Come back once you've had that talk.",
    copy:
      "This page will still be here. No rush, no guilt, no pressure. Just come back when the conversation has happened and your heart feels ready.",
  },
  mind: {
    title: "If you ever change your mind, come back to this page.",
    copy:
      "Take care of yourself, be gentle with your heart, and know that this was made with love. Goodbye for now.",
  },
};

const revealStages: Exclude<Stage, "questions" | "goodbye-talk" | "goodbye-mind">[] = [
  "video",
  "slides",
  "timeline",
  "letters",
  "songs",
  "final",
];

async function trackAnswer({
  questionId,
  answer,
  sessionId,
}: {
  questionId: string;
  answer: Choice;
  sessionId: string;
}) {
  const response = await fetch("/api/answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      questionId,
      answer,
      sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not save this answer.");
  }
}

function AnswerButton({
  label,
  onClick,
  variant = "primary",
  disabled,
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  const classes =
    variant === "primary"
      ? "bg-white text-rose-950 hover:bg-rose-50"
      : "border border-white/30 bg-white/10 text-white hover:bg-white/15";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full px-6 py-4 text-sm font-semibold tracking-[0.18em] uppercase transition disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32 sm:w-auto sm:py-3 ${classes}`}
    >
      {label}
    </button>
  );
}

function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur sm:rounded-[2.5rem] sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,182,214,0.16),transparent)]" />
        <div className="pointer-events-none absolute right-5 top-5 flex gap-1 opacity-35">
          {Array.from({ length: 13 }).map((_, index) => (
            <span
              key={`thirteen-${index}`}
              className="h-1.5 w-1.5 rounded-full bg-white"
            />
          ))}
        </div>
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.45em] text-rose-200/75">{eyebrow}</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-white/70 sm:mt-5 sm:text-base sm:leading-8">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {eraBracelet.map((era) => (
              <span
                key={era}
                className="rounded-full border border-white/12 bg-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-white/75"
              >
                {era}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}

function PlaceholderVideo({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-72 w-full flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/30 p-6 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:min-h-80 sm:rounded-[2rem] sm:p-8">
      <p className="text-xs uppercase tracking-[0.4em] text-rose-200/70">Video Slot</p>
      <h3 className="mt-4 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">{description}</p>
    </div>
  );
}

function PinGate({
  pin,
  onUnlock,
}: {
  pin: string;
  onUnlock: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (value === pin) {
      setError("");
      onUnlock();
      return;
    }

    setError("That PIN is not right yet.");
  }

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center px-4 py-6 sm:px-6 sm:py-16">
      <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[#160812]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur sm:rounded-[2rem] sm:p-10">
        <p className="text-center text-xs uppercase tracking-[0.45em] text-rose-200/70">
          Private Entry
        </p>
        <h1 className="mt-4 text-center text-3xl font-semibold text-white sm:text-5xl">
          Enter the PIN
        </h1>
        <p className="mt-4 text-center text-sm leading-7 text-white/70 sm:mt-5 sm:text-base sm:leading-8">
          This page opens only with the right code.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="PIN"
            className="w-full rounded-full border border-white/15 bg-[#1b0a15] px-5 py-4 text-center text-base tracking-[0.35em] text-white outline-none placeholder:tracking-[0.25em] placeholder:text-white/35 sm:text-lg sm:tracking-[0.4em]"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-950 transition hover:bg-rose-50"
          >
            Open
          </button>
        </form>

        {error ? <p className="mt-4 text-center text-sm text-rose-200">{error}</p> : null}
      </div>
    </section>
  );
}

function GoodbyeCard({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-4 py-6 sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/15 bg-[#160812]/90 p-6 text-center shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur sm:rounded-[2rem] sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-rose-200/70">A Little Note</p>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">{title}</h1>
        <p className="mt-5 text-sm leading-7 text-white/70 sm:mt-6 sm:text-base sm:leading-8">
          {copy}
        </p>
      </div>
    </section>
  );
}

function StageNavigation({
  stage,
  onBack,
  onNext,
  disableNext,
}: {
  stage: Exclude<Stage, "questions" | "goodbye-talk" | "goodbye-mind">;
  onBack: () => void;
  onNext: () => void;
  disableNext?: boolean;
}) {
  const currentIndex = revealStages.indexOf(stage);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === revealStages.length - 1;

  return (
    <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-5 sm:mt-10 sm:gap-4 sm:pt-6">
      <div className="flex w-full gap-2">
        {revealStages.map((item, index) => (
          <div
            key={item}
            className={`h-2 w-12 rounded-full ${
              index <= currentIndex ? "bg-white" : "bg-white/15"
            }`}
          />
        ))}
      </div>
      <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {!isFirst ? (
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-full border border-white/20 px-5 py-4 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto sm:py-3"
          >
            Back
          </button>
        ) : null}
        {!isLast ? (
          <button
            type="button"
            onClick={onNext}
            disabled={disableNext}
            className="w-full rounded-full bg-white px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-950 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-3"
          >
            Next Page
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function GiftExperience() {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage>("questions");
  const [selectedMomentId, setSelectedMomentId] = useState(timelineMoments[0].id);
  const [selectedLetterId, setSelectedLetterId] = useState(letters[0].id);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.sessionStorage.getItem("gift-pin-unlocked") === "true";
  });

  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const currentQuestion = questions[step];
  const selectedMoment =
    timelineMoments.find((moment) => moment.id === selectedMomentId) ?? timelineMoments[0];
  const selectedLetter =
    letters.find((letter) => letter.id === selectedLetterId) ?? letters[0];
  const currentSlide = slides[selectedSlide] ?? slides[0];

  const messageVideoUrl = process.env.NEXT_PUBLIC_MESSAGE_VIDEO_URL;
  const backgroundVideoUrl = process.env.NEXT_PUBLIC_BACKGROUND_VIDEO_URL;

  function unlockExperience() {
    window.sessionStorage.setItem("gift-pin-unlocked", "true");
    setIsUnlocked(true);
  }

  function goToNextStage() {
    const currentIndex = revealStages.indexOf(
      stage as Exclude<Stage, "questions" | "goodbye-talk" | "goodbye-mind">,
    );
    const nextStage = revealStages[currentIndex + 1];
    if (nextStage) {
      setStage(nextStage);
    }
  }

  function goToPreviousStage() {
    const currentIndex = revealStages.indexOf(
      stage as Exclude<Stage, "questions" | "goodbye-talk" | "goodbye-mind">,
    );
    const previousStage = revealStages[currentIndex - 1];
    if (previousStage) {
      setStage(previousStage);
    }
  }

  async function handleChoice(answer: Choice) {
    if (!currentQuestion || isSaving) {
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await trackAnswer({
        questionId: currentQuestion.id,
        answer,
        sessionId,
      });

      if (currentQuestion.id === "talk") {
        if (answer === "yes") {
          setStep(1);
        } else {
          setStage("goodbye-talk");
        }
      } else if (currentQuestion.id === "week") {
        if (answer === "yes") {
          setStep(2);
        } else {
          setStage("goodbye-mind");
        }
      } else {
        setStage(answer === "yes" ? "video" : "goodbye-mind");
      }
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Something went wrong while saving the answer.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isUnlocked) {
    return <PinGate pin="2526" onUnlock={unlockExperience} />;
  }

  if (stage === "goodbye-talk") {
    return (
      <GoodbyeCard
        title={goodbyeMessages.talk.title}
        copy={goodbyeMessages.talk.copy}
      />
    );
  }

  if (stage === "goodbye-mind") {
    return (
      <GoodbyeCard
        title={goodbyeMessages.mind.title}
        copy={goodbyeMessages.mind.copy}
      />
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#12030d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,140,170,0.24),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(255,210,220,0.12),_transparent_28%)]" />

      {stage === "questions" && currentQuestion ? (
        <section className="relative flex min-h-[100svh] items-center justify-center px-4 py-6 sm:px-6 sm:py-16">
          <div className="grid w-full max-w-6xl gap-6 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="mx-auto max-w-xl rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur sm:rounded-[2rem] sm:p-8">
                <p className="text-xs uppercase tracking-[0.45em] text-rose-200/75">For Her</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {eraBracelet.slice(0, 4).map((era) => (
                    <span
                      key={era}
                      className="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/72"
                    >
                      {era}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  {questions.map((question, index) => {
                    const isActive = index === step;
                    const isPast = index < step;

                    return (
                      <div
                        key={question.id}
                        className={`h-2 flex-1 rounded-full ${
                          isPast || isActive ? "bg-white" : "bg-white/15"
                        }`}
                      />
                    );
                  })}
                </div>
                <h1 className="mt-6 text-3xl font-semibold leading-tight sm:mt-8 sm:text-5xl">
                  {currentQuestion.prompt}
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:mt-5 sm:text-base sm:leading-8">
                  {currentQuestion.note}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
                  <AnswerButton
                    label={isSaving ? "Saving..." : "Yes"}
                    onClick={() => handleChoice("yes")}
                    disabled={isSaving}
                  />
                  <AnswerButton
                    label="No"
                    onClick={() => handleChoice("no")}
                    variant="secondary"
                    disabled={isSaving}
                  />
                </div>

                {statusMessage ? (
                  <p className="mt-5 text-sm text-rose-200">{statusMessage}</p>
                ) : null}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/5] max-w-[17rem] overflow-hidden rounded-[1.75rem] border border-white/12 bg-[linear-gradient(160deg,rgba(243,210,118,0.18),rgba(255,170,210,0.22),rgba(73,35,96,0.45),rgba(15,1,9,0.95))] shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:max-w-md sm:rounded-[2rem]">
                <div className="absolute inset-4 rounded-[1.25rem] border border-dashed border-white/25 sm:inset-6 sm:rounded-[1.5rem]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_28%)]" />
                <div className="absolute right-5 top-5 flex flex-wrap gap-1 opacity-55">
                  {Array.from({ length: 13 }).map((_, index) => (
                    <span key={`photo-dot-${index}`} className="h-1.5 w-1.5 rounded-full bg-white" />
                  ))}
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/10 bg-black/25 p-4 backdrop-blur sm:inset-x-10 sm:bottom-10 sm:rounded-[1.5rem] sm:p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-rose-200/80">Your Photo</p>
                  <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                    Drop your favourite picture here later.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    When you are ready, replace this with your real image in the design or turn it into a full-screen background.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {stage === "video" ? (
        <PageShell
          eyebrow="The Reveal"
          title="Okay. Then here is everything I wanted to say properly."
          description="This part stands on its own page. Her answer leads here first, then the next page opens only after the message is done."
        >
          <div className="relative isolate overflow-hidden rounded-[2rem]">
            {backgroundVideoUrl ? (
              <video
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={backgroundVideoUrl} />
              </video>
            ) : null}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,3,13,0.68),rgba(18,3,13,0.93))]" />
            <div className="grid gap-5 p-1 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                {messageVideoUrl ? (
                  <video
                    className="w-full rounded-[2rem] border border-white/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                    controls
                    preload="metadata"
                    onEnded={() => setHasVideoEnded(true)}
                  >
                    <source src={messageVideoUrl} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="space-y-4">
                    <PlaceholderVideo
                      title="Your main video message goes here."
                      description="Add a long personal recording through an external hosted MP4 URL later. For now, this slot marks the area where your message to her will play."
                    />
                    <button
                      type="button"
                      onClick={() => setHasVideoEnded(true)}
                      className="w-full rounded-full border border-white/20 px-5 py-4 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto sm:py-3"
                    >
                      Unlock the next page for now
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[2rem] sm:p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-rose-200/75">How It Works</p>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-white/70">
                  <li>Use `NEXT_PUBLIC_MESSAGE_VIDEO_URL` for the video where you speak to her.</li>
                  <li>Use `NEXT_PUBLIC_BACKGROUND_VIDEO_URL` for the looping memory montage behind this page.</li>
                  <li>The next page unlocks once the main message finishes.</li>
                </ul>
              </div>
            </div>
            <StageNavigation
              stage="video"
              onBack={goToPreviousStage}
              onNext={goToNextStage}
              disableNext={!hasVideoEnded}
            />
          </div>
        </PageShell>
      ) : null}

      {stage === "slides" ? (
        <PageShell
          eyebrow="Slides"
          title="A quieter little set of pages inside the page."
          description="Instead of one long scroll, this becomes the next stop after the video. You can turn these into the exact thoughts you want her to read."
        >
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setSelectedSlide(index)}
                  className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                    selectedSlide === index
                      ? "border-white bg-white text-[#23040f]"
                      : "border-white/12 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.35em] opacity-70">
                    Slide {index + 1}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">{slide.title}</h2>
                </button>
              ))}
            </div>

            <article className="rounded-[1.5rem] border border-white/10 bg-[#1e0a16] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:rounded-[2rem] sm:p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-rose-200/75">
                Current Slide
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">
                {currentSlide.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/70 sm:mt-6 sm:text-base sm:leading-8">
                {currentSlide.text}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedSlide((value) => Math.max(0, value - 1))}
                  disabled={selectedSlide === 0}
                  className="w-full rounded-full border border-white/20 px-5 py-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:py-3"
                >
                  Previous Slide
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSlide((value) => Math.min(slides.length - 1, value + 1))
                  }
                  disabled={selectedSlide === slides.length - 1}
                  className="w-full rounded-full border border-white/20 px-5 py-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:py-3"
                >
                  Next Slide
                </button>
              </div>
            </article>
          </div>
          <StageNavigation stage="slides" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {stage === "timeline" ? (
        <PageShell
          eyebrow="Timeline"
          title="A tiny map of your story."
          description="This now lives on its own page too, so each part of the experience feels intentional instead of all arriving at once."
        >
          <div className="grid gap-5 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[2rem] sm:p-8">
              <div className="relative flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                {timelineMoments.map((moment, index) => (
                  <div key={moment.id} className="flex items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedMomentId(moment.id)}
                      className={`flex h-14 w-14 items-center justify-center rounded-full border text-sm font-semibold transition ${
                        selectedMomentId === moment.id
                          ? "border-white bg-white text-[#290312]"
                          : "border-white/20 bg-white/5 text-white hover:bg-white/12"
                      }`}
                    >
                      {moment.label}
                    </button>
                    {index < timelineMoments.length - 1 ? (
                      <div className="h-px flex-1 bg-white/18 sm:w-20 sm:flex-none" />
                    ) : null}
                  </div>
                ))}
              </div>

              <article className="mt-6 rounded-[1.25rem] border border-white/10 bg-[#180813] p-5 sm:mt-8 sm:rounded-[1.5rem] sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-rose-200/75">
                  Selected Moment
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {selectedMoment.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">{selectedMoment.detail}</p>
              </article>
            </div>

            <div className="flex items-center rounded-[1.5rem] border border-white/10 bg-[#1b0914] p-5 sm:rounded-[2rem] sm:p-8">
              <p className="text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                Replace these four nodes with real memories and this page becomes one of the
                sweetest parts of the whole experience.
              </p>
            </div>
          </div>
          <StageNavigation stage="timeline" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {stage === "letters" ? (
        <PageShell
          eyebrow="Letters"
          title="A portfolio of little notes from you."
          description="Each letter now gets breathing room on its own screen in the journey, while still letting her switch between notes inside this page."
        >
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4">
              {letters.map((letter) => (
                <button
                  key={letter.id}
                  type="button"
                  onClick={() => setSelectedLetterId(letter.id)}
                  className={`rounded-[1.5rem] border p-6 text-left transition ${
                    selectedLetterId === letter.id
                      ? "border-white bg-white text-[#23040f]"
                      : "border-white/12 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.35em] opacity-70">Letter</p>
                  <h2 className="mt-3 text-2xl font-semibold">{letter.title}</h2>
                  <p className="mt-3 text-sm leading-7 opacity-80">{letter.excerpt}</p>
                </button>
              ))}
            </div>

            <article className="rounded-[1.5rem] border border-white/12 bg-[#fff8fb] p-5 text-[#290312] shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:rounded-[2rem] sm:p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-[#7f3658]">Open Letter</p>
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">{selectedLetter.title}</h2>
              <p className="mt-5 text-sm leading-7 text-[#4a1d32] sm:mt-6 sm:text-base sm:leading-8">
                {selectedLetter.body}
              </p>
            </article>
          </div>
          <StageNavigation stage="letters" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {stage === "songs" ? (
        <PageShell
          eyebrow="Songs"
          title="A little music page made just for her."
          description="This is where your sung songs can live, with a Spotify-style player feel and lyrics that light up while you sing."
        >
          <SongStage />
          <StageNavigation stage="songs" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {stage === "final" ? (
        <PageShell
          eyebrow="Last Page"
          title="Add one final note here that feels like the quiet end of a good letter."
          description="This is the closing page now, not the bottom of a long scroll. It can hold your softest final sentence."
        >
          <div className="space-y-5">
            <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,245,248,0.12),rgba(255,255,255,0.04))] p-6 text-center backdrop-blur sm:rounded-[2.5rem] sm:p-14">
              <p className="mx-auto max-w-3xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                Something warm. Something real. Something that feels like you. This section is a
                good place for a last promise, a thank you, or simply a sentence that she will
                remember long after she closes the page.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {hiddenNotes.map((note, index) => (
                <div
                  key={note}
                  className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/55">
                    secret note 0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{note}</p>
                </div>
              ))}
            </div>
          </div>
          <StageNavigation stage="final" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}
    </div>
  );
}
