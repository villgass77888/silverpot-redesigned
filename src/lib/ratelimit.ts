import 'server-only';

/**
 * Per-IP rate limit (§5.5): 5 submissions per 10 minutes.
 * Upstash Redis when its env is present; otherwise an in-memory sliding window
 * (per server instance — good enough as a second line behind Turnstile).
 */
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const memory = new Map<string, number[]>();

type Limiter = { limit(key: string): Promise<{ success: boolean }> };
let upstash: Limiter | null | undefined;

async function getUpstash(): Promise<Limiter | null> {
  if (upstash !== undefined) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return (upstash = null);
  const [{ Ratelimit }, { Redis }] = await Promise.all([
    import('@upstash/ratelimit'),
    import('@upstash/redis'),
  ]);
  upstash = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LIMIT, '10 m'),
    prefix: 'silverpot-forms',
  });
  return upstash;
}

export async function rateLimit(key: string): Promise<boolean> {
  const remote = await getUpstash();
  if (remote) return (await remote.limit(key)).success;
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 5000) memory.clear();
  return true;
}
