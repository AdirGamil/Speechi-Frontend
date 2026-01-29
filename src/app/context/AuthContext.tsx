/**
 * AuthContext: Global authentication and usage state management.
 * 
 * Supports two user types:
 * 1. Guest: Data stored in LocalStorage, 1 analysis/day
 * 2. Registered: Data stored in MongoDB via API, 5 analyses/day
 * 
 * Features:
 * - Real JWT authentication
 * - Usage tracking (local for guests, server for registered)
 * - Guest to registered migration
 * - All state updates are reactive - no refresh needed
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
import * as authApi from "../lib/authApi";
import {
  getUsage as getGuestUsage,
  incrementUsage as incrementGuestUsage,
  getHistory,
  clearHistory as clearGuestHistory,
  type UsageData,
} from "../lib/storage";

// ============================================
// Types
// ============================================

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string; // Computed: firstName + lastName
}

export interface UsageInfo {
  usedToday: number;
  dailyLimit: number;
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

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
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
  login: (payload: LoginPayload) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
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

function apiUserToAuthUser(apiUser: authApi.AuthUser): AuthUser {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
  };
}

function getInitials(firstName: string, lastName: string): string {
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  return "";
}

// ============================================
// Provider
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Usage state
  const [serverUsage, setServerUsage] = useState<UsageInfo>({ usedToday: 0, dailyLimit: 5 });
  const [guestUsage, setGuestUsage] = useState<UsageData>(() => getGuestUsage());

  // Derived state
  const isAuthenticated = user !== null;
  const initials = useMemo(() => {
    if (!user) return "";
    return getInitials(user.firstName, user.lastName);
  }, [user]);
  
  // Combined usage based on auth state
  const usage = useMemo<UsageInfo>(() => {
    if (isAuthenticated) {
      return serverUsage;
    }
    return {
      usedToday: guestUsage.count,
      dailyLimit: 1,
    };
  }, [isAuthenticated, serverUsage, guestUsage]);
  
  const canUse = usage.usedToday < usage.dailyLimit;

  // Initialize auth on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const response = await authApi.initializeAuth();
        if (response) {
          setUser(apiUserToAuthUser(response.user));
          setServerUsage(response.usage);
        }
      } catch {
        // Not authenticated or error
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // ============================================
  // Auth Actions
  // ============================================

  const register = useCallback(async (payload: RegisterPayload): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const response = await authApi.register(payload);
      const authUser = apiUserToAuthUser(response.user);
      
      // Migrate guest meetings
      const guestMeetings = getHistory();
      if (guestMeetings.length > 0) {
        try {
          await authApi.migrateMeetings(guestMeetings);
          clearGuestHistory();
        } catch (e) {
          console.error("[Auth] Failed to migrate meetings:", e);
        }
      }
      
      setUser(authUser);
      setServerUsage(response.usage);
      
      return { success: true, user: authUser };
    } catch (e) {
      const error = e as authApi.ApiError;
      return { success: false, error: error.detail || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const response = await authApi.login(payload);
      const authUser = apiUserToAuthUser(response.user);
      
      setUser(authUser);
      setServerUsage(response.usage);
      
      return { success: true, user: authUser };
    } catch (e) {
      const error = e as authApi.ApiError;
      return { success: false, error: error.detail || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setServerUsage({ usedToday: 0, dailyLimit: 5 });
    // Refresh guest usage
    setGuestUsage(getGuestUsage());
  }, []);

  // ============================================
  // Usage Actions
  // ============================================

  const incrementUsage = useCallback(() => {
    if (isAuthenticated) {
      // Server usage is incremented by the API call
      // Just refresh from server
      authApi.getUsage().then(setServerUsage).catch(() => {});
    } else {
      // Guest - increment locally
      const updated = incrementGuestUsage();
      setGuestUsage(updated);
    }
  }, [isAuthenticated]);

  const refreshUsage = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const usage = await authApi.getUsage();
        setServerUsage(usage);
      } catch {
        // Ignore
      }
    } else {
      setGuestUsage(getGuestUsage());
    }
  }, [isAuthenticated]);

  const checkLimit = useCallback(() => {
    const isRegistered = user !== null;
    const limit = isRegistered ? serverUsage.dailyLimit : 1;
    const used = isRegistered ? serverUsage.usedToday : guestUsage.count;
    const allowed = used < limit;

    return {
      canProceed: allowed,
      limitReached: !allowed,
      isRegistered,
      used,
      limit,
    };
  }, [user, serverUsage, guestUsage]);

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
