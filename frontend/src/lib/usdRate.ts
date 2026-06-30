// ─────────────────────────────────────────────────────────────
// Suman Travels — USD Exchange Rate Utility
// ─────────────────────────────────────────────────────────────

const FALLBACK_RATE = 83.5;
const CACHE_KEY = 'suman_usd_rate';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

interface RateCache {
  rate: number;
  fetchedAt: number;
}

export async function fetchLiveUsdRate(): Promise<number> {
  // Check localStorage cache first
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed: RateCache = JSON.parse(cached);
        if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) {
          return parsed.rate;
        }
      } catch { /* ignore */ }
    }
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const rate: number = data?.rates?.INR ?? FALLBACK_RATE;

    // Cache it
    if (typeof window !== 'undefined') {
      const cache: RateCache = { rate, fetchedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
    return rate;
  } catch {
    return FALLBACK_RATE;
  }
}

export function getManualUsdRate(): number {
  if (typeof window === 'undefined') return FALLBACK_RATE;
  const stored = localStorage.getItem('suman_manual_usd_rate');
  return stored ? parseFloat(stored) : FALLBACK_RATE;
}

export function setManualUsdRate(rate: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('suman_manual_usd_rate', rate.toString());
}

export function getEffectiveRate(manualRate: number | null, liveRate: number | null, useLive: boolean): number {
  if (!useLive && manualRate) return manualRate;
  return liveRate ?? manualRate ?? FALLBACK_RATE;
}
