// Вкладки «Что смотрим?» / «Когда смотрим?» на одной странице: без перезагрузки и мигания.
(function () {
  const root = document.documentElement;
  const links = document.querySelectorAll(".switch [data-tab]");
  const titles = { what: "Twiglles Киношная — что смотрим?", when: "Twiglles Киношная — когда смотрим?" };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Куда переключаемся сейчас: анимация меняет страницу на следующем кадре, а повторные нажатия должны знать цель.
  let want = root.classList.contains("tab-when") ? "when" : "what";
  const current = () => want;

  function apply(tab) {
    want = tab;
    root.classList.toggle("tab-when", tab === "when");
    links.forEach((a) => {
      if (a.dataset.tab === tab) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = titles[tab];
    window.scrollTo(0, 0);
  }

  function go(tab, push) {
    if (tab === current()) return;
    want = tab;
    if (push) history.pushState(null, "", tab === "when" ? "#when" : location.pathname + location.search);
    // Плавная смена: заголовки остаются на месте, содержимое растворяется в новое.
    if (document.startViewTransition && !reduced) document.startViewTransition(() => apply(tab));
    else apply(tab);
  }

  links.forEach((a) => a.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    go(a.dataset.tab, true);
  }));
  window.addEventListener("popstate", () => go(location.hash === "#when" ? "when" : "what", false));

  apply(location.hash === "#when" ? "when" : "what");
})();
