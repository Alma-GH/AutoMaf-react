import {LOCAL_WS_URL, PROD, SERVER_LINK, TIME_CALL_TO_SERVER} from "../const";

const log = !PROD

class Socket{

  websocket = null

  connect(onopen,onmessage,onclose,token){
    const params = new URLSearchParams()
    params.append("token", token)
    const url = (PROD ? SERVER_LINK : LOCAL_WS_URL) + "?" + params.toString()
    this.websocket = new WebSocket(url)

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
      console.log('Socket открыт')
      onopen()
    }
    this.websocket.onmessage = (event) => {

      const message = JSON.parse(event.data)

      if(log){
        console.group("ONMESSAGE")
        console.log({message})
        console.groupEnd()
      }

      onmessage(message)
    }
    this.websocket.onclose= () => {
      console.log('Socket закрыт')
      this.websocket = null
      onclose()
    }
    this.websocket.onerror = () => {
      console.log('Socket-произошла ошибка')
    }

  }

  send(string){
    if(!this.websocket){
      console.log("Socket: websocket == null")
      return
    }

    this.websocket.send(string)
  }

  close(){
    if(!this.websocket){
      console.log("Socket: websocket == null")
      return
    }

    this.websocket.close()
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