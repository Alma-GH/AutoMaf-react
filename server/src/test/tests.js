const Room = require("../class/Room");
const Player = require("../class/Player");
const Game = require("../class/Game");


const room = new Room(new Player("Roman"), 4, "room", "123")

console.log(room.getOptions())
room.setOptions({
  voteType: 1
})
console.log(room.getOptions())

// room.addPlayer(new Player("1"))
// room.addPlayer(new Player("Rom2"))
// room.addPlayer(new Player("Rom3"))
// room.startGame()
//
// console.log(room.getGame().getVoteType())




