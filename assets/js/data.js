/* ============================================================
   Thai Funchal & Grill — Dados de demonstração
   Dados fictícios mas realistas para um restaurante asiático
   no Funchal (Madeira). Mês de referência: Maio 2026.
   ============================================================ */

const MES_REF = "Maio 2026";

// Categorias de despesa (rubricas) com cor e ícone
const CATEGORIAS = {
  peixe:     { nome: "Peixe & Marisco",    cor: "#00C2A8", icon: "🦐" },
  carne:     { nome: "Carne & Aves",       cor: "#E5484D", icon: "🥩" },
  frescos:   { nome: "Vegetais & Frescos", cor: "#46A758", icon: "🥬" },
  mercearia: { nome: "Mercearia & Secos",  cor: "#F5A623", icon: "🍚" },
  asia:      { nome: "Importados Ásia",    cor: "#EC4899", icon: "🥢" },
  bebidas:   { nome: "Bebidas",            cor: "#8B5CF6", icon: "🍶" },
  energia:   { nome: "Energia & Água",     cor: "#F2C94C", icon: "⚡" },
  renda:     { nome: "Renda & Espaço",     cor: "#5B8DEF", icon: "🏠" },
  pessoal:   { nome: "Pessoal",            cor: "#14B8A6", icon: "👨‍🍳" },
  marketing: { nome: "Marketing",          cor: "#FF7849", icon: "📣" },
};

// Fornecedores típicos por rubrica
const FORNECEDORES = {
  peixe:     ["Doca do Peixe Lda", "Mercado dos Lavradores", "Frescos do Atlântico"],
  carne:     ["Talho Central Funchal", "Makro Cash & Carry", "Aves da Madeira"],
  frescos:   ["Hortas da Madeira", "Mercado dos Lavradores", "BioFrescos Lda"],
  mercearia: ["Recheio Cash & Carry", "Makro Cash & Carry", "Distrib. Insular"],
  asia:      ["Asia Foods Importação", "Oriental Market Lisboa", "Thai Import Pt"],
  bebidas:   ["Empresa de Cervejas Madeira", "Coral Distribuição", "Vinhos & Cia"],
  energia:   ["EEM — Eletricidade Madeira", "ARM Águas Madeira", "Gás Madeira"],
  renda:     ["Imobiliária Sé Funchal"],
  pessoal:   ["Segurança Social", "Processamento Salários"],
  marketing: ["Meta Platforms", "Gráfica do Funchal", "AI Solutions"],
};

// Gerador determinístico simples (para a demo ser sempre igual)
let _seed = 42;
function rnd() { _seed = (_seed * 9301 + 49297) % 233280; return _seed / 233280; }
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function between(min, max) { return Math.round((min + rnd() * (max - min)) * 100) / 100; }

// Itens de exemplo por rubrica (para o detalhe da fatura)
const ITENS = {
  peixe:     [["Camarão tigre 1kg", 24.9], ["Lulas limpas 2kg", 31.8], ["Salmão fresco 1.5kg", 27.0], ["Polvo 1kg", 18.5]],
  carne:     [["Peito de frango 5kg", 32.5], ["Vazia de novilho 2kg", 41.0], ["Pato inteiro", 16.9], ["Entrecosto 3kg", 21.3]],
  frescos:   [["Coentros (molhos x10)", 9.0], ["Manga verde 3kg", 11.4], ["Cebola roxa 5kg", 7.5], ["Pak choi 2kg", 8.8], ["Lima 2kg", 6.9]],
  mercearia: [["Arroz jasmim 10kg", 28.0], ["Noodles de arroz 5kg", 19.5], ["Óleo de amendoim 5L", 22.0], ["Açúcar de palma 2kg", 12.0]],
  asia:      [["Pasta de caril vermelho 2kg", 26.0], ["Leite de coco 12un", 21.6], ["Molho de peixe 6L", 33.0], ["Folhas de lima kafir", 14.5]],
  bebidas:   [["Cerveja Coral 24un", 19.2], ["Água 1.5L (12)", 6.5], ["Refrigerantes pack", 14.0], ["Vinho da casa (6gf)", 27.0]],
  energia:   [["Eletricidade — consumo mensal", 0], ["Água — consumo mensal", 0], ["Gás — botijas", 0]],
  renda:     [["Renda do espaço — Rua da Carreira", 0]],
  pessoal:   [["Salários equipa cozinha + sala", 0], ["TSU Segurança Social", 0]],
  marketing: [["Campanha Instagram/Facebook", 0], ["Flyers menu novo", 0]],
};

// Faixas de valor por rubrica
const FAIXAS = {
  peixe:     [80, 320], carne: [70, 260], frescos: [25, 120], mercearia: [60, 290],
  asia:      [90, 340], bebidas: [40, 210], energia: [180, 540], renda: [1800, 1800],
  pessoal:   [3200, 4100], marketing: [60, 320],
};

// Gera as faturas de COMPRA do mês
function gerarCompras() {
  const lista = [];
  const dist = {
    peixe: 5, carne: 4, frescos: 6, mercearia: 4, asia: 3,
    bebidas: 4, energia: 3, renda: 1, pessoal: 1, marketing: 2,
  };
  let id = 1000;
  for (const cat in dist) {
    for (let i = 0; i < dist[cat]; i++) {
      const dia = Math.floor(rnd() * 22) + 1; // mês decorrido: dias 1–22
      const [min, max] = FAIXAS[cat];
      const base = between(min, max);
      const iva = Math.round(base * 0.13 * 100) / 100; // restauração ~13%/23%
      const itensPool = ITENS[cat];
      const nItens = cat === "energia" || cat === "renda" || cat === "pessoal" || cat === "marketing" ? 1 : Math.min(itensPool.length, 2 + Math.floor(rnd() * 3));
      const itens = [];
      let resto = base;
      for (let k = 0; k < nItens; k++) {
        const it = itensPool[k % itensPool.length];
        const val = k === nItens - 1 ? Math.round(resto * 100) / 100 : Math.round((resto / (nItens - k)) * 100) / 100;
        resto -= val;
        itens.push({ desc: it[0], valor: val });
      }
      lista.push({
        id: "C" + (id++),
        tipo: "compra",
        fornecedor: pick(FORNECEDORES[cat]),
        categoria: cat,
        data: `2026-05-${String(dia).padStart(2, "0")}`,
        subtotal: base,
        iva,
        total: Math.round((base + iva) * 100) / 100,
        itens,
        estado: "processada",
        origem: "WhatsApp",
      });
    }
  }
  return lista.sort((a, b) => b.data.localeCompare(a.data));
}

// Receitas (vendas) — fecho diário do restaurante por canal
function gerarVendas() {
  const lista = [];
  const canais = [
    { nome: "Sala (almoço + jantar)", peso: 0.62 },
    { nome: "Takeaway / Balcão", peso: 0.18 },
    { nome: "Uber Eats", peso: 0.11 },
    { nome: "Glovo", peso: 0.09 },
  ];
  for (let dia = 1; dia <= 22; dia++) {
    const dow = new Date(2026, 4, dia).getDay();
    const fimSemana = dow === 5 || dow === 6 || dow === 0;
    const totalDia = between(fimSemana ? 1100 : 620, fimSemana ? 1850 : 1150);
    canais.forEach((c) => {
      lista.push({
        id: `V${dia}-${c.nome.slice(0, 3)}`,
        tipo: "venda",
        canal: c.nome,
        data: `2026-05-${String(dia).padStart(2, "0")}`,
        total: Math.round(totalDia * c.peso * 100) / 100,
        estado: "processada",
      });
    });
  }
  return lista;
}

const COMPRAS = gerarCompras();
const VENDAS = gerarVendas();

// helper local (eur ainda não definido aqui em cima — só ordenação)

// Fatura "destaque" usada na animação (a que o cliente envia na demo)
const FATURA_DEMO = {
  id: "C1042",
  tipo: "compra",
  fornecedor: "Asia Foods Importação",
  categoria: "asia",
  data: "2026-05-22",
  subtotal: 248.40,
  iva: 32.29,
  total: 280.69,
  itens: [
    { desc: "Pasta de caril vermelho 2kg", valor: 26.0 },
    { desc: "Leite de coco 12un", valor: 21.6 },
    { desc: "Molho de peixe 6L", valor: 33.0 },
    { desc: "Noodles de arroz 10kg", valor: 39.0 },
    { desc: "Folhas de lima kafir + capim-limão", valor: 28.8 },
    { desc: "Arroz jasmim 25kg", valor: 60.0 },
    { desc: "Óleo de amendoim 10L", valor: 40.0 },
  ],
  estado: "processada",
  origem: "WhatsApp",
};

// A fatura da demo faz parte das compras do mês (dia 22) e fica no topo
COMPRAS.unshift(FATURA_DEMO);
COMPRAS.sort((a, b) => b.data.localeCompare(a.data));

// Helpers de agregação ------------------------------------------------
function eur(n) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n || 0);
}

function totalCompras() { return COMPRAS.reduce((s, f) => s + f.total, 0); }
function totalVendas() { return VENDAS.reduce((s, f) => s + f.total, 0); }
function saldoMes() { return totalVendas() - totalCompras(); }

function comprasPorCategoria() {
  const m = {};
  COMPRAS.forEach((f) => { m[f.categoria] = (m[f.categoria] || 0) + f.total; });
  return Object.entries(m)
    .map(([k, v]) => ({ cat: k, nome: CATEGORIAS[k].nome, cor: CATEGORIAS[k].cor, icon: CATEGORIAS[k].icon, valor: Math.round(v * 100) / 100 }))
    .sort((a, b) => b.valor - a.valor);
}

function topFornecedores(n = 5) {
  const m = {};
  COMPRAS.forEach((f) => { m[f.fornecedor] = (m[f.fornecedor] || 0) + f.total; });
  return Object.entries(m).map(([k, v]) => ({ nome: k, valor: Math.round(v * 100) / 100 }))
    .sort((a, b) => b.valor - a.valor).slice(0, n);
}

function serieDiaria() {
  // agrega compras e vendas por dia
  const dias = {};
  for (let d = 1; d <= 22; d++) dias[d] = { compras: 0, vendas: 0 };
  COMPRAS.forEach((f) => { const d = +f.data.slice(-2); if (dias[d]) dias[d].compras += f.total; });
  VENDAS.forEach((f) => { const d = +f.data.slice(-2); if (dias[d]) dias[d].vendas += f.total; });
  const labels = [], compras = [], vendas = [];
  for (let d = 1; d <= 22; d++) {
    labels.push(`${String(d).padStart(2, "0")}/05`);
    compras.push(Math.round(dias[d].compras * 100) / 100);
    vendas.push(Math.round(dias[d].vendas * 100) / 100);
  }
  return { labels, compras, vendas };
}

// Faturas das últimas 24h (para o resumo WhatsApp)
// Inclui a fatura enviada na demo + compras dos 2 dias mais recentes,
// para o resumo ter substância.
function ultimas24h() {
  const dia = COMPRAS.filter((f) => f.data === "2026-05-22" && f.id !== FATURA_DEMO.id);
  return [FATURA_DEMO, ...dia].sort((a, b) => b.total - a.total);
}
