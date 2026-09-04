"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Butterfly } from "@/components/Illustrations";

type Status = "idle" | "submitting" | "done" | "error";

/**
 * The smallest, quietest thing on the page, by design.
 *
 * No countdown, no "spots left", no pre-checked consent, no guilt on the way
 * out. The segment question is optional and stays optional. On failure the
 * address you typed is still sitting in the field.
 */
export function Waitlist() {
  const [email, setEmail] = useState("");
  const [segment, setSegment] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const emailId = useId();
  const segmentId = useId();
  const errorId = useId();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, segment }),
      });

      if (response.ok) {
        setStatus("done");
        return;
      }

      const { error } = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setMessage(
        error === "email"
          ? "That address doesn't look quite right — have another look?"
          : "That didn't send. Your email's still here, so try again in a moment.",
      );
    } catch {
      setStatus("error");
      setMessage("That didn't send. Your email's still here, so try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <div className="ori-paper-card px-6 py-9 text-center">
        <Butterfly className="mx-auto h-12 w-14 text-ink" />
        <p className="mt-4 font-[family-name:var(--font-hand)] text-[1.5rem] leading-snug text-ink">
          You&rsquo;re in.
        </p>
        <p className="mx-auto mt-2 max-w-[30rem] text-[1rem] leading-relaxed text-ink-soft">
          We&rsquo;ll only email you when it matters &mdash; which means when there&rsquo;s something to
          download, and almost never otherwise.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="ori-paper-card px-6 py-8 md:px-8">
      <h3 className="font-[family-name:var(--font-display)] text-[1.5rem] leading-tight text-ink">
        iPhone, coming soon.
      </h3>
      <p className="mt-2.5 max-w-[34rem] text-[1rem] leading-relaxed text-ink-soft">
        Leave an email if you&rsquo;d like to know when it&rsquo;s ready. We&rsquo;ll only write when there&rsquo;s
        something worth writing about, and you can leave in one click.
      </p>

      <div className="mt-6">
        <label htmlFor={emailId} className="block text-[0.95rem] font-semibold text-ink">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error" || undefined}
          aria-describedby={status === "error" ? errorId : undefined}
          placeholder="you@example.com"
          className="mt-2 min-h-[52px] w-full rounded-[14px] border-[1.5px] border-[var(--hairline)] bg-[var(--paper)] px-4 text-[1.05rem] text-ink placeholder:text-ink-soft/70"
        />
      </div>

      <div className="mt-5">
        <label htmlFor={segmentId} className="block text-[0.95rem] font-semibold text-ink">
          Are you asking for yourself, or for someone else?{" "}
          <span className="font-normal text-ink-soft">Optional.</span>
        </label>
        <select
          id={segmentId}
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          className="mt-2 min-h-[52px] w-full rounded-[14px] border-[1.5px] border-[var(--hairline)] bg-[var(--paper)] px-4 text-[1.05rem] text-ink"
        >
          <option value="">Rather not say</option>
          <option value="sufferer">For me</option>
          <option value="partner">For my partner, or someone I love</option>
          <option value="clinician">I work with patients</option>
        </select>
      </div>

      {status === "error" ? (
        <p id={errorId} role="alert" className="mt-4 text-[0.98rem] text-ink">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 min-h-[52px] w-full rounded-full bg-[var(--ink)] px-8 text-[1.05rem] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Keep me posted"}
      </button>

      <p className="mt-5 text-[0.88rem] leading-relaxed text-ink-soft">
        Your address, and nothing else. Not linked to anything you did on this page &mdash;
        nothing you did on this page left your device.{" "}
        <Link href="/privacy" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
          How we handle it
        </Link>
        .
      </p>
    </form>
  );
}
