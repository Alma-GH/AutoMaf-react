import {useRedirect} from "./useRedirect";
import Socket from "../tools/Services/Socket";
import {EM_CLOSE_CONNECTION, LINK_START, T_CLOSE_CONNECTION} from "../tools/const";
import {toast} from "react-toastify";
import {useContext} from "react";
import {MessageContext, RoomContext} from "../context/contexts";

const useRedirectCloseConnection = () => {

  const context = useContext(RoomContext)
  const mContext = useContext(MessageContext)

  useRedirect(
    Socket.websocket===null,
    mContext.error,
    LINK_START,
    ()=>{
      toast(EM_CLOSE_CONNECTION, {toastId:T_CLOSE_CONNECTION})
      context.setRoom(null)
      context.setPlayer(null)
    }
  )
}

export default useRedirectCloseConnection;