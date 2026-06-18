import "./globals.css";

export const metadata = {
  title: "NavDhan — Business Loans for India's MSMEs",
  description:
    "Get ₹5L to ₹1Cr business loans from trusted lenders. One application, multiple offers, zero platform fee.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-nt-cream text-nt-slate-900 antialiased">{children}</body>
    </html>
  );
}
