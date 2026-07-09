// Fest website API client — site: fest.cimage.in (QR target /p/<token>)
// Base + endpoints per the fest backend. No auth required.

export const FEST_API_BASE =
  process.env.NEXT_PUBLIC_FEST_API_BASE ??
  "https://backend-admission.cimagepatna.com/api/fest";

export type FestEventInfo = {
  slug: string;
  name: string;
  description?: string;
  venue: string;
  starts_at: string | null;
  ends_at: string | null;
  requires_payment: boolean;
  amount: number | string;
  currency: string;
  is_active: boolean;
};

// Full public pass shape (PublicPassSerializer).
export type FestPassDetail = {
  code: string;
  status: string; // blank | claimed | used | cancelled
  event?: string;
  registration_name: string | null;
  png_s3_url?: string;
  s3_url?: string;
  issued_at?: string;
  claimed_at?: string;
};

// Education board dropdown: send `value`, show `label`.
export const BOARD_OPTIONS = [
  { value: "cbse", label: "CBSE" },
  { value: "icse", label: "ICSE" },
  { value: "state_board", label: "State Board" },
  { value: "bseb", label: "BSEB" },
  { value: "other", label: "Other" },
] as const;

export type RegisterPayload = {
  name: string; // required
  phone: string; // required (10 digits)
  email?: string;
  board?: string; // one of BOARD_OPTIONS values, or omitted
  course?: string; // sent as preferred_course; backend also accepts `course`
  school_name?: string;
  city?: string;
  id_card?: File | null; // jpg/png/pdf — triggers a multipart upload to S3
  extra?: Record<string, unknown>; // future-proofing; no backend change needed
};

export type RegisterSuccess = {
  registration_id: string;
  requires_payment: false;
  pass: { code: string; status: string; s3_url: string };
};

export type RegisterPaymentPending = {
  registration_id: string;
  requires_payment: true;
  payment_url: string;
  reference_id: string;
};

export type RegisterResult = RegisterSuccess | RegisterPaymentPending;

export type PassResolution = {
  needs_claim: boolean; // true when status === "blank"
  event: FestEventInfo;
  pass: FestPassDetail;
};

// Collect DRF-style field validation messages, e.g.
// { "phone": ["Phone must be 10 digits."], "board": ["…"] } → the strings.
// `includeStrings` picks up plain string values too (used for nested error
// bags like `details` / `errors`, where a value may be a bare message).
function collectFieldErrors(
  obj: Record<string, unknown>,
  includeStrings = false,
): string[] {
  const out: string[] = [];
  for (const val of Object.values(obj)) {
    if (typeof val === "string") {
      if (includeStrings && val) out.push(val);
      continue; // otherwise top-level metadata, not a field error
    }
    if (Array.isArray(val)) {
      for (const item of val) if (typeof item === "string") out.push(item);
    }
  }
  return out;
}

// Turn a parsed error body into the best human message we can find.
function errorMessageFrom(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;

    // Prefer the specific field message(s) over any generic wrapper text.
    const fieldMsgs = collectFieldErrors(obj);
    if (fieldMsgs.length) return fieldMsgs.join(" ");

    // Nested error bags: `details` / `errors` / `data`.
    for (const key of ["details", "errors", "data"] as const) {
      const nested = obj[key];
      if (nested && typeof nested === "object") {
        const msgs = collectFieldErrors(nested as Record<string, unknown>, true);
        if (msgs.length) return msgs.join(" ");
      }
    }

    // Single-message forms.
    const direct = obj.error ?? obj.detail ?? obj.message;
    if (typeof direct === "string" && direct) return direct;
  }
  return `Request failed (${status})`;
}

// Read a wrapped API response and return its `data` payload. Throws a friendly
// Error when the request failed — either by HTTP status OR by the backend's
// `{ success: false, error, details }` envelope, which can arrive with a 200.
async function readData<T>(res: Response): Promise<T> {
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }
  const obj =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  if (!res.ok || obj.success === false) {
    throw new Error(errorMessageFrom(body, res.status));
  }
  return obj.data as T;
}

// GET /api/fest/{slug}/ — event details for the registration page.
// Returns null when the event is inactive/unknown (404).
export async function getFestEvent(slug: string): Promise<FestEventInfo | null> {
  const res = await fetch(`${FEST_API_BASE}/${slug}/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  return readData<FestEventInfo>(res);
}

// Activity card shown on the website for a fest.
export type FestActivity = {
  id: string;
  register_slug: string; // CTA → POST /api/fest/<register_slug>/register/
  icon: string;
  category: string;
  name: string;
  description: string;
  date_label: string;
  time_label: string;
  venue: string;
  team_size: string;
  prize_pool: string;
  background_image_url: string; // "" until a banner is uploaded → use a fallback
  order: number;
  is_active: boolean;
};

// GET /api/fest/<fest_slug>/activities/ — active cards for that fest, in `order`.
export async function getFestActivities(
  festSlug: string,
): Promise<FestActivity[]> {
  const res = await fetch(`${FEST_API_BASE}/${festSlug}/activities/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return readData<FestActivity[]>(res);
}

// Build the fetch init for register/claim from a RegisterPayload: multipart
// when an ID card is attached (needed for the file), plain JSON otherwise.
// The claim endpoint accepts the identical RegisterSerializer body.
function buildRegisterInit(payload: RegisterPayload): RequestInit {
  const fields: Record<string, string> = {
    name: payload.name,
    phone: payload.phone,
  };
  if (payload.email) fields.email = payload.email;
  if (payload.board) fields.board = payload.board;
  if (payload.course) fields.preferred_course = payload.course;
  if (payload.school_name) fields.school_name = payload.school_name;
  if (payload.city) fields.city = payload.city;
  const hasExtra = payload.extra && Object.keys(payload.extra).length > 0;

  if (payload.id_card instanceof File) {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
    if (hasExtra) fd.append("extra", JSON.stringify(payload.extra));
    fd.append("id_card", payload.id_card);
    // No Content-Type header — the browser sets the multipart boundary.
    return { method: "POST", headers: { Accept: "application/json" }, body: fd };
  }

  const body: Record<string, unknown> = { ...fields };
  if (hasExtra) body.extra = payload.extra;
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  };
}

// POST /api/fest/{slug}/register/ — register a participant.
export async function registerForFest(
  slug: string,
  payload: RegisterPayload,
): Promise<RegisterResult> {
  const res = await fetch(
    `${FEST_API_BASE}/${slug}/register/`,
    buildRegisterInit(payload),
  );
  // Backend wraps the payload in { success, message, status, data: {…} } and
  // signals failures (e.g. duplicate phone) with success:false — which may even
  // arrive as a 200, so readData checks the envelope, not just the HTTP status.
  return readData<RegisterResult>(res);
}

// POST /api/fest/pass/{token}/claim/ — claim a blank pass in place.
// Quirk: unlike the GET (which nests the pass under data.pass), the claim
// response returns the pass as `data` itself.
export async function claimPass(
  token: string,
  payload: RegisterPayload,
): Promise<FestPassDetail> {
  const res = await fetch(
    `${FEST_API_BASE}/pass/${token}/claim/`,
    buildRegisterInit(payload),
  );
  return readData<FestPassDetail>(res);
}

export type FestPass = { code: string; status: string; s3_url?: string };

export type PaymentLookup = {
  registered: boolean;
  name?: string | null;
  paid?: boolean;
  can_retry: boolean;
  amount?: string | number;
  last_payment_status?: string | null;
  pass?: FestPass | null;
};

export type PaymentRetryResult =
  | {
      paid: false;
      amount: string;
      payment_url: string;
      reference_id: string;
    }
  | { paid: true; pass: FestPass };

// GET /api/fest/{slug}/payment/lookup/?phone= — check payment state by phone.
export async function lookupPayment(
  slug: string,
  phone: string,
): Promise<PaymentLookup> {
  const res = await fetch(
    `${FEST_API_BASE}/${slug}/payment/lookup/?phone=${encodeURIComponent(phone)}`,
    { headers: { Accept: "application/json" }, cache: "no-store" },
  );
  return readData<PaymentLookup>(res);
}

// POST /api/fest/{slug}/payment/retry/ — mint a fresh order (or return the
// existing pass if already paid). Redirect to payment_url when unpaid.
export async function retryPayment(
  slug: string,
  phone: string,
): Promise<PaymentRetryResult> {
  const res = await fetch(`${FEST_API_BASE}/${slug}/payment/retry/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ phone }),
  });
  return readData<PaymentRetryResult>(res);
}

// GET /api/fest/pass/{token}/ — resolve a scanned QR (drives /p/<token>).
// {token} is the signed value from the QR; the raw code also works.
export async function resolvePass(token: string): Promise<PassResolution> {
  const res = await fetch(`${FEST_API_BASE}/pass/${token}/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return readData<PassResolution>(res);
}
