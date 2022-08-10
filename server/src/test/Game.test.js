import Game from "../Game.js";
import Player from "../Player.js";

let arrPl = []

for (let i = 0; i < 4; i++) {
  let player = new Player("Roman" + i)
  arrPl.push(player)
}

let game = new Game(arrPl)

console.group("Test class 'Game':")
console.log(game.createCards(4) === 1)
console.log(game.createCards(5) === 1)
console.log(game.createCards(6) === 1)
console.log(game.createCards(7) === 1)
console.log(game.createCards(8) === 2)
console.groupEnd()

