/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables.
 * These match the variables defined in .env.example
 */
interface ImportMetaEnv {
  /** Base API URL (e.g., http://127.0.0.1:8000/api) */
  readonly VITE_API_BASE_URL: string;
  
  /** App environment (development, production) */
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
