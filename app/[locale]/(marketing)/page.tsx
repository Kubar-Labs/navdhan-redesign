"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, Briefcase, Factory, TrendingUp, ChevronRight, Mail } from "lucide-react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { RecognitionCarousel } from "@/src/components/sections/RecognitionCarousel";
import { getMessages } from "@/src/lib/i18n/messages";
import {
  associationBadges,
  techPartners,
  loanProducts,
  whyReasons,
  recognitionItems,
  customerStories,
  emiDefaults,
  trustBadges,
} from "@/src/lib/data/siteData";
import { calculateEmiBreakdown, formatCurrencyInr } from "@/src/lib/utils/emi";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Briefcase,
  Factory,
  TrendingUp,
};

export default function HomePage() {
  const { locale } = useParams<{ locale: string }>();
  const m = getMessages(locale);
  const t = (path: string): string => {
    const parts = path.split(".");
    let current: unknown = m;
    for (const part of parts) {
      if (current && typeof current === "object") {
        current = (current as Record<string, unknown>)[part];
      } else {
        return path;
      }
    }
    return typeof current === "string" ? current : path;
  };

  const [amount, setAmount] = useState(emiDefaults.defaultAmount);
  const [rate, setRate] = useState(emiDefaults.defaultRate);
  const [tenure, setTenure] = useState(emiDefaults.defaultTenure);
  const breakdown = calculateEmiBreakdown(amount, rate, tenure);

  return (
    <>
      {/* Hero */}
      <Section background="cream" padding="tight" id="top">
        <Container>
          <div className="py-20 md:py-28">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
              {t("home.hero.eyebrow")}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-nt-slate-900 md:text-5xl lg:text-6xl">
              {t("home.hero.headline")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-nt-slate-600 md:text-xl">
              {t("home.hero.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/apply`}
                className="inline-flex items-center gap-2 rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
              >
                {t("home.hero.primaryCta")}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:outreach@kubar.tech"
                className="inline-flex items-center gap-2 rounded-md border border-nt-slate-300 bg-white px-6 py-3 text-sm font-semibold text-nt-slate-900 hover:bg-nt-slate-50"
              >
                <Mail className="h-4 w-4" />
                {t("home.hero.secondaryCta")}
              </a>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                { value: t("home.hero.stat1value"), label: t("home.hero.stat1label") },
                { value: t("home.hero.stat2value"), label: t("home.hero.stat2label") },
                { value: t("home.hero.stat3value"), label: t("home.hero.stat3label") },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-nt-slate-900">{stat.value}</p>
                  <p className="text-sm text-nt-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Association badges */}
      <Section background="white" padding="tight">
        <Container>
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-nt-slate-500">
            {t("home.association.eyebrow")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
            {associationBadges.map((badge) => (
              <div
                key={badge.name}
                className="relative flex h-14 items-center justify-center rounded-md border border-nt-slate-200 bg-nt-cream px-6"
                title={badge.name}
              >
                {badge.logoAsset ? (
                  <Image
                    src={badge.logoAsset}
                    alt={t(badge.altKey) || badge.name}
                    width={120}
                    height={40}
                    className="max-h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-semibold text-nt-slate-700">{badge.name}</span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Loan products */}
      <Section background="white" id="products">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
            {t("home.loanProducts.eyebrow")}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-nt-slate-900 md:text-4xl">
            {t("home.loanProducts.heading")}
          </h2>
          <p className="mt-4 max-w-2xl text-nt-slate-600">{t("home.loanProducts.body")}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loanProducts.map((product) => {
              const Icon = iconMap[product.iconName] ?? ShieldCheck;
              return (
                <div
                  key={product.id}
                  className="rounded-xl border border-nt-slate-200 bg-white p-6"
                >
                  <Icon className="h-8 w-8 text-nt-orange-600" />
                  <h3 className="mt-4 text-lg font-semibold text-nt-slate-900">
                    {product.titleKey}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-nt-slate-600">
                    {product.descriptionKey}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Why NavDhan */}
      <Section background="cream" id="why">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
            {t("home.whyNavDhan.eyebrow")}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-nt-slate-900 md:text-4xl">
            {t("home.whyNavDhan.heading")}
          </h2>
          <p className="mt-4 max-w-2xl text-nt-slate-600">{t("home.whyNavDhan.body")}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyReasons.map((reason) => (
              <div key={reason.id} className="rounded-xl bg-white p-6">
                <h3 className="text-lg font-semibold text-nt-slate-900">{reason.titleKey}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nt-slate-600">{reason.bodyKey}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Recognition carousel */}
      <Section background="white">
        <Container>
          <RecognitionCarousel
            eyebrow={t("home.recognition.eyebrow")}
            heading={t("home.recognition.heading")}
            items={recognitionItems}
          />
        </Container>
      </Section>

      {/* Customer stories */}
      <Section background="cream" id="stories">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
            {t("home.customerStories.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-nt-slate-900 md:text-4xl">
            {t("home.customerStories.heading")}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customerStories.map((story) => (
              <blockquote
                key={story.id}
                className="rounded-xl border border-nt-slate-200 bg-white p-6"
              >
                <p className="text-sm italic text-nt-slate-600">
                  &ldquo;{story.questionKey}&rdquo;
                </p>
                <p className="mt-4 font-semibold text-nt-slate-900">{story.outcomeKey}</p>
                <footer className="mt-4 text-sm text-nt-slate-500">
                  — {story.name}, {story.roleKey}
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tech ecosystem ticker */}
      <Section background="white" padding="tight">
        <Container>
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-nt-slate-500">
            {t("home.ecosystem.eyebrow")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            {techPartners.map((partner) => (
              <div
                key={partner.name}
                className="relative flex h-14 w-36 items-center justify-center rounded-md border border-nt-slate-200 bg-nt-cream px-4"
                title={partner.name}
              >
                {partner.logoAsset ? (
                  <Image
                    src={partner.logoAsset}
                    alt={t(partner.altKey) || partner.name}
                    width={128}
                    height={40}
                    className="max-h-7 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-semibold text-nt-slate-700">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* EMI calculator */}
      <Section background="white" id="emi">
        <Container size="default">
          <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
            {t("home.emiCalculator.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-nt-slate-900 md:text-4xl">
            {t("home.emiCalculator.heading")}
          </h2>
          <p className="mt-4 max-w-2xl text-nt-slate-600">{t("home.emiCalculator.intro")}</p>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <label className="flex justify-between text-sm font-medium text-nt-slate-700">
                  <span>{t("home.emiCalculator.amount")}</span>
                  <span>{formatCurrencyInr(amount)}</span>
                </label>
                <input
                  type="range"
                  min={emiDefaults.minAmount}
                  max={emiDefaults.maxAmount}
                  step={100000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-3"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-nt-slate-700">
                  <span>{t("home.emiCalculator.rate")}</span>
                  <span>{rate}% p.a.</span>
                </label>
                <input
                  type="range"
                  min={emiDefaults.minRate}
                  max={emiDefaults.maxRate}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="mt-3"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-nt-slate-700">
                  <span>{t("home.emiCalculator.tenure")}</span>
                  <span>{tenure} months</span>
                </label>
                <input
                  type="range"
                  min={emiDefaults.minTenure}
                  max={emiDefaults.maxTenure}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="mt-3"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-nt-slate-200 bg-nt-cream p-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-nt-slate-600">{t("home.emiCalculator.monthly")}</p>
                  <p className="mt-1 text-3xl font-bold text-nt-slate-900">
                    {formatCurrencyInr(breakdown.emi)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-nt-slate-600">
                    {t("home.emiCalculator.totalPayable")}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-nt-slate-900">
                    {formatCurrencyInr(breakdown.totalPayable)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-nt-slate-600">{t("home.emiCalculator.principal")}</p>
                  <p className="mt-1 text-xl font-semibold text-nt-slate-900">
                    {formatCurrencyInr(breakdown.principal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-nt-slate-600">
                    {t("home.emiCalculator.totalInterest")}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-nt-slate-900">
                    {formatCurrencyInr(breakdown.totalInterest)}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/apply`}
                className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
              >
                {t("home.emiCalculator.cta")}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section background="cream">
        <Container className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-nt-slate-900 md:text-4xl">
            {t("home.finalCta.heading")}
          </h2>
          <p className="mt-4 text-nt-slate-600">{t("home.finalCta.subtext")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/apply`}
              className="inline-flex items-center gap-2 rounded-md bg-nt-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-nt-orange-700"
            >
              {t("home.finalCta.primaryCta")}
            </Link>
            <a
              href="mailto:hello@kubar.tech"
              className="inline-flex items-center gap-2 rounded-md border border-nt-slate-300 bg-white px-6 py-3 text-sm font-semibold text-nt-slate-900 hover:bg-nt-slate-50"
            >
              {t("home.finalCta.secondaryCta")}
            </a>
          </div>
        </Container>
      </Section>

      {/* Trust badges */}
      <Section background="white" padding="tight">
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-nt-slate-200 bg-nt-cream px-4 py-2 text-xs font-semibold text-nt-slate-700"
              >
                {badge}
              </span>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
