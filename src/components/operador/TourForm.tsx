"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Tour } from "@/lib/tours-data";

const CATEGORIES: { value: Tour["category"]; label: string }[] = [
  { value: "terrestre", label: "Terrestre" },
  { value: "nautico", label: "Náutico" },
  { value: "aventura", label: "Aventura" },
  { value: "cultural", label: "Cultural" },
  { value: "noturno", label: "Noturno" },
];

type ItineraryStep = { time: string; title: string; description: string; image: string };

export interface TourFormInitial {
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  tips: string;
  important_info: string;
  category: Tour["category"];
  transport_type: string;
  duration: string;
  duration_minutes: number | null;
  group_size: string;
  price: number;
  price_max: number | null;
  includes: string[];
  excludes: string[];
  image: string;
  images: string[];
  meeting_point: string;
  cancellation_policy: string;
  is_active: boolean;
  frequency: string;
  days: string;
  departureStart: string;
  departureEnd: string;
  returnTime: string;
  itinerary: ItineraryStep[];
}

const EMPTY: TourFormInitial = {
  title: "", subtitle: "", summary: "", description: "", tips: "", important_info: "",
  category: "terrestre", transport_type: "", duration: "", duration_minutes: null,
  group_size: "", price: 0, price_max: null, includes: [], excludes: [],
  image: "", images: [], meeting_point: "", cancellation_policy: "", is_active: false,
  frequency: "daily", days: "", departureStart: "", departureEnd: "", returnTime: "",
  itinerary: [],
};

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-300 text-[15px] text-[#111] outline-none focus:border-[#111] transition-colors";
const labelCls = "block text-[13px] font-medium text-[#111] mb-1.5";

export default function TourForm({
  action,
  initial,
  submitLabel = "Salvar passeio",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<TourFormInitial>;
  submitLabel?: string;
}) {
  const values = { ...EMPTY, ...initial };
  const [frequency, setFrequency] = useState(values.frequency);
  const [itinerary, setItinerary] = useState<ItineraryStep[]>(
    values.itinerary.map((s) => ({ time: s.time ?? "", title: s.title, description: s.description, image: s.image ?? "" }))
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const addStep = () => setItinerary((prev) => [...prev, { time: "", title: "", description: "", image: "" }]);
  const removeStep = (i: number) => setItinerary((prev) => prev.filter((_, idx) => idx !== i));
  const updateStep = (i: number, patch: Partial<ItineraryStep>) =>
    setItinerary((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const handleSubmit = (formData: FormData) => {
    setError(null);
    formData.set("itinerary_json", JSON.stringify(itinerary.filter((s) => s.title.trim())));
    startTransition(async () => {
      try {
        await action(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao salvar");
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-10 max-w-[720px]">
      {error && (
        <p className="p-4 rounded-xl bg-red-50 border border-red-100 text-[14px] text-red-600">{error}</p>
      )}

      {/* Básico */}
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111]">Informações básicas</h2>
        <div>
          <label className={labelCls}>Título — o que a pessoa vai contratar</label>
          <input name="title" defaultValue={values.title} required className={inputCls} placeholder="Ex: Dia inteiro em Trancoso com..." />
        </div>
        <div>
          <label className={labelCls}>Subtítulo curto (aparece nos cards)</label>
          <input name="subtitle" defaultValue={values.subtitle} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Resumo (1-2 frases, aparece sob o título)</label>
          <textarea name="summary" defaultValue={values.summary} rows={2} className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>Descrição completa</label>
          <textarea name="description" defaultValue={values.description} required rows={5} className={`${inputCls} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Categoria</label>
            <select name="category" defaultValue={values.category} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tipo de transporte</label>
            <input name="transport_type" defaultValue={values.transport_type} className={inputCls} placeholder="Van climatizada" />
          </div>
        </div>
      </section>

      {/* Duração, grupo, preço */}
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111]">Duração, grupo e preço</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Duração (texto)</label>
            <input name="duration" defaultValue={values.duration} required className={inputCls} placeholder="Dia inteiro" />
          </div>
          <div>
            <label className={labelCls}>Duração em minutos</label>
            <input name="duration_minutes" type="number" min={0} defaultValue={values.duration_minutes ?? ""} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tamanho do grupo</label>
          <input name="group_size" defaultValue={values.group_size} required className={inputCls} placeholder="Até 15 pessoas" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Preço adulto (R$)</label>
            <input name="price" type="number" step="0.01" min={0} defaultValue={values.price} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Preço máximo — alta temporada (opcional)</label>
            <input name="price_max" type="number" step="0.01" min={0} defaultValue={values.price_max ?? ""} className={inputCls} />
          </div>
        </div>
      </section>

      {/* Horário */}
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111]">Horário</h2>
        <div>
          <label className={labelCls}>Frequência</label>
          <select name="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputCls}>
            <option value="daily">Todos os dias</option>
            <option value="specific_days">Dias específicos</option>
            <option value="tide_based">Conforme a maré</option>
          </select>
        </div>
        {frequency === "specific_days" && (
          <div>
            <label className={labelCls}>Quais dias</label>
            <input name="days" defaultValue={values.days} className={inputCls} placeholder="Seg / Qua / Sex" />
          </div>
        )}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Saída</label>
            <input name="departureStart" defaultValue={values.departureStart} className={inputCls} placeholder="7h40" />
          </div>
          <div>
            <label className={labelCls}>Até</label>
            <input name="departureEnd" defaultValue={values.departureEnd} className={inputCls} placeholder="8h40" />
          </div>
          <div>
            <label className={labelCls}>Retorno</label>
            <input name="returnTime" defaultValue={values.returnTime} className={inputCls} placeholder="17h" />
          </div>
        </div>
      </section>

      {/* Roteiro */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#111]">Roteiro (opcional)</h2>
          <button type="button" onClick={addStep} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#111]">
            <Plus size={15} strokeWidth={2.5} /> Adicionar etapa
          </button>
        </div>
        {itinerary.map((step, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-gray-400">ETAPA {i + 1}</span>
              <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500">
                <Trash2 size={15} strokeWidth={2} />
              </button>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <input placeholder="7h40" value={step.time} onChange={(e) => updateStep(i, { time: e.target.value })} className={inputCls} />
              <input placeholder="Título da etapa" value={step.title} onChange={(e) => updateStep(i, { title: e.target.value })} className={inputCls} />
            </div>
            <textarea placeholder="Descrição" value={step.description} onChange={(e) => updateStep(i, { description: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
            <input placeholder="URL da foto dessa etapa (opcional)" value={step.image} onChange={(e) => updateStep(i, { image: e.target.value })} className={inputCls} />
          </div>
        ))}
      </section>

      {/* O que inclui/exclui */}
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111]">O que está incluso</h2>
        <div>
          <label className={labelCls}>Incluso (um item por linha)</label>
          <textarea name="includes" defaultValue={values.includes.join("\n")} rows={3} className={`${inputCls} resize-none`} placeholder={"Transporte ida/volta\nGuia CADASTUR credenciado"} />
        </div>
        <div>
          <label className={labelCls}>Não incluso (um item por linha)</label>
          <textarea name="excludes" defaultValue={values.excludes.join("\n")} rows={2} className={`${inputCls} resize-none`} placeholder={"Alimentação\nBebidas"} />
        </div>
      </section>

      {/* Fotos */}
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111]">Fotos</h2>
        <div>
          <label className={labelCls}>URL da foto de capa</label>
          <input name="image" defaultValue={values.image} required className={inputCls} placeholder="https://..." />
          <p className="text-[12px] text-gray-400 mt-1.5">Upload direto de arquivo chega em breve — por agora, cola o link da imagem.</p>
        </div>
        <div>
          <label className={labelCls}>Fotos da galeria (uma URL por linha, opcional)</label>
          <textarea name="images" defaultValue={values.images.join("\n")} rows={3} className={`${inputCls} resize-none`} />
        </div>
      </section>

      {/* Outras informações */}
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold text-[#111]">Outras informações</h2>
        <div>
          <label className={labelCls}>Dicas (opcional)</label>
          <textarea name="tips" defaultValue={values.tips} rows={2} className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>Informações importantes (opcional)</label>
          <textarea name="important_info" defaultValue={values.important_info} rows={2} className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>Ponto de encontro (opcional)</label>
          <input name="meeting_point" defaultValue={values.meeting_point} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Política de cancelamento</label>
          <textarea name="cancellation_policy" defaultValue={values.cancellation_policy} required rows={3} className={`${inputCls} resize-none`} />
        </div>
      </section>

      {/* Publicar */}
      <section className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <input type="checkbox" name="is_active" id="is_active" defaultChecked={values.is_active} className="w-5 h-5 accent-[#111]" />
        <label htmlFor="is_active" className="text-[14px] text-[#111]">
          Publicar imediatamente (aparece no site pro público)
        </label>
      </section>

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-auto px-8 py-3.5 rounded-full bg-[#111] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors disabled:opacity-40"
      >
        {isPending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
