"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("success");
    setEmail("");
  }

  return (
    <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
      <div className="space-y-2">
        <h3 className="font-display text-xl font-semibold">Stay in the loop</h3>
        <p className="text-sm text-muted">
          Occasional notes on research, engineering experiments, and things worth
          reading. No spam — unsubscribe anytime.
        </p>
      </div>

      {status === "success" ? (
        <p className="mt-4 text-sm text-accent-fg">
          Thanks — you&apos;re on the list. (Wire this to your email provider when
          ready.)
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            className="sm:max-w-xs"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      )}
    </div>
  );
}
