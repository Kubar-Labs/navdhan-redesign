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

  return (
    <FadeIn className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-nt-slate-500">{eyebrow}</p>

      {reduced ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          {partners.map((partner) => (
            <TickerLogo key={`${partner.name}-static`} partner={partner} isStatic />
          ))}
        </div>
      ) : (
        <div
          className="group mt-6 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
          aria-roledescription="marquee"
          aria-label="Technology partner logos"
        >
          <div className="animate-marquee flex w-max items-center gap-8 md:gap-12 group-hover:[animation-play-state:paused]">
            {duplicated.map((partner, index) => (
              <TickerLogo key={`${partner.name}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      )}
    </FadeIn>
  );
}

interface TickerLogoProps {
  partner: PartnerItem;
  isStatic?: boolean;
}

function TickerLogo({ partner, isStatic = false }: TickerLogoProps) {
  const alt = partner.altKey || `${partner.name} logo`;

  const content = (
    <span
      className="relative flex h-14 items-center justify-center rounded-md border border-nt-slate-200 bg-nt-cream px-4 md:px-5"
      title={partner.name}
    >
      {partner.logoAsset ? (
        <Image
          src={partner.logoAsset}
          alt={alt}
          width={144}
          height={40}
          loading="eager"
          decoding="sync"
          className="h-8 w-auto max-w-[120px] object-contain grayscale transition-all duration-300 hover:grayscale-0 focus-visible:grayscale-0 md:h-10 md:max-w-[140px]"
        />
      ) : (
        <span className="text-sm font-semibold text-nt-slate-700">{partner.name}</span>
      )}
    </span>
  );

  if (isStatic) {
    return content;
  }

  return partner.href ? (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
      className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-nt-orange-600"
    >
      {content}
    </a>
  ) : (
    content
  );
}
