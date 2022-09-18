import {useState} from "react";


export const useModal = ()=>{

  const [modal,setModal] = useState(false)

  function open(){
    setModal(true)
  }
  function close(){
    setModal(false)
  }

  return [modal, open, close]
}