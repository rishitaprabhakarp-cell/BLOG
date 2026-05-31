"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { useToast } from "@/components/Toast";

const STORAGE_KEY = "contact-form-draft";
const initialState: ContactState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!formRef.current) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<{
        name: string;
        email: string;
        message: string;
      }>;
      const form = formRef.current;
      const set = (n: string, v: string | undefined) => {
        if (!v) return;
        const el = form.elements.namedItem(n) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;
        if (el) el.value = v;
      };
      set("name", draft.name);
      set("email", draft.email);
      set("message", draft.message);
    } catch {
    }
  }, []);

  useEffect(() => {
    if (state.status === "idle") return;

    if (state.status === "ok") {
      toast(state.message ?? "Sent!", "success");
      formRef.current?.reset();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
      }
      return;
    }

    toast(state.message ?? "Something went wrong.", "error");
    const form = formRef.current;
    if (!form) return;
    try {
      const draft = {
        name:
          (form.elements.namedItem("name") as HTMLInputElement | null)?.value ??
          "",
        email:
          (form.elements.namedItem("email") as HTMLInputElement | null)
            ?.value ?? "",
        message:
          (form.elements.namedItem("message") as HTMLTextAreaElement | null)
            ?.value ?? "",
      };
      if (draft.name || draft.email || draft.message) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      }
    } catch {
    }
  }, [state, toast]);

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="flex flex-col gap-4"
    >
      <Field
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
        error={fieldErrors.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={fieldErrors.email}
      />
      <Field
        label="Message"
        name="message"
        type="textarea"
        required
        error={fieldErrors.message}
      />
      <SubmitButton />
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
  required?: boolean;
  error?: string;
};

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
  error,
}: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const baseCls =
    "no-console-hover console-border-hover w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:outline-none";
  const stateCls = error
    ? "border-red-500/60 focus:border-red-500/80"
    : "border-border-strong hover:border-highlight focus:border-highlight";
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="no-console-hover text-xs font-semibold uppercase tracking-wider text-muted-2"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={5}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${baseCls} ${stateCls} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${baseCls} ${stateCls}`}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <SendIcon className="h-4 w-4" />
      )}
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
