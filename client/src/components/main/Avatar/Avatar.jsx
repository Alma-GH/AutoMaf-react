import React from 'react';
import cn from "./Avatar.module.scss"

const Avatar = ({ index, cb }) => {
  return (
    <button className={cn.container} onClick={cb} type="button">
      {index === 1 && 1}
      {index === 2 && 2}
      {index === 3 && 3}
      {index === 4 && 4}
      {index === 5 && 5}
      {index === 6 && 6}
      {index === 7 && 7}
      {index === 8 && 8}
      {index === 9 && 9}
    </button>
  );
};

export default Avatar;