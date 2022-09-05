

class Timer {

  keys = {}


  timeout(key, cb, time){
    const id = this.keys[key]
    if(id)
      clearTimeout(id)
    this.keys[key] = setTimeout(cb,time)
  }

}


export default new Timer()