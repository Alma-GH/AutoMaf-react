import Onside from "../class/Onside.js";


//For game tests

function getVotes(game, aliveInds){
  const alive = game.getPlayersAlive()
  const table = []
  for (let i = 0; i < alive.length; i++) {
    table.push(alive[aliveInds[i]])
  }
  return table
}


function skip_discussion(game){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    game.addReadyPlayer(player)
  }
}

function night_kill(game){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()
  const victim = players.find(player=>player.getRole()!==Onside.CARD_MAFIA)

  const mafia = players.filter(player=>player.getRole()===Onside.CARD_MAFIA)
  mafia.forEach(member=>game.setVoteNight(member,victim))
}
function night_kill2(game,victim){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()

  const mafia = players.filter(player=>player.getRole()===Onside.CARD_MAFIA)
  mafia.forEach(member=>game.setVoteNight(member,victim))
}
function night_kill3(game,table){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()

  const mafia = players.filter(player=>player.getRole()===Onside.CARD_MAFIA)
  mafia.forEach((member,i)=>{
    game.setVoteNight(member,table[i])
  })
}

function subtotal(game){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()
  const sus = players[0]

  let speaker
  while(speaker = game.getPlayers().find(player=>player.isSpeak())){
    game.setVote(speaker,sus===speaker ? false : sus)
  }

}
function subtotal2(game,table){
  if(game.end !== null) return console.log("GAME END")

  const alive = game.getPlayersAlive()

  for (let i = 0; i < alive.length; i++) {
    const voter = alive[i]
    const val = table[i]
    game.setVote(voter,val)
  }

  // console.log(Array.from(game.getTable().entries())
  //   .map(row=>[row[0].getName(),row[1] ? row[1].getName():row[1]]))
}
function subtotalStop(game){
  if(game.end !== null) return console.log("GAME END")

  const players = game.getPlayersAlive()
  const sus = players[0]

  let speaker
  while(speaker = game.getPlayers().find(player=>player.isSpeak())){
    game.setVoteWithoutNextPhase(speaker,sus===speaker ? false : sus)
  }
}

function total(game){
  if(game.end !== null) return console.log("GAME END")

  const alive = game.getPlayersAlive()
  const sus = alive[0]

  let judged
  while(judged = game.getPlayers().find(player=>player.isJudged())){

    alive.forEach(player=>{
      const conds = (
        !player.isJudged() &&
        player.getVote()===null
      )
      if(conds && sus.isJudged()){
        game.setVote(player, sus)
      }
      if(conds && sus === player)
        game.setVote(player,false)
    })

    game.nextJudged()
  }

}
function total2(game,table){
  if(game.end !== null) return console.log("GAME END")

  const alive = game.getPlayersAlive()

  let judged
  while(judged = game.getPlayers().find(player=>player.isJudged())){
    // console.log({judged: judged.getName()})
    alive.forEach((player,ind)=>{
      if(judged === table[ind])
        game.setVote(player,judged)
    })
    game.nextJudged()
  }


}
function totalStop(game){
  if(game.end !== null) return console.log("GAME END")

  const alive = game.getPlayersAlive()
  const sus = alive[0]
  debugger
  let judged
  while(!game._isEndVote()){
    judged = game.getPlayers().find(player=>player.isJudged())
    alive.forEach(player=>{
      const conds = (
        !player.isJudged() &&
        player.getVote()===null &&
        !game._isEndVote()
      )
      if(conds && sus.isJudged()){
        game.setVoteWithoutNextPhase(player, sus)
      }
      if(conds && sus === player)
        game.setVoteWithoutNextPhase(player,false)
    })

    game.nextJudged()
  }

}


export {  getVotes,skip_discussion,night_kill,night_kill2,night_kill3,
  subtotal,subtotal2,subtotalStop,totalStop,total,total2}