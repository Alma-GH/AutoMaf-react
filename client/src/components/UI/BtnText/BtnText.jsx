import React from 'react';
import cls from "./BtnText.module.scss"

const BtnText = ({text, color}) => {

  let style = [cls.parent]
  if(color === "red")     style.push(cls.red)
  if(color === "yellow")  style.push(cls.yellow)

  return (
    <button className={style.join(" ")}>
      {text}
    </button>
  );
};

export default BtnText;