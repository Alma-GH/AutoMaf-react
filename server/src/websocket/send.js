const Onside = require("../class/Onside.js");
const {wss} = require("./wss");


function single(client, message){
  client.send(JSON.stringify(message))
}

function broadcast(message, id) {
  wss.clients.forEach(client => {
    if(id===undefined || client.id === id)
      client.send(JSON.stringify(message))
  })
}

function broadcastClear(message,id){
  const room = message.room
  const game = room.getGame()

  //tmp
  const table = game?.tableVotes
  const votes = game?.players.map(player=>player.vote)
  const nightVotes = game?.players.map(player=>player.voteNight)
  const log   = game?.log
  const timer = room.timer

  //clear/adaptive
  if(game){
    game.tableVotes = Array.from(game.getTable().entries())
      .map(row=>{
        const voter = row[0]
        const vote = row[1]
        return [voter.getID(), vote instanceof Onside ? vote.getID() : vote]
      })
    //TODO: crutch - after make voting by id
    game.players.forEach(player=>{
      if(player.vote instanceof Onside)
        player.vote = player.vote._id
      if(player.voteNight instanceof Onside)
        player.voteNight = player.voteNight._id
    })
    game.log = undefined
  }
  room.timer = undefined

  broadcast({event:message.event, room},id)

  //return values
  if(game){
    game.tableVotes = table
    game.players.forEach((player,ind)=> {
      player.vote = votes[ind]
      player.voteNight = nightVotes[ind]
    })
    game.log = log
  }
  room.timer = timer
}



module.exports = {single,broadcast,broadcastClear}