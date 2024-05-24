import {useState} from "react";


const useBoolean = (initial) => {
  const [bool, setBool] = useState(initial)

  const setFalse = () => setBool(false)
  const setTrue = () => setBool(true)

  return [bool, setTrue, setFalse, setBool]
}

export default useBoolean;