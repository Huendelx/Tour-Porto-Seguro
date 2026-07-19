import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeaderProvider } from "@/context/HeaderContext";
import { getCurrentProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Passeador — Passeios e experiências em Porto Seguro",
  description:
    "Passeios e experiências com quem conhece de verdade. Porto Seguro, Arraial d'Ajuda, Trancoso, Caraíva e região. Guias licenciados CADASTUR.",
  keywords: ["passeios porto seguro", "turismo bahia", "arraial d'ajuda", "trancoso", "passeador"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentProfile();

  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-full flex flex-col">
        <HeaderProvider>
          <Header profile={profile} />
          {children}
        </HeaderProvider>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-Q19GR5XKV4" />
    </html>
  );
}
