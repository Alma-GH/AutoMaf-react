

class Timer {

  keys = {}


  timeout(key, cb, time){
    const id = this.keys[key]
    if(id)
      clearTimeout(id)
    this.keys[key] = setTimeout(cb,time)
  }

  interval(key, cb, time, startNow){
    const id = this.keys[key]
    if(id)
      clearInterval(id)
    if(startNow)
      cb()
    this.keys[key] = setInterval(cb, time)
  }
  stopInterval(key){
    const id = this.keys[key]
    if(id)
      clearInterval(id)
  }

}


export default new Timer()