# Thai Funchal & Grill — Demo de Gestão Financeira por WhatsApp

Demonstração interativa (peça de vendas) da solução **AI Solutions**: o cliente fotografa uma fatura, envia pelo WhatsApp, e o assistente lê o fornecedor, valores, rubricas e data — organizando tudo num **dashboard financeiro** consultável a qualquer momento. Inclui ainda um **resumo automático no WhatsApp** (diário/semanal).

> ⚠️ Dados fictícios, criados apenas para apresentação a um restaurante asiático no Funchal.

## O que mostra

1. **Hero** — proposta de valor "da fatura ao dashboard em segundos".
2. **Fluxo animado** — telemóvel WhatsApp envia a foto → IA lê → campos extraídos aparecem → confirmação. Roda automaticamente ao chegar à secção, com botão para repetir.
3. **Dashboard interativo** (3 abas):
   - **Visão Geral** — KPIs, despesas por rubrica (donut), compras vs. vendas (área), top fornecedores (barras), últimas faturas.
   - **Faturas** — lista filtrável por rubrica e pesquisa por fornecedor; clicar abre o detalhe da fatura.
   - **Resumo WhatsApp** — mockup da mensagem-resumo automática.

## Stack

HTML/CSS/JS puro + [ApexCharts](https://apexcharts.com/) (via CDN). Sem build — abre `index.html` ou serve estaticamente. Publicado via GitHub Pages.

## Estrutura

```
index.html
assets/
  css/style.css      # estética dark premium AIS + acentos dourados Thai
  js/data.js         # dados fictícios do restaurante (compras, vendas, rubricas)
  js/app.js          # animação do fluxo + dashboard interativo + gráficos
```

---
Powered by **AI Solutions**
