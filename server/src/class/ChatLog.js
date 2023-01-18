const Game = require("./Game.js");

class ChatLog{

  static WHO_LOG = "Log"
  static WHO_HOST = "Ведущий"

  //DEP NIGHT PHASES
  static MAP_PHRASES_BY_START_PHASE = {
    [Game.PHASE_DAY_DISCUSSION]: "Жду готовности",
    [Game.PHASE_NIGHT_MAFIA]: "Город засыпает... Просыпается мафия. И делает свой выбор",
    [Game.PHASE_NIGHT_DETECTIVE]: "Просыпаются детективы. И делают свой выбор",
    [Game.PHASE_NIGHT_DOCTOR]: "Просыпаются доктора. И делают свой выбор",
    [Game.PHASE_NIGHT_BUTTERFLY]: "Просыпаются ночные бабочки. И делают свой выбор",
    [Game.PHASE_DAY_SUBTOTAL]: "Начнем промежуточные итоги",
    [Game.PHASE_DAY_TOTAL]: "Начнем итоговое голосование",
  }

  static MAP_PHRASES_BY_END_NIGHT_PHASE = {
    [Game.PHASE_NIGHT_MAFIA]: "Мафия сделала свой выбор. Мафия засыпает",
    [Game.PHASE_NIGHT_DETECTIVE]: "Расследование окончено. Детективы засыпают",
    [Game.PHASE_NIGHT_DOCTOR]: "Лечение окончено. Доктора засыпают",
    [Game.PHASE_NIGHT_BUTTERFLY]: "У кого-то была веселая ночка. Бабочки засыпают",
  }

  static MAP_PHRASES_RUS = {
    [Game.PHASE_DAY_DISCUSSION]: "День(Обсуждение)",
    [Game.PHASE_NIGHT_MAFIA]: "Ночь(Мафия)",
    [Game.PHASE_NIGHT_DETECTIVE]: "Ночь(Детектив)",
    [Game.PHASE_NIGHT_DOCTOR]: "Ночь(Доктор)",
    [Game.PHASE_NIGHT_BUTTERFLY]: "Ночь(Бабочка)",
    [Game.PHASE_DAY_SUBTOTAL]: "День(Промежуточный итог)",
    [Game.PHASE_DAY_TOTAL]: "День(Голосование)",
  }

  chat = []
  end = false

  getChat(){
    return this.chat
  }
  getLastMessage(){
    const ch = this.chat
    if(!ch.length)
      return null
    return ch[ch.length-1]
  }
  setLog(who, message){
    if(this.end)
      return
    const log = {
      who, message
    }

    this.chat.push(log)
  }
  clear(){
    this.chat.length = 0
    this.end = false
  }
  gameEnd(message){
    this.setLog(ChatLog.WHO_HOST, message)
    this.end = true
  }

  getHostPhraseByPhase(phase){
    return ChatLog.MAP_PHRASES_BY_START_PHASE[phase]
  }
  getHostPhraseByEndNightPhase(phase){
    return ChatLog.MAP_PHRASES_BY_END_NIGHT_PHASE[phase]
  }
  getHostPhraseByDeadPlayer(player){
    return `... игрока ${player.getName()}. Он может дать последнее слово.`
  }
  getHostPhraseByJailed(player){
    return `Игрока ${player.getName()} посадили... `
  }
  getHostPhraseBySpeaker(player){
    return `Игрок ${player.getName()} высказывается и голосует. Пожалуйста не перебивайте его.`
  }
  getHostPhraseByJudged(player){
    return `Кто считает, что ${player.getName()} мафия?`
  }
  getHostPhraseByVote(voter, vote){
    //TODO: if vote not player return other phrase
    return `Игрок ${voter.getName()} проголосовал за ${vote.getName()}`
  }

  getLogPhraseByPhase(phase){
    return `Смена фазы на ${ChatLog.MAP_PHRASES_RUS[phase]}`
  }
  getLogPhraseByDeadPlayer(player){
    return `Игрок ${player.getName()} вне игры`
  }
  getLogPhraseByQuitPlayer(player){
    return `Игрок ${player.getName()} вышел`
  }

}



module.exports = ChatLog