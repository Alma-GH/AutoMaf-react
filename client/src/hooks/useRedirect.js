import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DEBUG_REDIRECT} from "../tools/const";


export const useRedirect = (condition, changeableObj, link, cb=()=>{})=>{

  const nav = useNavigate()

  useEffect(()=>{

    if(condition && !DEBUG_REDIRECT){
      cb()
      nav(link)
    }

  },[changeableObj])

}