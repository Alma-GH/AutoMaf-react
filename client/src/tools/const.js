
//DEBUG
export const PROD                  = true
export const DEBUG_SERVER_COMMANDS = false && !PROD
export const DEBUG_LOG             = true && !PROD
export const DEBUG_REDIRECT        = false && !PROD

export const SECOND_STYLE          = false

//SERVER
//link
export const LOCAL_LINK = 'ws://localhost:5000'
export const SERVER_LINK = `wss://automaf-server.glitch.me`
export const TEST_SERVER_LINK = "wss://test-automaf.glitch.me/"

//default
export const DEFAULT_NAME = "Unknown"

// export const TIME_CALL_TO_SERVER = 2 * 60 * 1000
export const TIME_CALL_TO_SERVER = 5000


//PATHS
export const PATH_ROOT_APP = "/app"

export const PATH_ENTER   = "enter"
export const PATH_START   = "start"
export const PATH_CREATE  = "create"
export const PATH_FIND    = "find"

export const PATH_ROOT_ROOM = "room"
export const PATH_PREPARE   = "prepare"
export const PATH_GAME      = "game"



export const LINK_ENTER   = `${PATH_ROOT_APP}/${PATH_ENTER}`
export const LINK_START   = `${PATH_ROOT_APP}/${PATH_START}`
export const LINK_CREATE  = `${PATH_ROOT_APP}/${PATH_CREATE}`
export const LINK_FIND    = `${PATH_ROOT_APP}/${PATH_FIND}`

export const LINK_PREPARE = `${PATH_ROOT_APP}/${PATH_ROOT_ROOM}/${PATH_PREPARE}`
export const LINK_GAME    = `${PATH_ROOT_APP}/${PATH_ROOT_ROOM}/${PATH_GAME}`


//ROOM
//timers
export const T_START = "timer_key_start"
export const T_VOTE = "timer_key_realtime_vote"

//settings
export const S_VOTE_TYPE_REALTIME = "VOTE_TYPE_REALTIME"
export const S_VOTE_TYPE_CLASSIC = "VOTE_TYPE_CLASSIC"
export const S_VOTE_TYPE_FAIR = "VOTE_TYPE_FAIR"


//GAME
//roles
export const CARD_MAFIA = "CARD_MAFIA"
export const CARD_CIVIL = "CARD_CIVIL"
export const CARD_DETECTIVE = "CARD_DETECTIVE"
export const CARD_DOCTOR = "CARD_DOCTOR"
export const CARD_BUTTERFLY = "CARD_BUTTERFLY"

//phases
export const PHASE_PREPARE        = "PHASE_PREPARE"
export const PHASE_DAY_DISCUSSION = "PHASE_DAY_DISCUSSION"
export const PHASE_NIGHT_MAFIA    = "PHASE_NIGHT_MAFIA"
export const PHASE_NIGHT_DETECTIVE  = "PHASE_NIGHT_DETECTIVE"
export const PHASE_NIGHT_DOCTOR   = "PHASE_NIGHT_DOCTOR"
export const PHASE_NIGHT_BUTTERFLY  = "PHASE_NIGHT_BUTTERFLY"
export const PHASE_DAY_SUBTOTAL   = "PHASE_DAY_SUBTOTAL"
export const PHASE_DAY_TOTAL      = "PHASE_DAY_TOTAL"

//ends
export const CIVIL_WIN            = "CIVIL_WIN"
export const MAFIA_WIN            = "MAFIA_WIN"

//avatars
export const AVATAR_NORMAL  = "AVATAR_NORMAL"
export const AVATAR_DEAD    = "AVATAR_DEAD"
export const AVATAR_SPEAK   = "AVATAR_SPEAK"
export const AVATAR_JUDGED  = "AVATAR_JUDGED"
export const AVATAR_TIMER   = "AVATAR_TIMER"



//OTHER
//storage keys
export const S_NICK = "nick"
export const S_LOST_ROOM = "lost room"
export const S_LOST_PLAYER = "lost player"

//error message
export const EM_VERSION = "Данная функция пока не доступна"


