/**
 * useAuth hook: Re-exports from AuthContext for backward compatibility.
 * 
 * @deprecated Use useAuthContext from "../context/AuthContext" directly.
 */

export { useAuthContext as useAuth, isValidEmail } from "../context/AuthContext";
export type { AuthUser, LoginResult } from "../context/AuthContext";
