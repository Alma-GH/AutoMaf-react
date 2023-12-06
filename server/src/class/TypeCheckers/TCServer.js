const {EM_FIND_ROOM} = require("../../utils/const.js");


class TypeChecker{

  //client setters
  // checkArgs_addRoom(...args){
  //   if(args.length!==1) return false
  //
  //   const room = args[0]
  //
  //   const isRoom  = (room instanceof Room)
  //
  //   return isRoom
  // }
  // check_addRoom(...args){
  //   if(!this.checkArgs_addRoom(...args))
  //     throw new Error("is not a Room")
  //
  //   const room = args[0]
  //
  //   //TODO: check name of room
  // }

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

    const isString  = (typeof id === "string")

    return isString
  }
  check_getRoomByID(server,...args){
    if(!this.checkArgs_getRoomByID(...args))
      throw new Error("incorrect request Room by id")

    const id = args[0]

    if(!server.getRooms().find(room=>room.getID()===id))
      throw new Error("this room not exist")
  }

}

module.exports = new TypeChecker()