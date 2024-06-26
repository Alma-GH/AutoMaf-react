
const PROD      = process.env.PROD === "true"
const DEBUG     = true
const DEBUG_MOD = DEBUG && !PROD

const DEF_PLAYERS = {
  DEF_MIN_PLAYERS : 4,
  DEF_MAX_PLAYERS : 15,
}

const DEF_TIME = {
  T_START: 5,
  TO_START: !DEBUG_MOD ? 750 : 200,

  T_READY: 3,
  TO_READY: !DEBUG_MOD ? 1000 : 300,

  T_VOTE_NIGHT: 3,
  TO_VOTE_NIGHT: !DEBUG_MOD ? 1000 : 300,

  T_VOTE: 3,
  TO_VOTE: !DEBUG_MOD ? 1000 : 300,

  T_TAKE_VOTE_MIN: 3,
  T_TAKE_VOTE_MAX: 5,
  TO_TAKE_VOTE: !DEBUG_MOD ? 1000 : 500,


  TO_RECONNECT: !DEBUG_MOD ? 60*1000 : 20*1000
}


module.exports = Object.freeze({

  DEBUG_MOD: DEBUG_MOD,

  ...DEF_PLAYERS,

  ...DEF_TIME,

  //event
  E_SETTINGS     : "change_settings",
  E_CREATE_ROOM  : "create_room",
  E_FIND_ROOM    : "find_room",
  E_START_GAME   : "start_game",
  E_STOP_GAME    : "stop_game",
  E_CHOOSE_CARD  : "choose_card",
  E_READINESS    : "readiness",
  E_VOTE_NIGHT   : "vote_night",
  E_VOTE         : "vote",

  E_QUIT         : "quit_player",
  E_PLAYER_DATA  : "get_player",
  E_TIMER        : "get_timer",
  E_ERROR        : "error",

  E_RECONNECT    : "reconnect",



  //error messages to client
  EM_GAME_PROCESS      : "Игра уже начата",
  EM_ENTER_AGAIN       : "Вы уже находитесь в этой комнате",
  EM_UNEXPECTED_QUIT   : "Выход игрока",
  EM_VOTE_ON_TIMER     : "Уже нельзя голосовать",
  EM_QUIT_ON_GAME      : "Кто-то вышел из игры",
  //Player
  EM_NULL_NAME_PLAYER  : "Пустое имя игрока",

  //Room
  EM_MAX_PLAYERS       : "Эта комната заполнена",
  EM_SET_PLAYERS_LOW   : `Слишком мало игроков(${DEF_PLAYERS.DEF_MIN_PLAYERS} мин.)`,
  EM_SET_PLAYERS_HIGH  : `Слишком много игроков(${DEF_PLAYERS.DEF_MAX_PLAYERS} макс.)`,
  EM_START_GAME        : `Не хватает игроков для игры(${DEF_PLAYERS.DEF_MIN_PLAYERS} мин.)`,
  EM_START_ALREADY     : "Нельзя начать во время таймера",
  EM_MANY_MAF          : "Слишком большое количество членов мафии",
  EM_MANY_SPEC         : "Слишком большое количество спец. ролей",
  EM_NO_MAF            : "Добавьте хотя бы одного члена мафии",

  //Game
  EM_GAME_CHOOSE       : "Вы уже взяли карту",
  EM_CHOOSE_NULL       : "Эту карту уже взяли",
  EM_READY             : "Вы уже готовы",
  EM_PLAYER_DEAD       : "Этот игрок уже мертв",
  EM_VOTE              : "Вы не можете голосовать",
  EM_VOTE_PHASE        : "В эту фазу нельзя голосовать",
  EM_VOTE_FOR          : "Вы не можете голосовать за этого игрока",
});