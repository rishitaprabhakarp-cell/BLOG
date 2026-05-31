export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_LIMITS = {
  name: { min: 1, max: 80 },
  email: { max: 200 },
  message: { min: 10, max: 2000 },
} as const;

export function validateContact(data: ContactFormData): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const name = data.name.trim();
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length > CONTACT_LIMITS.name.max) {
    errors.name = `Name is too long (max ${CONTACT_LIMITS.name.max}).`;
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = "Please enter your email.";
  } else if (email.length > CONTACT_LIMITS.email.max || !EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const message = data.message.trim();
  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length < CONTACT_LIMITS.message.min) {
    errors.message = `Message is too short (min ${CONTACT_LIMITS.message.min} characters).`;
  } else if (message.length > CONTACT_LIMITS.message.max) {
    errors.message = `Message is too long (max ${CONTACT_LIMITS.message.max} characters).`;
  }

  return errors;
}
