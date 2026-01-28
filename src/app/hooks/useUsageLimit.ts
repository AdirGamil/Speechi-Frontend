/**
 * useUsageLimit hook: Re-exports from AuthContext for backward compatibility.
 * 
 * Usage state is now part of AuthContext for unified state management.
 * 
 * @deprecated Use useAuthContext from "../context/AuthContext" directly.
 */

import { useAuthContext } from "../context/AuthContext";

export function useUsageLimit() {
  const ctx = useAuthContext();
  
  return {
    usage: ctx.usage,
    used: ctx.usage.usedToday,
    limit: ctx.usage.dailyLimit,
    isRegistered: ctx.isAuthenticated,
    canUse: ctx.canUse,
    recordUsage: ctx.incrementUsage,
    checkLimit: ctx.checkLimit,
    refreshUsage: ctx.refreshUsage,
  };
}
