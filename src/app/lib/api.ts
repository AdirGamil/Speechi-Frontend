/**
 * API client for Speechi backend. FormData: audio, language.
 * Supports both uploaded files and recorded audio (treated identically).
 * 
 * API base URL is configured via environment variable VITE_API_BASE_URL.
 * No hardcoded URLs - supports both local development and production.
 */

// API base URL from environment (no trailing slash)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Log in development for debugging
if (import.meta.env.DEV) {
  console.log("[API] Base URL:", API_BASE);
}

export type ActionItem = { description: string; owner?: string | null };
export type Analysis = {
  summary: string;
  participants: string[];
  decisions: string[];
  action_items: ActionItem[];
  translated_transcript: string;
};
export type ApiResult = { transcript: string; analysis: Analysis };

/**
 * Build FormData for audio upload endpoints.
 */
function buildFormData(file: File, language: string): FormData {
  const fd = new FormData();
  fd.append("audio", file);
  fd.append("language", language);
  return fd;
}

/**
 * Parse error response from API.
 */
function parseError(text: string): string {
  try {
    const j = JSON.parse(text) as { detail?: string };
    if (typeof j.detail === "string") return j.detail;
  } catch {
    /* ignore */
  }
  return text;
}

/**
 * Generic fetch wrapper with error handling.
 * All API calls should use this function.
 */
async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, options);
  return res;
}

/**
 * Analyze a meeting audio file.
 * Works with both uploaded files and browser recordings.
 */
export async function analyzeMeeting(file: File, language: string): Promise<ApiResult> {
  const res = await apiFetch("/process-meeting", {
    method: "POST",
    body: buildFormData(file, language),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(parseError(t) || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<ApiResult>;
}

/**
 * Export meeting analysis as Word document.
 * Document headings are in the selected language.
 */
export async function exportWord(file: File, language: string): Promise<void> {
  const res = await apiFetch("/process-meeting/export-docx", {
    method: "POST",
    body: buildFormData(file, language),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(parseError(t) || `Export failed: ${res.status}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // Language-aware filename
  a.download = `meeting_summary_${language}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export meeting analysis as PDF document.
 * Document headings are in the selected language.
 * RTL support for Hebrew and Arabic.
 */
export async function exportPdf(file: File, language: string): Promise<void> {
  const res = await apiFetch("/process-meeting/export-pdf", {
    method: "POST",
    body: buildFormData(file, language),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(parseError(t) || `Export failed: ${res.status}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // Language-aware filename
  a.download = `meeting_summary_${language}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Get supported audio formats from backend.
 */
export async function getSupportedFormats(): Promise<{ formats: string[]; description: string }> {
  const res = await apiFetch("/supported-formats");
  if (!res.ok) {
    throw new Error("Failed to fetch supported formats");
  }
  return res.json();
}

/**
 * Health check endpoint.
 */
export async function healthCheck(): Promise<{ status: string }> {
  const res = await apiFetch("/health");
  if (!res.ok) {
    throw new Error("Health check failed");
  }
  return res.json();
}
