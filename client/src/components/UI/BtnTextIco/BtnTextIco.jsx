import React from 'react';
import cn from "./BtnTextIco.module.scss"

const BtnTextIco = ({cb, text, icon, alt, disabled }) => {
  return (
    <button onClick={cb} className={cn.container} disabled={disabled}>
      <span>{text}</span>
      <div className={cn.imgCont}>
        <img src={icon} alt={alt}/>
      </div>
    </button>
  );
};

export default BtnTextIco;