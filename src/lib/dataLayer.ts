// GTM dataLayer helpers. These only *feed* the GTM container already loaded in
// the root layout — the actual GA4 / Google Ads tags are configured inside GTM
// and fire on the "purchase" custom event pushed here.

type DataLayerObject = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
  }
}

function push(obj: DataLayerObject): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(obj);
}

// ── Buyer bridge ───────────────────────────────────────────────────────────
// The public pass endpoint doesn't return the buyer's email/phone, so we carry
// what the user typed in the registration form across the payment-gateway
// redirect. localStorage (not sessionStorage) so it survives the cross-origin
// round-trip to the gateway and back; cleared once the purchase event fires.
const BUYER_KEY = "fest_purchase_buyer";

export type Buyer = { name?: string; email?: string; phone?: string };

export function rememberBuyer(b: Buyer): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      BUYER_KEY,
      JSON.stringify({
        name: b.name || "",
        email: b.email || "",
        phone: b.phone || "",
      }),
    );
  } catch {
    // storage unavailable — user_data just won't have email/phone
  }
}

export function recallBuyer(): Buyer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BUYER_KEY);
    return raw ? (JSON.parse(raw) as Buyer) : null;
  } catch {
    return null;
  }
}

export function forgetBuyer(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(BUYER_KEY);
  } catch {
    // ignore
  }
}

export type PurchaseInput = {
  transactionId: string;
  value: number;
  currency: string;
  eventName: string;
  eventSlug: string;
  // Server-sourced. Email/phone are omitted when the backend doesn't expose
  // them (the public pass endpoint doesn't) — better empty than tampered.
  customerName?: string | null;
  email?: string | null;
  phone?: string | null;
  customerType?: "new" | "returning";
};

// Normalise a phone to +91XXXXXXXXXX (last 10 digits). Plaintext — GTM/Google
// hashes it for Enhanced Conversions, so we never pre-hash here.
function normalisePhone(raw?: string | null): string {
  const digits = (raw || "").replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `+91${digits}` : "";
}

function splitName(name?: string | null): { first: string; last: string } {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

// Push a GA4 `purchase` event with an Enhanced-Conversions `user_data` summary.
// Fires at most once per transaction (guards refresh / back-button re-fire so
// Google doesn't double-count), matching how the leads event was deduped.
export function pushPurchase(o: PurchaseInput): void {
  if (typeof window === "undefined" || !o.transactionId) return;

  try {
    const key = `purchase_fired_${o.transactionId}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // localStorage unavailable (private mode / blocked) — still fire once.
  }

  const { first, last } = splitName(o.customerName);
  const email = (o.email || "").trim().toLowerCase();
  const phone = normalisePhone(o.phone);
  const itemId = `${o.eventSlug || "event"}`
    .replace(/[^a-z0-9]+/gi, "_")
    .toUpperCase();

  // Clear any previous ecommerce object before pushing the new one.
  push({ ecommerce: null });
  push({
    event: "purchase",
    ecommerce: {
      currency: o.currency,
      value: o.value,
      transaction_id: o.transactionId,
      coupon: "",
      tax: 0,
      shipping: 0,
      customer_type: o.customerType || "new",
      items: [
        {
          item_id: `${itemId}_PASS`,
          item_name: o.eventName,
          item_brand: "CIMAGE",
          item_category: "Event Pass",
          price: o.value,
          quantity: 1,
          coupon: "",
        },
      ],
    },
    user_data: {
      email,
      phone_number: phone,
      address: { first_name: first, last_name: last },
    },
  });
}
