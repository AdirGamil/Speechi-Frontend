/**
 * Premium drag-and-drop upload zone with GSAP animations.
 * States: empty, drag hover, file selected, error.
 * Supports all common audio formats: MP3, WAV, M4A, AAC, OGG, FLAC, WEBM, MP4
 */

import { useCallback, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ACCEPT_AUDIO, AUDIO_FILE_REGEX, AUDIO_FORMATS_DISPLAY } from "../lib/constants";
import { HiCloudArrowUp, HiMusicalNote, HiCheckCircle } from "react-icons/hi2";

interface UploadZoneProps {
  accept?: string;
  onSelect: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
  hint: string;
  selectedFile?: File | null;
  removeFileLabel?: string;
  clickOrDragToReplaceLabel?: string;
}

export function UploadZone({ accept = ACCEPT_AUDIO, onSelect, onRemove, disabled, hint, selectedFile, removeFileLabel = "Remove file", clickOrDragToReplaceLabel = "Click or drag to replace" }: UploadZoneProps) {
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const zoneRef = useRef<HTMLLabelElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mount animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const zone = zoneRef.current;
    if (zone) {
      gsap.fromTo(
        zone,
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  // Drag hover animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const icon = iconRef.current;
    if (icon) {
      if (over && !disabled) {
        gsap.to(icon, { scale: 1.1, y: -4, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(icon, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
      }
    }
  }, [over, disabled]);

  // File selected animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !selectedFile) return;

    const content = contentRef.current;
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [selectedFile]);

  const validateFile = useCallback((file: File): boolean => {
    return AUDIO_FILE_REGEX.test(file.name);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setOver(false);
      setError(null);
      if (disabled) return;
      const f = e.dataTransfer.files[0];
      if (f && validateFile(f)) {
        onSelect(f);
      } else if (f) {
        setError(`Unsupported format. Please use: ${AUDIO_FORMATS_DISPLAY}`);
      }
    },
    [disabled, onSelect, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const f = e.target.files?.[0];
      if (f) onSelect(f);
      e.target.value = "";
    },
    [onSelect]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <label
      ref={zoneRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={
        "group relative block cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 " +
        (disabled ? "cursor-not-allowed opacity-60 " : " ") +
        (error
          ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
          : over && !disabled
          ? "border-indigo-400 bg-indigo-50/60 shadow-lg shadow-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-950/30"
          : selectedFile
          ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/20"
          : "border-zinc-200 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-zinc-700 dark:bg-zinc-800/30 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/20")
      }
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
      
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${over && !disabled ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 blur-xl" />
      </div>

      <div ref={contentRef} className="relative">
        {selectedFile ? (
          // File selected state
          <>
            <span className="mb-3 flex justify-center text-emerald-500 dark:text-emerald-400">
              <span ref={iconRef} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
                <HiCheckCircle className="h-8 w-8" />
              </span>
            </span>
            <div className="space-y-1">
              <p className="flex items-center justify-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                <HiMusicalNote className="h-4 w-4 shrink-0 text-emerald-500" />
                <span className="min-w-0 truncate">{selectedFile.name}</span>
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:focus:ring-red-500"
                    aria-label={removeFileLabel}
                    title={removeFileLabel}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {formatFileSize(selectedFile.size)}
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                {clickOrDragToReplaceLabel}
              </p>
            </div>
          </>
        ) : (
          // Empty state
          <>
            <span ref={iconRef} className="mb-4 flex justify-center">
              <span className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 ${
                over && !disabled 
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
                  : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
              }`}>
                <HiCloudArrowUp className="h-8 w-8" />
              </span>
            </span>
            <div className="space-y-2">
              <p className={`text-base font-medium transition-colors duration-300 ${
                over && !disabled
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-700 dark:text-zinc-300'
              }`}>
                {over && !disabled ? 'Drop your file here' : 'Drag & drop your audio file'}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {AUDIO_FORMATS_DISPLAY}
              </p>
            </div>
          </>
        )}

        {/* Error state */}
        {error && (
          <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </label>
  );
}
