<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Passeador — Founder's Workbook</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #09090b;
    color: #d4d4d8;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  .page { max-width: 800px; margin: 0 auto; padding: 60px 24px 120px; }

  h1 { font-size: 28px; font-weight: 700; color: #fafafa; margin-bottom: 4px; }
  .subtitle { color: #71717a; font-size: 14px; margin-bottom: 48px; }

  /* Legend */
  .legend { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 48px; padding: 16px 0; border-top: 1px solid #1e1e22; border-bottom: 1px solid #1e1e22; }
  .legend span { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #a1a1aa; }
  .d { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
  .dg { background: #22c55e; }
  .dy { background: #eab308; }
  .dr { background: #ef4444; }

  /* Sections */
  .s { margin-bottom: 56px; }
  .s-head { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #52525b; margin-bottom: 4px; }
  h2 { font-size: 18px; font-weight: 600; color: #fafafa; margin-bottom: 6px; }
  .s-quote { font-size: 13px; color: #52525b; font-style: italic; margin-bottom: 20px; }

  /* Items */
  .item { display: flex; gap: 10px; padding: 10px 12px; border-radius: 6px; margin-bottom: 4px; font-size: 13px; line-height: 1.6; }
  .item .d { margin-top: 5px; }
  .ig { background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.12); }
  .iy { background: rgba(234,179,8,0.05); border: 1px solid rgba(234,179,8,0.1); }
  .ir { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1); }
  .item strong { color: #e4e4e7; font-weight: 500; }
  .src { display: block; font-size: 11px; color: #52525b; margin-top: 2px; }

  /* Tables */
  .tw { overflow-x: auto; margin: 12px 0; border: 1px solid #1e1e22; border-radius: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 14px; background: #111113; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #71717a; border-bottom: 1px solid #1e1e22; }
  td { padding: 10px 14px; border-bottom: 1px solid #141416; }
  tr:last-child td { border-bottom: none; }

  /* Calc blocks */
  .calc { background: #111113; border: 1px solid #1e1e22; border-radius: 6px; padding: 20px; font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace; font-size: 12.5px; line-height: 1.9; white-space: pre-wrap; margin: 12px 0; color: #a1a1aa; }
  .calc .v { color: #fafafa; font-weight: 500; }
  .calc .g { color: #22c55e; }
  .calc .r { color: #ef4444; }
  .calc .y { color: #eab308; }

  /* Boxes */
  .box { border-radius: 6px; padding: 16px; margin: 12px 0; font-size: 13px; }
  .box-blue { background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.12); }
  .box-red { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1); }
  .box-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
  .box-blue .box-label { color: #3b82f6; }
  .box-red .box-label { color: #ef4444; }

  /* Card */
  .card { background: #111113; border: 1px solid #1e1e22; border-radius: 6px; padding: 20px; margin-bottom: 12px; }
  .card-t { font-size: 14px; font-weight: 600; color: #e4e4e7; margin-bottom: 12px; }

  /* Timeline */
  .tl { margin: 16px 0; }
  .tl-item { display: flex; gap: 16px; margin-bottom: 16px; }
  .tl-left { display: flex; flex-direction: column; align-items: center; }
  .tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; flex-shrink: 0; }
  .tl-line { width: 1px; flex: 1; background: #1e1e22; margin-top: 4px; }
  .tl-label { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
  .tl-text { font-size: 13px; }

  /* Footer */
  .footer { text-align: center; padding-top: 40px; border-top: 1px solid #1e1e22; margin-top: 60px; }
  .footer p { font-size: 14px; color: #52525b; max-width: 560px; margin: 0 auto 16px; }
  .footer small { font-size: 11px; color: #3f3f46; letter-spacing: 1px; text-transform: uppercase; }

  p { margin-bottom: 8px; }
  .muted { color: #71717a; }

  @media (max-width: 640px) {
    .page { padding: 32px 16px 80px; }
    .legend { flex-direction: column; gap: 8px; }
  }
</style>
</head>
<body>
<div class="page">

<h1>Passeador — Founder's Workbook</h1>
<p class="subtitle">Padrão San Francisco · Investor-Ready Data Room</p>

<div class="legend">
  <span><i class="d dg"></i> Pesquisado com fonte</span>
  <span><i class="d dy"></i> Estimativa — validar</span>
  <span><i class="d dr"></i> Só você consegue</span>
</div>

<!-- 01 -->
<div class="s">
  <div class="s-head">01</div>
  <h2>Problem Statement</h2>
  <p class="s-quote">"Se você não consegue descrever o problema em uma frase que faz a pessoa concordar com a cabeça, você não entendeu o problema ainda."</p>

  <p>Turistas no Brasil compram passeios locais via WhatsApp de operadores informais, sem garantia de preço, qualidade ou segurança — e os operadores perdem venda por não terem presença digital.</p>

  <div style="margin-top:16px">
    <div class="item ig"><i class="d dg"></i><div>OTAs globais cobram <strong>20-30% de comissão</strong> dos operadores. GYG: 20-30%. Viator: 20-30%. Airbnb: 20% flat.<span class="src">Arival, Regiondo, SambaHQ — 2025/2026</span></div></div>
    <div class="item ig"><i class="d dg"></i><div>OTAs capturaram <strong>33% das reservas</strong> de tours em 2024 (era 24% em 2019).<span class="src">Arival Operator Survey, 7.000+ operadores</span></div></div>
    <div class="item ig"><i class="d dg"></i><div>GetYourGuide não aceitava Real nativo. Civitatis foca turista europeu. <strong>Gap claro no mercado local.</strong></div></div>
    <div class="item ig"><i class="d dg"></i><div><strong>Vendas são quase 100% informais em todo o Brasil:</strong> operador divulga no Instagram e panfletagem de rua, fechamento via WhatsApp. Padrão nacional — de passeio de R$110 em Porto Seguro a aluguel de lancha de R$2k+ em Ubatuba/SP.<span class="src">Observação direta de campo + análise de perfis de operadores</span></div></div>
    <div class="item ir"><i class="d dr"></i><div><strong>Quantos operadores têm site funcional?</strong> — Google Maps + campo</div></div>
    <div class="item ir"><i class="d dr"></i><div><strong>Reclamações reais de turistas</strong> — ReclameAqui, TripAdvisor Porto Seguro</div></div>
    <div class="item ir"><i class="d dr"></i><div><strong>Depoimento direto do Porto Brasil Turismo</strong> confirmando a dor</div></div>
  </div>
</div>

<!-- 02 -->
<div class="s">
  <div class="s-head">02</div>
  <h2>Why Now</h2>
  <p class="s-quote">"O 'why now' é o que separa uma boa ideia de um bom timing."</p>

  <div class="item ig"><i class="d dg"></i><div><strong>Turismo BR em recorde:</strong> R$185 bilhões jan-out/2025.<span class="src">FecomercioSP/IBGE, jan/2026</span></div></div>
  <div class="item ig"><i class="d dg"></i><div><strong>20,6M viagens domésticas</strong> em 2024. Gasto médio subiu 8%: R$1.706 → R$1.843.<span class="src">PNAD/IBGE, out/2025</span></div></div>
  <div class="item ig"><i class="d dg"></i><div><strong>Turismo de experiências crescendo todo ano:</strong> 15,5% (2020) → 24,4% (2024). Única categoria em crescimento contínuo.<span class="src">PNAD/IBGE</span></div></div>
  <div class="item ig"><i class="d dg"></i><div><strong>Nordeste = 45% do faturamento</strong> doméstico e 44% dos embarques.<span class="src">Anuário Braztoa 2024</span></div></div>
  <div class="item ig"><i class="d dg"></i><div><strong>Porto Seguro:</strong> 2.467.363 visitantes em 2024 (+13%). Jan/2025: +17%. 3º destino mais vendido do Brasil. Permanência: 5,2 dias.<span class="src">Prefeitura Porto Seguro / Panrotas</span></div></div>
  <div class="item ig"><i class="d dg"></i><div><strong>Pix = 54,7% de todas as transações</strong> do Brasil (2S/2025). R$28 trilhões movimentados até out/2025.<span class="src">Banco Central / Istoé Dinheiro, abr/2026</span></div></div>
  <div class="item ir"><i class="d dr"></i><div><strong>% operadores sem presença digital</strong> — pesquisa de campo</div></div>
</div>

<!-- 03 -->
<div class="s">
  <div class="s-head">03</div>
  <h2>Market Sizing</h2>
  <p class="s-quote">"Em SF, se você começa pelo TAM, investidor já sabe que você não fez o dever de casa."</p>

  <div class="card">
    <div class="card-t">Bottom-Up — Porto Seguro</div>
    <div class="tw"><table>
      <tr><th>Variável</th><th>Valor</th><th></th></tr>
      <tr><td>Visitantes/ano</td><td>2.467.363 (2024)</td><td><i class="d dg"></i></td></tr>
      <tr><td>Crescimento</td><td>+13% YoY</td><td><i class="d dg"></i></td></tr>
      <tr><td>Permanência média</td><td>5,2 dias</td><td><i class="d dg"></i></td></tr>
      <tr><td>Hotéis/pousadas</td><td>760 · 70.000 leitos</td><td><i class="d dg"></i></td></tr>
      <tr><td>Operadores ativos</td><td>~150-250 (estimativa)</td><td><i class="d dy"></i></td></tr>
      <tr><td>Passeios/operador/mês</td><td>—</td><td><i class="d dr"></i></td></tr>
      <tr><td>Ticket médio</td><td>R$110</td><td><i class="d dg"></i></td></tr>
      <tr><td>Take rate</td><td>15%</td><td><i class="d dg"></i></td></tr>
      <tr><td>Receita/transação</td><td>R$16,50</td><td><i class="d dg"></i></td></tr>
      <tr><td>% penetração Ano 1</td><td>—</td><td><i class="d dr"></i></td></tr>
    </table></div>

    <div class="calc"><span class="muted">Cenário conservador:</span>
200 ops × 15% = <span class="v">30 operadores</span>
30 × 60 passeios/mês × R$16,50 = <span class="v">R$29.700/mês</span>
Anualizado (c/ sazonalidade): <span class="y">~R$260k-350k/ano</span>

<span class="muted">Cenário otimista:</span>
200 ops × 25% = <span class="v">50 operadores</span>
50 × 80 passeios/mês × R$16,50 = <span class="v">R$66.000/mês</span>
Anualizado: <span class="y">~R$580k-790k/ano</span></div>

    <div class="box box-red"><div class="box-label">Atenção</div>Estes números são hipóteses. O investidor vai perguntar "de onde vieram esses 60 passeios/mês?" e você precisa ter entrevistado operadores reais.</div>
  </div>

  <div class="card">
    <div class="card-t">Expansão — SAM (Top 10 Destinos)</div>
    <div class="tw"><table>
      <tr><th>Destino</th><th>Relativo</th><th></th></tr>
      <tr><td>Porto Seguro (base)</td><td>1x</td><td><i class="d dg"></i></td></tr>
      <tr><td>Foz do Iguaçu</td><td>~1.2x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Bonito</td><td>~0.8x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Gramado/Canela</td><td>~0.8x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Florianópolis</td><td>~0.7x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Jericoacoara</td><td>~0.6x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Chapada Diamantina</td><td>~0.5x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Paraty</td><td>~0.5x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Morro de São Paulo</td><td>~0.4x</td><td><i class="d dy"></i></td></tr>
      <tr><td>Fernando de Noronha</td><td>~0.3x</td><td><i class="d dy"></i></td></tr>
    </table></div>
    <p class="muted" style="font-size:12px;margin-top:8px">SAM estimado: ~6.8x Porto Seguro ≈ R$2.4M/ano em receita take rate (conservador)</p>
  </div>

  <div class="card">
    <div class="card-t">Top-Down — TAM (contexto)</div>
    <div class="tw"><table>
      <tr><th>Dado</th><th>Valor</th><th></th></tr>
      <tr><td>Turismo Brasil 2025</td><td>R$185B (jan-out)</td><td><i class="d dg"></i></td></tr>
      <tr><td>Viagens domésticas 2024</td><td>R$22,8B gastos</td><td><i class="d dg"></i></td></tr>
      <tr><td>% lazer</td><td>39,8%</td><td><i class="d dg"></i></td></tr>
      <tr><td>% experiências/cultura</td><td>24,4%</td><td><i class="d dg"></i></td></tr>
      <tr><td>Mercado passeios/tours</td><td>~R$3-5B</td><td><i class="d dy"></i></td></tr>
      <tr><td>TAM digitalizável</td><td>~R$1-2B</td><td><i class="d dy"></i></td></tr>
    </table></div>
    <p class="muted" style="font-size:12px;margin-top:8px">Sanity check: SOM Ano 1 (~R$350k) = ~0.02% do TAM → Saudável</p>
  </div>
</div>

<!-- 04 -->
<div class="s">
  <div class="s-head">04</div>
  <h2>Unit Economics</h2>
  <p class="s-quote">"Investidor SF pula direto pra essa página. Se não fecha, nada mais importa."</p>

  <div class="card">
    <div class="card-t">Economia por transação</div>
    <div class="calc">Ticket médio:               <span class="v">R$110,00</span>    <i class="d dg"></i>
Take rate (15%):             <span class="v">R$16,50</span>     <i class="d dg"></i>
Operador recebe:             R$93,50

Via Pix (MP 0.99% s/ R$110): <span class="r">-R$1,09</span>     <i class="d dg"></i>
  Margem bruta:              <span class="g">R$15,41</span>

Via cartão (MP ~3.99%):      <span class="r">-R$4,39</span>     <i class="d dg"></i>
  Margem bruta:              <span class="y">R$12,11</span>

Mix (70% Pix / 30% cartão): <span class="g">~R$14,42</span>    <i class="d dy"></i></div>
  </div>

  <div class="card">
    <div class="card-t">CAC — Custo de Aquisição</div>
    <div class="calc"><span class="muted">Lado turista:</span>
Budget Google Ads:           <span class="v">R$3.000-4.000</span>  <i class="d dg"></i>
CPC estimado (turismo BR):   <span class="y">R$1,50-3,00</span>   <i class="d dy"></i>
Cliques (R$3.500):           <span class="y">~1.150-2.300</span>  <i class="d dy"></i>
Conversão:                   <span class="r">🔴 SÓ O TESTE DIRÁ</span>
  (benchmark BR: 1-3%)

<span class="muted">Lado operador:</span>
Método:                      <span class="r">🔴 Venda direta</span>
CAC operador:                <span class="r">🔴</span></div>
  </div>

  <div class="card">
    <div class="card-t">Números mágicos</div>
    <div class="calc">LTV/CAC turista:   ~R$19,50 / ~R$115 = <span class="r">0.17x ❌</span>
LTV/CAC operador:  ~R$14.040 / ~R$500 = <span class="g">28x ✅</span></div>

    <div class="box box-blue">
      <div class="box-label">Insight crítico</div>
      <p>Passeador <strong>não é</strong> negócio de aquisição de turista via ads. É negócio de <strong>aquisição de operador</strong>. O operador traz os turistas. Ads é complementar.</p>
      <p style="margin-top:8px;margin-bottom:0;color:#a1a1aa"><em>"Adquirimos operadores a ~R$500 de CAC. Cada operador gera ~R$14k de LTV. O operador traz seu próprio fluxo de turistas — nós damos a ferramenta pra converter e rastrear."</em></p>
    </div>
  </div>
</div>

<!-- 05 -->
<div class="s">
  <div class="s-head">05</div>
  <h2>Tração & Validação</h2>
  <p class="s-quote">"Dado mata opinião."</p>

  <div class="tw"><table>
    <tr><th>Sinal</th><th></th><th>Detalhe</th></tr>
    <tr><td>Operador parceiro (Porto Brasil)</td><td><i class="d dg"></i></td><td>15 tours, preços verificados</td></tr>
    <tr><td>Cap table</td><td><i class="d dg"></i></td><td>80/5/15</td></tr>
    <tr><td>Comissão</td><td><i class="d dg"></i></td><td>15% take rate</td></tr>
    <tr><td>MVP scope</td><td><i class="d dg"></i></td><td>Supabase + Mercado Pago + Resend</td></tr>
    <tr><td>Diferencial tracking</td><td><i class="d dg"></i></td><td>GPS + status updates</td></tr>
    <tr><td>LOI operadores</td><td><i class="d dr"></i></td><td>Formalizar</td></tr>
    <tr><td>MVP funcional</td><td><i class="d dr"></i></td><td>Construir</td></tr>
    <tr><td>Landing page</td><td><i class="d dr"></i></td><td>Criar</td></tr>
    <tr><td>Teste Google Ads</td><td><i class="d dr"></i></td><td>R$3-4k, 30 dias</td></tr>
    <tr><td>Entrevistas (5-10 ops)</td><td><i class="d dr"></i></td><td>Fazer</td></tr>
    <tr><td>Dados conversão</td><td><i class="d dr"></i></td><td>Só após teste</td></tr>
  </table></div>
</div>

<!-- 06 -->
<div class="s">
  <div class="s-head">06</div>
  <h2>Competição</h2>

  <div class="tw"><table>
    <tr><th>Player</th><th>Comissão</th><th>Fraqueza no BR</th><th></th></tr>
    <tr><td>GetYourGuide</td><td>20-30%</td><td>Sem suporte PT, sem foco local</td><td><i class="d dg"></i></td></tr>
    <tr><td>Viator</td><td>20-30%</td><td>Comissão alta, sem Pix</td><td><i class="d dg"></i></td></tr>
    <tr><td>Civitatis</td><td>~20-25%</td><td>Foco turista europeu</td><td><i class="d dg"></i></td></tr>
    <tr><td>Airbnb Experiences</td><td>20%</td><td>Pouca oferta fora capitais</td><td><i class="d dg"></i></td></tr>
    <tr><td>WhatsApp</td><td>0%</td><td>Sem garantia, sem escala</td><td><i class="d dg"></i></td></tr>
    <tr><td>Agências locais</td><td>30-40%</td><td>Sem digital</td><td><i class="d dy"></i></td></tr>
    <tr><td style="color:#fafafa;font-weight:600">Passeador</td><td style="color:#22c55e;font-weight:600">15%</td><td style="color:#71717a">Local-first · Pix · GPS tracking</td><td></td></tr>
  </table></div>
</div>

<!-- 07 -->
<div class="s">
  <div class="s-head">07</div>
  <h2>The Ask</h2>

  <div class="calc">Valor:              <span class="v">R$150k — R$250k</span>       <i class="d dg"></i>
Equity:             <span class="v">10%</span>                      <i class="d dg"></i>
Pre-money:          <span class="v">R$1,5M — R$2,5M</span>         <i class="d dg"></i>

Uso do capital:
  Ads validação:    <span class="r">🔴</span>
  MVP/produto:      <span class="r">🔴</span>
  Operações PS:     <span class="r">🔴</span>
  Pró-labore:       <span class="r">🔴</span>
  Runway (meses):   <span class="r">🔴</span>

Milestones:
  <span class="r">🔴</span> "30 ops, 500 tx/mês, R$8k MRR em 6 meses"
  <span class="r">🔴</span> "Unit economics provada"
  <span class="r">🔴</span> "2ª praça validada"</div>
</div>

<!-- 08 -->
<div class="s">
  <div class="s-head">08</div>
  <h2>Próximos Passos</h2>

  <div class="tl">
    <div class="tl-item"><div class="tl-left"><div class="tl-dot"></div><div class="tl-line"></div></div><div><div class="tl-label">Sem 1-2 · Campo</div><div class="tl-text">Ligar pro Porto Brasil Turismo — volume, sazonalidade, comissões</div></div></div>
    <div class="tl-item"><div class="tl-left"><div class="tl-dot"></div><div class="tl-line"></div></div><div><div class="tl-label">Sem 1-2 · Mapeamento</div><div class="tl-text">Google Maps + TripAdvisor: contar operadores Porto Seguro</div></div></div>
    <div class="tl-item"><div class="tl-left"><div class="tl-dot"></div><div class="tl-line"></div></div><div><div class="tl-label">Sem 1-2 · Entrevistas</div><div class="tl-text">3-5 operadores — validar volume, dor, disposição</div></div></div>
    <div class="tl-item"><div class="tl-left"><div class="tl-dot"></div><div class="tl-line"></div></div><div><div class="tl-label">Sem 3-4 · Build</div><div class="tl-text">MVP funcional + landing page</div></div></div>
    <div class="tl-item"><div class="tl-left"><div class="tl-dot"></div><div class="tl-line"></div></div><div><div class="tl-label">Sem 3-4 · Validação</div><div class="tl-text">Google Ads R$3-4k, 30 dias</div></div></div>
    <div class="tl-item"><div class="tl-left"><div class="tl-dot" style="background:#22c55e"></div></div><div><div class="tl-label" style="color:#22c55e">Depois · Pitch</div><div class="tl-text">Preencher 🔴 → Deck 10-12 slides → Ensaiar 10x</div></div></div>
  </div>
</div>

<!-- 09 -->
<div class="s">
  <div class="s-head">09</div>
  <h2>Fontes</h2>
  <div class="tw"><table>
    <tr><th>Dado</th><th>Fonte</th><th>Data</th></tr>
    <tr><td>Turismo R$185B</td><td>FecomercioSP/IBGE</td><td>Jan 2026</td></tr>
    <tr><td>PNAD Turismo</td><td>IBGE/MTur</td><td>Out 2025</td></tr>
    <tr><td>Braztoa R$5.46B</td><td>Anuário Braztoa</td><td>Jul 2025</td></tr>
    <tr><td>Porto Seguro</td><td>Prefeitura PS</td><td>Jan 2025</td></tr>
    <tr><td>Pix 54,7%</td><td>BC / Istoé Dinheiro</td><td>Abr 2026</td></tr>
    <tr><td>OTA comissões</td><td>Arival / SambaHQ</td><td>2025-2026</td></tr>
    <tr><td>CPC Travel</td><td>WordStream 2024/25</td><td>—</td></tr>
    <tr><td>Mercado Pago</td><td>Blog MP</td><td>Mai 2026</td></tr>
  </table></div>
</div>

<!-- 10 -->
<div class="s">
  <div class="s-head">10</div>
  <h2>Glossário</h2>
  <p style="color:#71717a;margin-bottom:16px;">Termos usados neste documento, explicados de forma direta.</p>

  <div class="tw"><table>
    <tr><th style="width:160px">Termo</th><th>O que é</th></tr>
    <tr><td><strong>TAM</strong></td><td>Total Addressable Market. O mercado total, se todo mundo no mundo que poderia usar, usasse. É o número maior e mais teórico. Ex: "todo o mercado de passeios turísticos no Brasil."</td></tr>
    <tr><td><strong>SAM</strong></td><td>Serviceable Addressable Market. A fatia do TAM que você consegue atingir com seu modelo (limitação geográfica, tipo de cliente, canal). Ex: "passeios nos top 10 destinos de lazer do Brasil."</td></tr>
    <tr><td><strong>SOM</strong></td><td>Serviceable Obtainable Market. O que você de fato espera capturar nos próximos 12-18 meses. O número mais importante pro investidor porque mostra se você é pé no chão. Ex: "15% dos operadores de Porto Seguro no Ano 1."</td></tr>
    <tr><td><strong>Bottom-up</strong></td><td>Método de sizing que começa do pequeno pro grande. Você conta os operadores, multiplica por passeios, multiplica por ticket. É o método que investidor confia.</td></tr>
    <tr><td><strong>Top-down</strong></td><td>Método oposto: começa do mercado total e vai dividindo. "Turismo no Brasil fatura R$185B, X% é lazer, Y% é passeio..." Útil como contexto, mas sozinho não convence.</td></tr>
    <tr><td><strong>Unit Economics</strong></td><td>A economia de uma única transação. Quanto entra, quanto sai, quanto sobra. Se uma transação individual não dá lucro, fazer mil transações só multiplica o prejuízo.</td></tr>
    <tr><td><strong>CAC</strong></td><td>Customer Acquisition Cost. Quanto você gasta pra trazer um cliente. Se gastou R$3.000 em ads e vieram 30 clientes, CAC = R$100.</td></tr>
    <tr><td><strong>LTV</strong></td><td>Lifetime Value. Quanto um cliente gera de receita ao longo de toda a relação com você. Turista que compra 2 passeios e nunca mais volta tem LTV baixo. Operador que fica 18 meses tem LTV alto.</td></tr>
    <tr><td><strong>LTV/CAC</strong></td><td>A relação entre o que o cliente gera e o que custou pra trazer. Abaixo de 3x = perigoso (gasta quase tudo pra adquirir). Acima de 3x = saudável. Acima de 5x = deveria investir mais em crescimento.</td></tr>
    <tr><td><strong>Take rate</strong></td><td>A comissão que a plataforma cobra por transação. Passeador cobra 15%. De um passeio de R$110, fica com R$16,50.</td></tr>
    <tr><td><strong>Margem de contribuição</strong></td><td>O que sobra de cada transação depois de tirar os custos variáveis (taxa do Mercado Pago, etc). É o dinheiro real que cada venda coloca no caixa.</td></tr>
    <tr><td><strong>Payback period</strong></td><td>Em quanto tempo o custo de aquisição se paga. Se CAC = R$100 e cada transação dá R$14 de margem, precisa de ~7 transações pra recuperar o investimento.</td></tr>
    <tr><td><strong>CPC</strong></td><td>Cost per Click. Quanto você paga cada vez que alguém clica no seu anúncio no Google. Turismo no Brasil gira em torno de R$1,50-3,00.</td></tr>
    <tr><td><strong>CTR</strong></td><td>Click-through Rate. De cada 100 pessoas que viram seu anúncio, quantas clicaram. 3-5% é bom pra Google Ads.</td></tr>
    <tr><td><strong>Taxa de conversão</strong></td><td>De cada 100 pessoas que chegaram na sua página, quantas compraram. E-commerce no Brasil: 1-3% é normal.</td></tr>
    <tr><td><strong>MRR</strong></td><td>Monthly Recurring Revenue. Receita mensal recorrente. É o número que investidor mais acompanha porque mostra crescimento mês a mês.</td></tr>
    <tr><td><strong>Runway</strong></td><td>Quantos meses você sobrevive com o dinheiro que tem (ou que vai levantar). Se levantou R$200k e gasta R$20k/mês, seu runway é 10 meses.</td></tr>
    <tr><td><strong>Pre-money valuation</strong></td><td>Quanto a empresa vale ANTES de receber o investimento. Se pre-money é R$2M e o investidor coloca R$200k por 10%, post-money vira R$2,2M.</td></tr>
    <tr><td><strong>Equity</strong></td><td>Participação societária. O pedaço da empresa que o investidor recebe em troca do dinheiro.</td></tr>
    <tr><td><strong>Seed</strong></td><td>Rodada de investimento inicial. No Brasil, tipicamente R$100k-1M. Serve pra validar o produto e conseguir tração inicial.</td></tr>
    <tr><td><strong>MVP</strong></td><td>Minimum Viable Product. A versão mais simples do produto que funciona. Não precisa ser bonito, precisa provar que resolve o problema.</td></tr>
    <tr><td><strong>LOI</strong></td><td>Letter of Intent. Documento (pode ser simples) onde um operador diz "sim, tenho interesse em usar a plataforma." Não é contrato, mas mostra pro investidor que existe demanda real.</td></tr>
    <tr><td><strong>NPS</strong></td><td>Net Promoter Score. Pesquisa de satisfação: "de 0 a 10, quanto você recomendaria?" Acima de 50 é excelente. Acima de 70 é excepcional.</td></tr>
    <tr><td><strong>Go-to-Market</strong></td><td>A estratégia de como você vai ao mercado. Como adquire os primeiros clientes, em que ordem, com que canais. O plano concreto dos próximos 6 meses.</td></tr>
    <tr><td><strong>Moat</strong></td><td>Fosso defensável. O que impede um concorrente de copiar você facilmente. Pode ser tecnologia, rede de operadores, marca, dados. "Por que o GetYourGuide não faz isso amanhã?"</td></tr>
    <tr><td><strong>OTA</strong></td><td>Online Travel Agency. Plataformas como GetYourGuide, Viator, Civitatis, Booking. São os intermediários digitais de turismo.</td></tr>
    <tr><td><strong>Two-sided marketplace</strong></td><td>Marketplace de dois lados: precisa atrair oferta (operadores) e demanda (turistas) ao mesmo tempo. O desafio clássico do ovo e da galinha.</td></tr>
    <tr><td><strong>Supply side / Demand side</strong></td><td>Os dois lados do marketplace. Supply = quem oferece (operador). Demand = quem compra (turista). Cada lado tem CAC e LTV diferentes.</td></tr>
    <tr><td><strong>YoY</strong></td><td>Year over Year. Comparação com o mesmo período do ano anterior. "+13% YoY" = cresceu 13% comparado ao ano passado.</td></tr>
    <tr><td><strong>Tração</strong></td><td>Qualquer evidência de que o negócio funciona no mundo real. Vendas, usuários, waitlist, LOIs. É o que transforma PowerPoint em empresa.</td></tr>
    <tr><td><strong>Cap table</strong></td><td>Tabela de capitalização. Quem tem quanto % da empresa. Passeador: 80% Huendel / 5% operador PS / 15% pool reservado.</td></tr>
    <tr><td><strong>Why Now</strong></td><td>A seção do pitch que explica por que esse negócio faz sentido AGORA. Que forças externas (tecnologia, regulação, comportamento) criaram uma janela de oportunidade.</td></tr>
    <tr><td><strong>Sanity check</strong></td><td>Verificação de sanidade. Olhar se o número que você calculou faz sentido no mundo real. "Meu SOM é 0.02% do TAM? Ok, faz sentido. É 30%? Alguma coisa tá errada."</td></tr>
  </table></div>
</div>

<div class="footer">
  <p>"Os 🟢 te dão credibilidade. Os 🟡 te dão direção. Os 🔴 são o que te separa de quem só tem PowerPoint."</p>
  <small>MAXED® · Passeador · 2026</small>
</div>

</div>
</body>
</html>
