
class TypeChecker{

  checkArgs_getRoomByID(...args){
    if(args.length!==1) return false

    const id = args[0]

    const isString  = (typeof id === "string")

    return isString
  }
  check_getRoomByID(server,...args) {
    if(!this.checkArgs_getRoomByID(...args))
      throw new Error("incorrect request Room by id")

    const id = args[0]

    if(!server.getRooms().find(room=>room.getID()===id))
      throw new Error("this room not exist")
  }

}

module.exports = new TypeChecker()