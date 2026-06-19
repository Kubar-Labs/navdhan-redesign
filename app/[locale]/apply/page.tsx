"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/src/components/layout/Container";
import { emiDefaults } from "@/src/lib/data/siteData";
import { formatCurrencyInr, calculateEmiBreakdown } from "@/src/lib/utils/emi";

interface ApplyCopy {
  eyebrow: string;
  heading: string;
  description: string;
  loanDetailsTitle: string;
  amountLabel: string;
  tenureLabel: string;
  purposeLabel: string;
  purposes: Record<string, string>;
  aboutYouTitle: string;
  fullNameLabel: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  emailLabel: string;
  pinCodeLabel: string;
  pinCodePlaceholder: string;
  emiLabel: string;
  emiNote: (total: string) => string;
  consentDataPrefix: string;
  consentAnd: string;
  consentPolicy: string;
  privacyPolicy: string;
  consentLender: string;
  submit: string;
  submitting: string;
  successHeading: string;
  successBody: string;
  successCta: string;
  errorHeading: string;
  errorBody: string;
  fieldRequired: string;
}

const copyByLocale: Record<string, ApplyCopy> = {
  en: {
    eyebrow: "Business loan application",
    heading: "Get the right business loan, without chasing banks.",
    description: "Fill a few details to check your eligibility. It takes less than 5 minutes.",
    loanDetailsTitle: "Loan details",
    amountLabel: "Loan amount",
    tenureLabel: "Tenure (months)",
    purposeLabel: "Purpose",
    purposes: {
      working_capital: "Working capital",
      machinery: "Machinery / Equipment",
      inventory: "Inventory",
      business_expansion: "Business expansion",
      debt_refinancing: "Debt refinancing",
      other: "Other",
    },
    aboutYouTitle: "About you",
    fullNameLabel: "Full name",
    mobileLabel: "Mobile number",
    mobilePlaceholder: "10-digit mobile",
    emailLabel: "Email",
    pinCodeLabel: "Business PIN code",
    pinCodePlaceholder: "6-digit PIN",
    emiLabel: "Estimated EMI",
    emiNote: (total) =>
      `Total payable ${total} @ 18% p.a. This is only an estimate.`,
    consentDataPrefix: "I agree to NavDhan's",
    consentAnd: "and",
    consentPolicy: "Consent Policy",
    privacyPolicy: "Privacy Policy",
    consentLender:
      "I consent to sharing my details so NavDhan can find a loan offer for my business.",
    submit: "Check Eligibility",
    submitting: "Checking...",
    successHeading: "Thank you",
    successBody:
      "We have received your application. A NavDhan advisor will reach out within 24 hours.",
    successCta: "Back to home",
    errorHeading: "Something went wrong",
    errorBody: "Please check your details and try again.",
    fieldRequired: "This field is required",
  },
  hi: {
    eyebrow: "बिज़नेस लोन आवेदन",
    heading: "सही बिज़नेस लोन पाएँ, बैंकों के पीछे न भागें।",
    description: "पात्रता जाँचने के लिए कुछ विवरण भरें। इसमें 5 मिनट से भी कम समय लगता है।",
    loanDetailsTitle: "लोन विवरण",
    amountLabel: "लोन राशि",
    tenureLabel: "अवधि (महीने)",
    purposeLabel: "उद्देश्य",
    purposes: {
      working_capital: "कार्यशील पूँजी",
      machinery: "मशीनरी / उपकरण",
      inventory: "इन्वेंटरी",
      business_expansion: "व्यवसाय विस्तार",
      debt_refinancing: "कर्ज पुनर्वित्त",
      other: "अन्य",
    },
    aboutYouTitle: "आपके बारे में",
    fullNameLabel: "पूरा नाम",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "10-अंकों का मोबाइल",
    emailLabel: "ईमेल",
    pinCodeLabel: "व्यवसाय का PIN कोड",
    pinCodePlaceholder: "6-अंकों का PIN",
    emiLabel: "अनुमानित EMI",
    emiNote: (total) =>
      `कुल देय ${total} @ 18% प्रति वर्ष। यह केवल एक अनुमान है।`,
    consentDataPrefix: "मैं NavDhan की",
    consentAnd: "और",
    consentPolicy: "सहमति नीति",
    privacyPolicy: "गोपनीयता नीति",
    consentLender:
      "मैं सहमत हूँ कि मेरे व्यवसाय के लिए लोन ऑफ़र ढूंढने के लिए NavDhan मेरे विवरण साझा कर सकता है।",
    submit: "पात्रता जाँचें",
    submitting: "जाँच हो रही है...",
    successHeading: "धन्यवाद",
    successBody:
      "हमें आपका आवेदन मिल गया है। NavDhan सलाहकार 24 घंटों के भीतर संपर्क करेगा।",
    successCta: "होम पर वापस जाएँ",
    errorHeading: "कुछ गड़बड़ हुई",
    errorBody: "कृपया अपने विवरण जाँचें और पुनः प्रयास करें।",
    fieldRequired: "यह फ़ील्ड आवश्यक है",
  },
};

export default function ApplyPage() {
  const { locale } = useParams<{ locale: string }>();
  const copy = copyByLocale[locale] ?? copyByLocale.en;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const breakdown = calculateEmiBreakdown(Number(form.amount), 18, Number(form.tenure));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const idempotencyKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    try {
      const response = await fetch(`/api/apply/state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
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
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setSubmitted(true);
    } catch {
      setError(copy.errorBody);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-semibold text-nt-slate-900">{copy.successHeading}</h1>
        <p className="mt-4 text-nt-slate-600">{copy.successBody}</p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
        >
          {copy.successCta}
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-nt-slate-200 bg-white p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-nt-slate-900">
          {copy.heading}
        </h1>
        <p className="mt-4 text-nt-slate-600">{copy.description}</p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-nt-red-500" role="alert">
            <p className="font-semibold">{copy.errorHeading}</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <fieldset className="space-y-6">
            <legend className="text-lg font-semibold text-nt-slate-900">{copy.loanDetailsTitle}</legend>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-nt-slate-700">
                {copy.amountLabel}
              </label>
              <select
                id="amount"
                name="amount"
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
              <label htmlFor="tenure" className="block text-sm font-medium text-nt-slate-700">
                {copy.tenureLabel}
              </label>
              <select
                id="tenure"
                name="tenure"
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
              <label htmlFor="purpose" className="block text-sm font-medium text-nt-slate-700">
                {copy.purposeLabel}
              </label>
              <select
                id="purpose"
                name="purpose"
                className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              >
                {Object.entries(copy.purposes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="text-lg font-semibold text-nt-slate-900">{copy.aboutYouTitle}</legend>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-nt-slate-700">
                {copy.fullNameLabel}
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                type="text"
                autoComplete="name"
                className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-nt-slate-700">
                  {copy.mobileLabel}
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder={copy.mobilePlaceholder}
                  className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-nt-slate-700">
                  {copy.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  autoComplete="email"
                  className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="pinCode" className="block text-sm font-medium text-nt-slate-700">
                {copy.pinCodeLabel}
              </label>
              <input
                id="pinCode"
                name="pinCode"
                required
                type="text"
                pattern="[1-9][0-9]{5}"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder={copy.pinCodePlaceholder}
                className="mt-2 w-full rounded-md border border-nt-slate-300 px-4 py-3"
                value={form.pinCode}
                onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
              />
            </div>
          </fieldset>

          <div className="rounded-lg bg-nt-cream p-4">
            <p className="text-sm font-medium text-nt-slate-900">
              {copy.emiLabel}: {formatCurrencyInr(breakdown.emi)}/month
            </p>
            <p className="text-xs text-nt-slate-600">
              {copy.emiNote(formatCurrencyInr(breakdown.totalPayable))}
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-nt-slate-700">
              <input
                required
                type="checkbox"
                name="consentData"
                checked={form.consentData}
                onChange={(e) => setForm({ ...form, consentData: e.target.checked })}
              />
              <span>
                {copy.consentDataPrefix}{" "}
                <Link
                  href={`/${locale}/legal/consent-policy`}
                  className="text-nt-orange-600 underline"
                >
                  {copy.consentPolicy}
                </Link>{" "}
                {copy.consentAnd}{" "}
                <Link
                  href={`/${locale}/legal/privacy-policy`}
                  className="text-nt-orange-600 underline"
                >
                  {copy.privacyPolicy}
                </Link>
                .
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-nt-slate-700">
              <input
                required
                type="checkbox"
                name="consentLender"
                checked={form.consentLender}
                onChange={(e) => setForm({ ...form, consentLender: e.target.checked })}
              />
              <span>{copy.consentLender}</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700 disabled:opacity-70"
          >
            {submitting ? copy.submitting : copy.submit}
          </button>
        </form>
      </div>
    </Container>
  );
}
