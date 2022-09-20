import Game from "./Game.js";

class ChatLog{

  static WHO_LOG = "Log"
  static WHO_HOST = "Ведущий"

  //TODO: add other night phases
  static MAP_PHRASES = {
    [Game.PHASE_DAY_DISCUSSION]: "Итак начнем. Можете пока представиться друг другу",
    [Game.PHASE_NIGHT_MAFIA]: "Город засыпает... Просыпается мафия. И делает свой выбор",
    [Game.PHASE_DAY_SUBTOTAL]: "Начнем промежуточные итоги",
    [Game.PHASE_DAY_TOTAL]: "Начнем итоговое голосование",
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
  }
  gameEnd(message){
    this.setLog(ChatLog.WHO_HOST, message)
    this.end = true
  }

  getHostPhraseByPhase(phase){
    return ChatLog.MAP_PHRASES[phase]
  }
  getHostPhraseByDeadPlayer(player){
    return `... игрока ${player.getName()}. Он может дать последнее слово.
     После ведите общее обсуждение, а я подожду готовности к промежуточным итогам`
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

}



export default ChatLog