import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Passeador",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white pt-14">
      <div className="max-w-[720px] mx-auto px-4 md:px-6 py-14">
        <h1 className="text-[28px] font-bold text-[#111] mb-2">Termos de Uso</h1>
        <p className="text-[13px] text-gray-400 mb-10">Última atualização: julho de 2026</p>

        <div className="space-y-8 text-[15px] text-[#333] leading-relaxed">
          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">1. O que é o Passeador</h2>
            <p>
              O Passeador (<strong>passeador.com</strong>) é uma plataforma que reúne passeios e experiências
              turísticas oferecidos por operadores locais verificados, começando pela região de Porto Seguro,
              Bahia. Nós centralizamos a busca e a reserva — quem presta o serviço, cobra e realiza o passeio
              é sempre o operador responsável, identificado na página de cada passeio.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">2. Como funciona a reserva</h2>
            <p>
              Ao preencher o formulário de reserva, você envia uma solicitação diretamente ao operador do
              passeio via WhatsApp. A vaga só é garantida depois da confirmação do operador. O Passeador não
              processa pagamentos nesta fase — o pagamento é combinado e realizado diretamente com o
              operador, pelo meio que ele oferecer (Pix, cartão, dinheiro).
            </p>
            <p className="mt-3">
              Preços exibidos são "a partir de" e podem variar conforme temporada, número de participantes e
              serviços adicionais (como transfer) — o valor final é confirmado pelo operador antes da
              reserva.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">3. Cancelamentos e reembolsos</h2>
            <p>
              A política de cancelamento é definida por cada operador e fica descrita na página do passeio
              antes da reserva. O Passeador não processa reembolsos diretamente nesta fase — qualquer pedido
              de cancelamento ou reembolso é tratado junto ao operador responsável pelo passeio.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">4. Operadores</h2>
            <p>
              Passamos por um processo de curadoria antes de colocar um operador no ar — mas o Passeador é um
              intermediário entre você e o operador, não o prestador do serviço. A execução do passeio,
              equipamentos, guias e segurança durante a atividade são de responsabilidade do operador.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">5. Conta e login</h2>
            <p>
              Reservar um passeio não exige cadastro. Criar uma conta (via código enviado por e-mail) é
              opcional e serve para acompanhar suas reservas ou, no caso de operadores, gerenciar seus
              próprios passeios.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">6. Seus dados</h2>
            <p>
              Como tratamos seus dados pessoais está descrito na nossa{" "}
              <a href="/privacidade" className="underline underline-offset-2 text-[#111] font-medium">
                Política de Privacidade
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">7. Contato</h2>
            <p>
              Dúvidas sobre estes termos: <a href="mailto:contato@passeador.com" className="underline underline-offset-2 text-[#111] font-medium">contato@passeador.com</a>.
            </p>
          </section>

          <p className="text-[13px] text-gray-400 pt-4 border-t border-gray-100">
            Este documento pode ser atualizado conforme o Passeador evolui — mudanças relevantes serão
            comunicadas nesta página.
          </p>
        </div>
      </div>
    </main>
  );
}
