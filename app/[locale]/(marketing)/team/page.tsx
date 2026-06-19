import Image from "next/image";
import Link from "next/link";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import teamData from "@/src/lib/data/team.json";
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
            {teamData.pageHeadingKey}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-nt-slate-600">
            {teamData.pageSubtextKey}
          </p>
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
            {teamData.members.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-nt-slate-200 bg-nt-cream p-6"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-nt-slate-200">
                  {member.imageAsset ? (
                    <Image
                      src={member.imageAsset}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-nt-slate-900">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-nt-orange-600">
                  {member.roleKey}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-nt-slate-600">
                  {member.bioKey}
                </p>
                {member.linkedIn ? (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-nt-slate-500 hover:text-nt-orange-600"
                  >
                    LinkedIn →
                  </a>
                ) : null}
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
            {teamData.advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="flex gap-5 rounded-xl border border-nt-slate-200 bg-white p-6"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-nt-slate-100">
                  {advisor.imageAsset ? (
                    <Image
                      src={advisor.imageAsset}
                      alt={advisor.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : null}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-nt-slate-900">
                    {advisor.name}
                  </h3>
                  <p className="text-sm font-medium text-nt-orange-600">
                    {advisor.domainKey}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-nt-slate-600">
                    {advisor.contributionKey}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-nt-slate-900 md:text-3xl">
            Interested in joining our mission?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-nt-slate-600">
            We are always looking for talented builders who want to reshape MSME
            credit.
          </p>
          <Link
            href={teamData.joinHref}
            className="mt-6 inline-flex rounded-md bg-nt-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-nt-orange-700"
          >
            {teamData.joinCtaKey}
          </Link>
        </Container>
      </Section>
    </>
  );
}
