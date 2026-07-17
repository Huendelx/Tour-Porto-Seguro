import { redirect } from "next/navigation";
import { User, BadgeCheck } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import SairButton from "./SairButton";

export const dynamic = "force-dynamic";

export default async function MinhaContaPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/entrar");
  if (profile.role === "operador") redirect("/operador");

  return (
    <main className="min-h-screen bg-white pt-14 flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] py-16 text-center">
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

        <div className="mt-8 p-5 rounded-2xl bg-gray-50 border border-gray-100 text-left">
          <p className="text-[14px] text-gray-500 leading-relaxed">
            A área &quot;minhas reservas&quot; chega em breve. Por enquanto, reservar continua
            funcionando sem precisar de conta.
          </p>
        </div>

        <div className="mt-8">
          <SairButton />
        </div>
      </div>
    </main>
  );
}
