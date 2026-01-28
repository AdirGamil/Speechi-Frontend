/**
 * AuthContext: Global authentication and usage state management.
 * 
 * Provides:
 * - User authentication state (login, register, logout)
 * - Usage tracking (used/limit per day)
 * - All state updates are reactive - no refresh needed
 * 
 * Usage model:
 * - Guest: 1 analysis per day
 * - Registered: 5 analyses per day
 * - Resets daily at midnight
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getUser,
  removeUser,
  createUser,
  findUserByEmail,
  getUsage,
  incrementUsage as incrementUsageStorage,
  type LocalUser,
  type UsageData,
} from "../lib/storage";

// ============================================
// Types
// ============================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface UsageInfo {
  usedToday: number;
  dailyLimit: number;
}

export interface LoginResult {
  success: boolean;
  user: AuthUser | null;
  error?: "not_found";
}

interface AuthContextValue {
  // Auth state
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initials: string;
  
  // Usage state
  usage: UsageInfo;
  canUse: boolean;
  
  // Auth actions
  login: (email: string) => LoginResult;
  register: (name: string, email: string) => AuthUser;
  logout: () => void;
  
  // Usage actions
  incrementUsage: () => void;
  refreshUsage: () => void;
  
  // Limit check
  checkLimit: () => {
    canProceed: boolean;
    limitReached: boolean;
    isRegistered: boolean;
    used: number;
    limit: number;
  };
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// Helper functions
// ============================================

function localUserToAuthUser(user: LocalUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0] + parts[1]![0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function calculateUsageInfo(usageData: UsageData, isRegistered: boolean): UsageInfo {
  const dailyLimit = isRegistered ? 5 : 1;
  return {
    usedToday: usageData.count,
    dailyLimit,
  };
}

// ============================================
// Provider
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Auth state
  const [user, setUserState] = useState<AuthUser | null>(() => {
    const stored = getUser();
    return stored ? localUserToAuthUser(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Usage state
  const [usageData, setUsageData] = useState<UsageData>(() => getUsage());

  // Derived state
  const isAuthenticated = user !== null;
  const initials = useMemo(() => (user ? getInitials(user.name) : ""), [user]);
  const usage = useMemo(
    () => calculateUsageInfo(usageData, isAuthenticated),
    [usageData, isAuthenticated]
  );
  const canUse = usageData.count < usage.dailyLimit;

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "speechi_user") {
        const stored = getUser();
        setUserState(stored ? localUserToAuthUser(stored) : null);
      }
      if (e.key === "speechi_usage" || e.key === "speechi_user") {
        setUsageData(getUsage());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ============================================
  // Auth Actions
  // ============================================

  const register = useCallback((name: string, email: string): AuthUser => {
    setIsLoading(true);
    try {
      const newUser = createUser(name, email);
      const authUser = localUserToAuthUser(newUser);
      setUserState(authUser);
      // Refresh usage since limit changes from 1 to 5
      setUsageData(getUsage());
      return authUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((email: string): LoginResult => {
    setIsLoading(true);
    try {
      const foundUser = findUserByEmail(email);
      if (foundUser) {
        const authUser = localUserToAuthUser(foundUser);
        setUserState(authUser);
        // Refresh usage
        setUsageData(getUsage());
        return { success: true, user: authUser };
      }
      return { success: false, user: null, error: "not_found" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeUser();
    setUserState(null);
    // Refresh usage since limit changes from 5 to 1
    setUsageData(getUsage());
  }, []);

  // ============================================
  // Usage Actions
  // ============================================

  const incrementUsage = useCallback(() => {
    const updated = incrementUsageStorage();
    setUsageData(updated);
  }, []);

  const refreshUsage = useCallback(() => {
    setUsageData(getUsage());
  }, []);

  const checkLimit = useCallback(() => {
    // Refresh first to ensure we have latest data
    const currentUsage = getUsage();
    setUsageData(currentUsage);
    
    const isRegistered = user !== null;
    const limit = isRegistered ? 5 : 1;
    const used = currentUsage.count;
    const allowed = used < limit;

    return {
      canProceed: allowed,
      limitReached: !allowed,
      isRegistered,
      used,
      limit,
    };
  }, [user]);

  // ============================================
  // Context Value
  // ============================================

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      initials,
      usage,
      canUse,
      login,
      register,
      logout,
      incrementUsage,
      refreshUsage,
      checkLimit,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      initials,
      usage,
      canUse,
      login,
      register,
      logout,
      incrementUsage,
      refreshUsage,
      checkLimit,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}

// Email validation helper (exported for use in components)
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}
