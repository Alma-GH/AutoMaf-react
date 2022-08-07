import React from 'react';
import cls from "./WindowInput.module.scss"

const WindowInput = ({children}) => {
  return (
    <div className={cls.parent}>
      {children}
    </div>
  );
};

export default WindowInput;