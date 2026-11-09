/**
 * Lightweight in-memory, per-instance IP rate limiter for API routes.
 * Good enough to blunt casual abuse on a single server; use a shared store
 * (e.g. Redis) if the site is ever scaled to multiple instances.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_TRACKED_KEYS = 10_000;

function pruneExpired(now: number) {
  for (const [key, record] of rateLimitMap) {
    if (now > record.resetTime) rateLimitMap.delete(key);
  }
}

/**
 * Best-effort client IP.
 *
 * The left-most X-Forwarded-For entry is supplied by the client and trivially
 * spoofed, so it must not be used. Prefer X-Real-IP (set by our nginx proxy via
 * `proxy_set_header X-Real-IP $remote_addr;`), then the right-most XFF entry,
 * which is the one appended by the nearest proxy.
 */
export function getClientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((h) => h.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }

  return "unknown";
}

export function checkRateLimit(ip: string, limit = 10, windowMs = 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();

  if (rateLimitMap.size >= MAX_TRACKED_KEYS) {
    pruneExpired(now);
  }

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}
