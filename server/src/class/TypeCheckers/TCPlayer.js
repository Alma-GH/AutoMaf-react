const {EM_NULL_NAME_PLAYER} = require("../../utils/const.js");



class TypeChecker{
  //client setters
  checkArgs_constructor(...args){
    if(args.length!==1) return false

    const name = args[0]

    const isStr = (typeof name === "string")

    return isStr
  }
  check_constructor(...args){
    if(!this.checkArgs_constructor(...args))
      throw new Error("Args: incorrect set name")

    const name = args[0]

    if(!name.length)
      throw new Error(EM_NULL_NAME_PLAYER)
  }

  //class methods
  checkArgs_setID(...args){
    if(args.length!==1) return false

    const id = args[0]

    const isNum = (typeof id === "number")

    return isNum
  }
  check_setID(...args){
    if(!this.checkArgs_setID(...args))
      throw new Error("incorrect id for player")
  }
}

module.exports = new TypeChecker()