/*
  Типографика: строка не должна кончаться предлогом, союзом или частицей.
  Короткие служебные слова «приклеиваются» неразрывным пробелом к следующему слову,
  тире — к предыдущему. Работает и для текста, который страница дорисовывает позже.
*/
(function () {
  const NB = " ";
  const SHORT = "а|в|во|и|к|ко|о|об|обо|с|со|у|я|на|не|ни|но|по|за|из|от|до|да|ли|для|без|под|над|при|про|или|как|что|чем|это|все|всё|его|их|вы|вас|вам|мы";
  // Слева от слова — начало строки, пробел, скобка или кавычка; проверка не «съедает» символ,
  // поэтому цепочки вроде «и в одиночку» склеиваются за один проход.
  const glue = new RegExp(`(?<![^\\s(«"„])(${SHORT})\\s+(?=\\S)`, "gi");
  const dash = /\s+([—–])(?=\s)/g;
  const num = /(\d)[ \t]+(?=[а-яё])/gi; // «120 мин», «4 голоса», «2 ч 30 мин» не разрываются
  const fix = (s) => s.replace(glue, `$1${NB}`).replace(dash, `${NB}$1`).replace(num, `$1${NB}`);
  const skip = (node) => node.parentElement && node.parentElement.closest("script, style, textarea, input, code, pre");
  function walk(root) {
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = it.nextNode())) {
      if (skip(n) || !/[а-яё]/i.test(n.data)) continue;
      const v = fix(n.data);
      if (v !== n.data) n.data = v;
    }
  }
  walk(document.body);
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "characterData") walk(m.target.parentNode || document.body);
      else m.addedNodes.forEach((a) => (a.nodeType === 3 ? walk(a.parentNode) : a.nodeType === 1 && walk(a)));
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
