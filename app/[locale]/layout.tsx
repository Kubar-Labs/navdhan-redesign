import { notFound } from "next/navigation";
import { isValidLocale } from "@/src/lib/i18n/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }
  return (
    <div lang={locale} className="min-h-screen">
      {children}
    </div>
  );
}

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "hi" },
    { locale: "bn" },
    { locale: "te" },
    { locale: "mr" },
    { locale: "ta" },
    { locale: "kn" },
    { locale: "ml" },
  ];
}
