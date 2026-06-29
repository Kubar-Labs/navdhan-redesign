"use client";

export interface ConsentOverlayProps {
  title: string;
  summary: string;
  details: string;
  accepted: boolean;
  onChange: (accepted: boolean) => void;
  checkboxLabel: string;
}

export function ConsentOverlay({
  title,
  summary,
  details,
  accepted,
  onChange,
  checkboxLabel,
}: ConsentOverlayProps) {
  return (
    <section
      className="mt-4 rounded-xl border border-nt-slate-200 bg-[#fafaf8] p-6"
      aria-labelledby="consent-title"
    >
      <h3 id="consent-title" className="text-sm font-semibold text-nt-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-nt-slate-600">{summary}</p>
      <p className="mt-2 text-sm text-nt-slate-500">{details}</p>
      <label className="mt-4 flex items-start gap-3 text-sm text-nt-slate-700">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-nt-slate-300 text-nt-orange-600 focus:ring-nt-orange-600"
        />
        <span>{checkboxLabel}</span>
      </label>
    </section>
  );
}
