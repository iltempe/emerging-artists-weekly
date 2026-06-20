import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Track } from "../lib/types";
import { config } from "../lib/config";
import { assetUrl, logEvent } from "../lib/utils";

interface PlayerState {
  current: Track | null;
  isPlaying: boolean;
  progress: number; // 0..1
  duration: number;
  currentTime: number;
  play: (track: Track) => void;
  toggle: () => void;
  seek: (fraction: number) => void;
  next: () => void;
  prev: () => void;
}

const Ctx = createContext<PlayerState | undefined>(undefined);
const tracks = config.tracks;

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  if (!audioRef.current && typeof Audio !== "undefined") {
    audioRef.current = new Audio();
  }

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime);
    const onDur = () => setDuration(a.duration || 0);
    const onEnd = () => skip(1);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onDur);
    a.addEventListener("ended", onEnd);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onDur);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function play(track: Track) {
    const a = audioRef.current;
    if (!a) return;
    if (current?.id === track.id) {
      void a.play();
      return;
    }
    setCurrent(track);
    a.src = assetUrl(track.file);
    a.currentTime = 0;
    void a.play();
    void logEvent(track.id, "play");
  }

  function toggle() {
    const a = audioRef.current;
    if (!a || !current) return;
    if (a.paused) void a.play();
    else a.pause();
  }

  function seek(fraction: number) {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = fraction * duration;
  }

  function skip(dir: 1 | -1) {
    if (!current) return;
    const i = tracks.findIndex((t) => t.id === current.id);
    const nextTrack = tracks[(i + dir + tracks.length) % tracks.length];
    if (nextTrack) play(nextTrack);
  }

  const value: PlayerState = {
    current,
    isPlaying,
    progress: duration ? currentTime / duration : 0,
    duration,
    currentTime,
    play,
    toggle,
    seek,
    next: () => skip(1),
    prev: () => skip(-1),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer(): PlayerState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer deve stare dentro <PlayerProvider>");
  return ctx;
}
