/**
 * LocalStorage keys and helpers for Speechi preferences and history.
 */

export type UiLanguage = "en" | "he" | "fr" | "es" | "ar";
export type Theme = "light" | "dark" | "system";

export const KEYS = {
  uiLanguage: "speechi.uiLanguage",
  outputLanguage: "speechi.outputLanguage",
  theme: "speechi.theme",
  history: "speechi.history",
  user: "speechi_user",
  usage: "speechi_usage",
} as const;

const DEFAULT_UI: UiLanguage = "en";
const DEFAULT_OUTPUT: UiLanguage = "en";
const DEFAULT_THEME: Theme = "light";

export function getUiLanguage(): UiLanguage {
  const v = localStorage.getItem(KEYS.uiLanguage) as UiLanguage | null;
  return v && ["en", "he", "fr", "es", "ar"].includes(v) ? v : DEFAULT_UI;
}

export function setUiLanguage(lang: UiLanguage): void {
  localStorage.setItem(KEYS.uiLanguage, lang);
}

export function getOutputLanguage(): UiLanguage {
  const v = localStorage.getItem(KEYS.outputLanguage) as UiLanguage | null;
  return v && ["en", "he", "fr", "es", "ar"].includes(v) ? v : DEFAULT_OUTPUT;
}

export function setOutputLanguage(lang: UiLanguage): void {
  localStorage.setItem(KEYS.outputLanguage, lang);
}

export function getTheme(): Theme {
  const v = localStorage.getItem(KEYS.theme) as Theme | null;
  return v && ["light", "dark", "system"].includes(v) ? v : DEFAULT_THEME;
}

export function setTheme(t: Theme): void {
  localStorage.setItem(KEYS.theme, t);
}

export interface HistoryActionItem {
  description: string;
  owner?: string | null;
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  fileName: string;
  outputLanguage: string;
  summary: string;
  transcriptRaw: string;
  transcriptClean: string;
  participants: string[];
  decisions: string[];
  actionItems: HistoryActionItem[];
  exports: { word: boolean; pdf: boolean };
}

const MAX_HISTORY = 100;

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEYS.history);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e): e is HistoryItem => {
      if (typeof e !== "object" || e === null) return false;
      const x = e as Record<string, unknown>;
      return (
        typeof x.id === "string" &&
        typeof x.createdAt === "string" &&
        typeof x.fileName === "string" &&
        typeof x.outputLanguage === "string" &&
        typeof x.summary === "string" &&
        typeof x.transcriptRaw === "string" &&
        typeof x.transcriptClean === "string" &&
        Array.isArray(x.participants) &&
        Array.isArray(x.decisions) &&
        Array.isArray(x.actionItems) &&
        typeof x.exports === "object" &&
        x.exports !== null &&
        "word" in x.exports &&
        "pdf" in x.exports
      );
    });
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]): void {
  try {
    localStorage.setItem(KEYS.history, JSON.stringify(items.slice(-MAX_HISTORY)));
  } catch {
    /* ignore */
  }
}

export function getHistory(): HistoryItem[] {
  return loadHistory().slice().reverse();
}

export function addHistoryItem(item: Omit<HistoryItem, "id">): HistoryItem {
  const list = loadHistory();
  const existing = list.find(
    (e) => e.fileName === item.fileName && Math.abs(new Date(e.createdAt).getTime() - new Date(item.createdAt).getTime()) < 60_000
  );
  if (existing) return existing as HistoryItem;

  const entry: HistoryItem = { ...item, id: crypto.randomUUID() };
  list.push(entry);
  saveHistory(list);
  return entry;
}

export function updateHistoryExports(id: string, format: "word" | "pdf"): void {
  const list = loadHistory();
  const i = list.findIndex((e) => e.id === id);
  if (i === -1) return;
  const e = list[i]!;
  e.exports = { ...e.exports, [format]: true };
  saveHistory(list);
}

export function deleteHistoryItem(id: string): void {
  const list = loadHistory().filter((e) => e.id !== id);
  saveHistory(list);
}

export function clearHistory(): void {
  saveHistory([]);
}

/* ========================================
   USER AUTHENTICATION (Local Only)
   ======================================== */

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export function getUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(KEYS.user);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    const user = parsed as Record<string, unknown>;
    if (
      typeof user.id === "string" &&
      typeof user.name === "string" &&
      typeof user.email === "string" &&
      typeof user.createdAt === "number"
    ) {
      return user as unknown as LocalUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function setUser(user: LocalUser): void {
  try {
    localStorage.setItem(KEYS.user, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function removeUser(): void {
  try {
    localStorage.removeItem(KEYS.user);
  } catch {
    /* ignore */
  }
}

export function createUser(name: string, email: string): LocalUser {
  const user: LocalUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: Date.now(),
  };
  setUser(user);
  return user;
}

/**
 * Find user by email for login.
 * Since we store only one user at a time, this checks if the stored user matches.
 */
export function findUserByEmail(email: string): LocalUser | null {
  const user = getUser();
  if (!user) return null;
  
  // Compare emails case-insensitively
  if (user.email.toLowerCase() === email.trim().toLowerCase()) {
    return user;
  }
  return null;
}

/**
 * Login by email - sets the user if email matches stored user.
 * Returns the user if found, null otherwise.
 */
export function loginByEmail(email: string): LocalUser | null {
  const user = findUserByEmail(email);
  // If user found, they're already "logged in" (user is in storage)
  return user;
}

/* ========================================
   USAGE TRACKING (Local Only)
   ======================================== */

export interface UsageData {
  date: string; // "YYYY-MM-DD"
  count: number;
  lastUsedAt: number;
}

function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]!;
}

export function getUsage(): UsageData {
  try {
    const raw = localStorage.getItem(KEYS.usage);
    if (!raw) {
      return { date: getTodayDate(), count: 0, lastUsedAt: 0 };
    }
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) {
      return { date: getTodayDate(), count: 0, lastUsedAt: 0 };
    }
    const usage = parsed as Record<string, unknown>;
    if (
      typeof usage.date === "string" &&
      typeof usage.count === "number" &&
      typeof usage.lastUsedAt === "number"
    ) {
      // Reset if date changed
      if (usage.date !== getTodayDate()) {
        return { date: getTodayDate(), count: 0, lastUsedAt: 0 };
      }
      return usage as unknown as UsageData;
    }
    return { date: getTodayDate(), count: 0, lastUsedAt: 0 };
  } catch {
    return { date: getTodayDate(), count: 0, lastUsedAt: 0 };
  }
}

export function incrementUsage(): UsageData {
  const current = getUsage();
  const updated: UsageData = {
    date: getTodayDate(),
    count: current.count + 1,
    lastUsedAt: Date.now(),
  };
  try {
    localStorage.setItem(KEYS.usage, JSON.stringify(updated));
  } catch {
    /* ignore */
  }
  return updated;
}

export function canUseService(): { allowed: boolean; used: number; limit: number; isRegistered: boolean } {
  const user = getUser();
  const usage = getUsage();
  const isRegistered = user !== null;
  const limit = isRegistered ? 5 : 1;
  const used = usage.count;
  const allowed = used < limit;
  return { allowed, used, limit, isRegistered };
}
