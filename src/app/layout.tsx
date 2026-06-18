import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tour Porto Seguro — Passeios na Costa do Descobrimento",
  description:
    "Passeios exclusivos em Porto Seguro, Arraial d'Ajuda, Trancoso, Caraíva e região. Guias licenciados CADASTUR. Reserve pelo WhatsApp.",
  keywords: ["passeios porto seguro", "turismo bahia", "arraial d'ajuda", "trancoso", "recife de fora"],
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
