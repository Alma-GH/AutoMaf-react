
const DEF_PLAYERS = {
  //class Room
  DEF_MIN_PLAYERS : 4,
  DEF_MAX_PLAYERS : 15,
}


module.exports = Object.freeze({

  ...DEF_PLAYERS,

  //event
  E_CREATE_ROOM  : "create_room",
  E_FIND_ROOM    : "find_room",
  E_START_GAME   : "start_game",
  E_CHOOSE_CARD  : "choose_card",
  E_READINESS    : "readiness",
  E_VOTE_NIGHT   : "vote_night",
  E_VOTE         : "vote",
  E_NEXT_JUDGED  : "next_judged",

  E_QUIT         : "quit_player",
  E_PLAYER_DATA  : "get_player",
  E_TIMER        : "get_timer",
  E_ERROR        : "error",



  //error messages to client
  EM_WRONG_PASS        : "Неправильный пароль или название",
  EM_GAME_PROCESS      : "Игра уже начата",
  EM_UNEXPECTED_QUIT   : "Выход игрока",
  EM_VOTE_ON_TIMER     : "Уже нельзя голосовать",
  //Player
  EM_NULL_NAME_PLAYER  : "Пустое имя игрока",

  //Room
  EM_NULL_NAME_ROOM    : "Пустое имя комнаты",
  EM_MAX_PLAYERS       : "Эта комната заполнена",
  EM_SET_PLAYERS_LOW   : `Слишком мало игроков(${DEF_PLAYERS.DEF_MIN_PLAYERS} мин.)`,
  EM_SET_PLAYERS_HIGH  : `Слишком много игроков(${DEF_PLAYERS.DEF_MAX_PLAYERS} макс.)`,
  EM_UNIQUE_NAME       : "Такое название комнаты уже существует",
  EM_PASS_ROOM         : "Слишком короткий пароль",
  EM_START_GAME        : `Не хватает игроков для игры(${DEF_PLAYERS.DEF_MIN_PLAYERS} мин.)`,
  EM_START_ALREADY     : "Нельзя начать во время таймера",

  //Server
  EM_FIND_ROOM         : "Такой комнаты нет",

  //Game
  EM_GAME_CHOOSE       : "Вы уже взяли карту",
  EM_CHOOSE_NULL       : "Эту карту уже взяли",
  EM_READY             : "Вы уже готовы",
  EM_PLAYER_DEAD       : "Этот игрок уже мертв",
  EM_VOTE              : "Вы не можете голосовать",
  EM_VOTE_PHASE        : "В эту фазу нельзя голосовать",
  EM_VOTE_FOR          : "Вы не можете голосовать за этого игрока",
  EM_VOTE_AGAIN        : "Вы уже проголосовали",
});