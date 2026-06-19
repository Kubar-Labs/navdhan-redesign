"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RecognitionItem } from "@/src/types";

interface RecognitionCarouselProps {
  eyebrow: string;
  heading: string;
  items: RecognitionItem[];
}

export function RecognitionCarousel({ eyebrow, heading, items }: RecognitionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 300;
    el.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">{eyebrow}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-nt-slate-900 md:text-4xl">
          {heading}
        </h2>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label="Previous recognition"
            onClick={() => scrollBy("left")}
            className="rounded-full border border-nt-slate-300 bg-white p-2 text-nt-slate-700 hover:border-nt-orange-600 hover:text-nt-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nt-orange-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next recognition"
            onClick={() => scrollBy("right")}
            className="rounded-full border border-nt-slate-300 bg-white p-2 text-nt-slate-700 hover:border-nt-orange-600 hover:text-nt-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nt-orange-600"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="w-[280px] flex-shrink-0 snap-start rounded-xl border border-nt-slate-200 bg-nt-cream md:w-[320px]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl bg-nt-slate-200">
              {item.imageAsset ? (
                <Image
                  src={item.imageAsset}
                  alt={item.titleKey}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 320px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-nt-slate-100 to-nt-slate-200 text-nt-slate-400">
                  <span className="text-sm font-medium">{item.date}</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-nt-orange-600">{item.date}</p>
              <h3 className="mt-2 text-lg font-semibold text-nt-slate-900">{item.titleKey}</h3>
              <p className="mt-2 text-sm leading-relaxed text-nt-slate-600">
                {item.descriptionKey}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
