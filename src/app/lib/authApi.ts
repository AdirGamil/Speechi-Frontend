/**
 * Authentication API client.
 * 
 * Handles all auth-related API calls:
 * - Register
 * - Login
 * - Get current user
 * - Migrate guest meetings
 * - Get/sync meetings
 * 
 * Token is stored in memory only (not LocalStorage for security).
 * Token is passed to requests via Authorization header.
 */

import type { HistoryItem } from "./storage";

// ===========================================
// Configuration
// ===========================================

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("[Auth API] VITE_API_BASE_URL is not set");
}

// In-memory token storage (more secure than localStorage)
let _token: string | null = null;

// ===========================================
// Types
// ===========================================

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface UsageInfo {
  usedToday: number;
  dailyLimit: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  usage: UsageInfo;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface MeetingItem {
  id: string;
  fileName: string;
  outputLanguage: string;
  summary: string;
  transcriptRaw: string;
  transcriptClean: string;
  participants: string[];
  decisions: string[];
  actionItems: { description: string; owner?: string | null }[];
  createdAt: string;
  exports: { word: boolean; pdf: boolean };
}

export interface ApiError {
  detail: string;
  status: number;
}

// ===========================================
// Token Management
// ===========================================

export function setToken(token: string | null): void {
  _token = token;
  // Also store in sessionStorage for tab persistence
  if (token) {
    try {
      sessionStorage.setItem("speechi_token", token);
    } catch {
      // Ignore
    }
  } else {
    try {
      sessionStorage.removeItem("speechi_token");
    } catch {
      // Ignore
    }
  }
}

export function getToken(): string | null {
  if (_token) return _token;
  // Try to recover from sessionStorage
  try {
    const stored = sessionStorage.getItem("speechi_token");
    if (stored) {
      _token = stored;
      return stored;
    }
  } catch {
    // Ignore
  }
  return null;
}

export function clearToken(): void {
  _token = null;
  try {
    sessionStorage.removeItem("speechi_token");
  } catch {
    // Ignore
  }
}

// ===========================================
// API Helpers
// ===========================================

function buildUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const cleanBase = API_BASE_URL.endsWith("/") 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  return `${cleanBase}/${cleanEndpoint}`;
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const json = await response.json();
    return {
      detail: json.detail || "An error occurred",
      status: response.status,
    };
  } catch {
    return {
      detail: response.statusText || "An error occurred",
      status: response.status,
    };
  }
}

async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  /** When true, do not send Authorization header (for login/register before auth). */
  skipAuth = false
): Promise<T> {
  const url = buildUrl(endpoint);
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    // Must match backend allow_credentials=True for CORS preflight and response
    credentials: "include",
  });
  
  if (!response.ok) {
    const error = await parseError(response);
    throw error;
  }
  
  return response.json();
}

// ===========================================
// Auth API Functions
// ===========================================

/**
 * Register a new user.
 * Uses skipAuth so no stale token is sent (matches login for CORS/behavior).
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const result = await authFetch<AuthResponse>(
    "auth/register",
    { method: "POST", body: JSON.stringify(payload) },
    true
  );
  
  setToken(result.token);
  return result;
}

/**
 * Login with email and password.
 * Uses skipAuth so no stale token is sent and request matches register (avoids CORS/preflight quirks).
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const result = await authFetch<AuthResponse>(
    "auth/login",
    { method: "POST", body: JSON.stringify(payload) },
    true
  );
  
  setToken(result.token);
  return result;
}

/**
 * Get current user profile and refresh token.
 */
export async function getMe(): Promise<AuthResponse | null> {
  const token = getToken();
  if (!token) return null;
  
  try {
    const result = await authFetch<AuthResponse>("auth/me");
    // Update token (session extension)
    setToken(result.token);
    return result;
  } catch {
    // Token invalid or expired
    clearToken();
    return null;
  }
}

/**
 * Logout - clear token.
 */
export function logout(): void {
  clearToken();
}

/**
 * Get usage statistics.
 */
export async function getUsage(): Promise<UsageInfo> {
  return authFetch<UsageInfo>("auth/usage");
}

/**
 * Migrate guest meetings to user account.
 */
export async function migrateMeetings(
  meetings: HistoryItem[]
): Promise<{ migrated: number }> {
  return authFetch("auth/migrate-meetings", {
    method: "POST",
    body: JSON.stringify({ meetings }),
  });
}

/**
 * Get all meetings for authenticated user.
 */
export async function getMeetings(): Promise<{ meetings: MeetingItem[] }> {
  return authFetch("auth/meetings");
}

/**
 * Delete a meeting.
 */
export async function deleteMeeting(meetingId: string): Promise<{ deleted: boolean }> {
  return authFetch(`auth/meetings/${meetingId}`, {
    method: "DELETE",
  });
}

/**
 * Check if user is authenticated (has valid token).
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Initialize auth state from stored token.
 * Call this on app startup.
 */
export async function initializeAuth(): Promise<AuthResponse | null> {
  return getMe();
}
