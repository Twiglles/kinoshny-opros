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

  firebase: {
    apiKey: "AIzaSyCsDkUKyD5MsrFk4wjQMQennsXklNWk7KM",
    authDomain: "twiglles-kinoshnaya.firebaseapp.com",
    databaseURL: "https://twiglles-kinoshnaya-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "twiglles-kinoshnaya",
    appId: "1:1060450656852:web:30a97a410ad612f52803c1"
  }
};
