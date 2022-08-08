
const UNKNOWN = "unknown"

class Player {
  _id
  _name
  constructor(name) {
    this._id = null
    if(typeof name === "string") this._name = name
    else                         this._name = UNKNOWN
  }

  setID(id){
    if(typeof id === "number") this._id = id
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