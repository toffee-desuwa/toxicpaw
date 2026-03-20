/**
 * Simple in-memory rate limiter (no external dependencies).
 *
 * Tracks request counts per IP using a Map. Automatically cleans up
 * stale entries to prevent memory leaks.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms
}

interface RateLimitConfig {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window size in milliseconds (default: 60_000 = 1 minute). */
  windowMs?: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

const CLEANUP_INTERVAL = 60_000; // run cleanup every 60 s
const cleanupTimers = new Map<string, ReturnType<typeof setInterval>>();

/**
 * Check whether a request should be allowed.
 *
 * @param request  Incoming request (used to extract client IP)
 * @param config   { limit, windowMs? }
 * @param storeKey Unique key to isolate counters between routes
 * @returns `true` if the request is within limits, `false` if it should be rejected.
 */
export function rateLimit(
  request: Request,
  config: RateLimitConfig,
  storeKey = "default"
): boolean {
  const { limit, windowMs = 60_000 } = config;

  // Resolve client IP from standard headers (works behind proxies / Vercel)
  const ip = getClientIp(request);

  // Lazily create a per-route store
  if (!stores.has(storeKey)) {
    stores.set(storeKey, new Map());
    // Schedule periodic cleanup so the Map never grows unbounded
    const timer = setInterval(() => cleanup(storeKey), CLEANUP_INTERVAL);
    // Allow the Node process to exit even if the timer is still alive
    if (typeof timer === "object" && "unref" in timer) timer.unref();
    cleanupTimers.set(storeKey, timer);
  }

  const store = stores.get(storeKey)!;
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now >= entry.resetAt) {
    // First request in this window (or window expired) -- start fresh
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count < limit) {
    entry.count += 1;
    return true;
  }

  // Limit exceeded
  return false;
}

/** Extract client IP from request headers. */
function getClientIp(request: Request): string {
  const headers = request.headers;

  // Vercel / Cloudflare / common reverse-proxy headers
  const forwarded =
    headers.get("x-forwarded-for") ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip");

  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; take the first
    return forwarded.split(",")[0].trim();
  }

  return "unknown";
}

/** Remove expired entries from a given store. */
function cleanup(storeKey: string) {
  const store = stores.get(storeKey);
  if (!store) return;

  const now = Date.now();
  for (const [ip, entry] of store) {
    if (now >= entry.resetAt) {
      store.delete(ip);
    }
  }

  // If the store is empty, tear it down entirely
  if (store.size === 0) {
    stores.delete(storeKey);
    const timer = cleanupTimers.get(storeKey);
    if (timer) {
      clearInterval(timer);
      cleanupTimers.delete(storeKey);
    }
  }
}
