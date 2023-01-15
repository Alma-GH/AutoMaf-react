import Player from "../class/Player.js";
import Room from "../class/Room.js";
import {night_kill, skip_discussion, subtotalStop, totalStop} from "./func.test";

const MAX_PLAYERS = 7

//init players
const players = []
for (let i = 0; i < MAX_PLAYERS; i++) {
  let player = new Player("Roman" + i)
  players.push(player)
}

//init room
const room = new Room(players[0],MAX_PLAYERS,"MYROOM",null)
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
  game.createRole(player,i)
}

skip_discussion(game)
skip_discussion(game)
night_kill(game)
skip_discussion(game)
subtotalStop(game)
game.nextPhaseByVote()
skip_discussion(game)


//total 1
totalStop(game)
game.nextPhaseByVote()
night_kill(game)
skip_discussion(game)


console.group("Test class 'Game':")
console.log(game.toString())
console.groupEnd()

