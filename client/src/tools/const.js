
//DEBUG
export const PROD                   = process.env.REACT_APP_PROD === "true"
const SERVER_COMMANDS               = false
const PANEL                         = false
const REDIRECT                      = false

export const DEBUG_SERVER_COMMANDS = SERVER_COMMANDS && !PROD
export const DEBUG_PANEL           = PANEL && !PROD
export const DEBUG_REDIRECT        = REDIRECT && !PROD

//SERVER
//link
const LOCAL_BASE_URL = process.env.REACT_APP_LOCAL_BASE_URL
const LOCAL_WS_URL = process.env.REACT_APP_LOCAL_WS_URL
const SERVER_WS_URL = process.env.REACT_APP_SERVER_WS_URL
const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
export const BASE_URL = PROD ? SERVER_BASE_URL : LOCAL_BASE_URL
export const WS_URL = PROD ? SERVER_WS_URL : LOCAL_WS_URL

//default
export const DEFAULT_NAME = "Unknown"


//PATHS
export const PATH_ROOT_APP = "/app"

export const PATH_ROOT_AUTH = "auth"
export const PATH_LOGIN = "login"
export const PATH_REGISTRATION = "registration"

export const PATH_ENTER   = "enter"
export const PATH_START   = "start"
export const PATH_CREATE  = "create"
export const PATH_STAT    = "statistic"
export const PATH_FIND    = "find"
export const PATH_INVITE  = "invite"

export const PATH_ROOT_ROOM = "room"
export const PATH_PREPARE   = "prepare"
export const PATH_GAME      = "game"



export const LINK_REGISTRATION  = `${PATH_ROOT_AUTH}/${PATH_REGISTRATION}`
export const LINK_LOGIN         = `${PATH_ROOT_AUTH}/${PATH_LOGIN}`

export const LINK_ENTER   = `${PATH_ROOT_APP}/${PATH_ENTER}`
export const LINK_START   = `${PATH_ROOT_APP}/${PATH_START}`
export const LINK_CREATE  = `${PATH_ROOT_APP}/${PATH_CREATE}`
export const LINK_STAT    = `${PATH_ROOT_APP}/${PATH_STAT}`
export const LINK_FIND    = `${PATH_ROOT_APP}/${PATH_FIND}`
export const LINK_INVITE  = `${PATH_ROOT_APP}/${PATH_INVITE}`

export const LINK_PREPARE = `${PATH_ROOT_APP}/${PATH_ROOT_ROOM}/${PATH_PREPARE}`
export const LINK_GAME    = `${PATH_ROOT_APP}/${PATH_ROOT_ROOM}/${PATH_GAME}`


//ROOM
//timers
export const T_START = "timer_key_start"
export const T_VOTE = "timer_key_realtime_vote"

//settings
export const S_VOTE_TYPE_REALTIME = "VOTE_TYPE_REALTIME"


//GAME
//roles
export const CARD_MAFIA = "CARD_MAFIA"
export const CARD_CIVIL = "CARD_CIVIL"
export const CARD_DETECTIVE = "CARD_DETECTIVE"
export const CARD_DOCTOR = "CARD_DOCTOR"

//phases
export const PHASE_PREPARE        = "PHASE_PREPARE"
export const PHASE_DAY_DISCUSSION = "PHASE_DAY_DISCUSSION"
export const PHASE_NIGHT_MAFIA    = "PHASE_NIGHT_MAFIA"
export const PHASE_NIGHT_DETECTIVE  = "PHASE_NIGHT_DETECTIVE"
export const PHASE_NIGHT_DOCTOR   = "PHASE_NIGHT_DOCTOR"
export const PHASE_DAY_SUBTOTAL   = "PHASE_DAY_SUBTOTAL"
export const PHASE_DAY_TOTAL      = "PHASE_DAY_TOTAL"

//ends
export const CIVIL_WIN            = "CIVIL_WIN"
export const MAFIA_WIN            = "MAFIA_WIN"

//avatars
export const AVATAR_UNKNOWN  = "AVATAR_UNKNOWN"
export const AVATAR_NORMAL  = "AVATAR_NORMAL"
export const AVATAR_DEAD    = "AVATAR_DEAD"
export const AVATAR_SPEAK   = "AVATAR_SPEAK"
export const AVATAR_JUDGED  = "AVATAR_JUDGED"
export const AVATAR_TIMER   = "AVATAR_TIMER"



//OTHER
//storage keys
export const S_ACCESS_TOKEN = "access_token"
export const S_NICK = "nick"
export const S_LOST_ROOM = "lost room"
export const S_LOST_PLAYER = "lost player"

//toast keys
export const T_VERSION = "toast_version_id"
export const T_NICK = "toast_nick_id"
export const T_CLOSE_CONNECTION = "toast_connection_id"
export const T_CLIPBOARD = "toast_clipboard_id"

//error message
export const EM_VERSION           = "Данная функция пока не доступна"
export const EM_NICK              = "Введите ник"
export const EM_CLOSE_CONNECTION  = "Сервер прервал соединение"

//message
export const M_CLIPBOARD = "Ссылка скопирована"

//default objects
export const DEF_SETTINGS = {
  voteType: S_VOTE_TYPE_REALTIME,
  autoRole: true,
  numMaf: "",
  numDet: "",
  numDoc: ""
}

export const DEF_ERROR = {
  visible: false,
  message: ""
}


