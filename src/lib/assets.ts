// CIMAGE asset CDN (the S3 bucket that hosts shared media). Mirrors the helper
// used on the "/" route.
//   S3_BASE      → bucket root ".../public"        (reels, guest photos, screenshots)
//   asset(path)  → ".../public/public" + path      (badges, brand & section images)
export const S3_BASE =
  process.env.NEXT_PUBLIC_S3_BASE ??
  "https://cimage-web.s3.ap-south-1.amazonaws.com/public";

const ASSET_BASE = `${S3_BASE}/public`;

export function asset(path: string): string {
  return `${ASSET_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
