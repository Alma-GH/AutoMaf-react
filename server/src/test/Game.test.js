import Game from "../Game.js";
import Player from "../Player.js";

let arrPl = []

for (let i = 0; i < 4; i++) {
  let player = new Player("Roman" + i)
  arrPl.push(player)
}

let game = new Game(arrPl)

console.group("Test class 'Game':")

console.groupEnd()

