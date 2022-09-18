import React from 'react';
import clsWin from "../WindowInput/WindowInput.module.scss";

const PrepareCount = ({max,num}) => {

  function getColorNum(){
    if(num<4)
      return "red"
    if(num === max)
      return "#11ff00"
    return "yellow"
  }

  return (
    <div className={clsWin.count}>
      Игроков
      <span style={{color: getColorNum()}}>
        {num}/{max}
      </span>
    </div>
  );
};

export default PrepareCount;