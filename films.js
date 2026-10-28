/*
  Список фильмов для голосования. Чтобы добавить фильм — скопируй блок { ... } и поменяй поля.

  id       — уникальный латинский идентификатор (буквы, цифры, дефис). Не меняй его после старта голосования,
             иначе голоса за фильм «потеряются».
  by       — кто предложил фильм (необязательно).
  poster   — ссылка на картинку (постер или кадр). Можно оставить пустой и указать wiki —
             тогда постер подтянется с английской Википедии автоматически.
  wiki     — название статьи на en.wikipedia.org (как в адресе страницы), например "Interstellar_(film)".
  ratings  — imdb (из 10), kp (Кинопоиск, из 10), rt (Rotten Tomatoes, % критиков). Любое можно не указывать.
  imdbId   — код фильма в адресе IMDb (tt...), делает плашку IMDb ссылкой.
  kpId     — номер фильма в адресе Кинопоиска (kinopoisk.ru/film/НОМЕР). Без него будет ссылка на поиск.
  rtSlug   — хвост адреса на Rotten Tomatoes (rottentomatoes.com/m/ХВОСТ).

  Рейтинги сняты с сайтов 28.10.2026.
*/
window.FILMS = [
  {
    id: "i-swear", by: "Юи",
    title: "Я ругаюсь", original: "I Swear", year: 2025, runtime: 120,
    director: "Кирк Джонс",
    cast: ["Роберт Арамайо", "Питер Муллан", "Максин Пик", "Ширли Хендерсон"],
    genre: "биография, драма",
    about: "История шотландца Джона Дэвидсона: подросток с синдромом Туретта вырастает в человека, который учит мир принимать таких, как он.",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/57/I_Swear_film_poster.jpg",
    ratings: { imdb: 8.3, kp: 8.5, rt: 96 },
    imdbId: "tt31514146", kpId: 8472578, rtSlug: "i_swear_2025"
  },
  {
    id: "schindlers-list", by: "Вадим Трайдакало",
    title: "Список Шиндлера", original: "Schindler's List", year: 1993, runtime: 196,
    director: "Стивен Спилберг",
    cast: ["Лиам Нисон", "Бен Кингсли", "Рэйф Файнс", "Кэролайн Гудолл"],
    genre: "биография, история, драма",
    about: "Немецкий промышленник Оскар Шиндлер рискует всем, чтобы спасти от Холокоста больше тысячи евреев.",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/38/Schindler%27s_List_movie.jpg",
    ratings: { imdb: 9.0, kp: 8.9, rt: 98 },
    imdbId: "tt0108052", kpId: 329, rtSlug: "schindlers_list"
  },
  {
    id: "apollo-13", by: "Max Твиглс",
    title: "Аполлон-13", original: "Apollo 13", year: 1995, runtime: 140,
    director: "Рон Ховард",
    cast: ["Том Хэнкс", "Билл Пэкстон", "Кевин Бейкон", "Гэри Синиз"],
    genre: "драма, приключения, история",
    about: "Авария на пути к Луне превращает полёт в борьбу трёх астронавтов и Центра управления за возвращение домой.",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9e/Apollo_thirteen_movie.jpg",
    ratings: { imdb: 7.7, kp: 7.7, rt: 92 },
    imdbId: "tt0112384", kpId: 2217, rtSlug: "apollo_13"
  },
  {
    id: "society-of-the-snow", by: "Max Твиглс",
    title: "Общество снега", original: "La sociedad de la nieve", year: 2023, runtime: 144,
    director: "Хуан Антонио Байона",
    cast: ["Энцо Вогринчич", "Агустин Парделья", "Матиас Рекальт", "Эстебан Бильярди"],
    genre: "триллер, драма, биография",
    about: "Самолёт с уругвайской командой по регби разбивается в Андах, и выжившие 72 дня держатся среди снега и льда.",
    poster: "https://upload.wikimedia.org/wikipedia/en/7/76/Society_of_the_Snow_poster.jpg",
    ratings: { imdb: 7.8, kp: 7.6, rt: 90 },
    imdbId: "tt16277242", kpId: 4745702, rtSlug: "society_of_the_snow"
  },
  {
    id: "captain-phillips", by: "Max Твиглс",
    title: "Капитан Филлипс", original: "Captain Phillips", year: 2013, runtime: 134,
    director: "Пол Гринграсс",
    cast: ["Том Хэнкс", "Бархад Абди", "Баркхад Абдирахман", "Файсал Ахмед"],
    genre: "триллер, драма",
    about: "Сомалийские пираты захватывают американское грузовое судно, и капитан становится их заложником.",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a8/Captain_Phillips_Poster.jpg",
    ratings: { imdb: 7.8, kp: 7.6, rt: 93 },
    imdbId: "tt1535109", kpId: 484438, rtSlug: "captain_phillips"
  },
  {
    id: "spotlight", by: "Max Твиглс",
    title: "В центре внимания", original: "Spotlight", year: 2015, runtime: 129,
    director: "Том Маккарти",
    cast: ["Марк Руффало", "Майкл Китон", "Рэйчел Макадамс", "Лив Шрайбер"],
    genre: "драма, криминал, биография",
    about: "Журналисты Boston Globe раскапывают, как католическая церковь годами скрывала насилие над детьми.",
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f3/Spotlight_%28film%29_poster.jpg",
    ratings: { imdb: 8.1, kp: 7.7, rt: 97 },
    imdbId: "tt1895587", kpId: 834394, rtSlug: "spotlight_2015"
  },
  {
    id: "apocalypse-now", by: "Вадим Трайдакало",
    title: "Апокалипсис сегодня", original: "Apocalypse Now", year: 1979, runtime: 147,
    director: "Фрэнсис Форд Коппола",
    cast: ["Марлон Брандо", "Мартин Шин", "Роберт Дювалл", "Фредерик Форрест"],
    genre: "военный, драма",
    about: "Капитана Уилларда отправляют вверх по реке в джунгли Вьетнама, чтобы найти и устранить обезумевшего полковника Курца.",
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c2/Apocalypse_Now_poster.jpg",
    ratings: { imdb: 8.4, kp: 8.1, rt: 91 },
    imdbId: "tt0078788", kpId: 354, rtSlug: "apocalypse_now"
  },
  {
    id: "intouchables", by: "Вадим Трайдакало",
    title: "1+1", original: "Intouchables", year: 2011, runtime: 112,
    director: "Оливье Накаш, Эрик Толедано",
    cast: ["Франсуа Клюзе", "Омар Си", "Анн Ле Ни", "Одри Флёро"],
    genre: "драма, комедия",
    about: "Парализованный аристократ берёт в помощники парня из парижского пригорода — и находит в нём друга.",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/93/The_Intouchables.jpg",
    ratings: { imdb: 8.5, kp: 8.9, rt: 75 },
    imdbId: "tt1675434", kpId: 535341, rtSlug: "the_intouchables"
  },
  {
    id: "hacksaw-ridge", by: "Alexey Shakov",
    title: "По соображениям совести", original: "Hacksaw Ridge", year: 2016, runtime: 139,
    director: "Мэл Гибсон",
    cast: ["Эндрю Гарфилд", "Сэм Уортингтон", "Тереза Палмер", "Люк Брейси"],
    genre: "военный, биография, драма",
    about: "Армейский медик Десмонд Досс отказывается брать в руки оружие и в одиночку выносит раненых из боя на Окинаве.",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/8a/Hacksaw_Ridge_poster.png",
    ratings: { imdb: 8.1, kp: 8.3, rt: 84 },
    imdbId: "tt2119532", kpId: 649917, rtSlug: "hacksaw_ridge"
  },
  {
    id: "admiral", by: "Вадим Трайдакало",
    title: "Адмиралъ", original: "", year: 2008, runtime: 124,
    director: "Андрей Кравчук",
    cast: ["Константин Хабенский", "Елизавета Боярская", "Сергей Безруков", "Анна Ковальчук"],
    genre: "драма, история",
    about: "Судьба адмирала Колчака: Первая мировая, революция, Гражданская война и любовь к Анне Тимирёвой.",
    poster: "https://upload.wikimedia.org/wikipedia/en/e/e2/Admiral_%28film%29_poster.jpg",
    ratings: { imdb: 6.6, kp: 7.1 },
    imdbId: "tt1101026", kpId: 280938
  },
  {
    id: "green-book", by: "Сергей Туровцев",
    title: "Зелёная книга", original: "Green Book", year: 2018, runtime: 130,
    director: "Питер Фаррелли",
    cast: ["Вигго Мортенсен", "Махершала Али", "Линда Карделлини", "Себастьян Манискалко"],
    genre: "биография, комедия, драма",
    about: "Вышибала из Бронкса нанимается водителем к чернокожему пианисту, который едет в турне по американскому Югу 1960-х.",
    poster: "https://upload.wikimedia.org/wikipedia/en/5/5b/Green_Book_%282018_poster%29.png",
    ratings: { imdb: 8.2, kp: 8.6, rt: 77 },
    imdbId: "tt6966692", kpId: 1108577, rtSlug: "green_book"
  },
  {
    id: "ford-v-ferrari", by: "Alexey Shakov",
    title: "Ford против Ferrari", original: "Ford v Ferrari", year: 2019, runtime: 152,
    director: "Джеймс Мэнголд",
    cast: ["Кристиан Бэйл", "Мэтт Дэймон", "Катрина Балф", "Трэйси Леттс"],
    genre: "биография, спорт, драма",
    about: "Конструктор Кэрролл Шелби и гонщик Кен Майлз строят машину, которая должна обогнать Ferrari в «24 часах Ле-Мана».",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a4/Ford_v._Ferrari_%282019_film_poster%29.png",
    ratings: { imdb: 8.1, kp: 8.2, rt: 92 },
    imdbId: "tt1950186", kpId: 835086, rtSlug: "ford_v_ferrari"
  },
  {
    id: "im-still-here", by: "Irene",
    title: "Я всё ещё здесь", original: "Ainda Estou Aqui", year: 2024, runtime: 137,
    director: "Уолтер Саллес",
    cast: ["Фернанда Торрес", "Фернанда Монтенегро", "Селтон Мелу", "Валентина Ержзаже"],
    genre: "драма, биография, история",
    about: "Бразилия, 1970-е: после того как военные уводят из дома её мужа, Эунисе Пайва одна поднимает детей и добивается правды.",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/0a/I%27m_Still_Here_%282024_film%29_poster.jpg",
    ratings: { imdb: 8.1, kp: 7.3, rt: 97 },
    imdbId: "tt14961016", kpId: 6040913, rtSlug: "im_still_here_2024"
  },
  {
    id: "iron-claw", by: "Irene",
    title: "Стальная хватка", original: "The Iron Claw", year: 2023, runtime: 132,
    director: "Шон Дуркин",
    cast: ["Зак Эфрон", "Джереми Аллен Уайт", "Харрис Дикинсон", "Мора Тирни"],
    genre: "биография, спорт, драма",
    about: "Братья фон Эрих под давлением властного отца рвутся к вершине рестлинга — а над семьёй будто висит проклятие.",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/3a/Iron_claw_film_posterjpg.jpg",
    ratings: { imdb: 7.5, kp: 7.4, rt: 89 },
    imdbId: "tt21064584", kpId: 5005446, rtSlug: "the_iron_claw_2023"
  },
  {
    id: "chicago-7", by: "Irene",
    title: "Суд над чикагской семёркой", original: "The Trial of the Chicago 7", year: 2020, runtime: 129,
    director: "Аарон Соркин",
    cast: ["Марк Райлэнс", "Саша Барон Коэн", "Эдди Редмэйн", "Фрэнк Ланджелла"],
    genre: "драма, история",
    about: "Активистов, протестовавших против войны во Вьетнаме, судят за беспорядки в Чикаго в 1968 году — и процесс превращается в спектакль.",
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c2/TrialChicago7poster.jpeg",
    ratings: { imdb: 7.7, kp: 7.6, rt: 89 },
    imdbId: "tt1070874", kpId: 402981, rtSlug: "the_trial_of_the_chicago_7"
  },
  {
    id: "may-december", by: "Irene",
    title: "Май декабрь", original: "May December", year: 2023, runtime: 117,
    director: "Тодд Хейнс",
    cast: ["Натали Портман", "Джулианна Мур", "Чарльз Мелтон", "Кори Майкл Смит"],
    genre: "драма",
    about: "Актриса готовится к роли и приезжает к женщине, чей роман с подростком двадцать лет назад стал громким скандалом.",
    poster: "https://upload.wikimedia.org/wikipedia/en/2/21/May_December_poster.jpeg",
    ratings: { imdb: 6.7, kp: 6.1, rt: 91 },
    imdbId: "tt13651794", kpId: 4477074, rtSlug: "may_december"
  },
  {
    id: "hidden-life", by: "Irene",
    title: "Тайная жизнь", original: "A Hidden Life", year: 2019, runtime: 174,
    director: "Терренс Малик",
    cast: ["Аугуст Диль", "Валери Пахнер", "Мария Зимон", "Карин Нойхаузер"],
    genre: "драма, военный, биография",
    about: "Австрийский фермер Франц Егерштеттер отказывается присягать Гитлеру и воевать за Третий рейх.",
    poster: "https://upload.wikimedia.org/wikipedia/en/2/2d/HiddenLifePoster.jpeg",
    ratings: { imdb: 7.4, kp: 7.4, rt: 82 },
    imdbId: "tt5827916", kpId: 991632, rtSlug: "a_hidden_life_2019"
  },
  {
    id: "nomadland", by: "Irene",
    title: "Земля кочевников", original: "Nomadland", year: 2020, runtime: 107,
    director: "Хлоя Чжао",
    cast: ["Фрэнсис Макдорманд", "Дэвид Стрэтэйрн", "Линда Мэй", "Боб Уэллс"],
    genre: "драма",
    about: "Потеряв работу и дом после кризиса, немолодая женщина уезжает в фургоне по Америке и живёт среди современных кочевников.",
    poster: "https://upload.wikimedia.org/wikipedia/en/a/a5/Nomadland_poster.jpeg",
    ratings: { imdb: 7.3, kp: 7.2, rt: 93 },
    imdbId: "tt9770150", kpId: 1238506, rtSlug: "nomadland"
  },
  {
    id: "memories-of-murder", by: "Irene",
    title: "Воспоминания об убийстве", original: "Salinui chueok", year: 2003, runtime: 131,
    director: "Пон Джун-хо",
    cast: ["Сон Кан-хо", "Ким Сан-гён", "Ким Рве-ха", "Сон Джэ-хо"],
    genre: "детектив, криминал, драма",
    about: "Корейская провинция, 1986 год: два детектива пытаются поймать первого в стране серийного убийцу.",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/01/Salinui-chueok-south-korean-movie-poster-md.jpg",
    ratings: { imdb: 8.1, kp: 7.7, rt: 95 },
    imdbId: "tt0353969", kpId: 65770, rtSlug: "memories_of_murder_2003"
  },
  {
    id: "persepolis", by: "Irene",
    title: "Персеполис", original: "Persepolis", year: 2007, runtime: 96,
    director: "Маржан Сатрапи, Венсан Паронно",
    cast: ["Кьяра Мастроянни", "Катрин Денёв", "Даниель Дарьё", "Симон Абкарян"],
    genre: "мультфильм, драма, биография",
    about: "Анимационная автобиография Маржан Сатрапи: взросление в Иране во время Исламской революции и войны.",
    poster: "https://upload.wikimedia.org/wikipedia/en/0/0b/Persepolis_film.jpg",
    ratings: { imdb: 8.0, kp: 7.9, rt: 96 },
    imdbId: "tt0808417", kpId: 257900, rtSlug: "persepolis"
  },
  {
    id: "waltz-with-bashir", by: "Irene",
    title: "Вальс с Баширом", original: "Vals Im Bashir", year: 2008, runtime: 90,
    director: "Ари Фольман",
    cast: ["Ари Фольман", "Ори Сиван", "Ронни Даяг", "Шмуэль Френкель"],
    genre: "мультфильм, документальный, военный",
    about: "Режиссёр по крупицам восстанавливает собственные стёртые воспоминания о Ливанской войне 1982 года.",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9f/Waltz_with_Bashir_Poster.jpg",
    ratings: { imdb: 8.0, kp: 7.6, rt: 97 },
    imdbId: "tt1185616", kpId: 412474, rtSlug: "waltz_with_bashir"
  },
  {
    id: "lord-of-war", by: "Дима",
    title: "Оружейный барон", original: "Lord of War", year: 2005, runtime: 122,
    director: "Эндрю Никкол",
    cast: ["Николас Кейдж", "Бриджет Мойнэхэн", "Джаред Лето", "Итан Хоук"],
    genre: "драма, криминал",
    about: "Торговец оружием Юрий Орлов наживается на войнах по всему миру, а за ним по пятам идёт агент Интерпола.",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/92/Lordofwar.jpg",
    ratings: { imdb: 7.6, kp: 7.7, rt: 62 },
    imdbId: "tt0399295", kpId: 77439, rtSlug: "lord_of_war"
  },
  {
    id: "revenant", by: "Дима",
    title: "Выживший", original: "The Revenant", year: 2015, runtime: 156,
    director: "Алехандро Гонсалес Иньярриту",
    cast: ["Леонардо ДиКаприо", "Том Харди", "Донал Глисон", "Уилл Поултер"],
    genre: "приключения, вестерн, драма",
    about: "Охотник Хью Гласс, израненный медведем и брошенный товарищами, ползёт через дикую глушь, чтобы выжить и отомстить.",
    poster: "https://upload.wikimedia.org/wikipedia/en/b/b6/The_Revenant_2015_film_poster.jpg",
    ratings: { imdb: 8.0, kp: 7.9, rt: 78 },
    imdbId: "tt1663202", kpId: 522941, rtSlug: "the_revenant_2015"
  },
  {
    id: "moneyball", by: "Дима",
    title: "Человек, который изменил всё", original: "Moneyball", year: 2011, runtime: 133,
    director: "Беннетт Миллер",
    cast: ["Брэд Питт", "Джона Хилл", "Филип Сеймур Хоффман", "Крис Пратт"],
    genre: "драма, спорт, биография",
    about: "Менеджер бедного бейсбольного клуба собирает команду не по чутью скаутов, а по статистике — и ломает правила игры.",
    poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/Moneyball_Poster.jpg",
    ratings: { imdb: 7.6, kp: 7.8, rt: 94 },
    imdbId: "tt1210166", kpId: 432791, rtSlug: "moneyball"
  },
  {
    id: "terminal", by: "Дима",
    title: "Терминал", original: "The Terminal", year: 2004, runtime: 128,
    director: "Стивен Спилберг",
    cast: ["Том Хэнкс", "Кэтрин Зета-Джонс", "Стэнли Туччи", "Бэрри Шебака Хенли"],
    genre: "драма, мелодрама, комедия",
    about: "Пока он летел в Нью-Йорк, его страна перестала существовать — и путешественник застревает в аэропорту на месяцы.",
    poster: "https://upload.wikimedia.org/wikipedia/en/8/86/Movie_poster_the_terminal.jpg",
    ratings: { imdb: 7.4, kp: 8.1, rt: 61 },
    imdbId: "tt0362227", kpId: 6877, rtSlug: "1133499-1133499-terminal"
  },
  {
    id: "gold", by: "Дима",
    title: "Золото", original: "Gold", year: 2016, runtime: 120,
    director: "Стивен Гейган",
    cast: ["Мэттью Макконахи", "Эдгар Рамирес", "Брайс Даллас Ховард", "Кори Столл"],
    genre: "драма, криминал",
    about: "Неудачливый бизнесмен вместе с геологом находит в джунглях Индонезии гигантское месторождение золота. Или нет?",
    poster: "https://upload.wikimedia.org/wikipedia/en/2/27/Gold_%282016_film%29.png",
    ratings: { imdb: 6.7, kp: 7.4, rt: 41 },
    imdbId: "tt1800302", kpId: 577255, rtSlug: "gold_2017"
  },
  {
    id: "bohemian-rhapsody", by: "Дима",
    title: "Богемская рапсодия", original: "Bohemian Rhapsody", year: 2018, runtime: 134,
    director: "Брайан Сингер",
    cast: ["Рами Малек", "Люси Бойнтон", "Гвилим Ли", "Бен Харди"],
    genre: "биография, музыка, драма",
    about: "Путь Queen и Фредди Меркьюри — от первых концертов в пабах до легендарного выступления на Live Aid.",
    poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/Bohemian_Rhapsody_poster.png",
    ratings: { imdb: 7.9, kp: 8.0, rt: 60 },
    imdbId: "tt1727824", kpId: 568289, rtSlug: "bohemian_rhapsody"
  }
];
