/**
 * AudioRecorder: Browser-based meeting recording using MediaRecorder API.
 * 
 * States:
 * - Idle: Ready to record
 * - Recording: Live recording with timer and pulse indicator
 * - Stopped: Preview with play, delete, and use options
 * 
 * Output is treated identically to uploaded files.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { HiMicrophone, HiStop, HiTrash, HiPlay, HiPause, HiCheck } from "react-icons/hi2";
import { RECORDING_MIME_TYPE, RECORDING_FALLBACK_MIME_TYPE } from "../lib/constants";

type RecordingState = "idle" | "recording" | "stopped";

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  onCancel?: () => void;
  disabled?: boolean;
  t: {
    startRecording: string;
    stopRecording: string;
    recording: string;
    recordingInProgress: string;
    deleteRecording: string;
    useRecording: string;
    recordingNotSupported: string;
    microphonePermissionDenied: string;
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AudioRecorder({ onRecordingComplete, onCancel, disabled, t }: AudioRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check browser support
  const isSupported = typeof MediaRecorder !== "undefined" && navigator.mediaDevices?.getUserMedia;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);

  // Pulse animation during recording
  useEffect(() => {
    if (state !== "recording") return;
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const pulse = pulseRef.current;
    if (pulse) {
      gsap.to(pulse, {
        scale: 1.5,
        opacity: 0,
        duration: 1,
        repeat: -1,
        ease: "power2.out",
      });
    }

    return () => {
      if (pulse) gsap.killTweensOf(pulse);
    };
  }, [state]);

  // Mount animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (container) {
      gsap.fromTo(
        container,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  const getMimeType = useCallback(() => {
    if (MediaRecorder.isTypeSupported(RECORDING_MIME_TYPE)) {
      return RECORDING_MIME_TYPE;
    }
    if (MediaRecorder.isTypeSupported(RECORDING_FALLBACK_MIME_TYPE)) {
      return RECORDING_FALLBACK_MIME_TYPE;
    }
    return "";
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError(t.recordingNotSupported);
      return;
    }

    setError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getMimeType();
      
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setState("recording");
      setDuration(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError(t.microphonePermissionDenied);
      } else {
        setError(t.recordingNotSupported);
      }
    }
  }, [isSupported, getMimeType, t]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState("stopped");
  }, []);

  const deleteRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
    setState("idle");
    setIsPlaying(false);
    onCancel?.();
  }, [audioUrl, onCancel]);

  const useRecording = useCallback(() => {
    if (!audioUrl) return;
    
    const mimeType = getMimeType() || "audio/webm";
    const extension = mimeType.includes("wav") ? "wav" : "webm";
    const filename = `recording_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, "")}.${extension}`;
    
    // Create File from blob URL
    fetch(audioUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], filename, { type: mimeType });
        onRecordingComplete(file);
      });
  }, [audioUrl, getMimeType, onRecordingComplete]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Handle audio ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [audioUrl]);

  if (!isSupported) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-center text-sm text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/20 dark:text-amber-400">
        {t.recordingNotSupported}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-center text-sm text-red-600 dark:border-red-800/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Recording UI */}
      <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
        {state === "idle" && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={startRecording}
              disabled={disabled}
              className="group relative mx-auto flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiMicrophone className="h-8 w-8" />
              <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
              {t.startRecording}
            </p>
          </div>
        )}

        {state === "recording" && (
          <div className="space-y-4">
            <div className="relative mx-auto h-20 w-20">
              {/* Pulse effect */}
              <div
                ref={pulseRef}
                className="absolute inset-0 rounded-full bg-red-500/30"
              />
              {/* Main button */}
              <button
                type="button"
                onClick={stopRecording}
                className="relative z-10 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
              >
                <HiStop className="h-8 w-8" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-red-600 dark:text-red-400">
                {t.recording}
              </p>
              <p className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                {formatTime(duration)}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t.recordingInProgress}
              </p>
            </div>
          </div>
        )}

        {state === "stopped" && audioUrl && (
          <div className="space-y-4">
            {/* Audio preview */}
            <audio ref={audioRef} src={audioUrl} className="hidden" />
            
            <div className="flex items-center justify-center gap-4">
              {/* Play/Pause button */}
              <button
                type="button"
                onClick={togglePlayback}
                className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                {isPlaying ? (
                  <HiPause className="h-6 w-6" />
                ) : (
                  <HiPlay className="h-6 w-6" />
                )}
              </button>
              
              <div className="text-left">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.recording}
                </p>
                <p className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {formatTime(duration)}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={deleteRecording}
                className="inline-flex items-center cursor-pointer gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <HiTrash className="h-4 w-4" />
                {t.deleteRecording}
              </button>
              <button
                type="button"
                onClick={useRecording}
                disabled={disabled}
                className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg dark:focus:ring-offset-zinc-950"
                aria-label={t.useRecording}
              >
                <HiCheck className="h-5 w-5" />
                {t.useRecording}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
