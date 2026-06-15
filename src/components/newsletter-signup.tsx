"use client";

import { useEffect, useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isSubmitting) return;

    const timeout = window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail("");
    }, 1400);

    return () => window.clearTimeout(timeout);
  }, [isSubmitting]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-resort-olive mb-3">Subscribed</p>
        <h4 className="font-serif text-2xl text-resort-cocoa mb-2">You&apos;re on the list.</h4>
        <p className="text-resort-cocoa/75">
          We&apos;ll use your email for resort updates, stay offers, and future announcements.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex items-center justify-center rounded bg-resort-cocoa px-6 py-3 text-sm font-semibold uppercase tracking-widest text-resort-white transition-colors hover:bg-resort-terracotta"
        >
          Add Another Email
        </button>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto py-6 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-resort-cocoa/15 border-t-resort-terracotta" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-resort-olive">Processing</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your Email Address"
        className="flex-1 px-6 py-4 bg-resort-white border-2 border-resort-white focus:outline-none focus:border-resort-terracotta transition-colors rounded text-resort-cocoa"
        required
      />
      <button
        type="submit"
        className="px-10 py-4 bg-resort-cocoa text-resort-white hover:bg-resort-terracotta transition-colors font-bold tracking-widest uppercase text-sm rounded shadow-md"
      >
        Subscribe
      </button>
    </form>
  );
}
