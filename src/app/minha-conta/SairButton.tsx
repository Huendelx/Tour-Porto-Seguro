"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SairButton() {
  const router = useRouter();

  const sair = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={sair}
      className="flex items-center gap-2 text-[14px] font-semibold text-[#111] underline underline-offset-2"
    >
      <LogOut size={15} strokeWidth={2} />
      Sair
    </button>
  );
}
