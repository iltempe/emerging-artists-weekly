import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TrackPublic } from "../lib/types";
import { publicUrl } from "../lib/supabase";
import { trackEvent } from "../lib/utils";

interface PlayerState {
  current: TrackPublic | null;
  isPlaying: boolean;
  progress: number; // 0..1
  duration: number;
  currentTime: number;
  play: (track: TrackPublic) => void;
  toggle: () => void;
  seek: (fraction: number) => void;
}

const Ctx = createContext<PlayerState | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countedRef = useRef<string | null>(null);
  const [current, setCurrent] = useState<TrackPublic | null>(null);
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
    const onEnd = () => setIsPlaying(false);
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
  }, []);

  function play(track: TrackPublic) {
    const a = audioRef.current;
    if (!a) return;
    if (current?.id === track.id) {
      void a.play();
      return;
    }
    setCurrent(track);
    a.src = publicUrl("tracks", track.audio_path);
    a.currentTime = 0;
    countedRef.current = null;
    void a.play();
    // Conta un "play" anonimo una sola volta per brano.
    if (countedRef.current !== track.id) {
      countedRef.current = track.id;
      void trackEvent(track.id, "play");
    }
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

  const value: PlayerState = {
    current,
    isPlaying,
    progress: duration ? currentTime / duration : 0,
    duration,
    currentTime,
    play,
    toggle,
    seek,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer(): PlayerState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer deve stare dentro <PlayerProvider>");
  return ctx;
}
