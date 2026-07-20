"use client";

import { useState } from "react";
import { Mail, User, Building2, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function EntrarForm() {
  const [role, setRole] = useState<"turista" | "operador">("turista");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "verifying" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const emailValido = /^\S+@\S+\.\S+$/.test(email);
  const codeValido = /^\d{6,8}$/.test(code);

  const enviar = async () => {
    if (!emailValido) return;
    setStatus("loading");
    setErrorMsg("");

    const supabase = createSupabaseBrowserClient();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          data: { intended_role: role },
        },
      });

      if (error) {
        console.error("signInWithOtp error:", error.status, error.code, error.message, error);
        setStatus("error");
        setErrorMsg(error.message || `Erro ${error.status ?? ""} (${error.code ?? "sem código"}) — confere o console`);
        return;
      }
      setStatus("sent");
    } catch (e) {
      console.error("signInWithOtp threw:", e);
      setStatus("error");
      setErrorMsg("Falha de rede ao tentar enviar o código — confere o console do navegador.");
    }
  };

  const confirmar = async () => {
    if (!codeValido) return;
    setStatus("verifying");
    setErrorMsg("");

    const supabase = createSupabaseBrowserClient();
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      });

      if (error) {
        console.error("verifyOtp error:", error.status, error.code, error.message, error);
        setStatus("sent");
        setErrorMsg(error.message || "Código inválido ou expirado — pede um novo.");
        return;
      }

      window.location.href = "/minha-conta";
    } catch (e) {
      console.error("verifyOtp threw:", e);
      setStatus("sent");
      setErrorMsg("Falha de rede ao confirmar o código — confere o console do navegador.");
    }
  };

  return status === "sent" || status === "verifying" ? (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={26} strokeWidth={1.75} className="text-[#2d7d46]" />
      </div>
      <h1 className="text-[22px] font-bold text-[#111]">Digite o código</h1>
      <p className="text-[14px] text-gray-500 mt-2 leading-relaxed">
        Mandamos um código pra <span className="font-medium text-[#111]">{email}</span>.
      </p>

      <input
        type="text"
        inputMode="numeric"
        autoFocus
        maxLength={8}
        placeholder="00000000"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
        onKeyDown={(e) => e.key === "Enter" && confirmar()}
        className="w-full mt-6 py-3.5 rounded-xl border border-gray-300 text-[24px] text-center tracking-[0.3em] text-[#111] outline-none focus:border-[#111] transition-colors"
      />

      {errorMsg && <p className="mt-3 text-[13px] text-red-500">{errorMsg}</p>}

      <button
        onClick={confirmar}
        disabled={!codeValido || status === "verifying"}
        className="mt-4 w-full py-3.5 rounded-full bg-[#111] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors disabled:opacity-40"
      >
        {status === "verifying" ? "Confirmando..." : "Confirmar código"}
      </button>

      <button
        onClick={() => {
          setStatus("idle");
          setCode("");
          setErrorMsg("");
        }}
        className="mt-4 text-[13px] font-semibold text-[#111] underline underline-offset-2"
      >
        Usar outro e-mail
      </button>
    </div>
  ) : (
    <>
      <h1 className="text-[26px] font-bold text-[#111] text-center leading-tight">Entrar no Passeador</h1>
      <p className="text-[14px] text-gray-500 text-center mt-2">
        Sem senha — a gente manda um código no seu e-mail.
      </p>

      {/* Turista / Operador */}
      <div className="flex rounded-full bg-gray-100 p-1 mt-8">
        {([
          { id: "turista" as const, label: "Sou turista", icon: User },
          { id: "operador" as const, label: "Sou operador", icon: Building2 },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setRole(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
              role === t.id ? "bg-[#111] text-white" : "text-[#444] hover:text-[#111]"
            }`}
          >
            <t.icon size={14} strokeWidth={2} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 relative">
        <Mail size={17} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-300 text-[15px] text-[#111] placeholder:text-gray-400 outline-none focus:border-[#111] transition-colors"
        />
      </div>

      {status === "error" && (
        <p className="mt-3 text-[13px] text-red-500">{errorMsg}</p>
      )}

      <button
        onClick={enviar}
        disabled={!emailValido || status === "loading"}
        className="mt-4 w-full py-3.5 rounded-full bg-[#111] text-white text-[15px] font-semibold hover:bg-[#333] transition-colors disabled:opacity-40"
      >
        {status === "loading" ? "Enviando..." : "Enviar código de acesso"}
      </button>

      <p className="mt-6 text-[12px] text-gray-400 text-center leading-relaxed">
        {role === "operador"
          ? "Área do operador — cadastre e gerencie seus passeios."
          : "Área do turista — acompanhe suas reservas."}
      </p>
      <p className="mt-3 text-[12px] text-gray-400 text-center leading-relaxed">
        Ao continuar, você concorda com os{" "}
        <a href="/termos" target="_blank" className="underline underline-offset-2">Termos de Uso</a>{" "}
        e a{" "}
        <a href="/privacidade" target="_blank" className="underline underline-offset-2">Política de Privacidade</a>.
      </p>
    </>
  );
}
