/* ============================================================
   Thai Funchal & Grill — Demo · lógica de UI
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

document.getElementById("dash-mes").textContent = MES_REF;

/* ---------- 1. ANIMAÇÃO DO FLUXO (motion) ---------- */
const waBody = $("#wa-body");
const f = FATURA_DEMO;

function msgOut(html, time = "14:32") {
  const el = document.createElement("div");
  el.className = "wa-msg out";
  el.innerHTML = `${html}<span class="time">${time} <span class="ticks">✓✓</span></span>`;
  waBody.appendChild(el); scrollWA();
  return el;
}
function msgIn(html, time = "14:32") {
  const el = document.createElement("div");
  el.className = "wa-msg in";
  el.innerHTML = `${html}<span class="time">${time}</span>`;
  waBody.appendChild(el); scrollWA();
  return el;
}
function scrollWA() { waBody.scrollTop = waBody.scrollHeight; }

function photoBubble() {
  return `<div class="wa-photo">
    <div class="ph-top"></div>
    <div class="ph-in">
      <h5>${f.fornecedor}</h5>
      <div class="ph-row"><span>Fatura nº 2026/1042</span><span>${fmtData(f.data)}</span></div>
      <div class="ph-row"><span>NIF 511 234 567</span><span>Funchal</span></div>
      <div class="ph-row"><span>${f.itens.length} artigos</span><span>IVA incl.</span></div>
      <div class="ph-tot"><span>TOTAL</span><span>${eur(f.total)}</span></div>
    </div>
  </div>`;
}

function fmtData(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

let pipeTimers = [];
function clearPipe() {
  pipeTimers.forEach(clearTimeout); pipeTimers = [];
  $$(".pipe-step").forEach((s) => s.classList.remove("on"));
  $("#extract").classList.remove("show");
  $("#extract-foot").classList.remove("show");
  $("#extract-list").innerHTML = "";
  waBody.innerHTML = '<div class="wa-day">HOJE</div>';
}

async function playDemo() {
  clearPipe();
  const btn = $("#btn-play");
  btn.disabled = true; btn.textContent = "▶ A reproduzir…";

  $("#wa-status").textContent = "online";
  await wait(500);
  msgIn("Boa tarde! 👋 Envie-me a foto da fatura e eu trato de tudo.");
  await wait(900);

  // cliente envia foto
  msgOut(photoBubble());
  $(".pipe-step[data-step='1']").classList.add("on");
  await wait(1100);

  // assistente "a ler"
  $("#wa-status").textContent = "a escrever…";
  const typing = document.createElement("div");
  typing.className = "wa-typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  waBody.appendChild(typing); scrollWA();
  $(".pipe-step[data-step='2']").classList.add("on");
  await wait(1600);
  typing.remove();
  $("#wa-status").textContent = "online";

  // extração no painel direito
  $("#extract").classList.add("show");
  const cat = CATEGORIAS[f.categoria];
  const campos = [
    { lbl: "Fornecedor", val: f.fornecedor },
    { lbl: "Data", val: fmtData(f.data) },
    { lbl: "Rubrica", tag: true, cor: cat.cor, val: `${cat.icon} ${cat.nome}` },
    { lbl: "Subtotal", val: eur(f.subtotal) },
    { lbl: "IVA", val: eur(f.iva) },
    { lbl: "Total", val: eur(f.total) },
  ];
  const list = $("#extract-list");
  for (let i = 0; i < campos.length; i++) {
    const c = campos[i];
    const li = document.createElement("li");
    li.style.animationDelay = i * 0.12 + "s";
    li.style.borderLeftColor = c.tag ? c.cor : "var(--purple)";
    const valHtml = c.tag
      ? `<span class="val tag" style="background:${c.cor}22;color:${c.cor}">${c.val}</span>`
      : `<span class="val">${c.val}</span>`;
    li.innerHTML = `<span class="lbl">${c.lbl}</span>${valHtml}`;
    list.appendChild(li);
  }
  await wait(900);

  // confirmação no WhatsApp
  msgIn(`✅ <strong>Fatura registada!</strong><br>${f.fornecedor} · ${eur(f.total)}<br><small>Rubrica: ${cat.nome}</small>`);
  await wait(700);
  $(".pipe-step[data-step='3']").classList.add("on");
  $("#extract-foot").classList.add("show");
  await wait(500);
  msgIn("Já está organizada no seu painel 📊");

  btn.disabled = false; btn.textContent = "↻ Repetir demonstração";
}

$("#btn-play").addEventListener("click", playDemo);

// auto-play quando a secção entra em vista (uma vez)
let played = false;
new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting && !played) { played = true; playDemo(); }
  });
}, { threshold: 0.4 }).observe($("#flow"));

/* ---------- 2. DASHBOARD ---------- */

// Tabs
$$(".tab").forEach((t) => t.addEventListener("click", () => {
  $$(".tab").forEach((x) => x.classList.remove("active"));
  $$(".tabpane").forEach((x) => x.classList.remove("active"));
  t.classList.add("active");
  $("#tab-" + t.dataset.tab).classList.add("active");
  if (t.dataset.tab === "visao") setTimeout(renderCharts, 60);
}));

// KPIs
function renderKpis() {
  const compras = totalCompras(), vendas = totalVendas(), saldo = saldoMes();
  const nFat = COMPRAS.length;
  const html = [
    { cls: "k-out", ic: "📤", lbl: "Despesas (compras)", val: eur(compras), foot: `${nFat} faturas processadas`, footcls: "" },
    { cls: "k-in", ic: "📥", lbl: "Receitas (vendas)", val: eur(vendas), foot: `22 dias de operação`, footcls: "" },
    { cls: "k-saldo", ic: "⚖️", lbl: "Saldo do mês", val: eur(saldo), foot: saldo >= 0 ? "Resultado positivo" : "A operar abaixo", footcls: saldo >= 0 ? "pos" : "neg" },
    { cls: "k-fat", ic: "🧾", lbl: "Faturas / dia (média)", val: (nFat / 22).toFixed(1), foot: "100% via WhatsApp", footcls: "" },
  ].map((k) => `
    <div class="kpi ${k.cls}">
      <div class="k-lbl">${k.ic} ${k.lbl}</div>
      <div class="k-val">${k.val}</div>
      <div class="k-foot ${k.footcls}">${k.foot}</div>
    </div>`).join("");
  $("#kpis").innerHTML = html;
}

// Lista recente (visão geral)
function renderRecent() {
  const html = COMPRAS.slice(0, 6).map((f) => {
    const c = CATEGORIAS[f.categoria];
    return `<li>
      <div class="mini-ic" style="background:${c.cor}22">${c.icon}</div>
      <div class="mini-meta"><strong>${f.fornecedor}</strong><small>${fmtData(f.data)} · ${c.nome}</small></div>
      <div class="mini-val">${eur(f.total)}</div>
    </li>`;
  }).join("");
  $("#mini-recent").innerHTML = html;
}

// Charts
let charts = {};
function renderCharts() {
  const cat = comprasPorCategoria();
  const serie = serieDiaria();
  const top = topFornecedores(5);
  const txtDim = "#9a98b5";

  // Donut
  if (charts.donut) charts.donut.destroy();
  charts.donut = new ApexCharts($("#chart-donut"), {
    chart: { type: "donut", height: 260, fontFamily: "Inter", background: "transparent" },
    series: cat.map((c) => c.valor),
    labels: cat.map((c) => c.nome),
    colors: cat.map((c) => c.cor),
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: {
      show: true, label: "Total compras", color: txtDim, fontSize: "13px",
      formatter: () => eur(totalCompras()),
    }, value: { color: "#eceaf6", fontSize: "20px", fontWeight: 700, formatter: (v) => eur(v) } } } } },
    tooltip: { theme: "dark", y: { formatter: (v) => eur(v) } },
  });
  charts.donut.render();
  $("#donut-legend").innerHTML = cat.map((c) =>
    `<span><i style="background:${c.cor}"></i>${c.icon} ${c.nome}</span>`).join("");

  // Area
  if (charts.area) charts.area.destroy();
  charts.area = new ApexCharts($("#chart-area"), {
    chart: { type: "area", height: 270, fontFamily: "Inter", background: "transparent", toolbar: { show: false } },
    series: [
      { name: "Vendas", data: serie.vendas },
      { name: "Compras", data: serie.compras },
    ],
    colors: ["#25d366", "#E5484D"],
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: .35, opacityTo: .02 } },
    stroke: { curve: "smooth", width: 2.5 },
    dataLabels: { enabled: false },
    xaxis: { categories: serie.labels, labels: { style: { colors: txtDim, fontSize: "11px" }, rotate: 0, hideOverlappingLabels: true }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: txtDim }, formatter: (v) => "€" + Math.round(v) } },
    grid: { borderColor: "rgba(255,255,255,.06)" },
    legend: { labels: { colors: txtDim }, markers: { radius: 4 } },
    tooltip: { theme: "dark", y: { formatter: (v) => eur(v) } },
  });
  charts.area.render();

  // Bar
  if (charts.bar) charts.bar.destroy();
  charts.bar = new ApexCharts($("#chart-bar"), {
    chart: { type: "bar", height: 270, fontFamily: "Inter", background: "transparent", toolbar: { show: false } },
    series: [{ name: "Compras", data: top.map((t) => t.valor) }],
    colors: ["#7066A8"],
    plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: "62%", distributed: true } },
    dataLabels: { enabled: true, formatter: (v) => eur(v), style: { colors: ["#eceaf6"], fontSize: "12px" }, offsetX: 6, textAnchor: "start" },
    colors: ["#9b8fe0", "#7c6fd4", "#7066A8", "#5e4fb0", "#4a3f8f"],
    xaxis: { categories: top.map((t) => t.nome), labels: { style: { colors: txtDim }, formatter: (v) => "€" + Math.round(v) }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: "#eceaf6", fontSize: "12px" } } },
    grid: { borderColor: "rgba(255,255,255,.06)" },
    legend: { show: false },
    tooltip: { theme: "dark", y: { formatter: (v) => eur(v) } },
  });
  charts.bar.render();
}

/* ---------- 3. TAB FATURAS ---------- */
let filtroCat = "todas", filtroTxt = "";

function renderChips() {
  const cats = comprasPorCategoria();
  let html = `<div class="chip ${filtroCat === "todas" ? "active" : ""}" data-cat="todas" style="${filtroCat === "todas" ? "background:#7066A8" : ""}">Todas</div>`;
  html += cats.map((c) => {
    const active = filtroCat === c.cat;
    return `<div class="chip ${active ? "active" : ""}" data-cat="${c.cat}" style="${active ? `background:${c.cor}` : ""}">${c.icon} ${c.nome}</div>`;
  }).join("");
  $("#cat-chips").innerHTML = html;
  $$("#cat-chips .chip").forEach((ch) => ch.addEventListener("click", () => {
    filtroCat = ch.dataset.cat; renderChips(); renderTable();
  }));
}

function renderTable() {
  let rows = COMPRAS.filter((f) =>
    (filtroCat === "todas" || f.categoria === filtroCat) &&
    (filtroTxt === "" || f.fornecedor.toLowerCase().includes(filtroTxt)));
  if (!rows.length) {
    $("#ftable-body").innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--txt-dim);padding:34px">Sem faturas para este filtro.</td></tr>`;
    return;
  }
  $("#ftable-body").innerHTML = rows.map((f, i) => {
    const c = CATEGORIAS[f.categoria];
    return `<tr data-id="${f.id}">
      <td>${fmtData(f.data)}</td>
      <td>${f.fornecedor}</td>
      <td><span class="rub" style="background:${c.cor}22;color:${c.cor}">${c.icon} ${c.nome}</span></td>
      <td class="r"><strong>${eur(f.total)}</strong></td>
      <td><span class="origem">🟢 WhatsApp</span></td>
      <td class="r"><span class="chev">›</span></td>
    </tr>`;
  }).join("");
  $$("#ftable-body tr[data-id]").forEach((tr) => tr.addEventListener("click", () => openModal(tr.dataset.id)));
}

$("#search").addEventListener("input", (e) => { filtroTxt = e.target.value.toLowerCase().trim(); renderTable(); });

/* ---------- Modal detalhe ---------- */
function openModal(id) {
  const f = COMPRAS.find((x) => x.id === id) || FATURA_DEMO;
  const c = CATEGORIAS[f.categoria];
  const itens = f.itens.map((it) => `<li><span>${it.desc}</span><span>${eur(it.valor)}</span></li>`).join("");
  $("#modal-card").innerHTML = `
    <div class="m-head">
      <div>
        <h3>${f.fornecedor}</h3>
        <small>Fatura ${f.id} · ${fmtData(f.data)}</small>
      </div>
      <button class="m-close" id="m-close">×</button>
    </div>
    <div class="m-body">
      <span class="m-tag" style="background:${c.cor}22;color:${c.cor}">${c.icon} ${c.nome}</span>
      <ul class="m-items">${itens}</ul>
      <div class="m-totrow"><span style="color:var(--txt-dim)">Subtotal</span><span>${eur(f.subtotal)}</span></div>
      <div class="m-totrow"><span style="color:var(--txt-dim)">IVA</span><span>${eur(f.iva)}</span></div>
      <div class="m-totrow big"><span>Total</span><span>${eur(f.total)}</span></div>
      <div style="margin-top:16px;font-size:13px;color:var(--txt-dim);display:flex;align-items:center;gap:7px">
        🟢 Recebida e processada via WhatsApp · ${fmtData(f.data)}
      </div>
    </div>`;
  $("#modal").classList.add("show");
  $("#m-close").addEventListener("click", closeModal);
}
function closeModal() { $("#modal").classList.remove("show"); }
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ---------- 4. RESUMO WHATSAPP ---------- */
function renderResumo() {
  const u = ultimas24h();
  const totU = u.reduce((s, x) => s + x.total, 0);
  // vendas do dia 22
  const vDia = VENDAS.filter((v) => v.data === "2026-05-22").reduce((s, v) => s + v.total, 0);
  const porCat = {};
  u.forEach((x) => { porCat[x.categoria] = (porCat[x.categoria] || 0) + x.total; });
  const linhasCat = Object.entries(porCat)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${CATEGORIAS[k].icon} ${CATEGORIAS[k].nome}: <strong>${eur(v)}</strong>`)
    .join("<br>");

  const body = $("#resumo-body");
  body.innerHTML = `<div class="wa-day">RESUMO DIÁRIO · 22/05</div>`;
  const msg = document.createElement("div");
  msg.className = "wa-msg in";
  msg.innerHTML = `
    <strong>📊 Resumo do dia — Thai Funchal &amp; Grill</strong><br><br>
    📥 <strong>Vendas:</strong> ${eur(vDia)}<br>
    📤 <strong>Compras:</strong> ${eur(totU)} (${u.length} faturas)<br>
    ⚖️ <strong>Saldo do dia:</strong> ${eur(vDia - totU)}<br><br>
    <em>Compras por rubrica:</em><br>${linhasCat}<br><br>
    💡 Tudo registado no painel. Bom serviço! 🍜
    <span class="time">09:00</span>`;
  body.appendChild(msg);
}

/* ---------- INIT ---------- */
renderKpis();
renderRecent();
renderChips();
renderTable();
renderResumo();
// charts só quando a secção aparece (apex precisa de largura)
new IntersectionObserver((entries, obs) => {
  entries.forEach((e) => { if (e.isIntersecting) { renderCharts(); obs.disconnect(); } });
}, { threshold: 0.15 }).observe($("#dashboard"));
