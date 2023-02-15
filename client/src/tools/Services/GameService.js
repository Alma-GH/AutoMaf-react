import {
  CARD_BUTTERFLY,
  CARD_CIVIL, CARD_DETECTIVE, CARD_DOCTOR,
  CARD_MAFIA,
  PHASE_DAY_DISCUSSION,
  PHASE_DAY_SUBTOTAL,
  PHASE_DAY_TOTAL, PHASE_NIGHT_BUTTERFLY, PHASE_NIGHT_DETECTIVE, PHASE_NIGHT_DOCTOR,
  PHASE_NIGHT_MAFIA,
  PHASE_PREPARE,
  SECOND_STYLE
} from "../const";
import imgCivil from "../../assets/imgs/civil-card.png"
import imgCivil2 from "../../assets/imgs/civil-card2.png"
import imgMafia from "../../assets/imgs/mafia-card.png"
import imgMafia2 from "../../assets/imgs/mafia-card2.png"
import imgDetective from "../../assets/imgs/detective-card.png"
import imgDoctor from "../../assets/imgs/doctor-card.png"
import imgButterfly from "../../assets/imgs/butterfly-card.png"


class GameService {

  //DEP NIGHT PHASES 4
  IMG_MAP = {
    [CARD_MAFIA]: !SECOND_STYLE ? imgMafia : imgMafia2,
    [CARD_CIVIL]: !SECOND_STYLE ? imgCivil : imgCivil2,

    [CARD_DETECTIVE]: imgDetective,
    [CARD_DOCTOR]: imgDoctor,
    [CARD_BUTTERFLY]: imgButterfly,
  }

  NIGHT_MAP = {
    [PHASE_NIGHT_MAFIA]: CARD_MAFIA,
    [PHASE_NIGHT_DETECTIVE]: CARD_DETECTIVE,
    [PHASE_NIGHT_DOCTOR]: CARD_DOCTOR,
    [PHASE_NIGHT_BUTTERFLY]: CARD_BUTTERFLY,
  }

  NIGHT_PHASES = [
    PHASE_NIGHT_MAFIA,
    PHASE_NIGHT_DETECTIVE,
    PHASE_NIGHT_DOCTOR,
    PHASE_NIGHT_BUTTERFLY,
  ]

  //room methods
  getRoomID(room){
    return room?.roomID
  }
  getMembers(room){
    return room ? room.players : []
  }
  getMaxMembers(room){
    return room ? room.maxPlayers : 0
  }
  getRoomStatus(room){
    return room?.inGame
  }
  getNameRoom(room){
    return room?.name
  }
  getPassword(room){
    return room?.password
  }
  getLog(room){
    return room?.log?.chat
  }

  getName(player){
    return player?._name
  }
  getID(player){
    return player?._id
  }
  isLeader(player,players){
    if(!players)
      return null
    return this.getID(player) === this.getID(players[0])
  }


  //game methods
  getGame(room){
    return room?.game
  }
  getPhase(game){
    return (game ? game.phasePath[game.phaseIndex] : null)
  }
  getPhaseNext(game){
    return (game ? game.phasePath[game.phaseIndex+1] : null)
  }
  getPhaseRus(game){
    //DEP NIGHT PHASES 4
    const map = {
      [PHASE_PREPARE]: "Подготовка",
      [PHASE_DAY_DISCUSSION]: "День(Обсуждение)",
      [PHASE_NIGHT_MAFIA]: "Ночь(Мафия)",
      [PHASE_NIGHT_DETECTIVE]: "Ночь(Детектив)",
      [PHASE_NIGHT_DOCTOR]: "Ночь(Доктор)",
      [PHASE_NIGHT_BUTTERFLY]: "Ночь(Бабочка)",
      [PHASE_DAY_SUBTOTAL]: "День(Промежуточный итог)",
      [PHASE_DAY_TOTAL]: "День(Голосование)",
    }

    return map[this.getPhase(game)]
  }
  isNight(game){
    const phase = this.getPhase(game)
    return this.NIGHT_PHASES.includes(phase)
  }
  getCards(game){
    return game?.cards
  }
  getPlayers(game){

    return game?.players.map((player,indM)=>{
      const name = this.getName(player)
      const count = game.players
        .filter((pl,indF)=>((indF<indM) && (this.getName(pl) === name)))
        .length
      const newPlayer = {...player}
      newPlayer._name = count === 0 ? name : `${name}(${count})`
      return newPlayer
    })
  }
  getPlayersReady(game){
    return this.getPlayers(game).filter(player=>player.readiness)
  }
  getPlayersAlive(game){
    return this.getPlayers(game)?.filter(player=>player.alive)
  }
  getEnd(game){
    return game?.end
  }

  getPlayerByID(id,game){
    return this.getPlayers(game)?.find(pl=>pl._id === id)
  }
  isPlayer(player,game){
    return this.getPlayers(game)?.map(pl=>pl._id).includes(player._id)
  }
  numVotes(player,game){
    const all = this.getPlayers(game)
    return all?.filter(pl=>pl.vote===player._id).length
  }
  numNightVotes(player,game){
    const all = this.getPlayers(game)
    return all?.filter(pl=>pl.voteNight===this.getID(player)).length
  }
  getRole(player,game){
    const find = this.getPlayers(game)?.find(pl=>pl._id === this.getID(player))
    return find?.role
  }
  getPlayerVote(player,game){
    const find = this.getPlayers(game)?.find(pl=>pl._id === this.getID(player))
    return find?.vote
  }
  isPlayerToMatchNightPhase(player,game){
    const phase = this.getPhase(game)
    const role = this.getRole(player, game)

    if(!role || !phase)
      return null

    return this.NIGHT_MAP[phase] === role
  }
  getChoice(game){
    return game?.pathIdVote[0]
  }

  getTableVotes(game){
    if(!game?.tableVotes || !Object.keys(game.tableVotes).length)
      return null

    const tableFromServer = new Map(game.tableVotes)
    const players = this.getPlayersAlive(game)
    const table = players.map(player=>{
      const id = this.getID(player)
      const voter = id
      const vote  = tableFromServer.has(id)
        ? tableFromServer.get(id)
        : null
     return [voter, vote]
    })

    return table
  }
  getNumVotesFromTable(player, game){
    const table = this.getTableVotes(game)
    const id = this.getID(player)

    return table.filter(row=> row[1] === id).length
  }


  getImgByRole(role){
    return this.IMG_MAP[role]
  }
}

export default new GameService()