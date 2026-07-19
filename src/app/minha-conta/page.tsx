import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, BadgeCheck } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import SairButton from "./SairButton";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "Aguardando confirmação", className: "bg-amber-50 text-amber-700" },
  paid: { label: "Confirmada", className: "bg-green-50 text-[#2d7d46]" },
  cancelled: { label: "Cancelada", className: "bg-gray-100 text-gray-500" },
};

export default async function MinhaContaPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/entrar");
  if (profile.role === "operador") redirect("/operador");

  const { data: bookings } = profile.email
    ? await supabaseAdmin
        .from("bookings")
        .select("*, tour:tours(title, slug, image)")
        .ilike("tourist_email", profile.email)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <main className="min-h-screen bg-white pt-14 px-4">
      <div className="w-full max-w-[520px] mx-auto py-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <User size={26} strokeWidth={1.75} className="text-[#111]" />
          </div>

          <h1 className="text-[22px] font-bold text-[#111]">
            {profile.fullName || profile.email}
          </h1>

          <p className="flex items-center justify-center gap-1.5 text-[13px] text-gray-500 mt-2">
            <BadgeCheck size={14} strokeWidth={2} className="text-[#2d7d46]" />
            Conta de turista
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-[15px] font-bold text-[#111] mb-4">Minhas reservas</h2>

          {!bookings || bookings.length === 0 ? (
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-left">
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Nenhuma reserva encontrada com o e-mail dessa conta ainda. Reservar continua
                funcionando sem precisar de conta.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
                const status = STATUS_LABEL[b.payment_status] ?? STATUS_LABEL.pending;
                return (
                  <Link
                    key={b.id}
                    href={b.tour ? `/passeios/${b.tour.slug}` : "#"}
                    className="flex items-center gap-4 p-3 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {b.tour?.image && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={b.tour.image} alt={b.tour.title} fill sizes="64px" className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-[#111] truncate">{b.tour?.title ?? "Passeio"}</p>
                      <p className="text-[13px] text-gray-500">
                        {new Date(b.tour_date).toLocaleDateString("pt-BR")} · {b.adults} adulto{b.adults > 1 ? "s" : ""}
                        {b.children > 0 ? ` · ${b.children} criança${b.children > 1 ? "s" : ""}` : ""} · R$ {b.total_price}
                      </p>
                    </div>
                    <span className={`text-[12px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${status.className}`}>
                      {status.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <SairButton />
        </div>
      </div>
    </main>
  );
}
