/**
 * AI Response Cache — Prevents unnecessary API calls.
 * Uses localStorage with TTL (time-to-live) to cache AI responses.
 * This dramatically reduces Groq API usage.
 */

const CACHE_PREFIX = 'ai_cache_';

type CachedItem<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

/**
 * Get a cached AI response.
 * @returns The cached data if valid, or null if expired/missing.
 */
export function getCachedResponse<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const cached: CachedItem<T> = JSON.parse(raw);
    
    // Check if expired
    if (Date.now() > cached.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
}

/**
 * Store an AI response in cache.
 * @param ttlMinutes How long to keep the cache (default: 60 minutes)
 */
export function setCachedResponse<T>(key: string, data: T, ttlMinutes: number = 60): void {
  if (typeof window === 'undefined') return;

  try {
    const item: CachedItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (ttlMinutes * 60 * 1000),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch {
    // localStorage might be full, silently fail
  }
}

/**
 * Generate a cache key from input data.
 * Creates a simple hash from the stringified input.
 */
export function generateCacheKey(prefix: string, ...inputs: any[]): string {
  const str = JSON.stringify(inputs);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `${prefix}_${Math.abs(hash)}`;
}

/**
 * Clear all AI caches.
 */
export function clearAICache(): void {
  if (typeof window === 'undefined') return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}
