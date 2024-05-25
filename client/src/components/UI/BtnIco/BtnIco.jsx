import React from 'react';
import clsx from "clsx";
import cn from "./BtnIco.module.scss";

const BtnIco = ({ img, alt, cb, type, disabled, addCls }) => {
  return (
    <button
      className={clsx(cn.container, type === "secondary" && cn.secondary, addCls)}
      onClick={cb}
    >
      <img src={img} alt={alt} />
    </button>
  );
};

export default BtnIco;