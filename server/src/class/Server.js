const Checker = require("./TypeCheckers/TCServer.js")

class Server {

  static ROOM_EMPTY_TIME = 1000*60 //1min
  static ROOM_LIVE_TIME = 1000*60*60*24 //1day

  rooms = []

  constructor() {
    setInterval(()=>{
      this.getRooms().forEach(room=>{
        if(room.getPlayers().length === 0)
          this.closeRoom(room.getID())
      })
    },Server.ROOM_EMPTY_TIME)
  }

  getRooms(){
    return this.rooms
  }
  getRoomsNames(){
    return this.rooms.map(room=>room.getName())
  }

  getRoomByID(id){
    Checker.check_getRoomByID(this,id)

    return this.getRooms().find(room=>room.getID()===id)
  }
  getRoomByName(name){
    Checker.check_getRoomByName(this,name)

    return this.getRooms().find(room => room.getName() === name)
  }

  addRoom(room){
    // Checker.check_addRoom(room)
    this.rooms.push(room)
    setTimeout(()=>this.closeRoom(room.getID()), Server.ROOM_LIVE_TIME)
  }
  closeRoom(id){
    this.rooms = this.rooms.filter(room=>room.roomID !== id)
  }
  clear(){
    this.rooms.length = 0
  }

}


module.exports = new Server()

