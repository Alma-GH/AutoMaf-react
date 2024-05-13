const Checker = require("./TypeCheckers/TCPlayer.js")
const { v4: uuidv4 } = require('uuid');

class Player {
  _id
  _name
  constructor(name, id) {
    Checker.check_constructor(name)

    if(id)
      this.setID(id)
    else
      this.setID("guest_" + uuidv4())
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




