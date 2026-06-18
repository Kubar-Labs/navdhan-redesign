import { Header } from "@/src/components/shells/Header";
import { Footer } from "@/src/components/shells/Footer";
import { getTranslator } from "@/src/lib/i18n/translations";

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function MarketingLayout({ children, params }: MarketingLayoutProps) {
  const { locale } = await params;
  const t = await getTranslator(locale, "global.nav");

  const navLinks = [
    { label: t("loanProducts"), href: `/${locale}/#products` },
    { label: t("whyNavDhan"), href: `/${locale}/#why` },
    { label: t("emiCalculator"), href: `/${locale}/#emi` },
    { label: t("customerStories"), href: `/${locale}/#stories` },
    { label: t("team"), href: `/${locale}/team` },
  ];

  return (
    <>
      <Header
        navLinks={navLinks}
        cta={{ label: "Apply Loan", href: `/${locale}/apply`, variant: "primary" }}
        currentLocale={locale}
      />
      <main id="main-content">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
