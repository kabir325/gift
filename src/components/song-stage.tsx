"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LyricLine = {
  time: number;
  text: string;
};

type SongPerformance = {
  id: string;
  title: string;
  artist: string;
  era: string;
  note: string;
  mediaKind: "audio" | "video";
  mediaUrl?: string;
  coverUrl?: string;
  accent: string;
  lyrics: LyricLine[];
  bracelet: string[];
};

const songs: SongPerformance[] = [
  {
    id: "song-one",
    title: "Lover Letter",
    artist: "Taylor Swift",
    era: "Lover",
    note: "A softer, pink-lit page for the first song you want to sing for her.",
    mediaKind: "audio",
    mediaUrl: process.env.NEXT_PUBLIC_SONG_ONE_URL,
    coverUrl: process.env.NEXT_PUBLIC_SONG_ONE_COVER_URL,
    accent: "from-[#d96da2] via-[#8e3d71] to-[#27111d]",
    lyrics: [
      { time: 0, text: "Start with the first line you want highlighted." },
      { time: 8, text: "Then add the second line when that part begins." },
      { time: 16, text: "Keep going line by line with real timestamps." },
      { time: 24, text: "The active lyric will glow while the song plays." },
      { time: 32, text: "You can use this for a voice note or a singing video." },
    ],
    bracelet: ["pink skies", "paper rings", "golden hour", "13"],
  },
  {
    id: "song-two",
    title: "Red Room Confession",
    artist: "Taylor Swift",
    era: "Red",
    note: "This one can hold a more dramatic or sentimental performance if that fits her taste.",
    mediaKind: "video",
    mediaUrl: process.env.NEXT_PUBLIC_SONG_TWO_URL,
    coverUrl: process.env.NEXT_PUBLIC_SONG_TWO_COVER_URL,
    accent: "from-[#7d1f21] via-[#431414] to-[#120608]",
    lyrics: [
      { time: 0, text: "Add the opening line for the second performance here." },
      { time: 7, text: "If this is a video, the lyric sync still works the same way." },
      { time: 15, text: "This makes the section feel more like a personal Spotify page." },
      { time: 23, text: "You can slow this down and make it feel very intimate." },
      { time: 31, text: "Swap every placeholder once your recordings are ready." },
    ],
    bracelet: ["scarlet", "late drive", "favorite memory", "13"],
  },
  {
    id: "song-three",
    title: "Midnights Afterglow",
    artist: "Taylor Swift",
    era: "Midnights",
    note: "A late-night, intimate page for the last song before the final note.",
    mediaKind: "audio",
    mediaUrl: process.env.NEXT_PUBLIC_SONG_THREE_URL,
    coverUrl: process.env.NEXT_PUBLIC_SONG_THREE_COVER_URL,
    accent: "from-[#253a7a] via-[#241742] to-[#0d0918]",
    lyrics: [
      { time: 0, text: "This is a good place for the most emotional song." },
      { time: 9, text: "You can keep the lyrics exact or shorten them slightly." },
      { time: 18, text: "Short lyric blocks usually feel best on a phone screen." },
      { time: 27, text: "Leave some breathing room between lines for impact." },
      { time: 36, text: "Make the last line the one that lingers with her." },
    ],
    bracelet: ["blue hour", "secret note", "soft chaos", "13"],
  },
];

const eraShelf = [
  { name: "Fearless", tone: "golden" },
  { name: "Red", tone: "cinematic" },
  { name: "1989", tone: "skyline" },
  { name: "Lover", tone: "pastel" },
  { name: "Folklore", tone: "cabin" },
  { name: "Midnights", tone: "velvet" },
];

const hiddenClues = [
  "the lyric that secretly sounds like her",
  "the place name only the two of you would immediately understand",
  "the tiny detail about her that always catches you off guard",
  "the clue she will notice faster than anyone else ever could",
];

function formatTime(value: number) {
  if (!Number.isFinite(value)) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default function SongStage() {
  const [selectedSongId, setSelectedSongId] = useState(songs[0]?.id ?? "");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const lyricRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  const selectedSong =
    songs.find((song) => song.id === selectedSongId) ??
    songs[0];

  const activeLyricIndex = useMemo(() => {
    if (!selectedSong) {
      return -1;
    }

    let index = 0;

    for (let i = 0; i < selectedSong.lyrics.length; i += 1) {
      if (currentTime >= selectedSong.lyrics[i].time) {
        index = i;
      }
    }

    return index;
  }, [currentTime, selectedSong]);

  useEffect(() => {
    const activeLine = lyricRefs.current[activeLyricIndex];
    activeLine?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [activeLyricIndex]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    if (mediaRef.current) {
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
      mediaRef.current.load();
    }
  }, [selectedSongId]);

  async function togglePlayback() {
    if (!mediaRef.current || !selectedSong?.mediaUrl) {
      return;
    }

    if (mediaRef.current.paused) {
      await mediaRef.current.play();
      setIsPlaying(true);
      return;
    }

    mediaRef.current.pause();
    setIsPlaying(false);
  }

  function handleSeek(value: number) {
    if (!mediaRef.current) {
      return;
    }

    mediaRef.current.currentTime = value;
    setCurrentTime(value);
  }

  if (!selectedSong) {
    return null;
  }

  const hasMedia = Boolean(selectedSong.mediaUrl);

  return (
    <div className="grid items-start gap-5 sm:gap-8 lg:grid-cols-[0.34fr_0.66fr] xl:grid-cols-[0.3fr_0.7fr]">
      <div className="space-y-3 lg:sticky lg:top-6">
        <div className="liquid-panel rounded-[1.5rem] p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-rose-100/70">
            Eras Shelf
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {eraShelf.map((era) => (
              <span
                key={era.name}
                className="liquid-pill rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/75"
              >
                {era.name} / {era.tone}
              </span>
            ))}
          </div>
        </div>

        {songs.map((song) => {
          const isSelected = song.id === selectedSongId;

          return (
            <button
              key={song.id}
              type="button"
              onClick={() => setSelectedSongId(song.id)}
              className={`w-full rounded-[1.5rem] p-5 text-left transition ${
                isSelected
                  ? "liquid-panel bg-white/88 text-[#23040f]"
                  : "liquid-panel text-white hover:bg-white/10"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.35em] opacity-70">Song</p>
              <h2 className="mt-3 text-2xl font-semibold">{song.title}</h2>
              <p className="mt-2 text-[11px] uppercase tracking-[0.28em] opacity-65">
                {song.era} era
              </p>
              <p className="mt-2 text-sm opacity-75">{song.artist}</p>
              <p className="mt-3 text-sm leading-7 opacity-80">{song.note}</p>
            </button>
          );
        })}
      </div>

      <section
        className={`liquid-panel overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${selectedSong.accent} p-5 sm:p-6`}
      >
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] 2xl:grid-cols-[1.04fr_0.96fr]">
          <div className="liquid-panel rounded-[1.5rem] bg-black/20 p-5">
            <div className="flex items-start gap-4 xl:gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/25 xl:h-24 xl:w-24">
                {selectedSong.coverUrl ? (
                  <img
                    src={selectedSong.coverUrl}
                    alt={`${selectedSong.title} cover`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-[10px] uppercase tracking-[0.35em] text-white/68">
                    Cover
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.4em] text-rose-100/70">
                  From You / {selectedSong.era}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white xl:text-3xl">
                  {selectedSong.title}
                </h2>
                <p className="mt-2 text-sm text-white/78 xl:text-base">{selectedSong.artist}</p>
                <p className="mt-3 text-sm leading-7 text-white/76 xl:max-w-xl">
                  {selectedSong.note}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedSong.bracelet.map((bead) => (
                    <span
                      key={bead}
                      className="liquid-pill rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/80"
                    >
                      {bead}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              {selectedSong.mediaKind === "video" && hasMedia ? (
                <video
                  ref={(element) => {
                    mediaRef.current = element;
                  }}
                  className="aspect-video w-full rounded-[1.5rem] border border-white/10 bg-black object-cover shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
                  playsInline
                  preload="metadata"
                  onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                  onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={selectedSong.mediaUrl} />
                </video>
              ) : (
                <div className="liquid-panel rounded-[1.5rem] bg-black/25 p-6">
                  <audio
                    ref={(element) => {
                      mediaRef.current = element;
                    }}
                    preload="metadata"
                    onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                    onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  >
                    {hasMedia ? <source src={selectedSong.mediaUrl} /> : null}
                  </audio>
                  <div className="flex min-h-56 items-center justify-center rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),transparent_36%)] text-center xl:min-h-[20rem]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-rose-100/75">
                        Spotify Style
                      </p>
                      <p className="mt-4 text-2xl font-semibold text-white xl:text-3xl">
                        {hasMedia ? "Audio performance ready here." : "Add your audio or video URL here later."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void togglePlayback()}
                  disabled={!hasMedia}
                  className="liquid-pill flex h-14 w-14 items-center justify-center rounded-full bg-white/88 text-sm font-semibold text-[#23040f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 xl:h-16 xl:w-16"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <div className="min-w-0 flex-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 1}
                    step={0.1}
                    value={Math.min(currentTime, duration || 1)}
                    onChange={(event) => handleSeek(Number(event.target.value))}
                    className="w-full accent-white"
                    disabled={!hasMedia}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-white/72">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {!hasMedia ? (
                <p className="text-sm leading-7 text-rose-100/78">
                  Set the song URL in your environment or replace it with a direct hosted media URL once your recording is ready.
                </p>
              ) : null}
            </div>
          </div>

          <div className="liquid-panel rounded-[1.5rem] bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-rose-100/70">Live Lyrics</p>
            <div className="mt-5 max-h-[28rem] space-y-4 overflow-y-auto pr-2 xl:max-h-[36rem]">
              {selectedSong.lyrics.map((line, index) => {
                const isActive = index === activeLyricIndex;

                return (
                  <p
                    key={`${selectedSong.id}-${line.time}-${index}`}
                    ref={(element) => {
                      lyricRefs.current[index] = element;
                    }}
                    className={`rounded-[1.25rem] px-4 py-3 text-base leading-8 transition sm:text-lg ${
                      isActive
                        ? "liquid-pill bg-white/88 text-[#23040f] shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
                        : "text-white/70"
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="liquid-panel mt-5 rounded-[1.5rem] bg-black/10 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-100/70">
            Hidden Clues
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {hiddenClues.map((clue, index) => (
              <div
                key={clue}
                className="liquid-panel rounded-[1.25rem] p-4"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/65">
                  clue 0{index + 1}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/80">{clue}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-white/68">
            Replace these with tiny references only she would catch, and this page will feel a
            lot more like it was made specifically for her.
          </p>
        </div>
      </section>
    </div>
  );
}
