/*
  Настройки голосования.

  Пока firebase.apiKey пустой, страница работает в ДЕМО-режиме: голоса хранятся только
  в твоём браузере и другие люди их не видят. Чтобы голосование стало общим —
  создай бесплатный проект Firebase и вставь сюда его конфиг (инструкция в README.md).
*/
window.KINO_CONFIG = {
  // Название текущего голосования. Поменяй (например на "2026-11-01"), чтобы начать новое с нуля.
  pollId: "main",

  // Сколько фильмов может отметить один человек. 0 — без ограничений.
  maxVotesPerPerson: 0,

  // Выбор удобных дат (dates.html) и статистика по ним (dates-stats.html).
  dates: {
    // Название опроса. Поменяй, чтобы начать сбор дат с нуля.
    pollId: "2026-11",
    // Какой месяц показывать в календаре.
    months: ["2026-11"],
    // Варианты в выпадающем списке внутри клетки. from / to — часы (24 = полночь),
    // short — что написать в самой клетке.
    slots: [
      { label: "Весь день", short: "весь день", from: 10, to: 24 },
      { label: "Днём, 12:00–18:00", short: "днём", from: 12, to: 18 },
      { label: "С 17:00", short: "с 17:00", from: 17, to: 24 },
      { label: "С 18:00", short: "с 18:00", from: 18, to: 24 },
      { label: "С 19:00", short: "с 19:00", from: 19, to: 24 },
      { label: "С 20:00", short: "с 20:00", from: 20, to: 24 },
      { label: "С 21:00", short: "с 21:00", from: 21, to: 24 }
    ],
    // Границы шкалы времени в статистике и её шаг (часы; 24 = полночь).
    dayStart: 10,
    dayEnd: 24,
    stepMinutes: 30,
    // Длина просмотра в минутах: по ней статистика ищет лучшее время начала.
    movieMinutes: 150,
    // Показывать ли участникам, сколько человек уже отметили каждый день.
    showCounts: true
  },

  firebase: {
    apiKey: "AIzaSyCsDkUKyD5MsrFk4wjQMQennsXklNWk7KM",
    authDomain: "twiglles-kinoshnaya.firebaseapp.com",
    databaseURL: "https://twiglles-kinoshnaya-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "twiglles-kinoshnaya",
    appId: "1:1060450656852:web:30a97a410ad612f52803c1"
  }
};
