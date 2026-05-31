"use server";

import { validateContact, type ContactFieldErrors } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";

export type ContactState = {
  status: "idle" | "ok" | "error";
  message?: string;
  fieldErrors?: ContactFieldErrors;
  // Bumped on every result so client effects fire even on identical outcomes.
  nonce?: number;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const data = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const fieldErrors = validateContact(data);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      nonce: Date.now(),
    };
  }

  try {
    await sendContactEmail({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    });
    return {
      status: "ok",
      message: "Thanks — your message has been sent. I'll reply soon.",
      nonce: Date.now(),
    };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return {
      status: "error",
      message:
        "Sorry, something went wrong. Please try again or email me directly.",
      nonce: Date.now(),
    };
  }
}
