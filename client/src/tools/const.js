
//DEBUG
export const PROD                  = true
export const DEBUG_SERVER_COMMANDS = false && !PROD
export const DEBUG_LOG             = true && !PROD

//SERVER
//link
export const LOCAL_LINK = 'ws://localhost:5000'
export const SERVER_LINK = `wss://confirmed-cold-crowd.glitch.me`

//default
export const DEFAULT_NAME = "Unknown"


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



//GAME
//roles
export const CARD_MAFIA = "CARD_MAFIA"
export const CARD_CIVIL = "CARD_CIVIL"

//phases
export const PHASE_PREPARE        = "PHASE_PREPARE"
export const PHASE_DAY_DISCUSSION = "PHASE_DAY_DISCUSSION"
export const PHASE_NIGHT_MAFIA    = "PHASE_NIGHT_MAFIA"
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



//OTHER
//storage keys
export const S_NICK = "nick"

//
export const EM_VERSION = "Данная функция пока не доступна"
