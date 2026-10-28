/*
  Общее для dates.html (выбор дат) и dates-stats.html (статистика):
  настройки, помощники, календарная сетка и хранилище ответов.
*/
window.KinoDates = (function () {
  const cfg = window.KINO_CONFIG || {};
  const dc = cfg.dates || {};
  const hm = (h) => Math.round(Number(h) * 60);
  const settings = {
    pollId: dc.pollId || "default",
    months: dc.months && dc.months.length ? dc.months : ["2026-11"],
    min: hm(dc.dayStart ?? 10),
    max: hm(dc.dayEnd ?? 24),
    step: Number(dc.stepMinutes) || 30,
    defFrom: hm(dc.defaultFrom ?? 19),
    defTo: hm(dc.defaultTo ?? 23),
    slots: (dc.slots || []).map((s) => ({ label: s.label, short: s.short || s.label, from: hm(s.from), to: hm(s.to) })),
    movie: Number(dc.movieMinutes) || 120,
    showCounts: dc.showCounts !== false
  };

  const $ = (s) => document.querySelector(s);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } }
  };
  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };
  const people = (n) => `${n} ${plural(n, "человек", "человека", "человек")}`;
  const daysWord = (n) => `${n} ${plural(n, "день", "дня", "дней")}`;

  // Тот же анонимный id, что и в голосовании за фильм: один браузер = один участник.
  const voterId = (() => {
    let id = store.get("kino.voter");
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/-/g, "");
      store.set("kino.voter", id);
    }
    return id;
  })();

  // ---------- даты и время ----------
  const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const WD = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const WD_LONG = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];

  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const wdIndex = (date) => (date.getDay() + 6) % 7; // 0 = понедельник
  const todayKey = (() => { const t = new Date(); return keyOf(t.getFullYear(), t.getMonth() + 1, t.getDate()); })();
  const fmtTime = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const fmtRange = (r) => `${fmtTime(r[0])}–${fmtTime(r[1])}`;
  // Коротко для клетки календаря: 19–23, 19:30–23
  const fmtShort = (r) => r.map((m) => (m % 60 ? fmtTime(m).replace(/^0/, "") : String(m / 60))).join("–");
  const fmtDur = (m) => { const h = Math.floor(m / 60), mm = m % 60; return h && mm ? `${h} ч ${mm} мин` : h ? `${h} ч` : `${mm} мин`; };
  const fmtDay = (k) => { const d = parseKey(k); return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`; };
  const fmtDayLong = (k) => { const d = parseKey(k); return `${WD_LONG[wdIndex(d)]}, ${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`; };
  const fmtWd = (k) => WD[wdIndex(parseKey(k))];

  const clampRange = (r) => {
    let a = Math.max(settings.min, Math.min(settings.max - settings.step, Number(r && r[0])));
    let b = Math.max(a + settings.step, Math.min(settings.max, Number(r && r[1])));
    if (!Number.isFinite(a) || !Number.isFinite(b)) { a = settings.defFrom; b = settings.defTo; }
    return [a, b];
  };

  // HTML одного месяца. cell(key, day, info) возвращает внутренность клетки, info: { past, weekend }.
  function monthHTML(ym, cell, cls = "") {
    const [y, m] = ym.split("-").map(Number);
    const first = new Date(y, m - 1, 1);
    const total = new Date(y, m, 0).getDate();
    const lead = wdIndex(first);
    let html = `<section class="month ${cls}"><h2 class="month-title">${MONTHS[m - 1]} <span>${y}</span></h2>`;
    html += `<div class="grid">${WD.map((w, i) => `<div class="wd${i > 4 ? " we" : ""}">${w}</div>`).join("")}`;
    for (let i = 0; i < lead; i++) html += `<div class="day blank" aria-hidden="true"></div>`;
    for (let d = 1; d <= total; d++) {
      const k = keyOf(y, m, d);
      const weekend = wdIndex(new Date(y, m - 1, d)) > 4;
      html += cell(k, d, { past: k < todayKey, weekend });
    }
    return html + `</div></section>`;
  }

  // Ответ из базы → { name, days: { key: [from, to] }, updatedAt }
  function normalize(raw) {
    const days = {};
    for (const [k, v] of Object.entries((raw && raw.days) || {})) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(k) && v) days[k] = clampRange([v.from, v.to]);
    }
    return { name: String((raw && raw.name) || "").slice(0, 60), same: raw ? raw.same !== false : true, days, updatedAt: Number(raw && raw.updatedAt) || 0 };
  }
  const serialize = (a) => {
    const days = {};
    for (const [k, r] of Object.entries(a.days)) days[k] = { from: r[0], to: r[1] };
    const out = { same: !!a.same, days, updatedAt: Date.now() };
    if (a.name) out.name = a.name;
    return out;
  };

  // ---------- хранилище ----------
  function demoBackend() {
    const K = "kino.demo.dates." + settings.pollId;
    const read = () => { try { return JSON.parse(store.get(K)) || {}; } catch { return {}; } };
    let onAll = () => {};
    window.addEventListener("storage", (e) => { if (e.key === K) onAll(read()); });
    return {
      mode: "demo",
      subscribe(all, onError, onConn) { onAll = all; onConn(false); all(read()); },
      async save(answer) {
        const v = read();
        if (answer) v[voterId] = answer; else delete v[voterId];
        if (!store.set(K, JSON.stringify(v))) throw new Error("Не хватило места в браузере");
        onAll(v);
      }
    };
  }

  async function firebaseBackend(fbConfig) {
    const V = "10.12.2";
    const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
    const { getDatabase, ref, onValue, set } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-database.js`);
    const db = getDatabase(initializeApp(fbConfig));
    const root = `dates/${settings.pollId}/answers`;
    return {
      mode: "live",
      subscribe(onAll, onError, onConn) {
        onValue(ref(db, root), (snap) => onAll(snap.val() || {}), onError);
        onValue(ref(db, ".info/connected"), (snap) => onConn(!!snap.val()));
      },
      save(answer) {
        return set(ref(db, `${root}/${voterId}`), answer || null);
      }
    };
  }

  // Firebase, если он настроен, иначе демо-режим. ?demo в адресе включает демо принудительно.
  async function connect(note) {
    const fb = cfg.firebase || {};
    const forceDemo = new URLSearchParams(location.search).has("demo");
    if (!forceDemo && fb.apiKey && fb.databaseURL) {
      try {
        return await firebaseBackend(fb);
      } catch (e) {
        console.error(e);
        note("<b>Не удалось подключиться к Firebase</b> — работаем в демо-режиме. Проверь настройки в config.js.");
        return demoBackend();
      }
    }
    note(forceDemo
      ? "<b>Демо-режим</b> (в адресе есть ?demo). Ответы сохраняются только в этом браузере."
      : "<b>Демо-режим.</b> Ответы сохраняются только в этом браузере. Чтобы собирать даты со всех — подключи Firebase (см. README.md).");
    return demoBackend();
  }

  return {
    settings, $, esc, store, plural, people, daysWord, voterId,
    MONTHS, WD, keyOf, parseKey, todayKey,
    fmtTime, fmtRange, fmtShort, fmtDur, fmtDay, fmtDayLong, fmtWd,
    clampRange, monthHTML, normalize, serialize, connect
  };
})();
