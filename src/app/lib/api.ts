/**
 * Speechi API Client
 * 
 * Centralized API client for all backend communication.
 * All requests go through this module - no direct fetch calls elsewhere.
 * 
 * Configuration:
 * - API_BASE_URL is set via VITE_API_BASE_URL environment variable
 * - Development: http://127.0.0.1:8000/api
 * - Production: https://speechi-api.adirg.dev (or your API domain)
 * 
 * Authentication:
 * - For authenticated users, includes Bearer token in requests
 * - Token is retrieved from authApi module
 * 
 * IMPORTANT: The URL must match your backend's API_PREFIX configuration.
 * If backend has API_PREFIX=/api, use http://host:port/api
 * If backend has API_PREFIX="" (empty), use http://host:port
 */

import { getToken } from "./authApi";

// ===========================================
// Configuration
// ===========================================

/**
 * API base URL from environment.
 * MUST be set - no hardcoded fallbacks in production.
 */
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

// Validate configuration at startup (warning only, don't crash)
if (!API_BASE_URL && import.meta.env.DEV) {
  console.warn(
    "[Speechi API] VITE_API_BASE_URL is not set. Check your .env file."
  );
}

// ===========================================
// Types
// ===========================================

export interface ActionItem {
  description: string;
  owner?: string | null;
}

export interface Analysis {
  summary: string;
  participants: string[];
  decisions: string[];
  action_items: ActionItem[];
  translated_transcript: string;
  /** Original Whisper transcript (always full, never condensed) */
  raw_transcript?: string;
  /** Output language code used for analysis */
  language?: string;
  /** True if translated_transcript is condensed due to transcript length */
  is_condensed?: boolean;
}

export interface ApiResult {
  /** Raw Whisper transcript (kept for backward compatibility) */
  transcript: string;
  /** Structured analysis including both transcripts */
  analysis: Analysis;
}

export interface ApiError {
  detail: string;
  status: number;
}

export interface HealthResponse {
  status: string;
  environment?: string;
  api_prefix?: string;
}

export interface SupportedFormatsResponse {
  formats: string[];
  description: string;
}

// ===========================================
// Core API Functions
// ===========================================

/**
 * Build full API URL for an endpoint.
 * Ensures proper URL construction without double slashes.
 */
function buildUrl(endpoint: string): string {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  // Remove trailing slash from base URL if present
  const cleanBase = API_BASE_URL.endsWith("/") 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  return `${cleanBase}/${cleanEndpoint}`;
}

/**
 * Parse error response from API.
 */
function parseErrorResponse(text: string, status: number): ApiError {
  try {
    const json = JSON.parse(text) as { detail?: string };
    return {
      detail: typeof json.detail === "string" ? json.detail : text,
      status,
    };
  } catch {
    return { detail: text || `Request failed with status ${status}`, status };
  }
}

/**
 * Generic fetch wrapper with error handling.
 * All API calls MUST go through this function.
 * Automatically includes auth token if available.
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = buildUrl(endpoint);
  
  // Build headers with optional auth token
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };
  
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const text = await response.text();
    const error = parseErrorResponse(text, response.status);
    throw new Error(error.detail);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Fetch that returns a Blob (for file downloads).
 * Automatically includes auth token if available.
 */
async function apiFetchBlob(
  endpoint: string,
  options?: RequestInit
): Promise<Blob> {
  const url = buildUrl(endpoint);
  
  // Build headers with optional auth token
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };
  
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const text = await response.text();
    const error = parseErrorResponse(text, response.status);
    throw new Error(error.detail);
  }
  
  return response.blob();
}

/**
 * Build FormData for audio upload endpoints.
 */
function buildAudioFormData(file: File, language: string): FormData {
  const formData = new FormData();
  formData.append("audio", file);
  formData.append("language", language);
  return formData;
}

/**
 * Trigger file download in browser.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ===========================================
// Public API Functions
// ===========================================

/**
 * Health check endpoint.
 * Use to verify API connectivity.
 */
export async function healthCheck(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("health");
}

/**
 * Get supported audio formats from backend.
 */
export async function getSupportedFormats(): Promise<SupportedFormatsResponse> {
  return apiFetch<SupportedFormatsResponse>("supported-formats");
}

/**
 * Analyze a meeting audio file.
 * Works with both uploaded files and browser recordings.
 * 
 * @param file - Audio file (File object)
 * @param language - Output language code (en, he, fr, es, ar)
 * @returns Transcript and analysis results
 */
export async function analyzeMeeting(
  file: File,
  language: string
): Promise<ApiResult> {
  return apiFetch<ApiResult>("process-meeting", {
    method: "POST",
    body: buildAudioFormData(file, language),
  });
}

/**
 * Export meeting analysis as Word document.
 * Document headings and content are in the selected language.
 * 
 * @param file - Audio file (File object)
 * @param language - Output language code (en, he, fr, es, ar)
 */
export async function exportWord(
  file: File,
  language: string
): Promise<void> {
  const blob = await apiFetchBlob("process-meeting/export-docx", {
    method: "POST",
    body: buildAudioFormData(file, language),
  });
  downloadBlob(blob, `meeting_summary_${language}.docx`);
}

/**
 * Export meeting analysis as PDF document.
 * Document headings and content are in the selected language.
 * RTL support for Hebrew and Arabic.
 * 
 * @param file - Audio file (File object)
 * @param language - Output language code (en, he, fr, es, ar)
 */
export async function exportPdf(
  file: File,
  language: string
): Promise<void> {
  const blob = await apiFetchBlob("process-meeting/export-pdf", {
    method: "POST",
    body: buildAudioFormData(file, language),
  });
  downloadBlob(blob, `meeting_summary_${language}.pdf`);
}
