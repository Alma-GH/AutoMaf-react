import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


export const useRedirect = (condition, changeableObj, link, cb=()=>{})=>{

  const nav = useNavigate()

  useEffect(()=>{

    if(condition){
      cb()
      nav(link)
    }

  },[changeableObj])

}