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
  "you somehow make softness look effortless",
  "there are songs I cannot hear normally anymore because of you",
  "you are in so many of my favorite little thoughts",
  "if this feels like a clue, it probably is meant for you",
];

const questions: Question[] = [
  {
    id: "talk",
    prompt: "Did you have the talk you were to have?",
    note: "Take your time. Nothing here is going anywhere.",
  },
  {
    id: "week",
    prompt: "Are you okay with the one week thing?",
    note: "No pressure. I just want the most honest answer from you.",
  },
  {
    id: "sure",
    prompt: "Are you really sure?",
    note: "This is just me pausing for a second and asking with my whole heart.",
  },
];

const slides = [
  {
    title: "A Soft Start",
    text: "I wanted to make you something that felt slower than a message and softer than a speech. Something you could hold for a moment and feel, not just read.",
  },
  {
    title: "What I Hope Reaches You",
    text: "I hope this feels gentle. I hope it feels sincere. More than anything, I hope it feels like being looked at with care by someone who really means it.",
  },
  {
    title: "Why I Made This",
    text: "I did not want to say any of this in a rushed way. I wanted a place for the tenderness, the honesty, and all the little things about you that stay with me longer than they should.",
  },
  {
    title: "Whatever Happens",
    text: "Whatever this becomes, I wanted there to be one place where you could clearly see this: you have been deeply, quietly, and beautifully important to me.",
  },
];

const timelineMoments: TimelineMoment[] = [
  {
    id: "m1",
    label: "01",
    title: "The First Ease",
    detail:
      "There was a point where talking to you stopped feeling ordinary and started feeling like relief. That is the moment I always come back to first.",
  },
  {
    id: "m2",
    label: "02",
    title: "The Shift",
    detail:
      "Somewhere along the way, without any warning, you became part of the way I thought about my days. It happened quietly. It mattered a lot.",
  },
  {
    id: "m3",
    label: "03",
    title: "My Favorite Version Of Us",
    detail:
      "It might be one look, one laugh, one drive, one conversation, or one completely ordinary moment that still glows in my head for no reason except that it had you in it.",
  },
  {
    id: "m4",
    label: "04",
    title: "Right Here",
    detail:
      "This part is not about forcing an ending or a promise. It is just me meeting this moment honestly and hoping you can feel how carefully I am trying to hold it.",
  },
];

const letters: Letter[] = [
  {
    id: "l1",
    title: "If You Read This Slowly",
    excerpt: "The soft beginning. The part where I just tell the truth.",
    body:
      "I made this because I wanted to give my feelings somewhere gentler to live. Not in a rushed paragraph. Not in a nervous conversation. Just here, with enough room for me to tell you that you matter to me in a way that has been growing quietly and very sincerely.",
  },
  {
    id: "l2",
    title: "What Stays With Me About You",
    excerpt: "The details that sound small until you realize they are not.",
    body:
      "It is the small things for me. The way you carry yourself. The way your presence changes the feeling of a room. The way some people are easy to admire, but somehow you are also easy to miss after. There is something about you that lingers.",
  },
  {
    id: "l3",
    title: "What I Hope For",
    excerpt: "Not pressure. Just a gentle little truth about what I want.",
    body:
      "I hope for something honest, calm, and real. Something that does not need to be loud to matter. Something where we are kind to each other, curious about each other, and careful with what we are building from the very beginning.",
  },
];

const goodbyeMessages = {
  talk: {
    title: "Come back once you've had that talk.",
    copy:
      "This will still be here when the time is right. No guilt, no pressure, no hard feelings. Just come back when that conversation has happened and your heart feels settled enough to return.",
  },
  mind: {
    title: "If you ever change your mind, come back to this page.",
    copy:
      "Take care of yourself, be gentle with your heart, and know this was made with a lot of sincerity. Goodbye for now, and thank you for getting this far.",
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

  const payload = (await response.json()) as {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error || "Could not save this answer.");
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
      ? "liquid-pill bg-white/88 text-rose-950 hover:bg-white"
      : "liquid-pill text-white hover:bg-white/15";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full px-6 py-4 text-sm font-semibold tracking-[0.18em] uppercase transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32 sm:w-auto sm:py-3 ${classes}`}
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
      <div className="liquid-panel relative w-full max-w-6xl overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-10">
        <div className="liquid-orb right-[-3rem] top-[-2rem] h-24 w-24 bg-white/20" />
        <div className="liquid-orb bottom-[-2rem] left-[-2rem] h-28 w-28 bg-rose-200/20" />
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-rose-200/75 sm:tracking-[0.38em]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-white/78 sm:mt-5 sm:text-base sm:leading-8">
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {eraBracelet.map((era) => (
              <span
                key={era}
                className="liquid-pill rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-white/75"
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
    <div className="liquid-panel flex min-h-72 w-full flex-col items-center justify-center rounded-[1.5rem] p-6 text-center sm:min-h-80 sm:rounded-[2rem] sm:p-8">
      <p className="text-xs uppercase tracking-[0.4em] text-rose-200/70">Video Slot</p>
      <h3 className="mt-4 text-xl font-semibold text-white sm:text-2xl">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">{description}</p>
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
      <div className="liquid-panel w-full max-w-md rounded-[1.75rem] p-6 sm:rounded-[2rem] sm:p-10">
        <p className="text-center text-xs uppercase tracking-[0.45em] text-rose-200/70">
          Private Entry
        </p>
        <h1 className="mt-4 text-center text-3xl font-semibold text-white sm:text-5xl">
          Enter the PIN
        </h1>
        <p className="mt-4 text-center text-sm leading-7 text-white/78 sm:mt-5 sm:text-base sm:leading-8">
          This page opens only with the right code.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="PIN"
            className="liquid-pill w-full rounded-full px-5 py-4 text-center text-base tracking-[0.35em] text-white outline-none placeholder:tracking-[0.25em] placeholder:text-white/35 sm:text-lg sm:tracking-[0.4em]"
          />
          <button
            type="submit"
            className="liquid-pill w-full rounded-full bg-white/88 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-950 transition hover:bg-white"
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
      <div className="liquid-panel w-full max-w-2xl rounded-[1.75rem] p-6 text-center sm:rounded-[2rem] sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-rose-200/70">A Little Note</p>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">{title}</h1>
        <p className="mt-5 text-sm leading-7 text-white/78 sm:mt-6 sm:text-base sm:leading-8">
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
            className="liquid-pill w-full rounded-full px-5 py-4 text-sm font-medium text-white transition hover:bg-white/12 sm:w-auto sm:py-3"
          >
            Back
          </button>
        ) : null}
        {!isLast ? (
          <button
            type="button"
            onClick={onNext}
            disabled={disableNext}
            className="liquid-pill w-full rounded-full bg-white/88 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-3"
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
          <div className="w-full max-w-2xl">
            <div className="liquid-panel mx-auto rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-8">
              <p className="text-center text-xs uppercase tracking-[0.45em] text-rose-200/75">For Her</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {eraBracelet.slice(0, 4).map((era) => (
                  <span
                    key={era}
                    className="liquid-pill rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/72"
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
              <h1 className="mt-6 text-center text-3xl font-semibold leading-tight sm:mt-8 sm:text-5xl">
                {currentQuestion.prompt}
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-7 text-white/78 sm:mt-5 sm:text-base sm:leading-8">
                {currentQuestion.note}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
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
                <p className="mt-5 text-center text-sm text-rose-200">{statusMessage}</p>
              ) : null}
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
            <div className="mx-auto max-w-4xl p-1">
              <div className="space-y-4">
                {messageVideoUrl ? (
                  <video
                    className="w-full rounded-[1.5rem] border border-white/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:rounded-[2rem]"
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

                <p className="px-1 text-center text-sm leading-7 text-white/72">
                  Stay here with this for a second. The next page opens once the video finishes.
                </p>
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
          title="The things I wanted you to feel, one page at a time."
          description="Not rushed. Not crowded. Just a few soft little pages for the parts that matter."
        >
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setSelectedSlide(index)}
                  className={`w-full rounded-[1.5rem] p-5 text-left transition ${
                    selectedSlide === index
                      ? "liquid-panel bg-white/88 text-[#23040f]"
                      : "liquid-panel text-white hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.35em] opacity-70">
                    Slide {index + 1}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">{slide.title}</h2>
                </button>
              ))}
            </div>

            <article className="liquid-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-rose-200/75">
                Now Playing
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">
                {currentSlide.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/78 sm:mt-6 sm:text-base sm:leading-8">
                {currentSlide.text}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedSlide((value) => Math.max(0, value - 1))}
                  disabled={selectedSlide === 0}
                  className="liquid-pill w-full rounded-full px-5 py-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:py-3"
                >
                  Previous Slide
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSlide((value) => Math.min(slides.length - 1, value + 1))
                  }
                  disabled={selectedSlide === slides.length - 1}
                  className="liquid-pill w-full rounded-full px-5 py-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:py-3"
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
          title="The quiet little timeline in my head."
          description="Not every important thing is dramatic. Sometimes it is just a few small moments that refuse to leave."
        >
          <div className="grid gap-5 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="liquid-panel rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8">
              <div className="relative flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                {timelineMoments.map((moment, index) => (
                  <div key={moment.id} className="flex items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedMomentId(moment.id)}
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold transition ${
                        selectedMomentId === moment.id
                          ? "liquid-pill bg-white/88 text-[#290312]"
                          : "liquid-pill text-white hover:bg-white/12"
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

              <article className="liquid-panel mt-6 rounded-[1.25rem] p-5 sm:mt-8 sm:rounded-[1.5rem] sm:p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-rose-200/75">
                  Selected Moment
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {selectedMoment.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/78">{selectedMoment.detail}</p>
              </article>
            </div>

            <div className="liquid-panel flex items-center rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-8">
              <p className="text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
                If you want this page to really land, replace each of these with one real memory:
                a moment, a place, a sentence she said, or a version of her laugh you still
                remember.
              </p>
            </div>
          </div>
          <StageNavigation stage="timeline" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {stage === "letters" ? (
        <PageShell
          eyebrow="Letters"
          title="The letters I would rather hand to you slowly."
          description="This is the softer part. The part that sounds most like me when I stop trying to be clever."
        >
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4">
              {letters.map((letter) => (
                <button
                  key={letter.id}
                  type="button"
                  onClick={() => setSelectedLetterId(letter.id)}
                  className={`rounded-[1.5rem] p-6 text-left transition ${
                    selectedLetterId === letter.id
                      ? "liquid-panel bg-white/88 text-[#23040f]"
                      : "liquid-panel text-white hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.35em] opacity-70">Letter</p>
                  <h2 className="mt-3 text-2xl font-semibold">{letter.title}</h2>
                  <p className="mt-3 text-sm leading-7 opacity-80">{letter.excerpt}</p>
                </button>
              ))}
            </div>

            <article className="liquid-panel rounded-[1.5rem] bg-[#fff8fb]/88 p-5 text-[#290312] sm:rounded-[2rem] sm:p-10">
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
          title="The songs I would choose if I had to say it in music."
          description="A little more theatrical, a little more vulnerable, and probably the page she will replay if she is smiling."
        >
          <SongStage />
          <StageNavigation stage="songs" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {stage === "final" ? (
        <PageShell
          eyebrow="Last Page"
          title="If you remember one thing from all of this, let it be this."
          description="You have been worth the effort, the thought, and every careful word I wanted to get right."
        >
          <div className="space-y-5">
            <div className="liquid-panel mx-auto max-w-5xl rounded-[1.75rem] p-6 text-center sm:rounded-[2.5rem] sm:p-14">
              <p className="mx-auto max-w-3xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                I do not know what part of this you will keep with you, but I hope it is the
                gentleness. I hope it is the care. I hope it is the feeling of being seen by
                someone who thinks you are very, very easy to care about.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {hiddenNotes.map((note, index) => (
                <div
                  key={note}
                  className="liquid-panel rounded-[1.4rem] p-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/65">
                    secret note 0{index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/80">{note}</p>
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
