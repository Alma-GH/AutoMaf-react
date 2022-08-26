import Game from "../class/Game.js";
import Player from "../class/Player.js";
import Room from "../class/Room.js";
import Onside from "../class/Onside.js";
import {getVotes, night_kill, skip_discussion, subtotal2, total2} from "../utils/classU.js";

const MAX_PLAYERS = 5

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


//START
//players take cards
for (let i = 0; i < MAX_PLAYERS; i++) {
  const player = players[i]
  const onside = game.createRole(player,i)
  if(i>=0) game.addReadyPlayer(onside)
}


skip_discussion(game)
night_kill(game)
skip_discussion(game)
subtotal2(game,getVotes(game,[2,0,1,1]))
skip_discussion(game)

//total 1
total2(game,getVotes(game,[1,0,1,0]))
skip_discussion(game)
total2(game,getVotes(game,[1,0,1,1]))

night_kill(game)
// skip_discussion()
// subtotal()
// skip_discussion()
//
// //total 2
// total()
// night_kill()



console.group("Test class 'Game':")
// console.log(players)
// console.log(room.toString())
console.log(game.toString())
console.groupEnd()

