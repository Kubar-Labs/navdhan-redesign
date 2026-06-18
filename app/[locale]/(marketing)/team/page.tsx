import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { teamMembers, advisors } from "@/src/lib/data/siteData";
import { getTranslator } from "@/src/lib/i18n/translations";

interface TeamPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TeamPageProps) {
  const { locale } = await params;
  const t = await getTranslator(locale, "team.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  const t = await getTranslator(locale);

  return (
    <>
      <Section background="cream">
        <Container>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-nt-slate-900 md:text-5xl">
            {t("team.hero.heading")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-nt-slate-600">{t("team.hero.subtext")}</p>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
            {t("team.members.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-nt-slate-900">
            {t("team.members.heading")}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-nt-slate-200 bg-nt-cream p-6"
              >
                <div className="h-24 w-24 rounded-full bg-nt-slate-200" />
                <h3 className="mt-4 text-lg font-semibold text-nt-slate-900">{member.name}</h3>
                <p className="text-sm font-medium text-nt-orange-600">{t(member.roleKey)}</p>
                <p className="mt-3 text-sm leading-relaxed text-nt-slate-600">{t(member.bioKey)}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="cream">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-nt-orange-600">
            {t("team.advisors.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-nt-slate-900">
            {t("team.advisors.heading")}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="rounded-xl border border-nt-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-nt-slate-900">{advisor.name}</h3>
                <p className="text-sm font-medium text-nt-orange-600">{t(advisor.domainKey)}</p>
                <p className="mt-3 text-sm leading-relaxed text-nt-slate-600">
                  {t(advisor.contributionKey)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
