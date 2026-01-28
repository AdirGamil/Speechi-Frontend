/**
 * Minimal router: pathname + navigate. No React Router dependency.
 */

import { useCallback, useSyncExternalStore } from "react";

export type Path = "/" | "/app" | "/app/history" | "/app/settings";

function getPath(): Path {
  const p = typeof window === "undefined" ? "/" : window.location.pathname;
  if (p.startsWith("/app/history")) return "/app/history";
  if (p.startsWith("/app/settings")) return "/app/settings";
  if (p.startsWith("/app")) return "/app";
  return "/";
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
}

function getSnapshot(): Path {
  return getPath();
}

function getServerSnapshot(): Path {
  return "/";
}

export function usePathname(): Path {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useNavigate() {
  return useCallback((path: string) => {
    if (window.location.pathname === path) return;
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);
}
