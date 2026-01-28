/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables.
 * These match the variables defined in .env.example
 */
interface ImportMetaEnv {
  /**
   * Base API URL for backend communication.
   * Must be set - no hardcoded fallbacks allowed.
   * 
   * Examples:
   * - Development: http://127.0.0.1:8000/api
   * - Production: https://speechi-api.adirg.dev
   */
  readonly VITE_API_BASE_URL: string;
  
  /**
   * App environment indicator.
   * Values: "development" | "production"
   */
  readonly VITE_APP_ENV: "development" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
