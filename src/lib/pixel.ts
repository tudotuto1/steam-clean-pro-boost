// Meta Pixel helper. The Pixel ID is public, so hardcoding it is fine.
export const META_PIXEL_ID = "4360012974213226";
export const CONTENT_ID = "vaporpro-steam-cleaner";
export const CURRENCY = "CAD";
export const PRICE = 85;

type FbqParams = Record<string, unknown>;
interface FbqOptions {
  eventID?: string;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a Meta Pixel event via window.fbq, only if fbq is available.
 * Never throws — a missing fbq (ad blocker, SSR) must not break the app.
 */
export function track(event: string, params?: FbqParams, options?: FbqOptions) {
  if (typeof window === "undefined") return;
  const fbq = window.fbq;
  if (typeof fbq !== "function") return;
  try {
    if (options) {
      fbq("track", event, params ?? {}, options);
    } else if (params) {
      fbq("track", event, params);
    } else {
      fbq("track", event);
    }
  } catch {
    // Swallow: the pixel must never break the page.
  }
}
