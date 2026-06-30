---
title: "Passeador — Product Spec"
date: "2026-06-28"
---

# Passeador — Product Spec

## O que é

O lugar onde o turista brasileiro compra passeio. Catálogo real, preço transparente, pagamento seguro, confirmação na hora.

Hoje não existe um lugar assim. É WhatsApp, quiosque, agência de rua, site feio de operador. O dinheiro já rola — estimados R$550M/ano só em Porto Seguro. Rola mal. O Passeador é a camada boa em cima de um mercado que já transaciona muito por canais ruins.

## Pra quem

**Turista:** quer achar, comparar, pagar com segurança e saber que vai acontecer. Hoje ele paga um desconhecido e fica rezando pra aparecer.

**Operador:** quer vender direto, sem perder 30–50% pra agência, sem depender de WhatsApp pra fechar. Com o Passeador recebe +70% por reserva comparado com a agência de rua.

## Tipo de marketplace

**Curado, não aberto.** Operador se cadastra, passa por verificação, e só então vai pro ar. A curadoria é feature, não burocracia — "todos os operadores são verificados" é argumento de venda pros dois lados: o turista confia mais, o operador bom se diferencia do picareta.

Não é classificados. Não é "qualquer um lista". A confiança é o produto — se qualquer um entrar sem verificação, morre exatamente o que diferencia a plataforma.

### Fluxo de cadastro do operador

```
Operador acessa o painel → preenche dados da empresa (CNPJ, fotos do equipamento, contato)
    ↓
Cadastra passeios (fotos, preço, horários, o que inclui, ponto de encontro)
    ↓
Fica como "pendente — em análise"
    ↓
Passeador revisa e aprova (ou pede ajustes)
    ↓
Vai pro ar
```

Escala porque o trabalho pesado (preencher tudo) é do operador. O Passeador só valida. No piloto o founder faz a curadoria; com tração, delega.

### APIs e integrações

Não entram agora, e provavelmente por muito tempo. Operador brasileiro pequeno/médio não tem sistema de reserva, não tem API, não tem nada. A "integração" com ele é o painel: tela, botão, notificação. Se um dia aparecer operador grande querendo conectar sistema próprio, aí abre API. Problema de quem tem 500 operadores, não de quem tem 1.

---

## As 3 camadas de valor

### 1. Centraliza e vende (o core)

Catálogo de operadores verificados. Página do passeio com fotos, descrição, preço, o que inclui. Checkout seguro em reais. Confirmação instantânea por e-mail.

É o básico que não existe hoje — e já é o suficiente pra justificar a plataforma. Se tirar tudo o resto e deixar só isso, o Passeador ainda faz sentido.

### 2. Transfer como add-on

Na compra do passeio, o turista pode adicionar busca no hotel. "Adicionar transfer — +R$25."

Resolve três coisas de uma vez: pro turista simplifica (compra passeio e transporte junto), pro operador é receita adicional fácil (já tem a van), e pro Passeador é a porta de entrada natural pro tracking — porque transfer é deslocamento, e deslocamento é onde o GPS brilha.

### 3. Acompanhamento (o diferencial)

O turista quer saber que vai acontecer. A ansiedade é sempre a mesma — "paguei, será que vai rolar?" — só a resposta visual muda conforme o tipo de serviço.

Dois modos, mesma tela, mesmo objetivo:

| Modo | Quando | O que o turista vê | O que o operador faz |
|---|---|---|---|
| **GPS em tempo real** | Serviço com deslocamento até o turista (transfer, buggy, lancha, quadriciclo) | Pin se movendo no mapa + ETA | Liga a localização |
| **Status ao vivo** | Serviço sem deslocamento até o turista (barco no pier, trilha, aula, city tour) | Status atualizado ("confirmado" → "aguardando no local" → "embarque aberto" → "iniciando") | Aperta um botão |

Se tem GPS, mostra o mapa com o pin + os status. Se não tem GPS, mostra só os status. O turista não precisa saber qual modo é — ele abre e vê onde tá o negócio dele.

Pra referência: o Airbnb Experiences, o maior marketplace do mundo, pede pro turista esperar num ponto de encontro. Nenhum acompanhamento, nenhum status, nada. O Passeador resolve isso.

---

## Fluxo do turista

```
Busca destino ("Porto Seguro")
    ↓
Catálogo de passeios (filtro por categoria, preço, tipo)
    ↓
Página do passeio (fotos, descrição, preço, o que inclui)
    ↓
Reserva (data, participantes, dados do turista — sem cadastro)
    ↓
[Opcional] Adicionar transfer do hotel (+R$)
    ↓
Pagamento (Mercado Pago — Pix ou cartão)
    ↓
Confirmação instantânea (e-mail + tela)
    ↓
Dia do passeio → Acompanhamento
    Se tem transfer/deslocamento: GPS no mapa ("sua van chega em 8 min")
    Se não tem: status do operador ("guia confirmado, aguardando no pier 3")
```

## Fluxo do operador

```
Cadastra empresa no painel (CNPJ, fotos, contato)
    ↓
Cadastra passeios (fotos, preço, horários, o que inclui)
    ↓
Verificação do Passeador → aprovado → vai pro ar
    ↓
Recebe reserva (notificação)
    ↓
Confirma ou recusa
    ↓
Dia do passeio:
    Se transfer/deslocamento: liga localização → turista vê no mapa
    Se ponto fixo: atualiza status ("aguardando" → "embarque" → "iniciando")
    ↓
Serviço realizado → recebe o dinheiro (repasse)
```

---

## O que NÃO é

**Não é um app de tracking.** O tracking serve ao core, não é o core.

**Não é Airbnb Experiences.** Airbnb vende experiência premium pra gringo. Passeador vende passeio local pra brasileiro, em reais, com operador da região.

**Não é agregador de link.** O operador não "anuncia" e o turista vai pro WhatsApp dele. A transação inteira acontece dentro da plataforma — é isso que dá segurança e é isso que justifica a comissão.

**Não é plataforma aberta.** Operadores são verificados. Isso é o que sustenta a confiança.

---

## Modelo de receita

- **15% de comissão** por transação. Operador cadastra grátis, paga só quando vende.
- **Transfer como add-on** gera comissão adicional na mesma reserva.
- **Destaque pago** (posicionamento no catálogo) como receita secundária.

---

## Hierarquia de construção

### Agora (validação — Porto Seguro)
Camada 1: catálogo real + checkout Mercado Pago + confirmação por e-mail. UI do tracking mockada com "em breve". Transfer como conceito no design, sem implementar ainda. Sem cadastro de turista. Sem painel CRUD do operador. Dados do piloto cadastrados na mão.

### Com validação positiva
Camada 2: transfer add-on funcional. Camada 3 modo status (mais simples de construir, já cobre a maioria dos passeios). Painel do operador com cadastro self-service + verificação. Checkout transparente (pagar sem sair do site).

### Com tração
Camada 3 modo GPS (precisa de operador real testando em campo). Split de pagamento automático. Multi-praça. Reviews. Destaque pago.
