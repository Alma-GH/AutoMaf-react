import Room from "./Room.js";


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

}


export default new Server()