import Room from "../class/Room.js";
import Server from "../class/Server.js";
import Player from "../class/Player.js";
import {getVotes, night_kill, skip_discussion, subtotal, subtotal2} from "../utils/classU.js";
import Game from "../class/Game.js";
import Onside from "../class/Onside.js";

class FabTester{

  block(title, body){
    Tester.title(title)
    body()
    Tester.end()
  }

  title(title){
    console.group(title + ":")
  }
  end(){
    console.groupEnd()
  }

  pass(cb){
    try{
      cb()
      console.log("\x1b[32m","+ TEST PASSED","\x1b[0m")
    }catch (e){
      console.log("\x1b[31m",`+ TEST FAILED(${e.message})`,"\x1b[0m")
    }finally {
      this.clear()
    }
  }
  fail(cb){
    try{
      cb()
      console.log("\x1b[31m","- TEST FAILED","\x1b[0m")
    }catch (e){
      console.log("\x1b[32m",`- TEST PASSED(${e.message})`,"\x1b[0m")
    }finally {
      this.clear()
    }
  }

  clear(){
    //clear global
    Server.clear()
    Room.newID = 0
  }
}

const Tester = new FabTester()


Tester.block("Server", ()=>{
  Tester.block(".addRoom", ()=>{
    Tester.pass(()=>{
      const player = new Player("Roman")
      const room = new Room(player,4,"room", null)
      Server.addRoom(room)
    })
    Tester.fail(()=>{
      Server.addRoom(null)
    })
    // Tester.fail(()=>{
    //   const player = new Player("Roman")
    //   const room = new Room(player,4,"room", null)
    //   Server.addRoom(room)
    //
    //   const player2 = new Player("Roman2")
    //   const room2 = new Room(player,4,"room", null)
    //   Server.addRoom(room2)
    // })
  })
  Tester.block(".getRoomByName", ()=>{
    Tester.pass(()=>{
      const nameRoom = "room"
      const player = new Player("Roman")
      const room = new Room(player,4,nameRoom, null)
      Server.addRoom(room)

      Server.getRoomByName(nameRoom)
    })
    Tester.fail(()=>{
      Server.getRoomByName(null)
    })
    Tester.fail(()=>{
      const nameRoom = "room"
      const otherName = "room1"
      const player = new Player("Roman")
      const room = new Room(player,4,nameRoom, null)
      Server.addRoom(room)

      Server.getRoomByName(otherName)
    })
  })
  Tester.block(".getRoomByID", ()=>{
    Tester.pass(()=>{
      const nameRoom = "room"
      const player = new Player("Roman")
      const room = new Room(player,4,nameRoom, null)
      Server.addRoom(room)

      Server.getRoomByID(room.getID())
    })
    Tester.fail(()=>{
      Server.getRoomByID(null)
    })
    Tester.fail(()=>{
      Server.getRoomByID(3)
    })
  })
})

Tester.block("Room",()=>{
  Tester.block(".addPlayer",()=>{
    Tester.pass(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      const finder = new Player("Roman2")
      room.addPlayer(finder)

    })
    Tester.fail(()=>{
      const room = new Room(null, 4, "room", null)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      room.addPlayer(leader)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      for (let i = 0; i < 5; i++) {
        const finder = new Player("Roman"+i)
        room.addPlayer(finder)
      }
    })
  })
  Tester.block(".setMaxPlayers",()=>{
    Tester.pass(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)
      room.setMaxPlayers(10)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, null, "room", null)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 3, "room", null)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 100, "room", null)
    })
  })
  Tester.block(".setName",()=>{
    Tester.pass(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)
      room.setName("MYROOM")
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, null, null)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "", null)
    })
  })
  Tester.block(".setPass",()=>{
    Tester.pass(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", "123")
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", false)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", "12")
    })
  })
  Tester.block(".startGame",()=>{
    Tester.pass(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      for (let i = 0; i < 3; i++) {
        const finder = new Player("Roman"+i)
        room.addPlayer(finder)
      }

      room.startGame()
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      room.startGame()
    })
  })
  Tester.block(".quitPlayer",()=>{
    Tester.pass(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      room.quitPlayer(leader)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      room.quitPlayer(null)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      const player = new Player("RomanQ")
      room.quitPlayer(player)
    })
  })
  Tester.block(".getPlayerByID",()=>{
    Tester.pass(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      const first = room.getPlayerByID(0)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      const first = room.getPlayerByID(null)
    })
    Tester.fail(()=>{
      const leader = new Player("Roman")
      const room = new Room(leader, 4, "room", null)

      const first = room.getPlayerByID(3)
    })
  })
})

Tester.block("Player",()=>{
  Tester.block(".constructor",()=>{
    Tester.pass(()=>{
      const player = new Player("Roman")
    })
    Tester.fail(()=>{
      const player = new Player(null)
    })
    Tester.fail(()=>{
      const player = new Player("")
    })
  })
})

Tester.block("Game", ()=> {
  function getNewRoom() {
    const leader = new Player("Roman")
    const room = new Room(leader, 4, "room", null)

    for (let i = 0; i < 3; i++) {
      const finder = new Player("Roman" + i)
      room.addPlayer(finder)
    }
    room.startGame()

    return room
  }

  Tester.block(".createRole", () => {


    Tester.pass(() => {
      const room = getNewRoom()
      const game = room.getGame()
      room.getPlayers().forEach((pl, i) => {
        game.createRole(pl, i)
      })
    })
    Tester.fail(() => {
      const game = getNewRoom().getGame()
      game.createRole(null, 0)
    })
    Tester.fail(() => {
      const room = getNewRoom()
      const game = room.getGame()
      game.createRole(room.getPlayerByID(0), 100)
    })
    Tester.fail(() => {
      const room = getNewRoom()
      const game = room.getGame()
      const player = room.getPlayerByID(0)
      game.createRole(player, 0)
      game.createRole(player, 1)
    })
    Tester.fail(() => {
      const room = getNewRoom()
      const game = room.getGame()
      room.getPlayers().forEach(pl => {
        game.createRole(pl, 0)
      })
    })
  })
  Tester.block(".addReadyPlayer", () => {
    function getNewGame() {
      const room = getNewRoom()
      const game = room.getGame()
      room.getPlayers().forEach((pl, i) => {
        game.createRole(pl, i)
      })
      return game
    }

    Tester.pass(() => {
      const game = getNewGame()
      game.getPlayers().forEach(pl => {
        game.addReadyPlayer(pl)
      })
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.addReadyPlayer(null)
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.getPlayers().forEach(pl => {
        game.addReadyPlayer(pl)
        game.addReadyPlayer(pl)
      })
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.getPlayers().forEach(pl => {
        pl.kill()
        game.addReadyPlayer(pl)
      })
    })
    Tester.fail(() => {
      const game = getNewGame()
      game._nextPhase()
      game._nextPhase()
      game.getPlayers().forEach(pl => {
        game.addReadyPlayer(pl)
      })
    })
  })
  Tester.block(".setVoteNight", () => {
    function getNewGame() {
      const room = getNewRoom()
      const game = room.getGame()
      room.getPlayers().forEach((pl, i) => {
        game.addReadyPlayer(game.createRole(pl, i))
      })
      skip_discussion(game)
      return game
    }

    Tester.pass(() => {
      const game = getNewGame()
      night_kill(game)
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.setVoteNight(null, 5)
    })
    Tester.fail(() => {
      const game = getNewGame()
      game._nextPhase()
      game.getPlayers().forEach(pl => {
        if (pl.getRole() === Onside.CARD_MAFIA)
          game.setVoteNight(pl, null)
      })
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.getPlayers().forEach(pl => {
        if (pl.getRole() === Onside.CARD_MAFIA) {
          pl.kill()
          game.setVoteNight(pl, null)
        }
      })
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.getPlayers().forEach(pl => {
        if (pl.getRole() === Onside.CARD_MAFIA) {
          const victim = game.getPlayers().find(pl => pl.getRole() !== Onside.CARD_MAFIA)
          victim.kill()
          game.setVoteNight(pl, victim)
        }
      })
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.getPlayers().forEach(pl => {
        if (pl.getRole() !== Onside.CARD_MAFIA) {
          game.setVoteNight(pl, null)
        }
      })
    })
    Tester.fail(() => {
      const game = getNewGame()
      game.getPlayers().forEach(pl => {
        if (pl.getRole() === Onside.CARD_MAFIA) {
          game.setVoteNight(pl, pl)
        }
      })
    })
  })
  Tester.block(".setVote", () => {
    function getNewGameSubTotal() {
      const room = getNewRoom()
      const game = room.getGame()
      room.getPlayers().forEach((pl, i) => {
        game.addReadyPlayer(game.createRole(pl, i))
      })
      skip_discussion(game)
      night_kill(game)
      skip_discussion(game)
      return game
    }
    function getNewGameTotal() {
      const game = getNewGameSubTotal()
      subtotal2(game,getVotes(game,[2,0,1,1]))
      skip_discussion(game)
      return game
    }

    Tester.pass(()=>{
      const game = getNewGameSubTotal()
      subtotal(game)
    })
    Tester.fail(()=>{
      const game = getNewGameSubTotal()
      game.setVote(null,0)
    })
    Tester.fail(()=>{
      const game = getNewGameSubTotal()
      const speaker = game.getPlayers().find(pl=>pl.isSpeak())
      speaker.kill()
      game.setVote(speaker,null)
    })
    Tester.fail(()=>{
      const game = getNewGameSubTotal()
      const speaker = game.getPlayers().find(pl=>pl.isSpeak())
      const sus = game.getPlayersAlive().find(pl=>!pl.isSpeak())
      sus.kill()
      game.setVote(speaker,sus)
    })
    Tester.fail(()=>{
      const game = getNewGameSubTotal()
      const speaker = game.getPlayers().find(pl=>pl.isSpeak())
      game.setVote(speaker,false)
      game.setVote(speaker,false)
    })
    Tester.fail(()=>{
      const game = getNewGameSubTotal()
      const notSpeaker = game.getPlayersAlive().find(pl=>!pl.isSpeak())
      game.setVote(notSpeaker,null)
    })
    Tester.fail(()=>{
      const game = getNewGameSubTotal()
      const speaker = game.getPlayers().find(pl=>pl.isSpeak())
      game.setVote(speaker,speaker)
    })
    Tester.fail(()=>{
      const game = getNewGameTotal()
      const judged = game.getPlayers().find(pl=>pl.isJudged())
      game.setVote(judged,null)
    })
    Tester.fail(()=>{
      const game = getNewGameTotal()
      const notJudged = game.getPlayersAlive().find(pl=>!pl.isJudged())
      game.setVote(notJudged,notJudged)
    })
    Tester.fail(()=>{
      const game = getNewGameSubTotal()
      const speaker = game.getPlayers().find(pl=>pl.isSpeak())
      game._nextPhase()
      game.setVote(speaker,null)
    })
  })
  Tester.block(".getPlayersByID", () => {
    function getNewGame() {
      const room = getNewRoom()
      const game = room.getGame()
      room.getPlayers().forEach((pl, i) => {
        game.createRole(pl, i)
      })
      return game
    }

    Tester.pass(()=>{
      const game = getNewGame()
      const player = game.getPlayerByID(0)
    })
    Tester.fail(()=>{
      const game = getNewGame()
      const player = game.getPlayerByID(null)
    })
    Tester.fail(()=>{
      const game = getNewGame()
      const player = game.getPlayerByID(100)
    })
  })

})




