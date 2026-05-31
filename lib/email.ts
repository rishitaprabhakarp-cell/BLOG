import "server-only";
import type { ContactFormData } from "@/lib/contact";

// Email-sending adapter.
// - With no env vars set, this logs the payload server-side so the form/UX
//   can be tested end-to-end without a third-party account.
// - Set RESEND_API_KEY (and optionally CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)
//   in Vercel/`.env.local` to enable real delivery via Resend.
//   See https://resend.com/api-reference/emails/send-email
export async function sendContactEmail(payload: ContactFormData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.CONTACT_TO_EMAIL || "rishita.prabhakar.p@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    console.log(
      "[contact] RESEND_API_KEY not set — skipping send. Payload:",
      payload,
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `Portfolio contact from ${payload.name}`,
      text: `${payload.message}\n\n— ${payload.name} <${payload.email}>`,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API ${response.status}: ${body}`);
  }
}
