import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getTourBySlug } from "@/lib/tours-data";

export const dynamic = "force-dynamic";

export default async function ReservaSucessoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  return (
    <main className="min-h-screen bg-white pt-14 flex items-center justify-center px-4">
      <div className="w-full max-w-[440px] py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={28} strokeWidth={1.75} className="text-[#2d7d46]" />
        </div>

        <h1 className="text-[24px] font-bold text-[#111]">Pagamento aprovado!</h1>

        <div className="flex items-center gap-3 mt-6 p-3 rounded-2xl border border-gray-200 text-left">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <Image src={tour.image} alt={tour.title} fill sizes="56px" className="object-cover" />
          </div>
          <p className="font-semibold text-[14px] text-[#111] leading-snug">{tour.title}</p>
        </div>

        <p className="mt-6 text-[14px] text-gray-500 leading-relaxed">
          Sua vaga está garantida. Mandamos um e-mail confirmando o pagamento, e o operador vai
          entrar em contato pelo WhatsApp com os detalhes finais.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 px-7 py-3.5 rounded-full bg-[#111] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors"
        >
          Voltar pro início
        </Link>
      </div>
    </main>
  );
}
