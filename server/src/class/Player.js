const Checker = require("./TypeCheckers/TCPlayer.js")

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

module.exports = Player




