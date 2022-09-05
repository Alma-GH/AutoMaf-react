import React from 'react';
import cls from "./ErrorMessage.module.scss"

const ErrorMessage = ({message, visible}) => {

  const style = []
  style.push(cls.error)
  if(visible)
    style.push(cls.vis)

  return (
    <div className={style.join(" ")}>
      {message}
    </div>
  );
};

export default ErrorMessage;