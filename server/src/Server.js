import Room from "./Room.js";


class Server {

  rooms = []

  getRooms(){
    return this.rooms
  }
  getRoomsNames(){
    return this.rooms.map(room=>room.getName())
  }

  addRoom(room){
    //TODO: change check type

    if(!(room instanceof Room))
      throw new Error("Type error: Server.addRoom(room)")

    this.rooms.push(room)
  }

}


export default new Server()