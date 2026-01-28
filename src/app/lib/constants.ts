/**
 * Feature flags and shared constants.
 */

/** PDF export is now enabled with backend support. */
export const PDF_EXPORT_ENABLED = true;

/** Supported audio formats - matches backend ALLOWED_AUDIO_FORMATS */
export const SUPPORTED_AUDIO_EXTENSIONS = [
  "mp3",
  "wav",
  "m4a",
  "aac",
  "ogg",
  "flac",
  "webm",
  "mp4",
] as const;

/** Accept string for file inputs */
export const ACCEPT_AUDIO = [
  // Extensions
  ".mp3",
  ".wav",
  ".m4a",
  ".aac",
  ".ogg",
  ".flac",
  ".webm",
  ".mp4",
  // MIME types
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/x-aac",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
  "audio/webm",
  "video/webm",
  "video/mp4",
].join(",");

/** Regex to validate audio file extensions */
export const AUDIO_FILE_REGEX = /\.(mp3|wav|m4a|aac|ogg|flac|webm|mp4)$/i;

/** Human-readable format list */
export const AUDIO_FORMATS_DISPLAY = "MP3, WAV, M4A, AAC, OGG, FLAC, WEBM, MP4";

export const OUTPUT_LANGUAGES = [
  { value: "en" as const, label: "English" },
  { value: "he" as const, label: "עברית" },
  { value: "fr" as const, label: "Français" },
  { value: "es" as const, label: "Español" },
  { value: "ar" as const, label: "العربية" },
];

/** Recording constants */
export const RECORDING_MIME_TYPE = "audio/webm";
export const RECORDING_FALLBACK_MIME_TYPE = "audio/wav";
export const MAX_RECORDING_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
