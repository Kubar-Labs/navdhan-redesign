import { Header } from "@/src/components/shells/Header";

interface ApplyLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function ApplyLayout({ children, params }: ApplyLayoutProps) {
  const { locale } = await params;

  return (
    <>
      <Header
        navLinks={[{ label: "Home", href: `/${locale}` }]}
        cta={{ label: "Support", href: "mailto:hello@kubar.tech", variant: "secondary" }}
        currentLocale={locale}
      />
      <main id="main-content" className="min-h-screen bg-nt-cream">
        {children}
      </main>
    </>
  );
}
