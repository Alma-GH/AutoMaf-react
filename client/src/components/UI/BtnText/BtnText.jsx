import React from 'react';
import cn from "./BtnText.module.scss"
import clsx from "clsx";

const BtnText = ({text, type, cb, disabled, addCls}) => {
  return (
    <button
      className={clsx(cn.container, type === "secondary" && cn.secondary, addCls)}
      onClick={cb}
      disabled={disabled}
      type="button"
    >
      <span className={cn.label}>
        {text}
      </span>
    </button>
  );
};

export default BtnText;