"use client";

import { useMemo, useState } from "react";

type Choice = "yes" | "no";
type Stage =
  | "questions"
  | "goodbye-talk"
  | "goodbye-mind"
  | "video"
  | "slides"
  | "understand"
  | "changed"
  | "not-asking"
  | "one-week"
  | "try-again"
  | "one-chance"
  | "letters"
  | "final";

type Question = {
  id: "talk" | "week" | "sure";
  prompt: string;
  note: string;
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
  "some endings only look final when you read them too quickly.",
  "maybe some hearts just take the long road back to each other.",
  "if this becomes a second beginning, let it be softer than the first.",
  "I am not asking for forever tonight, only for one honest try.",
];

const finalPageMessage =
  "I know you wanted a fresh start to things, and I really do understand that.\n\nBut if even a small part of you is still open to this, I honestly believe it could be different now. Enough time has passed for both of us to change, learn, and see things more clearly.\n\nI am not asking for something big all at once. I am only asking for one honest week. One week to talk properly, to notice how it feels, and to see whether there is still something here that feels peaceful, real, and worth choosing.\n\nIf it feels right, we continue. If it does not, we let it go gently and with clarity. I just do not want us to walk away from something that could still be beautiful without giving it one fair chance.";

const questions: Question[] = [
  {
    id: "talk",
    prompt: "Did you have the talk you were to have?",
    note: "Take your time. Nothing here is rushing you.",
  },
  {
    id: "week",
    prompt: "Are you okay with the one week thing?",
    note: "No pressure at all. I only want the most honest answer from you.",
  },
  {
    id: "sure",
    prompt: "Are you really sure?",
    note: "This is me pausing for one second and asking with my whole heart.",
  },
];

const slides = [
  {
    title: "I Love You",
    text: "Let me remove the word 'love' between I and You.\n\nHow can love follow the word I?\nAnd how can it come before You?\n\nAs when there's love, what else is there except love?\n\nAnd when there is You, I forget about myself and even about love itself.",
  },
  {
    title: "What I Hope Reaches You",
    text: "I hope this feels gentle.\nI hope it feels sincere.\nMore than anything, I hope it feels like being seen with care by someone who truly means every word.",
  },
  {
    title: "Why I Made This",
    text: "I did not want to say any of this in a rushed way.\n\nI wanted one place for the tenderness, the honesty, and all the little things about you that stay with me longer than they should.",
  },
  {
    title: "Whatever Happens",
    text: "Whatever this becomes, I wanted there to be one place where you could clearly see this:\n\nyou have been deeply, quietly, and beautifully important to me.\n\nThat part has always been true.",
  },
];

const reflectionPages = {
  understand: {
    eyebrow: "Understanding",
    title: "What I Understand Now",
    description:
      "I know things cannot restart by pretending the past did not happen, and I am not trying to do that here.",
    body: [
      "What went wrong before cannot be fixed by pretty words alone. I understand that more clearly now than I did then.",
      "I understand that hurt changes the way trust feels. Even if care is still there, safety does not automatically come back just because two people miss each other.",
      "I also understand that some of what became heavy between us was not just circumstance. It was timing, communication, the things left unsaid, and the softness we did not always protect well enough.",
    ],
  },
  changed: {
    eyebrow: "Change",
    title: "What Has Changed In Me",
    description:
      "I do not want to say I have changed without telling you what that actually means.",
    body: [
      "I think more before I react now. I have become less interested in being right and more interested in being clear, calm, and kind.",
      "I understand communication differently now. Not just saying what I feel, but saying it in a way that does not make the other person carry unnecessary weight.",
      "I have more patience than I used to, and more perspective too. Enough to know that if something matters, it should feel steady, not chaotic.",
    ],
    bullets: [
      "More patience, less impulse.",
      "More honesty, less avoidance.",
      "More listening, less trying to control the outcome.",
      "More care for how something feels on your side, not only mine.",
    ],
  },
  "not-asking": {
    eyebrow: "No Pressure",
    title: "What I Am Not Asking From You",
    description:
      "I want this to feel peaceful, not heavy, so this part matters to me a lot.",
    body: [
      "I am not asking for pressure.",
      "I am not asking for an instant answer.",
      "I am not asking you to ignore what happened or pretend the past did not matter.",
    ],
    bullets: [
      "I am not asking you to carry my emotions for me.",
      "I am not asking you to say yes out of guilt, history, or softness alone.",
      "I am not asking for something dramatic. Just something honest.",
    ],
  },
  "one-week": {
    eyebrow: "One Week",
    title: "Why One Week",
    description:
      "Not as a trap. Not as pressure. Just as a small, fair amount of time to see what is actually here now.",
    body: [
      "One week feels fair because it is enough time to notice whether something feels lighter, safer, calmer, and more real than before.",
      "It is not forever. It is not a promise. It is not me trying to lock you into anything.",
      "It is simply one honest week to see whether there is still something here worth protecting, and whether it feels like it is moving in a good direction.",
    ],
  },
  "try-again": {
    eyebrow: "If We Try Again",
    title: "If We Try Again, I Want It To Feel Like This",
    description:
      "This is the version of it I would want. Not loud. Not messy. Just good in the ways that matter.",
    body: [
      "Safe.",
      "Calm.",
      "Honest.",
      "Gentle.",
      "No games.",
      "No forcing.",
    ],
    bullets: [
      "Space to speak honestly.",
      "Care without confusion.",
      "Effort without pressure.",
      "Closeness without chaos.",
    ],
  },
  "one-chance": {
    eyebrow: "One Chance",
    title: "If I Could Ask For Just One Chance",
    description:
      "This is the most sincere version of what I want to say.",
    body: [
      "I still care because what I feel for you did not disappear just because time passed. It changed shape maybe, but it never stopped being real to me.",
      "What I learned is that care is not enough by itself. It has to come with steadiness, patience, honesty, and the ability to make the other person feel safe.",
      "Why I think this could be different now is not only because I want it. It is because I genuinely think we are not the exact same people we were before, and that matters.",
      "And if you still say no, I want you to know you would be safe doing that too. I would respect it. Because if this ever happens again, I want it to be chosen freely, not emotionally forced.",
    ],
  },
} as const;

const letters: Letter[] = [
  {
    id: "l1",
    title: "If You Read This Slowly",
    excerpt: "The soft beginning. The part where I just tell the truth.",
    body:
      "I made this because I wanted to give my feelings somewhere gentler to live. Not inside a rushed paragraph. Not inside an awkward conversation. Just here, with enough room for me to tell you that you matter to me in a way that has stayed quiet, constant, and very real.",
  },
  {
    id: "l2",
    title: "What Stays With Me About You",
    excerpt: "The details that sound small until you realize they are not.",
    body:
      "It is the small things for me. The way you carry yourself. The way your presence changes the feeling of a room. The softness in the way you are, even when you are trying not to show it. Some people are easy to admire, but somehow you are also impossible not to miss after. There is something about you that lingers.",
  },
  {
    id: "l3",
    title: "One Note I Needed You To Read",
    excerpt: "The most delicate thing I wanted to leave with you.",
    body:
      `"I love you

Let me remove the word 'love' between I and You.

How can love follow the word I?
And how can it come before You?

As when there's love, what else is there except love?

And when there is You, I forget about myself and even about love itself."`,
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
  "understand",
  "changed",
  "not-asking",
  "one-week",
  "try-again",
  "one-chance",
  "letters",
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
      ? "liquid-pill border border-white/20 bg-white/14 text-white hover:bg-white/20"
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
    <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-4">
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
            className="liquid-pill w-full rounded-full border border-white/20 bg-white/14 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-3"
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
  const [selectedLetterId, setSelectedLetterId] = useState(letters[0].id);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const currentQuestion = questions[step];
  const selectedLetter =
    letters.find((letter) => letter.id === selectedLetterId) ?? letters[0];
  const currentSlide = slides[selectedSlide] ?? slides[0];
  const currentReflectionPage =
    stage in reflectionPages
      ? reflectionPages[stage as keyof typeof reflectionPages]
      : null;

  const messageVideoUrl = process.env.NEXT_PUBLIC_MESSAGE_VIDEO_URL;
  const backgroundVideoUrl = process.env.NEXT_PUBLIC_BACKGROUND_VIDEO_URL;
  const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK;
  const spotifyPlaylistLink = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_LINK;

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
          title="Welcome. You have no idea how much it means to me that you are here."
          description="If you stayed and said yes all the way here, thank you. What comes next is just me trying to say everything a little more carefully, a little more clearly, and with all the sincerity I have."
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
              </div>
            </div>
          </div>
          <StageNavigation
            stage="video"
            onBack={goToPreviousStage}
            onNext={goToNextStage}
            disableNext={!hasVideoEnded}
          />
        </PageShell>
      ) : null}

      {stage === "slides" ? (
        <PageShell
          eyebrow="Slides"
          title="The things I wanted you to feel, one page at a time."
          description="Not rushed. Not crowded. Just a few small pages for the parts that matter most to me."
        >
          <article className="liquid-panel mx-auto max-w-4xl rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10">
            <p className="text-xs uppercase tracking-[0.35em] text-rose-200/75">
              Slide {selectedSlide + 1} of {slides.length}
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">
              {currentSlide.title}
            </h2>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/78 sm:mt-6 sm:text-base sm:leading-8">
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
          <StageNavigation stage="slides" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {stage === "letters" ? (
        <PageShell
          eyebrow="Letters"
          title="The letters I would rather hand to you slowly."
          description="This is the softer part. The part that sounds most like me when I stop trying too hard and just tell the truth."
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
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#4a1d32] sm:mt-6 sm:text-base sm:leading-8">
                {selectedLetter.body}
              </p>
            </article>
          </div>
          <StageNavigation stage="letters" onBack={goToPreviousStage} onNext={goToNextStage} />
        </PageShell>
      ) : null}

      {currentReflectionPage ? (
        <PageShell
          eyebrow={currentReflectionPage.eyebrow}
          title={currentReflectionPage.title}
          description={currentReflectionPage.description}
        >
          <div className="liquid-panel mx-auto max-w-4xl rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10">
            <div className="space-y-5">
              {currentReflectionPage.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="whitespace-pre-line text-sm leading-7 text-white/80 sm:text-base sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {"bullets" in currentReflectionPage ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {currentReflectionPage.bullets.map((point) => (
                  <div key={point} className="liquid-pill rounded-[1.25rem] p-4 text-white/82">
                    {point}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <StageNavigation
            stage={stage as Exclude<Stage, "questions" | "goodbye-talk" | "goodbye-mind">}
            onBack={goToPreviousStage}
            onNext={goToNextStage}
          />
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
              <p className="mx-auto max-w-3xl whitespace-pre-line text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                {finalPageMessage}
              </p>
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-pill mt-8 inline-flex rounded-full border border-white/20 bg-white/14 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
                >
                  Text Me On WhatsApp
                </a>
              ) : null}
              {spotifyPlaylistLink ? (
                <a
                  href={spotifyPlaylistLink}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-pill mt-4 inline-flex rounded-full border border-white/20 bg-white/14 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
                >
                  Open The Playlist
                </a>
              ) : null}
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
