import React from 'react';
import cn from "./Avatar.module.scss"
import imgCrown from "../../../assets/imgs/crown.svg"
import clsx from "clsx";

const Avatar = ({ index, cb, withCrown, addCls }) => {
  return (
    <button className={clsx(cn.container, addCls)} onClick={cb} type="button">
      {index === 1 && 1}
      {index === 2 && 2}
      {index === 3 && 3}
      {index === 4 && 4}
      {index === 5 && 5}
      {index === 6 && 6}
      {index === 7 && 7}
      {index === 8 && 8}
      {index === 9 && 9}
      {withCrown && <img src={imgCrown} alt="crown"/>}
    </button>
  );
};

export default Avatar;