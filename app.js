(async function () {
  const cfg = window.KINO_CONFIG || {};
  const pollId = cfg.pollId || "main";
  const maxVotes = Number(cfg.maxVotesPerPerson) || 0;
  const staticFilms = (window.FILMS || []).map((f, i) => ({ ...f, id: String(f.id || "film-" + i) }));
  let films = staticFilms.slice(); // + фильмы, добавленные через форму

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
  const votesWord = (n) => `${n} ${plural(n, "голос", "голоса", "голосов")}`;
  const castList = (c) => (Array.isArray(c) ? c : String(c || "").split(",")).map((s) => String(s).trim()).filter(Boolean);

  // Анонимный id участника: хранится в браузере, по нему один человек = один голос за фильм.
  const voterId = (() => {
    let id = store.get("kino.voter");
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/-/g, "");
      store.set("kino.voter", id);
    }
    return id;
  })();

  let votes = {}; // { filmId: { voterId: true } }
  const isMine = (id) => !!(votes[id] && votes[id][voterId]);
  const countOf = (id) => Object.keys(votes[id] || {}).length;
  const myCount = () => films.filter((f) => isMine(f.id)).length;

  // ---------- карточки ----------
  function ratingBadges(f) {
    const r = f.ratings || {};
    const out = [];
    const ten = (x) => (typeof x === "number" ? x.toFixed(1) : esc(x));
    const badge = (href, label, value, title = "") => {
      const inner = `<span class="tag">${label}</span>${value}`;
      const t = title ? ` title="${title}"` : "";
      return href
        ? `<a class="rate" href="${href}" target="_blank" rel="noopener"${t}>${inner}</a>`
        : `<span class="rate"${t}>${inner}</span>`;
    };
    if (r.imdb != null) {
      out.push(badge(f.imdbId ? `https://www.imdb.com/title/${esc(f.imdbId)}/` : "", "IMDb", ten(r.imdb)));
    }
    if (r.kp != null) {
      const href = f.kpId
        ? `https://www.kinopoisk.ru/film/${esc(f.kpId)}/`
        : `https://www.kinopoisk.ru/index.php?kp_query=${encodeURIComponent(f.title)}`;
      out.push(badge(href, "КП", ten(r.kp)));
    }
    if (r.rt != null) {
      out.push(badge(f.rtSlug ? `https://www.rottentomatoes.com/m/${esc(f.rtSlug)}` : "", "RT", `${esc(r.rt)}%`,
        "Rotten Tomatoes — доля положительных рецензий критиков"));
    }
    return out.join("");
  }

  function posterHTML(f, i) {
    const img = f.poster
      ? `<img src="${esc(f.poster)}" alt="${esc(f.title)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`
      : "";
    return `<div class="poster"><div class="ph">${esc(f.title)}</div>${img}<span class="num">${i + 1}</span></div>`;
  }

  function renderFilms() {
    $("#films").innerHTML = films.map((f, i) => {
      const sub = [f.original && f.original !== f.title ? esc(f.original) : "", esc(f.year), f.runtime ? `${esc(f.runtime)} мин` : ""]
        .filter(Boolean).join('<span class="dot">·</span>');
      const cast = castList(f.cast);
      const facts = [
        f.director ? `<dt>Режиссёр</dt><dd>${esc(f.director)}</dd>` : "",
        cast.length ? `<dt>В ролях</dt><dd>${cast.map(esc).join(", ")}</dd>` : "",
        f.genre ? `<dt>Жанр</dt><dd>${esc(f.genre)}</dd>` : ""
      ].join("");
      const rates = ratingBadges(f);
      return `
        <article class="film" id="film-${esc(f.id)}" data-id="${esc(f.id)}">
          ${posterHTML(f, i)}
          <div class="info">
            <h2>${esc(f.title)}</h2>
            ${sub ? `<div class="sub">${sub}</div>` : ""}
            ${f.about ? `<p class="about">${esc(f.about)}</p>` : ""}
            ${facts ? `<dl class="facts">${facts}</dl>` : ""}
            ${rates ? `<div class="rates">${rates}</div>` : ""}
            <div class="vote-row">
              <button class="vote" type="button" data-id="${esc(f.id)}" aria-pressed="false"></button>
              <span class="vote-count"></span>
              ${f.addedBy && f.addedBy === voterId ? `<button class="link-btn del" type="button" data-del="${esc(f.id)}">Удалить</button>` : ""}
            </div>
          </div>
        </article>`;
    }).join("");
  }

  function updateCards() {
    const full = maxVotes > 0 && myCount() >= maxVotes;
    for (const f of films) {
      const card = document.getElementById("film-" + f.id);
      if (!card) continue;
      const mine = isMine(f.id);
      const btn = card.querySelector(".vote");
      btn.setAttribute("aria-pressed", String(mine));
      btn.textContent = mine ? "✓ Ваш голос" : "Хочу смотреть";
      btn.disabled = !mine && full;
      btn.title = btn.disabled ? `Можно выбрать не больше ${maxVotes}` : "";
      card.classList.toggle("voted", mine);
      const n = countOf(f.id);
      card.querySelector(".vote-count").textContent = n ? votesWord(n) : "пока без голосов";
    }
  }

  // ---------- таблица результатов ----------
  const rows = {};
  const thumbHTML = (f) => (f.poster ? `<img class="thumb" src="${esc(f.poster)}" alt="" referrerpolicy="no-referrer">` : `<span class="thumb"></span>`);

  function syncBoard() {
    const board = $("#board");
    board.style.height = `calc(var(--row-h) * ${films.length})`;
    const ids = new Set(films.map((f) => f.id));
    for (const id of Object.keys(rows)) {
      if (!ids.has(id)) { rows[id].el.remove(); delete rows[id]; }
    }
    for (const f of films) {
      if (rows[f.id]) continue;
      const row = document.createElement("button");
      row.type = "button";
      row.className = "row";
      row.style.transform = `translateY(calc(var(--row-h) * ${films.length}))`;
      row.innerHTML = `
        <span class="rank"></span>
        ${thumbHTML(f)}
        <span class="mid"><div class="name">${esc(f.title)}</div><div class="bar"><div class="fill"></div></div></span>
        <span class="n">0</span>`;
      row.addEventListener("click", () => jumpTo(f.id));
      board.appendChild(row);
      rows[f.id] = { el: row, n: 0 };
    }
  }

  function updateBoard() {
    const ranked = films
      .map((f, i) => ({ f, i, n: countOf(f.id) }))
      .sort((a, b) => b.n - a.n || a.i - b.i);
    const top = ranked[0] ? ranked[0].n : 0;
    const total = ranked.reduce((s, r) => s + r.n, 0);

    ranked.forEach((r, pos) => {
      const row = rows[r.f.id];
      const el = row.el;
      el.style.transform = `translateY(calc(var(--row-h) * ${pos}))`;
      el.querySelector(".rank").textContent = pos + 1;
      el.querySelector(".n").textContent = r.n;
      el.querySelector(".fill").style.width = top ? `${(r.n / top) * 100}%` : "0%";
      el.classList.toggle("lead", r.n > 0 && r.n === top);
      el.classList.toggle("mine", isMine(r.f.id));
      if (r.n !== row.n) {
        el.classList.remove("bump");
        void el.offsetWidth;
        el.classList.add("bump");
      }
      row.n = r.n;
    });

    const leaders = ranked.filter((r) => r.n > 0 && r.n === top);
    let summary = "пока нет голосов";
    if (leaders.length === 1) summary = `лидирует: ${leaders[0].f.title}`;
    else if (leaders.length > 1) summary = `ничья: ${leaders.map((r) => r.f.title).join(", ")}`;
    $("#panel-summary").textContent = summary;

    const voters = new Set();
    films.forEach((f) => Object.keys(votes[f.id] || {}).forEach((id) => voters.add(id)));
    $("#panel-stats").innerHTML = `
      Проголосовали: <b>${voters.size}</b> ${plural(voters.size, "человек", "человека", "человек")} · всего <b>${votesWord(total)}</b><br>
      Ваши голоса: <b>${myCount()}</b>${maxVotes ? ` из ${maxVotes}` : ""}`;
  }

  function jumpTo(id) {
    const card = document.getElementById("film-" + id);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "start" });
    if (matchMedia("(max-width: 900px)").matches) setCollapsed(true);
    card.classList.add("flash");
    setTimeout(() => card.classList.remove("flash"), 1200);
  }

  // ---------- свернуть / развернуть панель ----------
  function setCollapsed(c) {
    $("#layout").classList.toggle("collapsed", c);
    $("#panel-toggle").setAttribute("aria-expanded", String(!c));
    store.set("kino.panelCollapsed", c ? "1" : "0");
  }

  // ---------- хранилище: голоса и добавленные фильмы ----------
  function demoBackend() {
    const VK = "kino.demo." + pollId;
    const FK = "kino.demo.films." + pollId;
    const read = (k) => { try { return JSON.parse(store.get(k)) || {}; } catch { return {}; } };
    let onVotes = () => {}, onFilms = () => {};
    // Другие вкладки этого же браузера видят изменения сразу.
    window.addEventListener("storage", (e) => {
      if (e.key === VK) onVotes(read(VK));
      if (e.key === FK) onFilms(read(FK));
    });
    return {
      mode: "demo",
      subscribe(v, f) { onVotes = v; onFilms = f; f(read(FK)); v(read(VK)); },
      async setVote(filmId, on) {
        const v = read(VK);
        v[filmId] = v[filmId] || {};
        if (on) v[filmId][voterId] = true; else delete v[filmId][voterId];
        store.set(VK, JSON.stringify(v));
        onVotes(v);
      },
      async addFilm(data) {
        const all = read(FK);
        const id = "u" + Date.now().toString(36);
        all[id] = data;
        if (!store.set(FK, JSON.stringify(all))) throw new Error("Не хватило места в браузере");
        onFilms(all);
        return id;
      },
      async removeFilm(id) {
        const all = read(FK);
        delete all[id];
        store.set(FK, JSON.stringify(all));
        onFilms(all);
      }
    };
  }

  async function firebaseBackend(fbConfig) {
    const V = "10.12.2";
    const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
    const { getDatabase, ref, onValue, set, push } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-database.js`);
    const db = getDatabase(initializeApp(fbConfig));
    const root = `polls/${pollId}`;
    return {
      mode: "live",
      subscribe(onVotes, onFilms, onError, onConn) {
        onValue(ref(db, `${root}/films`), (snap) => onFilms(snap.val() || {}), onError);
        onValue(ref(db, `${root}/votes`), (snap) => onVotes(snap.val() || {}), onError);
        onValue(ref(db, ".info/connected"), (snap) => onConn(!!snap.val()));
      },
      setVote(filmId, on) {
        return set(ref(db, `${root}/votes/${filmId}/${voterId}`), on ? true : null);
      },
      async addFilm(data) {
        const r = push(ref(db, `${root}/films`));
        await set(r, data);
        return r.key;
      },
      removeFilm(id) {
        return set(ref(db, `${root}/films/${id}`), null);
      }
    };
  }

  function note(html) {
    const el = $("#mode-note");
    el.innerHTML = html;
    el.hidden = !html;
  }

  // ---------- старт ----------
  renderFilms();
  syncBoard();
  setCollapsed(store.get("kino.panelCollapsed") === "1" || (store.get("kino.panelCollapsed") == null && matchMedia("(max-width: 900px)").matches));
  $("#panel-toggle").addEventListener("click", () => setCollapsed(!$("#layout").classList.contains("collapsed")));

  let backend;
  const fb = cfg.firebase || {};
  if (fb.apiKey && fb.databaseURL) {
    try {
      backend = await firebaseBackend(fb);
    } catch (e) {
      console.error(e);
      note("<b>Не удалось подключиться к Firebase</b> — работаем в демо-режиме. Проверьте настройки в config.js.");
    }
  } else {
    note("<b>Демо-режим.</b> Голоса и добавленные фильмы сохраняются только в этом браузере. Чтобы голосовать вместе — подключите Firebase (см. README.md).");
  }
  backend = backend || demoBackend();

  const dot = $("#live-dot");
  if (backend.mode === "demo") { dot.classList.add("demo"); dot.title = "Демо-режим"; }

  const onVotes = (v) => { votes = v || {}; updateCards(); updateBoard(); };
  const onFilms = (all) => {
    const extra = Object.entries(all || {})
      .filter(([, f]) => f && f.title)
      .map(([id, f]) => ({ ...f, id }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    films = [...staticFilms, ...extra];
    renderFilms();
    syncBoard();
    updateCards();
    updateBoard();
  };
  backend.subscribe(
    onVotes,
    onFilms,
    (err) => { console.error(err); note("<b>Нет доступа к базе голосов.</b> Проверьте правила (Rules) в Firebase — см. README.md."); },
    (connected) => { dot.classList.toggle("on", connected); dot.title = connected ? "Онлайн — результаты обновляются вживую" : "Нет соединения"; }
  );

  $("#films").addEventListener("click", async (e) => {
    const del = e.target.closest(".del");
    if (del) {
      const f = films.find((x) => x.id === del.dataset.del);
      if (f && confirm(`Удалить «${f.title}» из голосования?`)) {
        try { await backend.removeFilm(f.id); } catch (err) { console.error(err); alert("Не получилось удалить фильм."); }
      }
      return;
    }
    const btn = e.target.closest(".vote");
    if (!btn || btn.disabled) return;
    const id = btn.dataset.id;
    const on = !isMine(id);
    // Сразу показываем результат, не дожидаясь сервера.
    const prev = JSON.parse(JSON.stringify(votes));
    votes[id] = { ...(votes[id] || {}) };
    if (on) votes[id][voterId] = true; else delete votes[id][voterId];
    onVotes(votes);
    try {
      await backend.setVote(id, on);
    } catch (err) {
      console.error(err);
      onVotes(prev);
      alert("Не получилось сохранить голос. Попробуйте ещё раз.");
    }
  });

  // ---------- форма «Добавить фильм» ----------
  const form = $("#add-form");
  const openBtn = $("#add-open");
  const msg = (t) => ($("#form-msg").textContent = t || "");
  let posterData = "";

  function openForm(open) {
    form.hidden = !open;
    openBtn.hidden = open;
    if (open) form.elements.title.focus();
  }

  function setPoster(src) {
    posterData = src || "";
    const img = $("#f-preview");
    img.hidden = !posterData;
    if (posterData) img.src = posterData; else img.removeAttribute("src");
    $("#drop").classList.toggle("has-img", !!posterData);
  }

  // Картинку ужимаем до 400px по ширине, чтобы она быстро грузилась у всех.
  async function loadImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const scale = Math.min(1, 400 / img.naturalWidth);
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      setPoster(c.toDataURL("image/jpeg", 0.82));
      form.elements.posterUrl.value = "";
      msg("");
    } catch {
      msg("Не получилось открыть картинку");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function resetForm() {
    form.reset();
    setPoster("");
    msg("");
  }

  openBtn.addEventListener("click", () => openForm(true));
  $("#add-cancel").addEventListener("click", () => { resetForm(); openForm(false); });
  $("#f-file").addEventListener("change", (e) => loadImage(e.target.files[0]));
  $("#f-preview").addEventListener("error", () => { if (posterData) { setPoster(""); msg("Картинка по ссылке не открылась"); } });
  form.elements.posterUrl.addEventListener("change", (e) => {
    const v = e.target.value.trim();
    if (/^https?:\/\//i.test(v)) { setPoster(v); msg(""); }
    else if (v) msg("Ссылка должна начинаться с http:// или https://");
  });

  const drop = $("#drop");
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("over");
    loadImage(e.dataTransfer.files[0]);
  });
  form.addEventListener("paste", (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
    if (item) { e.preventDefault(); loadImage(item.getAsFile()); }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const g = (k) => String(form.elements[k].value || "").trim();
    const num = (k, max) => {
      const v = parseFloat(g(k).replace(",", "."));
      return Number.isFinite(v) && v >= 0 && v <= max ? v : null;
    };
    const title = g("title");
    if (!title) { msg("Напишите хотя бы название"); form.elements.title.focus(); return; }

    const ratings = {};
    const imdb = num("imdb", 10), kp = num("kp", 10), rt = num("rt", 100);
    if (imdb != null) ratings.imdb = Math.round(imdb * 10) / 10;
    if (kp != null) ratings.kp = Math.round(kp * 10) / 10;
    if (rt != null) ratings.rt = Math.round(rt);

    const data = {
      title,
      original: g("original"),
      year: parseInt(g("year"), 10) || "",
      runtime: parseInt(g("runtime"), 10) || "",
      director: g("director"),
      cast: castList(g("cast")).join(", "),
      genre: g("genre"),
      about: g("about"),
      poster: posterData,
      ratings,
      addedBy: voterId,
      createdAt: Date.now()
    };
    for (const k of Object.keys(data)) {
      if (data[k] === "" || (typeof data[k] === "object" && !Object.keys(data[k]).length)) delete data[k];
    }

    const submit = $("#add-submit");
    submit.disabled = true;
    msg("Сохраняю…");
    try {
      const id = await backend.addFilm(data);
      resetForm();
      openForm(false);
      setTimeout(() => jumpTo(id), 50);
    } catch (err) {
      console.error(err);
      msg("Не получилось сохранить. Попробуйте картинку поменьше или ещё раз.");
    } finally {
      submit.disabled = false;
    }
  });

  // Постеры с Википедии для фильмов, у которых указан только wiki.
  const needPoster = staticFilms.filter((f) => !f.poster && f.wiki);
  if (needPoster.length) {
    try {
      const titles = needPoster.map((f) => f.wiki).join("|");
      const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pilicense=any&pithumbsize=600&redirects=1&format=json&origin=*&titles=${encodeURIComponent(titles)}`;
      const data = await (await fetch(url)).json();
      const q = data.query || {};
      const norm = {};
      [...(q.normalized || []), ...(q.redirects || [])].forEach((n) => (norm[n.from] = n.to));
      const thumbs = {};
      Object.values(q.pages || {}).forEach((p) => { if (p.thumbnail) thumbs[p.title] = p.thumbnail.source; });
      for (const f of needPoster) {
        let t = f.wiki;
        while (norm[t]) t = norm[t];
        if (!thumbs[t]) continue;
        f.poster = thumbs[t];
        const card = document.querySelector(`#film-${CSS.escape(f.id)} .poster`);
        if (card) card.outerHTML = posterHTML(f, films.indexOf(f));
        rows[f.id].el.querySelector(".thumb").outerHTML = thumbHTML(f);
      }
    } catch (e) {
      console.warn("Постеры с Википедии не загрузились", e);
    }
  }
})();
