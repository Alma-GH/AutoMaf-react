import Room from "./Room.js";
import {EM_FIND_ROOM} from "../utils/const.js";


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
    Checker.check_getRoomByID(this,id)

    return this.getRooms().find(room=>room.getID()===id)
  }
  getRoomByName(name){
    Checker.check_getRoomByName(this,name)

    return this.getRooms().find(room => room.getName() === name)
  }

  addRoom(room){
    Checker.check_addRoom(room)

    this.rooms.push(room)
  }
  closeRoom(id){
    this.rooms = this.rooms.filter(room=>room.roomID !== id)
  }
  clear(){
    this.rooms.length = 0
  }

}


export default new Server()


class TypeChecker{

  //client setters
  checkArgs_addRoom(...args){
    if(args.length!==1) return false

    const room = args[0]

    const isRoom  = (room instanceof Room)

    return isRoom
  }
  check_addRoom(...args){
    if(!this.checkArgs_addRoom(...args))
      throw new Error("is not a Room")

    const room = args[0]

    //TODO: check name of room
  }

  //client getters
  checkArgs_getRoomByName(...args){
    if(args.length!==1) return false

    const name = args[0]

    const isStr  = (typeof name === "string")

    return isStr
  }
  check_getRoomByName(server,...args){
    if(!this.checkArgs_getRoomByName(...args))
      throw new Error("incorrect request Room by name")

    const name = args[0]

    if(!server.getRooms().find(room=>room.getName()===name))
      throw new Error(EM_FIND_ROOM)
  }

  checkArgs_getRoomByID(...args){
    if(args.length!==1) return false

    const id = args[0]

    const isNum  = (typeof id === "number")
    const isInt  = Number.isInteger(id)

    return isNum && isInt
  }
  check_getRoomByID(server,...args){
    if(!this.checkArgs_getRoomByID(...args))
      throw new Error("incorrect request Room by id")

    const id = args[0]

    if(!server.getRooms().find(room=>room.getID()===id))
      throw new Error("this room not exist")
  }

}

const Checker = new TypeChecker()