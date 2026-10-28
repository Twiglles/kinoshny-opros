(async function () {
  const K = window.KinoDates;
  const S = K.settings;
  const { $, esc } = K;
  const movie = Math.min(S.movie, S.max - S.min);

  let answers = []; // [{ id, name, label, days, updatedAt }]
  let selectedDay = null;

  // ---------- расчёты ----------
  // По дню: кто отметил, и с какого времени начать, чтобы весь фильм смогло досмотреть больше всего людей.
  function analyzeDay(k) {
    const who = answers.filter((a) => a.days[k]);
    let best = { n: 0, start: null };
    for (let s = S.min; s + movie <= S.max; s += S.step) {
      const n = who.filter((a) => a.days[k][0] <= s && a.days[k][1] >= s + movie).length;
      if (n > best.n) best = { n, start: s };
    }
    return { k, who, best };
  }

  function rankDays() {
    const keys = new Set();
    answers.forEach((a) => Object.keys(a.days).forEach((k) => keys.add(k)));
    return [...keys].map(analyzeDay).sort((x, y) => y.best.n - x.best.n || y.who.length - x.who.length || (x.k < y.k ? -1 : 1));
  }

  // ---------- отрисовка ----------
  function renderKpis(ranked) {
    const n = answers.length;
    const top = ranked[0];
    const daysPicked = answers.reduce((s, a) => s + Object.keys(a.days).length, 0);
    $("#kpis").innerHTML = `
      <div class="kpi"><div class="kpi-label">Ответили</div><div class="kpi-value">${n}</div>
        <div class="kpi-sub">${n ? `в среднем ${(daysPicked / n).toFixed(1).replace(".", ",")} дня на человека` : "пока никто"}</div></div>
      <div class="kpi"><div class="kpi-label">Лучший день</div><div class="kpi-value">${top ? K.fmtDay(top.k) : "—"}</div>
        <div class="kpi-sub">${top ? `${K.fmtDayLong(top.k).split(",")[0]} · отметили ${top.who.length} из ${n}` : "появится после первых ответов"}</div></div>
      <div class="kpi"><div class="kpi-label">Начало в этот день</div><div class="kpi-value">${top && top.best.n ? K.fmtTime(top.best.start) : "—"}</div>
        <div class="kpi-sub">${top && top.best.n ? `весь фильм (${K.fmtDur(movie)}) смогут ${top.best.n} из ${n}` : `нет окна на ${K.fmtDur(movie)}`}</div></div>`;
  }

  function renderTop(ranked) {
    const n = answers.length;
    $("#top-note").textContent = `Сортировка: сколько человек смогут посмотреть весь фильм (${K.fmtDur(movie)}) целиком, потом — сколько отметили день`;
    if (!ranked.length) { $("#top").innerHTML = `<div class="empty">Пока никто не отметил ни одного дня. Отправь людям ссылку на <a href="dates.html">страницу выбора дат</a>.</div>`; return; }
    const lead = ranked[0].best.n;
    $("#top").innerHTML = ranked.slice(0, 10).map((d, i) => `
      <button type="button" class="top-row${d.best.n === lead && lead > 0 ? " first" : ""}${d.k === selectedDay ? " sel" : ""}" data-k="${d.k}">
        <span class="rank">${i + 1}</span>
        <span class="d"><b>${K.fmtDay(d.k)}</b><span>${K.fmtWd(d.k)}</span></span>
        <span class="mid">
          <span class="best">${d.best.n ? `начало в <b>${K.fmtTime(d.best.start)}</b> — смогут ${d.best.n}` : "общего окна на весь фильм нет"}</span>
          <div class="bar"><div class="fill" style="width:${n ? (d.best.n / n) * 100 : 0}%"></div></div>
        </span>
        <span class="n">${d.who.length} <small>из ${n}</small></span>
      </button>`).join("");
  }

  function renderHeat() {
    const counts = {};
    answers.forEach((a) => Object.keys(a.days).forEach((k) => (counts[k] = (counts[k] || 0) + 1)));
    const max = Math.max(1, ...Object.values(counts));
    $("#heat").innerHTML = S.months.map((ym) => K.monthHTML(ym, (k, d, info) => {
      const c = counts[k] || 0;
      const style = c ? ` style="--h:${(0.18 + 0.82 * (c / max)).toFixed(2)}"` : "";
      return `<button type="button" class="day${c ? " lvl" : ""}${info.past ? " past" : ""}${k === selectedDay ? " sel" : ""}" data-k="${k}"${style}
        title="${esc(K.fmtDayLong(k))}: ${c ? K.people(c) : "никто"}"><span class="dn">${d}</span><span class="cnt">${c || ""}</span></button>`;
    })).join("");
  }

  function renderDetail() {
    const block = $("#detail-block");
    if (!selectedDay) { block.hidden = true; return; }
    block.hidden = false;
    const d = analyzeDay(selectedDay);
    const span = S.max - S.min;
    const pct = (m) => ((m - S.min) / span) * 100;

    const slots = [];
    for (let s = S.min; s < S.max; s += S.step) {
      slots.push(d.who.filter((a) => a.days[d.k][0] <= s && a.days[d.k][1] >= s + S.step).length);
    }
    const peak = Math.max(0, ...slots);
    const hist = slots.map((c) => `<i class="${c && c === peak ? "max" : ""}" style="height:${peak ? (c / peak) * 100 : 0}%" title="${c}"></i>`).join("");
    const win = d.best.n ? `<div class="tl-win" style="left:${pct(d.best.start)}%;width:${(movie / span) * 100}%" title="Лучшее окно"></div>` : "";

    const ticks = [];
    for (let m = Math.ceil(S.min / 120) * 120; m <= S.max; m += 120) ticks.push(`<span style="left:${pct(m)}%">${m / 60}:00</span>`);

    const lanes = d.who
      .slice()
      .sort((a, b) => a.days[d.k][0] - b.days[d.k][0])
      .map((a) => {
        const r = a.days[d.k];
        return `<div class="tl-name${a.name ? "" : " anon"}" title="${esc(a.label)}">${esc(a.label)}</div>
          <div class="tl-lane"><div class="tl-bar" style="left:${pct(r[0])}%;width:${pct(r[1]) - pct(r[0])}%">${K.fmtRange(r)}</div></div>`;
      }).join("");

    $("#detail").innerHTML = `
      <h3>${K.fmtDayLong(d.k)}</h3>
      <div class="sub">Отметили <b>${K.people(d.who.length)}</b>${d.best.n
        ? ` · лучше всего начать в <b>${K.fmtTime(d.best.start)}</b>: весь фильм смогут <b>${d.best.n}</b>`
        : ` · общего окна на ${K.fmtDur(movie)} нет`}</div>
      <div class="tl">
        <div class="tl-name anon">Свободны</div>
        <div class="tl-lane" style="background:none;height:64px"><div class="tl-hist">${hist}</div>${win}</div>
        ${lanes}
        <div class="tl-name"></div><div class="tl-axis">${ticks.join("")}</div>
      </div>`;
  }

  function renderPeople() {
    if (!answers.length) { $("#people").innerHTML = `<div class="empty">Ответов пока нет.</div>`; return; }
    const fmtWhen = (t) => t ? new Date(t).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
    const rows = answers
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((a) => {
        const days = Object.keys(a.days).sort();
        return `<tr>
          <td class="${a.name ? "" : "anon"}">${esc(a.label)}</td>
          <td>${days.length}</td>
          <td><div class="chips">${days.map((k) => `<span class="chip">${K.fmtDay(k)} · ${K.fmtShort(a.days[k])}</span>`).join("")}</div></td>
          <td class="when">${fmtWhen(a.updatedAt)}</td>
        </tr>`;
      }).join("");
    $("#people").innerHTML = `<div class="table-wrap"><table class="people">
      <thead><tr><th>Кто</th><th>Дней</th><th>Удобно</th><th>Обновлено</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function render() {
    const ranked = rankDays();
    if (selectedDay && !ranked.some((d) => d.k === selectedDay)) selectedDay = null;
    if (!selectedDay && ranked.length) selectedDay = ranked[0].k;
    renderKpis(ranked);
    renderTop(ranked);
    renderHeat();
    renderDetail();
    renderPeople();
  }

  const select = (k) => {
    selectedDay = k;
    render();
    $("#detail-block").scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  $("#top").addEventListener("click", (e) => { const r = e.target.closest("[data-k]"); if (r) select(r.dataset.k); });
  $("#heat").addEventListener("click", (e) => { const r = e.target.closest("[data-k]"); if (r) select(r.dataset.k); });

  // ---------- CSV: одна строка на человека и день ----------
  $("#csv").addEventListener("click", () => {
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const lines = [["Кто", "id", "Дата", "С", "До", "Обновлено"].map(q).join(";")];
    for (const a of answers) {
      for (const k of Object.keys(a.days).sort()) {
        const r = a.days[k];
        lines.push([a.label, a.id, k, K.fmtTime(r[0]), K.fmtTime(r[1]), a.updatedAt ? new Date(a.updatedAt).toISOString() : ""].map(q).join(";"));
      }
    }
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `kino-dates-${S.pollId}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  // ---------- старт ----------
  const note = (html) => { const el = $("#mode-note"); el.innerHTML = html; el.hidden = !html; };
  render();
  const backend = await K.connect(note);
  const dot = $("#live-dot");
  if (backend.mode === "demo") { dot.classList.add("demo"); $("#conn").textContent = "Демо-режим: данные только из этого браузера"; }

  backend.subscribe(
    (all) => {
      let anon = 0;
      answers = Object.entries(all || {})
        .map(([id, raw]) => ({ id, ...K.normalize(raw) }))
        .filter((a) => Object.keys(a.days).length)
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .map((a) => ({ ...a, label: a.name || `Без имени ${++anon}` }));
      render();
    },
    (err) => { console.error(err); note("<b>Нет доступа к базе дат.</b> Проверь правила (Rules) в Firebase — см. README.md, раздел «Выбор дат»."); },
    (connected) => {
      if (backend.mode === "demo") return;
      dot.classList.toggle("on", connected);
      $("#conn").textContent = connected ? "Онлайн — обновляется вживую" : "Нет соединения";
    }
  );
})();
