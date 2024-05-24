import React from 'react';
import cls from "./InputC.module.scss"

const InputC = ({val,setVal,placeholder,enterCB, type="text"}) => {

  function pressEnter(e){
    const isEnter     = e.key === "Enter"
    const isFunction  = typeof enterCB === "function"
    if(isEnter && isFunction)
      enterCB()
  }

  return (
    <input
      type={type}
       placeholder={placeholder}
       value={val}
       onChange={e => setVal(e.target.value)}
       className={cls.parent}
       onKeyDown={pressEnter}
    />
  );
};

export default InputC;