import React from 'react';
import cls from "./BtnText.module.scss"

const BtnText = ({text, color, cb, disabled}) => {

  let style = [cls.parent]
  if(color === "red")     style.push(cls.red)
  if(color === "yellow")  style.push(cls.yellow)

  return (
    <button className={style.join(" ")} onClick={cb} disabled={disabled}>
      <div className={cls.label}>
        {text}
      </div>
    </button>
  );
};

export default BtnText;