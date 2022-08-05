import React from 'react';
import cls from "./InputC.module.scss"

const InputC = ({val,setVal,placeholder}) => {



  return (
    <input type="text"
           placeholder={placeholder}
           value={val}
           onChange={e => setVal(e.target.value)}
           className={cls.parent}
    />
  );
};

export default InputC;