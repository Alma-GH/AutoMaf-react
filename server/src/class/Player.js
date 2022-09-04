import {EM_NULL_NAME_PLAYER} from "../utils/const.js";



class Player {
  _id
  _name
  constructor(name) {
    Checker.check_constructor(name)

    this._id = null
    this._name = name
  }

  setID(id){
    Checker.check_setID(id)

    this._id = id
  }
  getID(){
    return this._id
  }
  getName(){
    return this._name
  }

  toString(){
    return JSON.stringify({
      id: this._id,
      name: this._name
    })
  }
}

export default Player



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

const Checker = new TypeChecker()




