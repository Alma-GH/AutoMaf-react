import Game from "../Game.js";
import Player from "../Player.js";
import Room from "../Room.js";
import Onside from "../Onside.js";

const MAX_PLAYERS = 4

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

//players take cards
const onsides = []
for (let i = 0; i < MAX_PLAYERS; i++) {
  const player = players[i]
  const onside = game.createRole(player,i)
  onsides.push(onside)
  if(i>=0) game.addReadyPlayer(onside)
}

//players skip day discussion
for (let i = 0; i < MAX_PLAYERS; i++) {
  const onside = onsides[i]
  game.addReadyPlayer(onside)
}

//night kill
for (let i = 0; i < MAX_PLAYERS; i++) {
  const onside = onsides[i]
  if(onside.getRole()===Onside.CARD_MAFIA)
    game.setVoteNight(onside,onsides.find(player=>player.getRole()!==Onside.CARD_MAFIA))
}

//players skip day discussion
for (let i = 0; i < MAX_PLAYERS; i++) {
  const onside = onsides[i]
  game.addReadyPlayer(onside)
}

//subtotal
game.startSubTotal()
const sus = game.getPlayers().find(player=>player.isLive())
for (let i = 0; i < MAX_PLAYERS; i++) {
  const onside = game.getPlayers().find(player=>player.isSpeak())
  if(onside)
    game.setVote(onside,sus===onside ? false : sus)
}

//players skip day discussion
for (let i = 0; i < MAX_PLAYERS; i++) {
  const onside = onsides[i]
  game.addReadyPlayer(onside)
}




console.group("Test class 'Game':")
console.log(players)
console.log(room.toString())
console.log(game.toString())
console.groupEnd()

