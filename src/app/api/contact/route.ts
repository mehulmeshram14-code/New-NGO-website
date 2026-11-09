import { NextRequest, NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { googleContactForm } from "@/data/contactForm";

const GOOGLE_TIMEOUT_MS = 10_000;

/**
 * Receives the custom contact form and forwards it to the "Contact Us" Google Form,
 * so responses keep landing in the same Google Forms / Sheets inbox as before.
 */
export async function POST(req: NextRequest) {
  const { allowed } = checkRateLimit(`contact:${getClientIp(req.headers)}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many messages from your connection. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled in: almost certainly a bot. Pretend success so it doesn't retry.
  if (typeof body === "object" && body !== null && (body as { website?: unknown }).website) {
    return NextResponse.json({ success: true });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { success: false, error: issue?.message ?? "Please check the form and try again.", field: issue?.path.join(".") },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;
  const { formResponseUrl, entries } = googleContactForm;

  const payload = new URLSearchParams({
    [entries.name]: name,
    [entries.email]: email,
    [entries.subject]: subject,
    [entries.message]: message,
    fvv: "1",
    pageHistory: "0",
  });

  try {
    const res = await fetch(formResponseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
      redirect: "follow",
      signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS),
      cache: "no-store",
    });

    // Google answers 200 when the response is recorded; 4xx usually means the form's
    // questions changed (stale entry IDs) or the form stopped accepting responses.
    if (!res.ok) {
      console.error(`Google Form submission rejected: HTTP ${res.status}`);
      return NextResponse.json(
        { success: false, error: "We couldn't send your message right now. Please email us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Google Form submission failed:", (err as Error)?.message || err);
    return NextResponse.json(
      { success: false, error: "We couldn't send your message right now. Please email us directly." },
      { status: 502 }
    );
  }
}
