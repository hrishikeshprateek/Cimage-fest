// UTM attribution capture. The campaign params live on the *landing* URL, but
// the user usually registers a few clicks later (by which point client-side
// navigation has dropped the query string) — so we stash them on first load and
// read them back at submit time.

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "fest_utm";

// Read UTM params off the current URL and persist them for the session. Only
// overwrites when the current URL actually carries UTMs, so later navigations
// don't wipe an earlier capture.
export function captureUtm(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: UtmParams = {};
    let any = false;
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) {
        found[k] = v;
        any = true;
      }
    }
    if (any) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // storage/URL unavailable — attribution just won't be captured
  }
}

export function getUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}
