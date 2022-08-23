import Game from "../Game.js";
import Player from "../Player.js";
import Room from "../Room.js";
import Onside from "../Onside.js";

const MAX_PLAYERS = 6

//init players
const players = []
for (let i = 0; i < MAX_PLAYERS; i++) {
  let player = new Player("Roman" + i)
  players.push(player)
}

//init room
const room = new Room(players[0],MAX_PLAYERS,"MYROOM")
for (let i = 1; i < MAX_PLAYERS; i++) {
  let player = players[i]
  room.addPlayer(player)
}

//init game
room.startGame()
const game = room.getGame()


//GAME PROCESS

function skip_discussion(){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    game.addReadyPlayer(player)
  }
}

function night_kill(){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()
  const victim = players.find(player=>player.getRole()!==Onside.CARD_MAFIA)

  const mafia = players.filter(player=>player.getRole()===Onside.CARD_MAFIA)
  mafia.forEach(member=>game.setVoteNight(member,victim))
}

function subtotal(){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()
  const sus = players[0]

  let speaker
  while(speaker = game.getPlayers().find(player=>player.isSpeak()))
    game.setVote(speaker,sus===speaker ? false : sus)
}

function total(){
  if(game.end !== null) return console.log("GAME END")

  let sus = game.getPlayersAlive()[0]
  let judged
  while (judged = game.getPlayers().find(player=>player.isJudged())) {
    const players = game.getPlayersAlive()

    for (let j = 0; j < players.length; j++) {
      const player = players[j]
      const conds = (
        !player.isJudged() &&
        player.getVote()===null
      )
      if(conds && sus.isJudged())
        game.setVote(player, sus)
      if(conds && sus === player)
        game.setVote(player,false)
    }
    if(!game.getPhase())
      break

    game.nextJudged()
  }
}

//START
//players take cards
const onsides = []
for (let i = 0; i < MAX_PLAYERS; i++) {
  const player = players[i]
  const onside = game.createRole(player,i)
  onsides.push(onside)
  if(i>=0) game.addReadyPlayer(onside)
}

skip_discussion()
night_kill()
skip_discussion()
subtotal()
skip_discussion()

//total 1
total()

night_kill()
skip_discussion()
subtotal()
skip_discussion()

//total 2
total()



console.group("Test class 'Game':")
console.log(players)
console.log(room.toString())
console.log(game.toString())
console.groupEnd()

