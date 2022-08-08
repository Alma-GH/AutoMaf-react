import Room from "./Room.js";


class Server {

  rooms = []

  addRoom(room){
    //TODO: change check type

    if(!(room instanceof Room))
      throw new Error("Type error: Server.addRoom(room)")

    this.rooms.push(room)
  }

}


export default new Server()