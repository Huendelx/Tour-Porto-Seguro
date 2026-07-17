import Link from "next/link";
import Image from "next/image";
import { Plus, Eye, EyeOff } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getMyOperator, createOperatorCompany } from "./actions";
import ToggleActiveButton from "./ToggleActiveButton";

export default async function OperadorPage() {
  const operator = await getMyOperator();

  if (!operator) {
    return (
      <div className="max-w-[480px]">
        <h1 className="text-[24px] font-bold text-[#111] mb-1">Cadastre sua empresa</h1>
        <p className="text-[14px] text-gray-500 mb-8">
          Antes de cadastrar passeios, a gente precisa de alguns dados sobre o operador.
        </p>
        <form action={createOperatorCompany} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#111] mb-1.5">Nome da empresa</label>
            <input name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[15px] outline-none focus:border-[#111]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#111] mb-1.5">WhatsApp (com DDD)</label>
            <input name="whatsapp" required placeholder="5573999999999" className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[15px] outline-none focus:border-[#111]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#111] mb-1.5">Anos de experiência</label>
            <input name="years_experience" type="number" min={0} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[15px] outline-none focus:border-[#111]" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#111] mb-1.5">Sobre a empresa</label>
            <textarea name="bio" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[15px] outline-none focus:border-[#111] resize-none" />
          </div>
          <button className="w-full py-3.5 rounded-full bg-[#111] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors">
            Criar empresa
          </button>
          <p className="text-[12px] text-gray-400 leading-relaxed">
            Sua empresa passa por uma curadoria antes de aparecer publicamente como verificada.
          </p>
        </form>
      </div>
    );
  }

  const { data: tours } = await supabaseAdmin
    .from("tours")
    .select("id, slug, title, image, price, is_active")
    .eq("operator_id", operator.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#111]">{operator.name}</h1>
          <p className="text-[13px] text-gray-500 mt-1">
            {operator.verified ? "✓ Verificado pelo Passeador" : "Aguardando verificação"}
          </p>
        </div>
        <Link
          href="/operador/passeios/novo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111] text-white text-[14px] font-semibold hover:bg-[#333] transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          Novo passeio
        </Link>
      </div>

      {!tours || tours.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 rounded-2xl">
          <p className="text-[15px] text-gray-500">Você ainda não cadastrou nenhum passeio.</p>
          <Link href="/operador/passeios/novo" className="inline-block mt-3 text-[14px] font-semibold text-[#111] underline">
            Cadastrar o primeiro
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tours.map((t) => (
            <div key={t.id} className="flex items-center gap-4 p-3 rounded-2xl border border-gray-200 bg-white">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {t.image && <Image src={t.image} alt={t.title} fill sizes="64px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-[#111] truncate">{t.title}</p>
                <p className="text-[13px] text-gray-500">A partir de R$ {t.price}</p>
              </div>
              <span
                className={`flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                  t.is_active ? "bg-green-50 text-[#2d7d46]" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.is_active ? <Eye size={12} strokeWidth={2} /> : <EyeOff size={12} strokeWidth={2} />}
                {t.is_active ? "Publicado" : "Pausado"}
              </span>
              <ToggleActiveButton tourId={t.id} isActive={t.is_active} />
              <Link
                href={`/operador/passeios/${t.id}`}
                className="text-[13px] font-semibold text-[#111] underline flex-shrink-0"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
