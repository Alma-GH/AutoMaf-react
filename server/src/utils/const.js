

//class Room
export const DEF_MIN_PLAYERS = 4
export const DEF_MAX_PLAYERS = 15 //temp

//event
export const E_CREATE_ROOM  = "create_room"
export const E_FIND_ROOM    = "find_room"
export const E_START_GAME   = "start_game"
export const E_CHOOSE_CARD  = "choose_card"
export const E_READINESS    = "readiness"
export const E_VOTE_NIGHT   = "vote_night"
export const E_VOTE         = "vote"
export const E_NEXT_JUDGED  = "next_judged"

export const E_QUIT         = "quit_player"
export const E_PLAYER_DATA  = "get_player"
export const E_TIMER        = "get_timer"
export const E_ERROR        = "error"



//error messages to client
export const EM_WRONG_PASS        = "Неправильный пароль или название"
export const EM_GAME_PROCESS      = "Игра уже начата"
export const EM_UNEXPECTED_QUIT   = "Выход игрока"
export const EM_VOTE_ON_TIMER     = "Уже нельзя голосовать"
//Player
export const EM_NULL_NAME_PLAYER  = "Пустое имя игрока"

//Room
export const EM_NULL_NAME_ROOM    = "Пустое имя комнаты"
export const EM_MAX_PLAYERS       = "Эта комната заполнена"
export const EM_SET_PLAYERS_LOW   = `Слишком мало игроков(${DEF_MIN_PLAYERS} мин.)`
export const EM_SET_PLAYERS_HIGH  = `Слишком много игроков(${DEF_MAX_PLAYERS} макс.)`
export const EM_UNIQUE_NAME       = "Такое название комнаты уже существует"
export const EM_PASS_ROOM         = "Слишком короткий пароль"
export const EM_START_GAME        = `Не хватает игроков для игры(${DEF_MIN_PLAYERS} мин.)`
export const EM_START_ALREADY     = "Нельзя начать во время таймера"

//Server
export const EM_FIND_ROOM         = "Такой комнаты нет"

//Game
export const EM_GAME_CHOOSE       = "Вы уже взяли карту"
export const EM_CHOOSE_NULL       = "Эту карту уже взяли"
export const EM_READY             = "Вы уже готовы"
export const EM_PLAYER_DEAD       = "Этот игрок уже мертв"
export const EM_VOTE              = "Вы не можете голосовать"
export const EM_VOTE_PHASE        = "В эту фазу нельзя голосовать"
export const EM_VOTE_FOR          = "Вы не можете голосовать за этого игрока"
export const EM_VOTE_AGAIN        = "Вы уже проголосовали"