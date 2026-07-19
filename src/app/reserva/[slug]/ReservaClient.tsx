"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Star, ShieldCheck, MessageCircle, Pencil, Car, Check } from "lucide-react";
import type { Tour } from "@/lib/tours-data";
import { runsOn, nextValidDate, fromISODate, toISODate, formatDatePt } from "@/lib/schedule";
import { createBooking, createPaymentPreference } from "../actions";

export default function ReservaClient({ tour }: { tour: Tour }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramDate = searchParams.get("data") ? fromISODate(searchParams.get("data")!) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = paramDate && paramDate >= today && runsOn(paramDate.getDay(), tour) ? paramDate : nextValidDate(tour);

  const [adults, setAdults] = useState(() => Math.max(1, Number(searchParams.get("adultos") ?? 1) || 1));
  const [children, setChildren] = useState(() => Math.max(0, Number(searchParams.get("criancas") ?? 0) || 0));
  const [editGuests, setEditGuests] = useState(false);

  // Passo 1 — dados do turista
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dadosOk, setDadosOk] = useState(false);
  const [tentou, setTentou] = useState(false);

  const nomeValido = nome.trim().length >= 3;
  const emailValido = /^\S+@\S+\.\S+$/.test(email);
  const zapValido = whatsapp.replace(/\D/g, "").length >= 10;

  // Transfer — só faz sentido oferecer em passeios que não já incluem busca no pacote
  const ofereceTransfer = !tour.hasTransfer;
  const [querTransfer, setQuerTransfer] = useState(false);
  const [enderecoTransfer, setEnderecoTransfer] = useState("");
  const enderecoValido = enderecoTransfer.trim().length >= 5;

  const adultPrice = tour.prices.find((p) => p.category === "adult");
  const childPrice = tour.prices.find((p) => p.category === "child");
  const adultUnit = adultPrice?.priceMin ?? tour.price;
  const childUnit = childPrice?.priceMin ?? 0;
  const total = adults * adultUnit + children * childUnit;
  const feeNotes = [...new Set(tour.prices.map((p) => p.notes).filter(Boolean))] as string[];

  const podeConfirmar = dadosOk && (!querTransfer || enderecoValido);

  const [pagando, setPagando] = useState(false);
  const [pagarErro, setPagarErro] = useState("");

  const pagar = async () => {
    if (!podeConfirmar || pagando) return;
    setPagando(true);
    setPagarErro("");

    const bookingId = await createBooking({
      tourId: tour.id,
      tourTitle: tour.title,
      tourDate: toISODate(date),
      formattedDate: formatDatePt(date),
      adults,
      children,
      totalPrice: total,
      touristName: nome.trim(),
      touristEmail: email.trim(),
      touristWhatsapp: whatsapp.trim(),
      notes: querTransfer ? `Transfer solicitado — buscar em ${enderecoTransfer.trim()}` : undefined,
    });

    if (!bookingId) {
      setPagando(false);
      setPagarErro("Não deu pra registrar a reserva agora — tenta de novo em instantes.");
      return;
    }

    const { url } = await createPaymentPreference({
      bookingId,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      totalPrice: total,
    });

    if (!url) {
      setPagando(false);
      setPagarErro("Não deu pra abrir o pagamento agora — tenta de novo ou reserve pelo WhatsApp.");
      return;
    }

    window.location.href = url;
  };

  const confirmar = () => {
    if (!podeConfirmar) return;

    // Dispara sem esperar — não trava/bloqueia o window.open (popup blocker
    // barra window.open depois de um await fora do clique original).
    createBooking({
      tourId: tour.id,
      tourTitle: tour.title,
      tourDate: toISODate(date),
      formattedDate: formatDatePt(date),
      adults,
      children,
      totalPrice: total,
      touristName: nome.trim(),
      touristEmail: email.trim(),
      touristWhatsapp: whatsapp.trim(),
      notes: querTransfer ? `Transfer solicitado — buscar em ${enderecoTransfer.trim()}` : undefined,
    }).catch((e) => console.error("Falha ao salvar reserva:", e));

    const msg =
      `Olá! Quero confirmar minha reserva pelo Passeador.\n\n` +
      `*${tour.title}*\n` +
      `Data: ${formatDatePt(date)}\n` +
      (tour.schedule.departureStart
        ? `Saída: ${tour.schedule.departureStart}${tour.schedule.departureEnd ? `–${tour.schedule.departureEnd}` : ""}\n`
        : `Horário: conforme tábua de marés\n`) +
      `Adultos: ${adults}${children > 0 ? `\nCrianças: ${children}` : ""}\n` +
      `Total estimado: R$ ${total}\n` +
      (querTransfer ? `\nTransfer: sim — buscar em ${enderecoTransfer.trim()} (valor a confirmar)\n` : "\n") +
      `Nome: ${nome.trim()}\n` +
      `E-mail: ${email.trim()}\n` +
      `WhatsApp: ${whatsapp.trim()}`;
    window.open(`https://wa.me/${tour.operator.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inputCls = (invalid: boolean) =>
    `w-full px-4 py-3.5 rounded-xl border text-[15px] text-[#111] placeholder:text-gray-400 outline-none transition-colors ${
      invalid ? "border-red-400" : "border-gray-300 focus:border-[#111]"
    }`;

  return (
    <main className="min-h-screen bg-white pt-14">
      <div className="max-w-[1148px] mx-auto px-4 md:px-6 pt-8 md:pt-10 pb-16">

        {/* Topo */}
        <div className="flex items-center gap-4 mb-8 md:mb-10">
          <button
            onClick={() => router.back()}
            className="hidden md:flex w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors items-center justify-center flex-shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft size={19} strokeWidth={2} className="text-[#111]" />
          </button>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#111] leading-tight">Confirmar e pagar</h1>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-[72px] items-start">

          {/* ── Passos ── */}
          <div className="flex-1 min-w-0 w-full space-y-5">

            {/* 1. Seus dados */}
            <section
              className="rounded-3xl border border-gray-200 px-6 md:px-7 py-6"
              style={dadosOk ? {} : { boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-[#111]">1. Seus dados</h2>
                {dadosOk && (
                  <button
                    onClick={() => setDadosOk(false)}
                    className="flex items-center gap-1.5 text-[13px] font-semibold text-[#111] underline underline-offset-2"
                  >
                    <Pencil size={13} strokeWidth={2} />
                    Editar
                  </button>
                )}
              </div>

              {dadosOk ? (
                <div className="mt-3 text-[14px] text-gray-500 leading-relaxed">
                  {nome} · {email} · {whatsapp}
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={inputCls(tentou && !nomeValido)}
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls(tentou && !emailValido)}
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp (com DDD)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={inputCls(tentou && !zapValido)}
                  />
                  {tentou && !(nomeValido && emailValido && zapValido) && (
                    <p className="text-[13px] text-red-500">Confere os campos destacados — nome, e-mail e WhatsApp válidos.</p>
                  )}
                  <button
                    onClick={() => {
                      setTentou(true);
                      if (nomeValido && emailValido && zapValido) setDadosOk(true);
                    }}
                    className="mt-1 px-7 py-3.5 rounded-full bg-[#111] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </section>

            {/* Transfer — opcional */}
            {ofereceTransfer && (
              <section className={`rounded-3xl border border-gray-200 px-6 md:px-7 py-6 ${dadosOk ? "" : "opacity-50 pointer-events-none"}`}>
                <button
                  onClick={() => setQuerTransfer((v) => !v)}
                  className="w-full flex items-start gap-3.5 text-left"
                >
                  <span
                    className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      querTransfer ? "bg-[#111] border-[#111]" : "border-gray-300"
                    }`}
                  >
                    {querTransfer && <Check size={14} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[15px] font-semibold text-[#111]">
                      <Car size={17} strokeWidth={1.75} className="text-gray-400" />
                      Adicionar busca no hotel ou pousada
                    </span>
                    <span className="block text-[13px] text-gray-500 mt-1">
                      O operador confirma disponibilidade e valor do transfer pelo WhatsApp.
                    </span>
                  </span>
                </button>
                {querTransfer && (
                  <div className="mt-4 pl-9">
                    <input
                      type="text"
                      placeholder="Nome e endereço do hotel/pousada"
                      value={enderecoTransfer}
                      onChange={(e) => setEnderecoTransfer(e.target.value)}
                      className={inputCls(false)}
                    />
                  </div>
                )}
              </section>
            )}

            {/* 2. Pagamento */}
            <section className={`rounded-3xl border border-gray-200 px-6 md:px-7 py-6 ${dadosOk ? "" : "opacity-50 pointer-events-none"}`}>
              <h2 className="text-[18px] font-bold text-[#111]">2. Pagamento</h2>
              <p className="mt-3 text-[14px] text-gray-500 leading-relaxed">
                <span className="capitalize">{formatDatePt(date)}</span>
                {tour.schedule.departureStart && ` · saída ${tour.schedule.departureStart}`} ·{" "}
                {adults} adulto{adults > 1 ? "s" : ""}{children > 0 ? ` e ${children} criança${children > 1 ? "s" : ""}` : ""} ·
                total de <span className="font-semibold text-[#111]">R$ {total}</span>.
              </p>
              {pagarErro && <p className="mt-3 text-[13px] text-red-500">{pagarErro}</p>}
              <button
                onClick={pagar}
                disabled={!podeConfirmar || pagando}
                className="mt-5 flex items-center justify-center gap-2.5 w-full md:w-auto md:px-9 py-4 rounded-full bg-[var(--tps-accent)] text-[#111] text-[15px] font-semibold hover:bg-[var(--tps-accent-hover)] transition-colors disabled:opacity-40"
              >
                <ShieldCheck size={17} strokeWidth={2} />
                {pagando ? "Abrindo pagamento..." : "Pagar agora"}
              </button>
              <p className="mt-3 text-[12px] text-gray-400 flex items-center gap-1.5">
                <ShieldCheck size={13} strokeWidth={1.75} className="text-gray-400" />
                Pagamento processado pelo Mercado Pago — Pix ou cartão
              </p>
              <p className="mt-2 text-[12px] text-gray-400">
                Ao continuar, você concorda com os{" "}
                <a href="/termos" target="_blank" className="underline underline-offset-2 text-gray-500">Termos de Uso</a>{" "}
                e a{" "}
                <a href="/privacidade" target="_blank" className="underline underline-offset-2 text-gray-500">Política de Privacidade</a>.
              </p>
            </section>

            {/* 3. Ou pelo WhatsApp */}
            <section className={`rounded-3xl border border-gray-200 px-6 md:px-7 py-6 ${dadosOk ? "" : "opacity-50 pointer-events-none"}`}>
              <h2 className="text-[18px] font-bold text-[#111]">Prefere combinar direto?</h2>
              <p className="mt-3 text-[14px] text-gray-500 leading-relaxed">
                Sua solicitação vai direto pro operador no WhatsApp e vocês combinam o pagamento
                (Pix ou cartão) diretamente — a vaga é garantida na resposta dele.
              </p>
              <button
                onClick={confirmar}
                disabled={!podeConfirmar}
                className="mt-5 flex items-center justify-center gap-2.5 w-full md:w-auto md:px-9 py-3.5 rounded-full border border-gray-300 text-[#111] text-[14px] font-semibold hover:border-[#111] transition-colors disabled:opacity-40"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Reservar pelo WhatsApp
              </button>
              <p className="mt-3 text-[12px] text-gray-400">
                Resposta em até 30 minutos no horário comercial · Operador verificado pelo Passeador
              </p>
              <p className="mt-2 text-[12px] text-gray-400">
                Ao confirmar, você concorda com os{" "}
                <a href="/termos" target="_blank" className="underline underline-offset-2 text-gray-500">Termos de Uso</a>{" "}
                e a{" "}
                <a href="/privacidade" target="_blank" className="underline underline-offset-2 text-gray-500">Política de Privacidade</a>.
              </p>
            </section>
          </div>

          {/* ── Resumo ── */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="lg:sticky lg:top-20 rounded-3xl border border-gray-100 p-6" style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.07)" }}>

              {/* Passeio */}
              <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={tour.image} alt={tour.title} fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[15px] text-[#111] leading-snug line-clamp-2">{tour.title}</p>
                  <p className="flex items-center gap-1 text-[13px] mt-1.5">
                    <Star size={12} className="fill-[#111] text-[#111]" />
                    <span className="font-semibold text-[#111]">4,9</span>
                    <span className="text-gray-400">· avaliações verificadas</span>
                  </p>
                </div>
              </div>

              {/* Cancelamento */}
              <div className="py-5 border-b border-gray-100">
                <p className="text-[14px] font-semibold text-[#111] mb-1">Política de cancelamento</p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {tour.cancellationPolicy.split("\n").slice(0, 2).join(" ")}
                </p>
              </div>

              {/* Data */}
              <div className="py-5 border-b border-gray-100">
                <p className="text-[14px] font-semibold text-[#111] mb-1">Data</p>
                <p className="text-[14px] text-gray-500 capitalize">{formatDatePt(date)}</p>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  {tour.schedule.frequency === "tide_based"
                    ? "Horário conforme a maré — confirmado na reserva"
                    : `Saída ${tour.schedule.departureStart ?? "a combinar"}${tour.schedule.departureEnd ? `–${tour.schedule.departureEnd}` : ""}${tour.schedule.returnTime ? ` · Retorno ${tour.schedule.returnTime}` : ""}`}
                </p>
              </div>

              {/* Pessoas */}
              <div className="py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111] mb-1">Pessoas</p>
                    <p className="text-[14px] text-gray-500">
                      {adults} adulto{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} criança${children > 1 ? "s" : ""}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditGuests((v) => !v)}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-[13px] font-semibold text-[#111]"
                  >
                    {editGuests ? "Fechar" : "Alterar"}
                  </button>
                </div>
                {editGuests && (
                  <div className="mt-4 space-y-4">
                    <SummaryCounter label="Adultos" value={adults} min={1} onChange={setAdults} />
                    {childPrice && (
                      <SummaryCounter label={`Crianças (${childPrice.label.replace("Criança ", "")})`} value={children} min={0} onChange={setChildren} />
                    )}
                  </div>
                )}
              </div>

              {/* Preço */}
              <div className="pt-5 space-y-2">
                <p className="text-[14px] font-semibold text-[#111] mb-1">Informações de preço</p>
                <div className="flex items-center justify-between text-[14px] text-gray-500">
                  <span>R$ {adultUnit} × {adults} adulto{adults > 1 ? "s" : ""}</span>
                  <span>R$ {adultUnit * adults}</span>
                </div>
                {children > 0 && childPrice && (
                  <div className="flex items-center justify-between text-[14px] text-gray-500">
                    <span>R$ {childUnit} × {children} criança{children > 1 ? "s" : ""}</span>
                    <span>R$ {childUnit * children}</span>
                  </div>
                )}
                {feeNotes.map((n) => (
                  <p key={n} className="text-[12px] text-amber-600">{n}</p>
                ))}
                {querTransfer && (
                  <div className="flex items-center justify-between text-[14px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Car size={14} strokeWidth={1.75} className="text-gray-400" />
                      Transfer do hotel
                    </span>
                    <span className="text-gray-400">a combinar</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
                  <span className="text-[15px] font-bold text-[#111]">Total estimado</span>
                  <span className="text-[17px] font-bold text-[#111]">R$ {total}</span>
                </div>
                <p className="text-[12px] text-gray-400 pt-1">
                  Valores "a partir de" — o operador confirma o total na reserva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryCounter({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[14px] text-[#111]">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-300 text-[#111] flex items-center justify-center hover:border-[#111] transition-colors text-lg font-light disabled:opacity-25"
          aria-label={`Diminuir ${label}`}
        >
          −
        </button>
        <span className="w-5 text-center font-semibold text-[#111] text-[15px] tabular-nums">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 text-[#111] flex items-center justify-center hover:border-[#111] transition-colors text-lg font-light"
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
