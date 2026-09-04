import { NextResponse } from "next/server";

/**
 * The waitlist endpoint — the only thing on this site that ever leaves the
 * device, and only because a person typed an email address and pressed a button.
 *
 * It takes an email and an optional, never-required segment. It does not
 * receive, and must never be extended to receive, anything from the self-check
 * or the aura demo.
 *
 * Configure before deploying:
 *   WAITLIST_ENDPOINT  the first-party URL of your store or ESP's API
 *   WAITLIST_TOKEN     its bearer token
 * Both belong to a provider with a signed DPA. With them unset the route fails
 * honestly rather than pretending a sign-up succeeded.
 */

export const runtime = "nodejs";

/* Deliberately permissive — the point is to catch typos, not to police
   what a valid address may look like. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SEGMENTS = new Set(["sufferer", "partner", "clinician", ""]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "malformed" }, { status: 400 });
  }

  const { email, segment } = (body ?? {}) as { email?: unknown; segment?: unknown };

  if (typeof email !== "string" || !EMAIL.test(email.trim()) || email.length > 254) {
    return NextResponse.json({ error: "email" }, { status: 400 });
  }

  const seg = typeof segment === "string" ? segment : "";
  if (!SEGMENTS.has(seg)) {
    return NextResponse.json({ error: "segment" }, { status: 400 });
  }

  const endpoint = process.env.WAITLIST_ENDPOINT;
  const token = process.env.WAITLIST_TOKEN;

  if (!endpoint || !token) {
    console.error("[waitlist] WAITLIST_ENDPOINT / WAITLIST_TOKEN are not configured.");
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        segment: seg || null,
        source: "oriyali-web",
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      console.error("[waitlist] upstream responded", upstream.status);
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
  } catch (error) {
    console.error("[waitlist] upstream unreachable", error);
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
