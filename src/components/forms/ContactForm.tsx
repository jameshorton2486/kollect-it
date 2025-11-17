"use client";

import { useState } from "react";
import React from "react";

/**
 * Interface defining the structure of the form state.
 */
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * A reusable, accessible, and validated Contact Form component.
 */
export default function ContactForm() {
  // --- State Initialization ---
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // --- Validation Logic ---
  const validate = (f: FormState): Partial<FormState> => {
    const e: Partial<FormState> = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = "Valid email required";
    if (!f.subject.trim()) e.subject = "Subject is required";
    if (f.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  };

  // --- Submission Handler ---
  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      // 🚨 REPLACE THIS WITH YOUR ACTUAL API CALL to send the data
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated network delay
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      if (process.env.NODE_ENV === "development")
        console.error("Form submission failed:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Reusable Input Component for Name, Email, Subject ---
  const Input = ({
    id,
    label,
    type = "text",
  }: {
    id: keyof FormState;
    label: string;
    type?: string;
  }) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-[hsl(var(--ink-900))]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(ev) => setForm((s) => ({ ...s, [id]: ev.target.value }))}
        className={`w-full rounded border px-3 py-2 outline-none transition-colors duration-150 ${errors[id] ? "border-red-500 ring-1 ring-red-500" : "border-[hsl(var(--border-300))] focus:border-gold"}`}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {errors[id] && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {errors[id]}
        </p>
      )}
    </div>
  );

  // --- Main Component Render ---
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded border border-[hsl(var(--border-300))] bg-cream p-6 shadow-lg"
    >
      {sent ? (
        <div className="text-center p-8">
          <h3 className="font-serif text-3xl font-bold text-ink">
            Message Sent Successfully! 🎉
          </h3>
          <p className="mt-3 text-lg text-[hsl(var(--ink-900))]">
            We appreciate you reaching out. We'll get back to you shortly.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-ink underline hover:text-gold"
            type="button"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-ink">
            Contact Us
          </h2>

          <Input id="name" label="Name *" />
          <Input id="email" label="Email *" type="email" />
          <Input id="subject" label="Subject *" />

          <div className="mb-4">
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium text-[hsl(var(--ink-900))]"
            >
              Message *
            </label>
            <textarea
              id="message"
              rows={6}
              maxLength={500}
              value={form.message}
              onChange={(ev) =>
                setForm((s) => ({ ...s, message: ev.target.value }))
              }
              className={`w-full rounded border px-3 py-2 outline-none transition-colors duration-150 ${errors.message ? "border-red-500 ring-1 ring-red-500" : "border-[hsl(var(--border-300))] focus:border-gold"}`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message && (
                <p id="message-error" className="text-sm text-red-600">
                  {errors.message}
                </p>
              )}
              <div className="ml-auto text-xs text-[hsl(var(--ink-700))]">
                {form.message.length} / 500
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-cta w-full py-2.5 font-bold rounded-md bg-cta text-white hover:bg-cta-hover transition-colors duration-200 disabled:bg-gray-400"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </>
      )}
    </form>
  );
}

