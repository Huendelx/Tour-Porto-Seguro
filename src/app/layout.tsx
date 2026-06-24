import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Passeador — Passeios e experiências em Porto Seguro",
  description:
    "Passeios e experiências com quem conhece de verdade. Porto Seguro, Arraial d'Ajuda, Trancoso, Caraíva e região. Guias licenciados CADASTUR.",
  keywords: ["passeios porto seguro", "turismo bahia", "arraial d'ajuda", "trancoso", "passeador"],
  themeColor: "#072d40",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
