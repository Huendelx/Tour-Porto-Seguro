import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Passeador",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white pt-14">
      <div className="max-w-[720px] mx-auto px-4 md:px-6 py-14">
        <h1 className="text-[28px] font-bold text-[#111] mb-2">Política de Privacidade</h1>
        <p className="text-[13px] text-gray-400 mb-10">Última atualização: julho de 2026</p>

        <div className="space-y-8 text-[15px] text-[#333] leading-relaxed">
          <section>
            <p>
              Esta política explica quais dados o Passeador coleta, pra que usa, e o que fazemos pra
              proteger essas informações, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">1. Quais dados coletamos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Ao reservar um passeio:</strong> nome, e-mail e número de WhatsApp — usados só pra
                identificar sua reserva e repassá-la ao operador do passeio.
              </li>
              <li>
                <strong>Ao criar uma conta:</strong> seu e-mail, pra enviar o código de acesso e manter você
                logado.
              </li>
              <li>
                <strong>Se você é operador:</strong> nome da empresa, WhatsApp e informações do seu negócio
                que você cadastra no painel.
              </li>
              <li>
                <strong>Automaticamente:</strong> dados técnicos básicos de navegação (endereço IP,
                navegador) que qualquer site recebe ao ser acessado, e sua última busca (destino, data,
                pessoas), guardada só no seu próprio navegador (não em nossos servidores) pra preencher a
                busca da próxima vez que você visitar.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">2. Pra que usamos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processar e encaminhar sua reserva ao operador responsável, via WhatsApp.</li>
              <li>Permitir login sem senha (código de acesso por e-mail).</li>
              <li>Dar suporte quando você entra em contato.</li>
              <li>Melhorar o site com base em como ele é usado.</li>
            </ul>
            <p className="mt-3">
              Não vendemos seus dados pra terceiros, e não usamos seus dados pra nada além do que está
              descrito aqui.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">3. Com quem compartilhamos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>O operador do passeio</strong> que você reserva — recebe seu nome, e-mail e WhatsApp
                pra confirmar e realizar o serviço.
              </li>
              <li>
                <strong>Supabase</strong> — a infraestrutura de banco de dados e autenticação que usamos por
                trás do site (pode processar dados fora do Brasil).
              </li>
              <li>
                <strong>Resend</strong> — serviço usado só pra entregar o e-mail com seu código de acesso.
              </li>
            </ul>
            <p className="mt-3">Nenhum desses parceiros usa seus dados pra fins próprios de marketing.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">4. Por quanto tempo guardamos</h2>
            <p>
              Guardamos os dados de uma reserva enquanto forem relevantes pra você ou pro operador (histórico,
              suporte), e o dado da sua conta enquanto ela existir. Você pode pedir a exclusão a qualquer
              momento — ver seção 6.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">5. Cookies e armazenamento local</h2>
            <p>
              Usamos cookies técnicos essenciais pra manter sua sessão logada, e o armazenamento local do
              navegador (localStorage) pra lembrar sua última busca. Não usamos cookies de rastreamento
              publicitário hoje. Se isso mudar (por exemplo, com ferramentas de analytics), esta política será
              atualizada antes.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">6. Seus direitos</h2>
            <p>Você pode, a qualquer momento, pedir pra:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Confirmar quais dados seus temos;</li>
              <li>Corrigir dados incompletos ou desatualizados;</li>
              <li>Excluir seus dados (respeitado o que for necessário pra obrigações legais/fiscais);</li>
              <li>Saber com quem compartilhamos seus dados.</li>
            </ul>
            <p className="mt-3">
              Pra qualquer um desses pedidos, escreva pra{" "}
              <a href="mailto:contato@passeador.com" className="underline underline-offset-2 text-[#111] font-medium">
                contato@passeador.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">7. Segurança</h2>
            <p>
              Seus dados trafegam de forma criptografada (HTTPS) e ficam num banco de dados com controle de
              acesso — nem toda informação é visível publicamente, e escrita de dados sensíveis passa por
              validações no servidor.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-bold text-[#111] mb-2">8. Contato</h2>
            <p>
              Dúvidas sobre privacidade ou seus dados:{" "}
              <a href="mailto:contato@passeador.com" className="underline underline-offset-2 text-[#111] font-medium">
                contato@passeador.com
              </a>.
            </p>
          </section>

          <p className="text-[13px] text-gray-400 pt-4 border-t border-gray-100">
            Esta política pode ser atualizada conforme o Passeador cresce — mudanças relevantes serão
            comunicadas nesta página.
          </p>
        </div>
      </div>
    </main>
  );
}
