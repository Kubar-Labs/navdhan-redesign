"use client";

import Image from "next/image";
import type { PartnerItem } from "@/src/types";
import { FadeIn } from "@/src/components/motion/FadeIn";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

export interface EcosystemTickerProps {
  eyebrow: string;
  partners: PartnerItem[];
}

export function EcosystemTicker({ eyebrow, partners }: EcosystemTickerProps) {
  const reduced = useReducedMotion();
  const duplicated = [...partners, ...partners];

  if (reduced) {
    return (
      <section className="rounded-2xl bg-nt-slate-900 px-6 py-10 md:py-14">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-nt-slate-300">
            {eyebrow}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <TickerLogo key={`${partner.name}-static`} partner={partner} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-nt-slate-900 px-6 py-10 md:py-14">
      <FadeIn className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-nt-slate-300">
          {eyebrow}
        </p>
      </FadeIn>

      <div
        className="relative mt-8"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, white 6%, white 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, white 6%, white 94%, transparent)",
        }}
        aria-roledescription="marquee"
        aria-label="Technology partner logos"
      >
        <div className="animate-marquee flex w-max items-center gap-10 md:gap-16">
          {duplicated.map((partner, index) => (
            <TickerLogo key={`${partner.name}-${index}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TickerLogoProps {
  partner: PartnerItem;
}

function TickerLogo({ partner }: TickerLogoProps) {
  const alt = partner.altKey ? `${partner.name} logo` : `${partner.name} logo`;
  return (
    <a
      href={partner.href || "#"}
      target={partner.href ? "_blank" : undefined}
      rel={partner.href ? "noopener noreferrer" : undefined}
      aria-label={partner.name}
      className="group inline-flex flex-shrink-0 items-center justify-center rounded-lg p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nt-orange-600"
    >
      {partner.logoAsset ? (
        <Image
          src={partner.logoAsset}
          alt={alt}
          width={160}
          height={44}
          loading="eager"
          decoding="async"
          className="partner-logo h-8 w-auto max-w-[140px] object-contain md:h-10 md:max-w-[160px]"
        />
      ) : (
        <span className="text-sm font-semibold text-white/80 transition group-hover:text-white">
          {partner.name}
        </span>
      )}
    </a>
  );
}
