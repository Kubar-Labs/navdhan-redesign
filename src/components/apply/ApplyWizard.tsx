"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ChevronRight, Check } from "lucide-react";

export interface ApplyMessages {
  eyebrow?: string;
  heading?: string;
  description?: string;
  submit?: string;
  submitting?: string;
  successHeading?: string;
  successBody?: string;
  successCta?: string;
  errorHeading?: string;
  errorBody?: string;
  fieldRequired?: string;
  fullNameLabel?: string;
  emailLabel?: string;
  mobileLabel?: string;
  mobilePlaceholder?: string;
  amountLabel?: string;
  consentDataPrefix?: string;
  consentAnd?: string;
  consentPolicy?: string;
  privacyPolicy?: string;
  consentLender?: string;
  validation?: {
    mobileInvalid?: string;
    emailInvalid?: string;
    nameInvalid?: string;
    consentRequired?: string;
    amountInvalid?: string;
  };
  wizard?: {
    stepIndicator?: string[];
    back?: string;
    next?: string;
    step1Title?: string;
    step1Body?: string;
    businessNameLabel?: string;
    businessNamePlaceholder?: string;
    entityTypeLabel?: string;
    entityTypes?: Record<string, string>;
    annualTurnoverLabel?: string;
    annualTurnoverPlaceholder?: string;
    turnoverRanges?: Record<string, string>;
    securityNote?: string;
    step2Title?: string;
    step2Body?: string;
    step3Title?: string;
    step3Body?: string;
  };
}

interface ApplyWizardProps {
  locale: string;
  messages: ApplyMessages;
}

export function ApplyWizard({ locale, messages }: ApplyWizardProps) {
  const m = messages.wizard ?? {};
  const steps = m.stepIndicator ?? ["Business details", "Contact & loan", "Review & submit"];
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    entityType: "",
    annualTurnover: "",
    fullName: "",
    email: "",
    phone: "",
    requestedAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consentData, setConsentData] = useState(false);
  const [consentLender, setConsentLender] = useState(false);

  const validateStep1 = () => {
    const next: Record<string, string> = {};
    if (!form.businessName.trim()) next.businessName = messages.fieldRequired ?? "Required";
    if (!form.entityType) next.entityType = messages.fieldRequired ?? "Required";
    if (!form.annualTurnover) next.annualTurnover = messages.fieldRequired ?? "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = messages.fieldRequired ?? "Required";

    const email = form.email.trim();
    if (!email) {
      next.email = messages.fieldRequired ?? "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = messages.validation?.emailInvalid ?? "Invalid email";
    }

    const phone = form.phone.trim();
    if (!phone) {
      next.phone = messages.fieldRequired ?? "Required";
    } else if (!/^\d{10}$/.test(phone)) {
      next.phone = messages.validation?.mobileInvalid ?? "Invalid mobile";
    }

    const amount = form.requestedAmount.trim();
    if (!amount) {
      next.requestedAmount = messages.fieldRequired ?? "Required";
    } else if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      next.requestedAmount = messages.validation?.amountInvalid ?? "Invalid amount";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateReview = () => {
    const next: Record<string, string> = {};
    if (!consentData || !consentLender) {
      next.consent = messages.validation?.consentRequired ?? messages.fieldRequired ?? "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = () => {
    if (!validateReview()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-nt-slate-200 bg-white p-8 md:p-12">
        <StepIndicator steps={steps} current={3} />
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nt-green-500/10 text-nt-green-500">
            <Check className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-nt-slate-900">
            {messages.successHeading ?? "Thank you"}
          </h2>
          <p className="mt-2 text-nt-slate-600">
            {messages.successBody ?? "We have received your application."}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-6 inline-flex rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
          >
            {messages.successCta ?? "Back to home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-nt-slate-200 bg-white p-8 md:p-12">
      <StepIndicator steps={steps} current={step} />

      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
        {messages.eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-nt-slate-900">
        {messages.heading}
      </h1>
      <p className="mt-4 text-nt-slate-600">{messages.description}</p>

      {step === 1 && (
        <div className="mt-10 space-y-8">
          <div className="rounded-xl border border-nt-slate-200 p-6">
            <h2 className="text-lg font-semibold text-nt-slate-900">{m.step1Title}</h2>
            <p className="mt-1 text-sm text-nt-slate-600">{m.step1Body}</p>

            <div className="mt-6 space-y-5">
              <TextField
                id="businessName"
                label={m.businessNameLabel ?? "Business name"}
                placeholder={m.businessNamePlaceholder}
                value={form.businessName}
                onChange={(value) => setForm({ ...form, businessName: value })}
                error={errors.businessName}
                autoComplete="organization"
              />

              <div>
                <label htmlFor="entityType" className="block text-sm font-medium text-nt-slate-700">
                  {m.entityTypeLabel}
                </label>
                <select
                  id="entityType"
                  name="entityType"
                  value={form.entityType}
                  onChange={(e) => setForm({ ...form, entityType: e.target.value })}
                  className="mt-2 w-full rounded-md border border-nt-slate-300 bg-white px-4 py-3"
                >
                  <option value="">{m.entityTypeLabel}</option>
                  {Object.entries(m.entityTypes ?? {}).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.entityType && (
                  <p className="mt-1 text-xs text-nt-red-500">{errors.entityType}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="annualTurnover"
                  className="block text-sm font-medium text-nt-slate-700"
                >
                  {m.annualTurnoverLabel}
                </label>
                <select
                  id="annualTurnover"
                  name="annualTurnover"
                  value={form.annualTurnover}
                  onChange={(e) => setForm({ ...form, annualTurnover: e.target.value })}
                  className="mt-2 w-full rounded-md border border-nt-slate-300 bg-white px-4 py-3"
                >
                  <option value="">{m.annualTurnoverPlaceholder}</option>
                  {Object.entries(m.turnoverRanges ?? {}).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.annualTurnover && (
                  <p className="mt-1 text-xs text-nt-red-500">{errors.annualTurnover}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-nt-cream p-4 text-sm text-nt-slate-700">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-nt-slate-500" />
              {m.securityNote}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
          >
            <span className="flex items-center justify-center gap-2">
              {m.next}
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-10 space-y-8">
          <div className="rounded-xl border border-nt-slate-200 p-6">
            <h2 className="text-lg font-semibold text-nt-slate-900">{m.step2Title}</h2>
            <p className="mt-1 text-sm text-nt-slate-600">{m.step2Body}</p>

            <div className="mt-6 space-y-5">
              <TextField
                id="fullName"
                label={messages.fullNameLabel ?? "Full name"}
                value={form.fullName}
                onChange={(value) => setForm({ ...form, fullName: value })}
                error={errors.fullName}
                autoComplete="name"
              />

              <TextField
                id="email"
                type="email"
                label={messages.emailLabel ?? "Email"}
                value={form.email}
                onChange={(value) => setForm({ ...form, email: value })}
                error={errors.email}
                autoComplete="email"
              />

              <TextField
                id="phone"
                type="tel"
                label={messages.mobileLabel ?? "Mobile number"}
                placeholder={messages.mobilePlaceholder ?? "10-digit mobile"}
                value={form.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
                error={errors.phone}
                autoComplete="tel"
              />

              <TextField
                id="requestedAmount"
                label={messages.amountLabel ?? "Loan amount"}
                value={form.requestedAmount}
                onChange={(value) => setForm({ ...form, requestedAmount: value })}
                error={errors.requestedAmount}
                inputMode="numeric"
              />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-nt-cream p-4 text-sm text-nt-slate-700">
              <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-nt-slate-500" />
              {m.securityNote}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-md border border-nt-slate-300 bg-white px-6 py-3 text-sm font-semibold text-nt-slate-900 hover:bg-nt-slate-50"
            >
              {m.back}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
            >
              <span className="flex items-center justify-center gap-2">
                {m.next}
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-10 space-y-8">
          <div className="rounded-xl border border-nt-slate-200 p-6">
            <h2 className="text-lg font-semibold text-nt-slate-900">{m.step3Title}</h2>
            <p className="mt-1 text-sm text-nt-slate-600">{m.step3Body}</p>

            <dl className="mt-6 divide-y divide-nt-slate-100">
              <SummaryRow
                label={m.businessNameLabel ?? "Business name"}
                value={form.businessName}
              />
              <SummaryRow
                label={m.entityTypeLabel ?? "Business type"}
                value={m.entityTypes?.[form.entityType] ?? form.entityType}
              />
              <SummaryRow
                label={m.annualTurnoverLabel ?? "Annual turnover"}
                value={m.turnoverRanges?.[form.annualTurnover] ?? form.annualTurnover}
              />
              <SummaryRow label={messages.fullNameLabel ?? "Full name"} value={form.fullName} />
              <SummaryRow label={messages.emailLabel ?? "Email"} value={form.email} />
              <SummaryRow label={messages.mobileLabel ?? "Mobile number"} value={form.phone} />
              <SummaryRow
                label={messages.amountLabel ?? "Loan amount"}
                value={form.requestedAmount}
              />
            </dl>

            <div className="mt-6 space-y-4">
              <label className="flex items-start gap-3 text-sm text-nt-slate-700">
                <input
                  type="checkbox"
                  checked={consentData}
                  onChange={(e) => setConsentData(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-nt-slate-300 text-nt-orange-600"
                />
                <span>
                  {messages.consentDataPrefix}{" "}
                  <Link
                    href={`/${locale}/legal/consent-policy`}
                    className="underline hover:text-nt-slate-900"
                  >
                    {messages.consentPolicy}
                  </Link>{" "}
                  {messages.consentAnd}{" "}
                  <Link
                    href={`/${locale}/legal/privacy-policy`}
                    className="underline hover:text-nt-slate-900"
                  >
                    {messages.privacyPolicy}
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-nt-slate-700">
                <input
                  type="checkbox"
                  checked={consentLender}
                  onChange={(e) => setConsentLender(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-nt-slate-300 text-nt-orange-600"
                />
                <span>{messages.consentLender}</span>
              </label>

              {errors.consent && <p className="text-xs text-nt-red-500">{errors.consent}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 rounded-md border border-nt-slate-300 bg-white px-6 py-3 text-sm font-semibold text-nt-slate-900 hover:bg-nt-slate-50"
            >
              {m.back}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
            >
              {messages.submit}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TextField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-nt-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
      />
      {error && <p className="mt-1 text-xs text-nt-red-500">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 text-sm">
      <dt className="text-nt-slate-600">{label}</dt>
      <dd className="font-medium text-nt-slate-900">{value || "—"}</dd>
    </div>
  );
}

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isCompleted = stepNumber < current;
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive || isCompleted
                    ? "bg-nt-orange-600 text-white"
                    : "border border-nt-slate-300 text-nt-slate-500"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </span>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isActive || isCompleted ? "text-nt-slate-900" : "text-nt-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${
                  isCompleted ? "bg-nt-orange-600" : "bg-nt-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
