import React from 'react';
import clsWin from "../WindowInput/WindowInput.module.scss";

const PrepareCount = ({max,num, stage=0}) => {

  function getColorNum(){
    if(num<4)
      return "red"
    if(num === max)
      return "#11ff00"
    return "yellow"
  }

  return (
    <div className={clsWin.count}>
      {(stage===0) &&
        <>
          Игроков
          <span style={{color: getColorNum()}}>
            {num}/{max}
          </span>
        </>
      }

      <StartLoader stage={stage}/>
    </div>
  );
};

export default PrepareCount;


const StartLoader = ({stage})=>{

  const list = [...Array(5).keys()]

  if(stage===0)
    return
  return (
    <div className={clsWin.load}>
      <ul>
        {list.map(ind=>{
          if(ind+1<=stage)  return <li key={ind} style={{opacity: 1}}/>
          else              return <li key={ind}/>
        })}
      </ul>
    </div>
  );
}