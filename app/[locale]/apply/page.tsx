"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/src/components/layout/Container";
import { emiDefaults } from "@/src/lib/data/siteData";
import { formatCurrencyInr, calculateEmiBreakdown } from "@/src/lib/utils/emi";

const copyByLocale: Record<
  string,
  { heading: string; description: string; consentLender: string; submit: string }
> = {
  en: {
    heading: "Get the right business loan, without chasing banks.",
    description: "Fill a few details to check your eligibility. It takes less than 5 minutes.",
    consentLender:
      "I consent to sharing my details so NavDhan can find a loan offer for my business.",
    submit: "Check Eligibility",
  },
  hi: {
    heading: "सही बिज़नेस लोन पाएँ, बैंकों के पीछे न भागें।",
    description: "पात्रता जाँचने के लिए कुछ विवरण भरें। इसमें 5 मिनट से भी कम समय लगता है।",
    consentLender:
      "मैं सहमत हूँ कि मेरे व्यवसाय के लिए लोन ऑफ़र ढूंढने के लिए NavDhan मेरे विवरण साझा कर सकता है।",
    submit: "पात्रता जाँचें",
  },
};

export default function ApplyPage() {
  const { locale } = useParams<{ locale: string }>();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    amount: String(emiDefaults.defaultAmount),
    tenure: String(emiDefaults.defaultTenure),
    purpose: "working_capital",
    fullName: "",
    mobile: "",
    email: "",
    pinCode: "",
    consentData: false,
    consentLender: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await fetch(`/api/apply/state`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({
          step: "loan_intent",
          data: {
            loanAmount: Number(form.amount),
            tenureMonths: Number(form.tenure),
            purpose: form.purpose,
            fullName: form.fullName,
            mobileNumber: form.mobile,
            email: form.email,
            businessPinCode: form.pinCode,
          },
        }),
      });
    } catch {
      // ignore network errors in this stub
    }
    setSubmitted(true);
  };

  const breakdown = calculateEmiBreakdown(Number(form.amount), 18, Number(form.tenure));

  if (submitted) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-semibold text-nt-slate-900">Thank you</h1>
        <p className="mt-4 text-nt-slate-600">
          We have received your application. A NavDhan advisor will reach out within 24 hours.
        </p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
        >
          Back to home
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-nt-slate-200 bg-white p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
          Business loan application
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-nt-slate-900">
          {copy.heading}
        </h1>
        <p className="mt-4 text-nt-slate-600">{copy.description}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-nt-slate-700">Loan amount</label>
            <select
              className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            >
              <option value="500000">₹5 Lakh</option>
              <option value="1000000">₹10 Lakh</option>
              <option value="2500000">₹25 Lakh</option>
              <option value="5000000">₹50 Lakh</option>
              <option value="100000000">₹1 Crore</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-nt-slate-700">Tenure (months)</label>
            <select
              className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
              value={form.tenure}
              onChange={(e) => setForm({ ...form, tenure: e.target.value })}
            >
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="9">9 months</option>
              <option value="12">12 months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-nt-slate-700">Purpose</label>
            <select
              className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            >
              <option value="working_capital">Working capital</option>
              <option value="machinery">Machinery / Equipment</option>
              <option value="inventory">Inventory</option>
              <option value="business_expansion">Business expansion</option>
              <option value="debt_refinancing">Debt refinancing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-nt-slate-700">Full name</label>
            <input
              required
              type="text"
              className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-nt-slate-700">Mobile number</label>
              <input
                required
                type="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit mobile"
                className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nt-slate-700">Email</label>
              <input
                required
                type="email"
                className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-nt-slate-700">Business PIN code</label>
            <input
              required
              type="text"
              pattern="[1-9][0-9]{5}"
              placeholder="6-digit PIN"
              className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
              value={form.pinCode}
              onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
            />
          </div>

          <div className="rounded-lg bg-nt-cream p-4">
            <p className="text-sm font-medium text-nt-slate-900">
              Estimated EMI: {formatCurrencyInr(breakdown.emi)}/month
            </p>
            <p className="text-xs text-nt-slate-600">
              Total payable {formatCurrencyInr(breakdown.totalPayable)} @ 18% p.a. This is only an
              estimate.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-nt-slate-700">
              <input
                required
                type="checkbox"
                checked={form.consentData}
                onChange={(e) => setForm({ ...form, consentData: e.target.checked })}
              />
              <span>
                I agree to NavDhan{"'"}s{" "}
                <Link
                  href={`/${locale}/legal/consent-policy`}
                  className="text-nt-orange-600 underline"
                >
                  Consent Policy
                </Link>{" "}
                and{" "}
                <Link
                  href={`/${locale}/legal/privacy-policy`}
                  className="text-nt-orange-600 underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-nt-slate-700">
              <input
                required
                type="checkbox"
                checked={form.consentLender}
                onChange={(e) => setForm({ ...form, consentLender: e.target.checked })}
              />
              <span>{copy.consentLender}</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
          >
            {copy.submit}
          </button>
        </form>
      </div>
    </Container>
  );
}
