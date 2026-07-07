// Fest website API client — fast.cimage.in
// Base + endpoints per the fest backend. No auth required.

export const FEST_API_BASE =
  process.env.NEXT_PUBLIC_FEST_API_BASE ??
  "https://backend-admission.cimagepatna.com/api/fest";

export type FestEventInfo = {
  slug: string;
  name: string;
  description?: string;
  venue: string;
  starts_at: string;
  ends_at: string;
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

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as Record<string, unknown>;
    const msg =
      (body.detail as string) ||
      (body.message as string) ||
      (body.error as string);
    if (msg) return msg;
  } catch {
    // non-JSON body — fall through
  }
  return `Request failed (${res.status})`;
}

// GET /api/fest/{slug}/ — event details for the registration page.
// Returns null when the event is inactive/unknown (404).
export async function getFestEvent(slug: string): Promise<FestEventInfo | null> {
  const res = await fetch(`${FEST_API_BASE}/${slug}/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { data: FestEventInfo };
  return json.data;
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
  if (!res.ok) throw new Error(await readError(res));
  // Backend wraps the payload in { success, message, status, data: {…} }.
  const json = (await res.json()) as { data: RegisterResult };
  return json.data;
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
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { data: FestPassDetail };
  return json.data;
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
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { data: PaymentLookup };
  return json.data;
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
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { data: PaymentRetryResult };
  return json.data;
}

// GET /api/fest/pass/{token}/ — resolve a scanned QR (drives /p/<token>).
// {token} is the signed value from the QR; the raw code also works.
export async function resolvePass(token: string): Promise<PassResolution> {
  const res = await fetch(`${FEST_API_BASE}/pass/${token}/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await readError(res));
  const json = (await res.json()) as { data: PassResolution };
  return json.data;
}
