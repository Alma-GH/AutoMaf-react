import {SERVER_LINK} from "../const";

const log = true

class Socket{

  websocket = null

  connect(onopen,onmessage){

    this.websocket = new WebSocket(SERVER_LINK)

    this.websocket.onopen = () => {

      if(log){
        const message = {
          data: "onopen",
          id: Date.now()
        }
        this.websocket.send(JSON.stringify(message))
        console.group("ONOPEN")
        console.log({message})
        console.groupEnd()
      }

      onopen()
    }
    this.websocket.onmessage = (event) => {

      const message = JSON.parse(event.data)

      if(log){
        console.group("ONMESSAGE")
        console.log({message,game:message.game,players:message.game?.players})
        console.groupEnd()
      }

      onmessage(message)
    }
    this.websocket.onclose= () => {
      console.log('Socket закрыт')
      this.websocket = null
    }
    this.websocket.onerror = () => {
      console.log('Socket произошла ошибка')
    }
  }

  send(string){
    if(!this.websocket)
      throw new Error("Socket: websocket == null")

    this.websocket.send(string)
  }

  getState(type_string){
    if(!this.websocket)
      return false

    const map = ["CONNECTING","OPEN","CLOSING","CLOSED"]
    const state = this.websocket.readyState

    if(type_string)
      return map[state]
    else
      return state
  }
}



export default new Socket()