/**
 * Root app: minimal router. Entry loader on first / visit, then Landing vs App shell.
 * 
 * Providers:
 * - LanguageProvider: i18n and RTL support
 * - AuthProvider: global auth and usage state
 */

import { useCallback, useState } from "react";
import { usePathname } from "./app/lib/router";
import { LanguageProvider } from "./app/context/LanguageContext";
import { AuthProvider } from "./app/context/AuthContext";
import { AppShell } from "./app/components/AppShell";
import { EntryLoader } from "./app/components/EntryLoader";
import { Landing } from "./app/pages/Landing";
import { NewMeeting } from "./app/pages/NewMeeting";
import { HistoryPage } from "./app/pages/HistoryPage";
import { SettingsPage } from "./app/pages/SettingsPage";

const LOADER_SEEN_KEY = "speechi.loaderSeen";

export default function App() {
  const path = usePathname();
  const [loaderDone, setLoaderDone] = useState(() => {
    if (typeof window === "undefined") return true;
    return path !== "/" || !!sessionStorage.getItem(LOADER_SEEN_KEY);
  });

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem(LOADER_SEEN_KEY, "1");
    setLoaderDone(true);
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        {path === "/" ? (
          !loaderDone ? (
            <EntryLoader onComplete={handleLoaderComplete} />
          ) : (
            <Landing />
          )
        ) : (
          <AppShell>
            {path === "/app" ? <NewMeeting /> : null}
            {path === "/app/history" ? <HistoryPage /> : null}
            {path === "/app/settings" ? <SettingsPage /> : null}
          </AppShell>
        )}
      </AuthProvider>
    </LanguageProvider>
  );
}
