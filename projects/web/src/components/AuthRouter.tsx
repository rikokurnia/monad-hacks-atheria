"use client";

import { useState, useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, usePathname } from "next/navigation";

export default function AuthRouter({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ready || !mounted) return;

    if (authenticated && pathname === "/landing") {
      router.replace("/");
    } else if (!authenticated && pathname === "/") {
      router.replace("/landing");
    }
  }, [ready, authenticated, pathname, router, mounted]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Global background music setup
    if (!audioRef.current) {
      const audio = new Audio("/assets/audio/song-theme-atheria.mp3");
      audio.loop = true;
      audio.volume = 0.3; // Gentle background volume
      audioRef.current = audio;
    }

    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {
          // Autoplay was blocked, will wait for user interaction
        });
      }
    };

    // Try to play immediately (might work if previously interacted)
    playAudio();

    // Ensure it plays on first user interaction
    const handleInteraction = () => {
      playAudio();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // Simple loading state to prevent flash of content during initial auth check
  if (!mounted || !ready) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
