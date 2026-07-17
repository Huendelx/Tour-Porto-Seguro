import TourForm from "@/components/operador/TourForm";
import { createTour } from "../../actions";

export default function NovoPasseioPage() {
  return (
    <div>
      <h1 className="text-[24px] font-bold text-[#111] mb-8">Novo passeio</h1>
      <TourForm action={createTour} submitLabel="Cadastrar passeio" />
    </div>
  );
}
