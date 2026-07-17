import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OperadorLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/entrar");
  if (profile.role !== "operador") redirect("/minha-conta");

  return (
    <main className="min-h-screen bg-[#fafafa] pt-14">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6 flex items-center gap-6 h-14">
          <Link href="/operador" className="text-[14px] font-semibold text-[#111]">
            Painel do operador
          </Link>
          <nav className="flex items-center gap-5 ml-auto">
            <Link href="/operador" className="text-[14px] text-gray-600 hover:text-[#111] transition-colors">
              Meus passeios
            </Link>
            <Link href="/operador/reservas" className="text-[14px] text-gray-600 hover:text-[#111] transition-colors">
              Reservas
            </Link>
          </nav>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-10">
        {children}
      </div>
    </main>
  );
}
