import Link from "next/link";
import { Container } from "@/src/components/layout/Container";
import { legalSlugs } from "@/src/lib/legal/loader";
import { getTranslator } from "@/src/lib/i18n/translations";

function legalLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface FooterProps {
  locale: string;
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslator(locale);

  const company = t("global.footer.company");
  const address = t("global.footer.address");
  const tagline = t("global.footer.tagline");
  const copyright = t("global.footer.copyright");

  return (
    <footer className="bg-nt-slate-900 py-16 text-white">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="text-xl font-bold text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nt-orange-600"
            >
              NavDhan
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-nt-slate-300">{tagline}</p>
            <p className="mt-6 text-xs text-nt-slate-400">{copyright}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-nt-slate-400">
              {t("global.footer.companyHeading")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-nt-slate-300">
              <li>
                <Link
                  href={`/${locale}/team`}
                  className="hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nt-orange-600"
                >
                  {t("global.nav.team")}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${t("global.contact.support")}@navdhan.app`}
                  className="hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nt-orange-600"
                >
                  {t("global.contact.support")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-nt-slate-400">
              {t("global.footer.contactHeading")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-nt-slate-300">
              <li>{t("global.contact.loan")}</li>
              <li>{t("global.contact.partnership")}</li>
              <li>{t("global.contact.support")}</li>
              <li>{t("global.contact.careers")}</li>
              <li>{t("global.contact.press")}</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-nt-slate-400">
              {t("global.footer.legalHeading")}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-nt-slate-300">
              {legalSlugs.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${locale}/legal/${slug}`}
                    className="hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nt-orange-600"
                  >
                    {legalLabel(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-nt-slate-800 pt-8 text-xs leading-relaxed text-nt-slate-400">
          <p>{company}</p>
          <p className="mt-1">{address}</p>
          <p className="mt-4 font-medium text-nt-slate-300">
            {t("global.footer.badges")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
