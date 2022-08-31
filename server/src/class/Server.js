import Room from "./Room.js";


//TODO: if room live more 1day closeRoom
class Server {

  rooms = []

  getRooms(){
    return this.rooms
  }
  getRoomsNames(){
    return this.rooms.map(room=>room.getName())
  }

  getRoomByID(id){
    return this.getRooms().find(room=>room.getID()===id)
  }
  getRoomByName(name){
    return this.getRooms().find(room=>room.getName()===name)
  }

  addRoom(room){
    //TODO: change check type

    if(!(room instanceof Room))
      throw new Error("Type error: Server.addRoom(room)")

    this.rooms.push(room)
  }
  closeRoom(id){
    this.rooms = this.rooms.filter(room=>room.roomID !== id)
  }

}


export default new Server()